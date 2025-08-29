'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, cardService } from '@/services/api'
import Header from '@/components/Header'
import CardDetail from '@/components/CardDetail'

export default function CardPage() {
  const params = useParams()
  const router = useRouter()
  const [card, setCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [username, setUsername] = useState<string>('')

  // Get username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const fetchCard = async () => {
    try {
      const cardId = parseInt(params.id as string)
      if (isNaN(cardId)) {
        setError('Invalid card ID')
        return
      }
      
      // For now, we'll need to fetch all cards and find the one we want
      // TODO: Implement getCardById in the API
      const allCards = await cardService.getAllCards()
      const foundCard = allCards.find(c => c.id === cardId)
      
      if (!foundCard) {
        setError('Card not found')
        return
      }
      
      setCard(foundCard)
    } catch (error) {
      console.error('Error fetching card:', error)
      setError('Failed to load card')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCard()
  }, [params.id])

  const handleCardUpdated = (updatedCard: Card) => {
    setCard(updatedCard)
  }

  const handleCardDeleted = () => {
    router.push('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="app-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#64748b'
        }}>
          Loading card...
        </div>
      </div>
    )
  }

  if (error || !card) {
    return (
      <div className="app-container">
        <Header username={username} onLogout={handleLogout} />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: 'calc(100vh - 100px)',
          fontSize: '1.2rem',
          color: '#dc2626'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p>{error || 'Card not found'}</p>
            <button 
              onClick={() => router.push('/')}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Collection
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <Header username={username} onLogout={handleLogout} />
      <CardDetail 
        card={card} 
        onCardUpdated={handleCardUpdated}
        onCardDeleted={handleCardDeleted}
      />
    </div>
  )
}
