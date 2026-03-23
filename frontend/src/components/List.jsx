import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CardModal from './CardModal'

function Card({ card, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: 'white',
    borderRadius: '4px',
    padding: '8px',
    marginBottom: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    cursor: 'grab'
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      {card.title}
      {card.assignedUser && (
        <div style={{ fontSize: '12px', color: '#5e6c84', marginTop: '4px' }}>
          👤 {card.assignedUser}
        </div>
      )}
    </div>
  )
}

function List({ list, onAddCard, onAddComment, onAssignUser }) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)

  const { setNodeRef } = useDroppable({ id: list.id })

  function handleAdd() {
    if (newTitle.trim() === '') return
    onAddCard(newTitle)
    setNewTitle('')
    setAdding(false)
  }

  return (
    <div style={{
      backgroundColor: '#ebecf0',
      borderRadius: '8px',
      padding: '12px',
      width: '270px',
      minWidth: '270px',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>{list.title}</h3>

      <SortableContext items={list.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef}>
          {list.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => setSelectedCard(card)}
            />
          ))}
        </div>
      </SortableContext>

      {adding ? (
        <div>
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título de la tarjeta"
            style={{
              width: '100%', padding: '6px',
              borderRadius: '4px', border: '1px solid #ccc',
              marginBottom: '6px'
            }}
          />
          <button onClick={handleAdd} style={{
            backgroundColor: '#0079bf', color: 'white',
            border: 'none', borderRadius: '4px',
            padding: '6px 12px', cursor: 'pointer', marginRight: '6px'
          }}>
            Agregar
          </button>
          <button onClick={() => setAdding(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'
          }}>✕</button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#5e6c84', padding: '4px', width: '100%', textAlign: 'left'
        }}>
          + Agregar tarjeta
        </button>
      )}

      {selectedCard && (
        <CardModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          onAddComment={(cardId, comment) => {
            onAddComment(cardId, comment)
            setSelectedCard(prev => ({ ...prev, comments: [...(prev.comments || []), comment] }))
          }}
          onAssignUser={(cardId, user) => {
            onAssignUser(cardId, user)
            setSelectedCard(prev => ({ ...prev, assignedUser: user }))
          }}
        />
      )}
    </div>
  )
}

export default List