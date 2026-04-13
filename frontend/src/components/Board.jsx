// src/components/Board.jsx
import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import List from './List'
import API, { USE_MOCK, MOCK } from '../api'

function Board({ boardId }) {
  const [data, setData] = useState({ lists: [] })
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [boardId])

  async function cargarDatos() {
    setLoading(true)
    try {
      // ── MOCK ──────────────────────────────────────────────
      if (USE_MOCK) {
        const board = MOCK.boards[boardId]
        if (board) {
          const lists = board.lists.map(list => ({
            ...list,
            id: list.id.toString(),
            title: list.name,
            cards: list.cards.map(card => ({
              ...card,
              id: card.id.toString(),
              comments: card.comments || []
            }))
          }))
          setData({ lists })
          setUsuarios(MOCK.users)
        }
        setLoading(false)
        return
      }

      // ── REAL ──────────────────────────────────────────────
      const listsRes    = await API.get(`/lists/?board=${boardId}`)
      const cardsRes    = await API.get(`/cards/?board=${boardId}`)
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
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  )

  function findListByCardId(cardId) {
    return data.lists.find(list =>
      list.cards.some(card => card.id === cardId)
    )
  }

  function onDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId   = over.id

    const sourceList = findListByCardId(activeId)
    let destList = data.lists.find(l => l.id === overId)
    if (!destList) destList = findListByCardId(overId)

    if (!sourceList || !destList || sourceList.id === destList.id) return

    const movedCard = sourceList.cards.find(c => c.id === activeId)

    if (!USE_MOCK) {
      API.patch(`/cards/${activeId}/`, { list: parseInt(destList.id) })
    }

    const updatedLists = data.lists.map(list => {
      if (list.id === sourceList.id) {
        return { ...list, cards: list.cards.filter(c => c.id !== activeId) }
      }
      if (list.id === destList.id) {
        return { ...list, cards: [...list.cards, movedCard] }
      }
      return list
    })

    setData({ lists: updatedLists })
  }

  async function onAddCard(listId, title) {
    try {
      if (USE_MOCK) {
        const newCard = {
          id: Date.now().toString(),
          title,
          description: '',
          list: parseInt(listId),
          assigned_to: null,
          comments: []
        }
        setData(prev => ({
          lists: prev.lists.map(list =>
            list.id === listId
              ? { ...list, cards: [...list.cards, newCard] }
              : list
          )
        }))
        return
      }

      const res = await API.post('/cards/', {
        title,
        description: ' ',
        list: parseInt(listId),
        assigned_to: null,
        position: 0
      })
      const newCard = { ...res.data, id: res.data.id.toString(), comments: [] }
      setData(prev => ({
        lists: prev.lists.map(list =>
          list.id === listId
            ? { ...list, cards: [...list.cards, newCard] }
            : list
        )
      }))
    } catch (error) {
      console.error('Error creando tarjeta:', error.response?.data)
    }
  }

  async function onAddComment(cardId, comment) {
    try {
      if (!USE_MOCK) {
        await API.post('/comments/', {
          content: comment,
          card: parseInt(cardId),
          user: 1
        })
      }
      setData(prev => ({
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.map(card =>
            card.id === cardId
              ? { ...card, comments: [...(card.comments || []), comment] }
              : card
          )
        }))
      }))
    } catch (error) {
      console.error('Error agregando comentario:', error.response?.data)
    }
  }

  async function onAssignUser(cardId, userId) {
    try {
      if (!USE_MOCK) {
        await API.patch(`/cards/${cardId}/`, {
          assigned_to: userId === '' ? null : parseInt(userId)
        })
      }
      setData(prev => ({
        lists: prev.lists.map(list => ({
          ...list,
          cards: list.cards.map(card =>
            card.id === cardId
              ? { ...card, assigned_to: userId }
              : card
          )
        }))
      }))
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
        height: 'calc(100vh - 44px)',
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
        minHeight: 'calc(100vh - 44px)',
        alignItems: 'flex-start'
      }}>
        {data.lists.map(list => (
          <List
            key={list.id}
            list={list}
            usuarios={usuarios}
            onAddCard={title => onAddCard(list.id, title)}
            onAddComment={onAddComment}
            onAssignUser={onAssignUser}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Board