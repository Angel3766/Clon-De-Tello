function Navbar() {
  return (
    <nav style={{
      background: 'rgba(0,0,0,0.3)',
      backdropFilter: 'blur(10px)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🃏</span>
        <h1 style={{
          color: 'white',
          fontSize: '20px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}>
          Clon de Tello
        </h1>
      </div>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'white',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '14px'
      }}>
        👤 Usuario
      </div>
    </nav>
  )
}

export default Navbar