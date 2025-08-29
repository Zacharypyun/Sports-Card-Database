'use client'
import { useState } from 'react'
import { Card, cardService } from '@/services/api'
import CardForm from './CardForm'

interface CardDetailProps {
  card: Card
  onCardUpdated: (card: Card) => void
  onCardDeleted: () => void
}

export default function CardDetail({ card, onCardUpdated, onCardDeleted }: CardDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSave = async (updatedCard: Card) => {
    try {
      // Use the updateCard API
      const cardWithId = { ...updatedCard, id: card.id }
      const savedCard = await cardService.updateCard(card.id!, updatedCard)
      onCardUpdated(savedCard)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating card:', error)
      alert('Failed to update card')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      if (card.id) {
        await cardService.deleteCard(card.id)
        onCardDeleted()
      }
    } catch (error) {
      console.error('Error deleting card:', error)
      alert('Failed to delete card')
      setIsDeleting(false)
    }
  }

  const getSportEmoji = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'baseball': return '⚾'
      case 'basketball': return '🏀'
      case 'football': return '🏈'
      case 'hockey': return '🏒'
      case 'soccer': return '⚽'
      default: return '🏆'
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'mint': return '#dbeafe'
      case 'near mint': return '#e0e7ff'
      case 'excellent': return '#fef3c7'
      case 'good': return '#fecaca'
      default: return '#dbeafe'
    }
  }

  const getConditionTextColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'mint': return '#1e40af'
      case 'near mint': return '#3730a3'
      case 'excellent': return '#92400e'
      case 'good': return '#991b1b'
      default: return '#1e40af'
    }
  }

  const formatFeatures = (features: Record<string, any>) => {
    if (!features || Object.keys(features).length === 0) {
      return 'None'
    }
    return Object.entries(features)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => key.charAt(0).toUpperCase() + key.slice(1))
      .join(', ')
  }

  const getImageSrc = (imageUrl?: string | null) => {
    if (!imageUrl) return null
    if (imageUrl.startsWith('data:image/')) return imageUrl
    if (imageUrl.startsWith('/')) return `http://localhost:8000${imageUrl}`
    return imageUrl
  }

  const getDisplayedImage = () => {
    const storedFrontImage = card.id ? localStorage.getItem(`card_${card.id}_front_image`) : null
    const storedBackImage = card.id ? localStorage.getItem(`card_${card.id}_back_image`) : null

    if (isHovered && (storedBackImage || card.back_image_url)) {
      return storedBackImage || getImageSrc(card.back_image_url)
    }
    return storedFrontImage || getImageSrc(card.front_image_url)
  }

  if (isEditing) {
    return (
      <div className="card-detail-edit">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '0 2rem'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
            Edit Card
          </h1>
          <button 
            onClick={handleCancelEdit}
            style={{
              background: '#64748b',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
        <CardForm 
          userId={card.user_id} 
          onCardCreated={handleSave}
          initialCard={card}
          isEditing={true}
        />
      </div>
    )
  }

  return (
    <div className="card-detail">
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '0 2rem'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b' }}>
          {card.playerName}
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleEdit}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              background: isDeleting ? '#94a3b8' : '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', padding: '0 2rem' }}>
        {/* Card Image Section */}
        <div style={{ flex: '0 0 400px' }}>
          <div 
            style={{
              width: '400px',
              height: '500px',
              background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '6rem',
              color: '#999'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {getDisplayedImage() ? (
              <img 
                src={getDisplayedImage()!}
                alt={`${card.playerName} ${isHovered ? 'back' : 'front'}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              getSportEmoji(card.sport)
            )}
            {(card.back_image_url || (card.id && localStorage.getItem(`card_${card.id}_back_image`))) && (
              <div style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                pointerEvents: 'none'
              }}>
                {isHovered ? 'Back' : 'Front'}
              </div>
            )}
          </div>
          {card.back_image_url && (
            <div style={{
              marginTop: '1rem',
              textAlign: 'center',
              color: '#64748b',
              fontSize: '0.9rem'
            }}>
              Back image available
            </div>
          )}
        </div>

        {/* Card Information Section */}
        <div style={{ flex: '1' }}>
          <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Basic Information
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Year:</strong> {card.year}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Brand:</strong> {card.brand}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Set:</strong> {card.setName}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Card Number:</strong> #{card.cardNumber}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Sport:</strong> {getSportEmoji(card.sport)} {card.sport}
                </div>
              </div>

              <div>
                <h3 style={{ color: '#475569', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Details
                </h3>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Condition:</strong>
                  <span 
                    style={{
                      marginLeft: '0.5rem',
                      background: getConditionColor(card.condition),
                      color: getConditionTextColor(card.condition),
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}
                  >
                    {card.condition}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Value:</strong> {card.value ? `$${card.value.toLocaleString()}` : 'Not specified'}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Status:</strong>
                  <span style={{
                    marginLeft: '0.5rem',
                    background: card.sold ? '#fecaca' : '#d1fae5',
                    color: card.sold ? '#991b1b' : '#065f46',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {card.sold ? 'SOLD' : 'Available'}
                  </span>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Features:</strong>
                  <div style={{ marginTop: '0.5rem', color: '#64748b' }}>
                    {formatFeatures(card.features)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
