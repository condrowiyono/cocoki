import { useState, useRef, useEffect } from 'react'
import './ImageTextMatch.css'

interface MatchItem {
  id: string
  image: string
  text: string
}

interface Connection {
  imageId: string
  textId: string
}

const ImageTextMatch = () => {
  const [items] = useState<MatchItem[]>([
    { id: '1', image: '🐶', text: 'Anjing' },
    { id: '2', image: '🐱', text: 'Kucing' },
    { id: '3', image: '🐘', text: 'Gajah' },
    { id: '4', image: '🦁', text: 'Singa' },
  ])

  // Assign a unique color to each item
  const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#06b6d4']
  const getColorForImage = (imageId: string) => {
    const index = items.findIndex(item => item.id === imageId)
    return colors[index] || '#60a5fa'
  }

  const [connections, setConnections] = useState<Connection[]>([])
  const [dragStart, setDragStart] = useState<{ x: number; y: number; id: string } | null>(null)
  const [currentDrag, setCurrentDrag] = useState<{ x: number; y: number } | null>(null)
  const [, setForceUpdate] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)

  // Shuffle text items for the game
  const [shuffledTexts] = useState(() =>
    [...items].sort(() => Math.random() - 0.5)
  )

  // Force re-render on window resize to update SVG paths
  useEffect(() => {
    const handleResize = () => {
      setForceUpdate(prev => prev + 1)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleDotMouseDown = (e: React.MouseEvent, id: string, side: 'left' | 'right') => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const svgRect = svgRef.current?.getBoundingClientRect()

    if (!svgRect) return

    const x = rect.left + rect.width / 2 - svgRect.left
    const y = rect.top + rect.height / 2 - svgRect.top

    if (side === 'left') {
      // Check if this image already has a connection
      const existingConnection = connections.find(c => c.imageId === id)
      if (existingConnection) {
        // Remove existing connection from this image
        setConnections(connections.filter(c => c.imageId !== id))
      }

      // Starting a new connection from left side
      setDragStart({ x, y, id })
      setCurrentDrag({ x, y })
    } else {
      // Clicking on right side - complete or remove connection
      const existingConnection = connections.find(c => c.textId === id)
      if (existingConnection) {
        // Remove existing connection
        setConnections(connections.filter(c => c.textId !== id))
      }
    }
  }

  const handleDotTouchStart = (e: React.TouchEvent, id: string, side: 'left' | 'right') => {
    e.preventDefault()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const svgRect = svgRef.current?.getBoundingClientRect()

    if (!svgRect) return

    const x = rect.left + rect.width / 2 - svgRect.left
    const y = rect.top + rect.height / 2 - svgRect.top

    if (side === 'left') {
      // Check if this image already has a connection
      const existingConnection = connections.find(c => c.imageId === id)
      if (existingConnection) {
        // Remove existing connection from this image
        setConnections(connections.filter(c => c.imageId !== id))
      }

      // Starting a new connection from left side
      setDragStart({ x, y, id })
      setCurrentDrag({ x, y })
    } else {
      // Clicking on right side - complete or remove connection
      const existingConnection = connections.find(c => c.textId === id)
      if (existingConnection) {
        // Remove existing connection
        setConnections(connections.filter(c => c.textId !== id))
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragStart) {
      const svgRect = svgRef.current?.getBoundingClientRect()
      if (!svgRect) return

      const x = e.clientX - svgRect.left
      const y = e.clientY - svgRect.top

      setCurrentDrag({ x, y })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStart && e.touches.length > 0) {
      const svgRect = svgRef.current?.getBoundingClientRect()
      if (!svgRect) return

      const touch = e.touches[0]
      const x = touch.clientX - svgRect.left
      const y = touch.clientY - svgRect.top

      setCurrentDrag({ x, y })
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!dragStart) return

    // Check if we're over a right-side dot
    const target = document.elementFromPoint(e.clientX, e.clientY)
    const dotElement = target?.closest('.match-dot.right')

    if (dotElement) {
      const textId = dotElement.getAttribute('data-id')
      if (textId) {
        // Remove any existing connection to this text
        const filteredConnections = connections.filter(c => c.textId !== textId)

        // Add new connection
        setConnections([...filteredConnections, { imageId: dragStart.id, textId }])
      }
    }

    setDragStart(null)
    setCurrentDrag(null)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!dragStart) return

    // Get the touch position
    const touch = e.changedTouches[0]

    // Check if we're over a right-side dot
    const target = document.elementFromPoint(touch.clientX, touch.clientY)
    const dotElement = target?.closest('.match-dot.right')

    if (dotElement) {
      const textId = dotElement.getAttribute('data-id')
      if (textId) {
        // Remove any existing connection to this text
        const filteredConnections = connections.filter(c => c.textId !== textId)

        // Add new connection
        setConnections([...filteredConnections, { imageId: dragStart.id, textId }])
      }
    }

    setDragStart(null)
    setCurrentDrag(null)
  }

  const getConnectionPath = (imageId: string, textId: string) => {
    const imageElement = document.querySelector(`.match-dot.left[data-id="${imageId}"]`)
    const textElement = document.querySelector(`.match-dot.right[data-id="${textId}"]`)
    const svgRect = svgRef.current?.getBoundingClientRect()

    if (!imageElement || !textElement || !svgRect) return ''

    const imageRect = imageElement.getBoundingClientRect()
    const textRect = textElement.getBoundingClientRect()

    const x1 = imageRect.left + imageRect.width / 2 - svgRect.left
    const y1 = imageRect.top + imageRect.height / 2 - svgRect.top
    const x2 = textRect.left + textRect.width / 2 - svgRect.left
    const y2 = textRect.top + textRect.height / 2 - svgRect.top

    // Create a curved path - adapt based on layout direction
    const isMobile = window.innerWidth <= 768

    if (isMobile) {
      // For mobile vertical layout, use horizontal curves
      const midY = (y1 + y2) / 2
      return `M ${x1} ${y1} Q ${x1} ${midY}, ${(x1 + x2) / 2} ${midY} T ${x2} ${y2}`
    } else {
      // For desktop horizontal layout, use vertical curves
      const midX = (x1 + x2) / 2
      return `M ${x1} ${y1} Q ${midX} ${y1}, ${midX} ${(y1 + y2) / 2} T ${x2} ${y2}`
    }
  }

  const checkAnswers = () => {
    let correct = 0
    connections.forEach(conn => {
      if (conn.imageId === conn.textId) {
        correct++
      }
    })

    if (correct === items.length) {
      alert('🎉 Sempurna! Kamu berhasil mencocokkan semua gambar dengan benar!')
    } else {
      alert(`Kamu benar ${correct} dari ${items.length}. Ayo coba lagi!`)
    }
  }

  return (
    <div className="match-game">
      <h1>Cocokkan Gambar!</h1>
      <p>Tarik dari titik di samping gambar ke kata yang sesuai</p>

      <div
        className="match-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg ref={svgRef} className="connection-svg">
          {/* Draw established connections */}
          {connections.map((conn, idx) => (
            <path
              key={idx}
              d={getConnectionPath(conn.imageId, conn.textId)}
              stroke={getColorForImage(conn.imageId)}
              strokeWidth="3"
              fill="none"
              className="connection-line"
            />
          ))}

          {/* Draw current drag line */}
          {dragStart && currentDrag && (
            <line
              x1={dragStart.x}
              y1={dragStart.y}
              x2={currentDrag.x}
              y2={currentDrag.y}
              stroke={getColorForImage(dragStart.id)}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}
        </svg>

        <div className="match-column left">
          {items.map((item) => (
            <div key={item.id} className="match-item">
              <div className="match-image">{item.image}</div>
              <div
                className="match-dot left"
                data-id={item.id}
                onMouseDown={(e) => handleDotMouseDown(e, item.id, 'left')}
                onTouchStart={(e) => handleDotTouchStart(e, item.id, 'left')}
              />
            </div>
          ))}
        </div>

        <div className="match-column right">
          {shuffledTexts.map((item) => (
            <div key={item.id} className="match-item">
              <div
                className="match-dot right"
                data-id={item.id}
                onMouseDown={(e) => handleDotMouseDown(e, item.id, 'right')}
                onTouchStart={(e) => handleDotTouchStart(e, item.id, 'right')}
              />
              <div className="match-text">{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      <button className="check-button" onClick={checkAnswers}>
        Periksa Jawaban
      </button>
    </div>
  )
}

export default ImageTextMatch
