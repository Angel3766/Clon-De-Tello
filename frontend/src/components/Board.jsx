import { useState } from 'react'
import List from './List'

const initialData = {
  lists: [
    {
      id: '1',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Tarea de ejemplo 1' },
        { id: '2', title: 'Tarea de ejemplo 2' },
      ]
    },
    {
      id: '2',
      title: 'Doing',
      cards: [
        { id: '3', title: 'Tarea en progreso' },
      ]
    },
    {
      id: '3',
      title: 'Done',
      cards: [
        { id: '4', title: 'Tarea completada' },
      ]
    },
  ]
}

function Board() {
  const [data, setData] = useState(initialData)

  return (
    <div style={{
      padding: '20px',
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      minHeight: 'calc(100vh - 48px)'
    }}>
      {data.lists.map((list) => (
        <List key={list.id} title={list.title} cards={list.cards} />
      ))}
    </div>
  )
}

export default Board