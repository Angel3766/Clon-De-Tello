import { useState } from 'react'

const usuariosDisponibles = ['Leonardo', 'Compañero', 'Profesor']

function CardModal({ card, onClose, onAddComment, onAssignUser }) {
  const [comment, setComment] = useState('')

  function handleSubmit() {
    if (comment.trim() === '') return
    onAddComment(card.id, comment)
    setComment('')
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '500px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px' }}>{card.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>✕</button>
        </div>

        <h4 style={{ marginBottom: '8px' }}>Asignar usuario</h4>
        <select
          value={card.assignedUser || ''}
          onChange={(e) => onAssignUser(card.id, e.target.value)}
          style={{
            width: '100%', padding: '6px',
            borderRadius: '4px', border: '1px solid #ccc',
            marginBottom: '16px'
          }}
        >
          <option value=''>Sin asignar</option>
          {usuariosDisponibles.map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        {card.assignedUser && (
          <p style={{ marginBottom: '16px', fontSize: '14px', color: '#5e6c84' }}>
            Asignado a: <strong>{card.assignedUser}</strong>
          </p>
        )}

        <h4 style={{ marginBottom: '8px' }}>Comentarios</h4>
        <div style={{ marginBottom: '12px' }}>
          {card.comments && card.comments.map((c, i) => (
            <div key={i} style={{
              backgroundColor: '#f4f5f7',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '6px',
              fontSize: '14px'
            }}>
              {c}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe un comentario..."
            style={{
              flex: 1, padding: '6px',
              borderRadius: '4px', border: '1px solid #ccc'
            }}
          />
          <button onClick={handleSubmit} style={{
            backgroundColor: '#0079bf', color: 'white',
            border: 'none', borderRadius: '4px',
            padding: '6px 12px', cursor: 'pointer'
          }}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardModal