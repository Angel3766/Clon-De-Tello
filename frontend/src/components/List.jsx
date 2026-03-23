function List({ title, cards }) {
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
        {cards.map((card) => (
          <div key={card.id} style={{
            backgroundColor: 'white',
            borderRadius: '4px',
            padding: '8px',
            marginBottom: '8px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {card.title}
          </div>
        ))}
      </div>
    </div>
  )
}

export default List