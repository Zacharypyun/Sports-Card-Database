'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/services/api'

interface CardItemProps {
  card: Card
  onClick?: (card: Card) => void
}

export default function CardItem({ card, onClick }: CardItemProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick(card)
    } else {
      // Navigate to card detail page
      router.push(`/card/${card.id}`)
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

  const getImageSrc = (imageUrl?: string) => {
    if (!imageUrl) return null
    
    // Check if it's a base64 data URL
    if (imageUrl.startsWith('data:image/')) {
      return imageUrl
    }
    
    // Check if it's a relative URL that needs the backend base
    if (imageUrl.startsWith('/')) {
      return `http://localhost:8000${imageUrl}`
    }
    
    // Return as-is if it's already a full URL
    return imageUrl
  }

  const getImageToShow = () => {
    // Check localStorage for updated images first
    const storedFrontImage = localStorage.getItem(`card_${card.id}_front_image`)
    const storedBackImage = localStorage.getItem(`card_${card.id}_back_image`)
    
    if (isHovered && (storedBackImage || card.back_image_url)) {
      return storedBackImage || getImageSrc(card.back_image_url)
    }
    return storedFrontImage || getImageSrc(card.front_image_url)
  }

  const getImageAlt = () => {
    const storedBackImage = localStorage.getItem(`card_${card.id}_back_image`)
    if (isHovered && (storedBackImage || card.back_image_url)) {
      return `${card.playerName} back`
    }
    return `${card.playerName} front`
  }

  const hasImage = () => {
    const imageToShow = getImageToShow()
    return imageToShow && imageToShow !== 'null' && imageToShow !== ''
  }

  return (
    <div 
      className="card-item" 
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-image">
        {hasImage() ? (
          <img 
            src={getImageToShow()!}
            alt={getImageAlt()}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          getSportEmoji(card.sport)
        )}
        {(card.back_image_url || localStorage.getItem(`card_${card.id}_back_image`)) && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.7rem',
            pointerEvents: 'none'
          }}>
            {isHovered ? 'Back' : 'Front'}
          </div>
        )}
      </div>
      <div className="card-info">
        <div className="card-title">
          {card.playerName}
          {card.sold && (
            <span style={{ 
              marginLeft: '8px',
              background: '#fecaca',
              color: '#991b1b',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: '500'
            }}>
              SOLD
            </span>
          )}
        </div>
        <div className="card-details">
          {card.year} {card.brand}<br/>
          Card #{card.cardNumber}<br/>
          {card.setName}
        </div>
        <div className="card-footer">
          <span className="card-value">
            {card.value ? `$${card.value.toLocaleString()}` : 'N/A'}
          </span>
          <span 
            className="card-condition"
            style={{
              background: getConditionColor(card.condition),
              color: getConditionTextColor(card.condition)
            }}
          >
            {card.condition}
          </span>
        </div>
      </div>
    </div>
  )
}
