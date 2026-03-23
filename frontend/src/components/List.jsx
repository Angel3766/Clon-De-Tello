import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import CardModal from './CardModal'

function List({ title, cards, onAddCard, onAddComment, onAssignUser }) {
  const [adding, setAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)

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
      <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>{title}</h3>
      <div>
        {cards.map((card, index) => (
          <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() => setSelectedCard(card)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  padding: '8px',
                  marginBottom: '8px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  cursor: 'grab',
                  ...provided.draggableProps.style
                }}
              >
                {card.title}
              </div>
            )}
          </Draggable>
        ))}
      </div>

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
            setSelectedCard(prev => ({
              ...prev,
              comments: [...(prev.comments || []), comment]
            }))
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