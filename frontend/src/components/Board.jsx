import { useState } from 'react'
import { DndContext, closestCenter } from '@dnd-kit/core'
import List from './List'

const initialData = {
  lists: [
    {
      id: '1',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Tarea de ejemplo 1', comments: [] },
        { id: '2', title: 'Tarea de ejemplo 2', comments: [] },
      ]
    },
    {
      id: '2',
      title: 'Doing',
      cards: [
        { id: '3', title: 'Tarea en progreso', comments: [] },
      ]
    },
    {
      id: '3',
      title: 'Done',
      cards: [
        { id: '4', title: 'Tarea completada', comments: [] },
      ]
    },
  ]
}

function Board() {
  const [data, setData] = useState(initialData)

  function onDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id

    let sourceListId = null
    let destListId = null
    let movedCard = null

    const newLists = data.lists.map(list => {
      const cardIndex = list.cards.findIndex(c => c.id === activeId)
      if (cardIndex !== -1) {
        sourceListId = list.id
        movedCard = list.cards[cardIndex]
      }
      return list
    })

    data.lists.forEach(list => {
      const found = list.cards.find(c => c.id === overId)
      if (found) destListId = list.id
      if (list.id === overId) destListId = list.id
    })

    if (!destListId || sourceListId === destListId) return

    const updatedLists = data.lists.map(list => {
      if (list.id === sourceListId) {
        return { ...list, cards: list.cards.filter(c => c.id !== activeId) }
      }
      if (list.id === destListId) {
        return { ...list, cards: [...list.cards, movedCard] }
      }
      return list
    })

    setData({ lists: updatedLists })
  }

  function onAddCard(listId, title) {
    const newCard = { id: Date.now().toString(), title, comments: [] }
    const newLists = data.lists.map(list => {
      if (list.id === listId) return { ...list, cards: [...list.cards, newCard] }
      return list
    })
    setData({ lists: newLists })
  }

  function onAddComment(cardId, comment) {
    const newLists = data.lists.map(list => ({
      ...list,
      cards: list.cards.map(card => {
        if (card.id === cardId) return { ...card, comments: [...(card.comments || []), comment] }
        return card
      })
    }))
    setData({ lists: newLists })
  }

  function onAssignUser(cardId, user) {
    const newLists = data.lists.map(list => ({
      ...list,
      cards: list.cards.map(card => {
        if (card.id === cardId) return { ...card, assignedUser: user }
        return card
      })
    }))
    setData({ lists: newLists })
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
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