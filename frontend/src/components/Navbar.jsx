function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#026aa7',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <h1 style={{ color: 'white', fontSize: '18px' }}>
        Clon de Tello 🃏
      </h1>
      <div style={{ color: 'white', fontSize: '14px' }}>
        Bienvenido, Usuario
      </div>
    </nav>
  )
}

export default Navbar