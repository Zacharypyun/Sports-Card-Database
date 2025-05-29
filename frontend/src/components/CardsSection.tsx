'use client'
import { useState } from 'react'
import { Card } from '@/services/api'
import CardItem from './CardItem'

interface CardsSectionProps {
  cards: Card[]
}

export default function CardsSection({ cards }: CardsSectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleViewToggle = (mode: 'grid' | 'list') => {
    setViewMode(mode)
  }

  return (
    <section className="cards-section">
      <div className="section-header">
        <h2>My Collection ({cards.length} cards)</h2>
        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => handleViewToggle('grid')}
          >
            📱 Grid
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => handleViewToggle('list')}
          >
            📋 List
          </button>
        </div>
      </div>

      {cards.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          color: '#64748b',
          fontSize: '1.1rem'
        }}>
          <p>No cards found in your collection yet.</p>
          <p style={{ marginTop: '1rem', fontSize: '1rem' }}>
            Click the + button to add your first card!
          </p>
        </div>
      ) : (
        <div className={`cards-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
          {cards.map((card) => (
            <CardItem 
              key={card.id} 
              card={card}
            />
          ))}
        </div>
      )}
    </section>
  )
}
