import { useState } from 'react'
import { DragDropContext, Droppable } from '@hello-pangea/dnd'
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

  function onDragEnd(result) {
    const { source, destination } = result
    if (!destination) return

    const sourcelist = data.lists.find(l => l.id === source.droppableId)
    const destList = data.lists.find(l => l.id === destination.droppableId)
    const sourceCards = [...sourcelist.cards]
    const destCards = sourcelist.id === destList.id ? sourceCards : [...destList.cards]

    const [moved] = sourceCards.splice(source.index, 1)
    destCards.splice(destination.index, 0, moved)

    const newLists = data.lists.map(list => {
      if (list.id === sourcelist.id) return { ...list, cards: sourceCards }
      if (list.id === destList.id) return { ...list, cards: destCards }
      return list
    })

    setData({ lists: newLists })
  }

  function onAddCard(listId, title) {
    const newCard = {
      id: Date.now().toString(),
      title,
      comments: []
    }
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

  // ✅ NUEVA FUNCIÓN
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{
        padding: '20px',
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        minHeight: 'calc(100vh - 48px)'
      }}>
        {data.lists.map((list) => (
          <Droppable key={list.id} droppableId={list.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <List
                  title={list.title}
                  cards={list.cards}
                  onAddCard={(title) => onAddCard(list.id, title)}
                  onAddComment={onAddComment}
                  onAssignUser={onAssignUser} // ✅ SE PASA AQUÍ
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

export default Board