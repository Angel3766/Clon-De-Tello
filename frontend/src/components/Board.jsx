import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import List from './List'
import API from '../api'

function Board() {
  const [data, setData] = useState({ lists: [] })
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    try {
      const listsRes = await API.get('/lists/')
      const cardsRes = await API.get('/cards/')
      const commentsRes = await API.get('/comments/')
      const usuariosRes = await API.get('/users/')

      const lists = listsRes.data.map(list => ({
        ...list,
        id: list.id.toString(),
        title: list.name,
        cards: cardsRes.data
          .filter(card => card.list === list.id)
          .map(card => ({
            ...card,
            id: card.id.toString(),
            comments: commentsRes.data
              .filter(c => c.card === card.id)
              .map(c => c.content)
          }))
      }))

      setData({ lists })
      setUsuarios(usuariosRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Error cargando datos:', error)
      setLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  // 🔥 FUNCIÓN AUXILIAR
  function findListByCardId(cardId) {
    return data.lists.find(list =>
      list.cards.some(card => card.id === cardId)
    )
  }

  // 🔥 DRAG & DROP FIXED
  function onDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    const sourceList = findListByCardId(activeId)

    // 🔥 Buscar lista destino
    let destList = data.lists.find(l => l.id === overId)

    // Si no es lista, puede ser una card
    if (!destList) {
      destList = findListByCardId(overId)
    }

    if (!sourceList || !destList || sourceList.id === destList.id) return

    const movedCard = sourceList.cards.find(c => c.id === activeId)

    // 🔥 Backend
    API.patch(`/cards/${activeId}/`, {
      list: parseInt(destList.id)
    })

    // 🔥 Frontend
    const updatedLists = data.lists.map(list => {
      if (list.id === sourceList.id) {
        return {
          ...list,
          cards: list.cards.filter(c => c.id !== activeId)
        }
      }

      if (list.id === destList.id) {
        return {
          ...list,
          cards: [...list.cards, movedCard]
        }
      }

      return list
    })

    setData({ lists: updatedLists })
  }

  async function onAddCard(listId, title) {
    try {
      const res = await API.post('/cards/', {
        title,
        description: ' ',
        list: parseInt(listId),
        assigned_to: null,
        position: 0
      })

      const newCard = {
        ...res.data,
        id: res.data.id.toString(),
        comments: []
      }

      const newLists = data.lists.map(list => {
        if (list.id === listId) {
          return { ...list, cards: [...list.cards, newCard] }
        }
        return list
      })

      setData({ lists: newLists })
    } catch (error) {
      console.error('Error creando tarjeta:', error.response?.data)
    }
  }

  async function onAddComment(cardId, comment) {
    try {
      await API.post('/comments/', {
        content: comment,
        card: parseInt(cardId),
        user: 1
      })

      const newLists = data.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              comments: [...(card.comments || []), comment]
            }
          }
          return card
        })
      }))

      setData({ lists: newLists })
    } catch (error) {
      console.error('Error agregando comentario:', error.response?.data)
    }
  }

  async function onAssignUser(cardId, user) {
    try {
      await API.patch(`/cards/${cardId}/`, {
        assigned_to: user === '' ? null : parseInt(user)
      })

      const newLists = data.lists.map(list => ({
        ...list,
        cards: list.cards.map(card => {
          if (card.id === cardId) {
            return {
              ...card,
              assignedUser: user
            }
          }
          return card
        })
      }))

      setData({ lists: newLists })
    } catch (error) {
      console.error('Error asignando usuario:', error.response?.data)
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 48px)',
        color: 'white',
        fontSize: '18px'
      }}>
        Cargando tablero...
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        minHeight: 'calc(100vh - 48px)'
      }}>
        {data.lists.map((list) => (
          <List
            key={list.id}
            list={list}
            usuarios={usuarios}
            onAddCard={(title) => onAddCard(list.id, title)}
            onAddComment={onAddComment}
            onAssignUser={onAssignUser}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Board