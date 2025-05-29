'use client'
import { useState, useEffect } from 'react'
import { Card, cardService } from '@/services/api'
import Header from '@/components/Header'
import StatsBar from '@/components/StatsBar'
import Sidebar from '@/components/Sidebar'
import CardsSection from '@/components/CardsSection'
import FloatingActionButton from '@/components/FloatingActionButton'
import CardForm from '@/components/CardForm'
import UserManager from '@/components/UserManager'

export default function Home() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)
  const [username, setUsername] = useState<string>('')
  const [showCardForm, setShowCardForm] = useState(false)
  const [filteredCards, setFilteredCards] = useState<Card[]>([])

  // Check for persisted user session on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')
    console.log('Stored user data:', { storedUserId, storedUsername })
    if (storedUserId && storedUsername) {
      setUserId(Number(storedUserId))
      setUsername(storedUsername)
    }
  }, [])

  // Debug username changes
  useEffect(() => {
    console.log('Username state changed:', username)
  }, [username])

  const fetchCards = async () => {
    try {
      const data = await cardService.getAllCards()
      setCards(data)
      setFilteredCards(data)
    } catch (error) {
      console.error('Error fetching cards:', error)
      // If there's an error, set empty array
      setCards([])
      setFilteredCards([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCards()
    }
  }, [userId])

  const handleCardCreated = (newCard: Card) => {
    fetchCards()
    setShowCardForm(false)
  }

  const handleFilterChange = (filters: any) => {
    console.log('Filters changed:', filters)
    
    let filtered = [...cards]
    
    // Filter by sport
    if (filters.sport) {
      filtered = filtered.filter(card => 
        card.sport.toLowerCase() === filters.sport.toLowerCase()
      )
    }
    
    // Filter by condition
    if (filters.condition) {
      filtered = filtered.filter(card => 
        card.condition.toLowerCase() === filters.condition.toLowerCase()
      )
    }
    
    // Filter by year range
    if (filters.yearRange) {
      const [startYear, endYear] = filters.yearRange.split('-').map(Number)
      filtered = filtered.filter(card => 
        card.year >= startYear && card.year <= endYear
      )
    }
    
    // Filter by special features
    if (filters.special) {
      filtered = filtered.filter(card => {
        switch (filters.special) {
          case 'rookie':
            return card.features?.rookie === true
          case 'autographed':
            return card.features?.autographed === true
          case 'serial-numbered':
            return card.features?.serialNumbered === true
          case 'graded':
            return card.features?.graded === true
          case 'sold':
            return card.sold === true
          default:
            return true
        }
      })
    }
    
    setFilteredCards(filtered)
  }

  const handleAddCard = () => {
    if (!userId) {
      alert('Please register a user first to add cards.')
      return
    }
    setShowCardForm(true)
  }

  const handleUserSet = (newUserId: number, newUsername: string) => {
    console.log('handleUserSet called with:', { newUserId, newUsername })
    setUserId(newUserId)
    setUsername(newUsername)
    localStorage.setItem('userId', newUserId.toString())
    localStorage.setItem('username', newUsername)
  }

  const handleLogout = () => {
    setUserId(null)
    setUsername('')
    setCards([])
    setFilteredCards([])
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
  }

  // Calculate stats from real data only
  const totalCards = cards.length
  const collectionValue = cards.reduce((sum, card) => sum + (card.value || 0), 0)
  const monthlyChange = 0 // TODO: Calculate actual monthly change based on card creation dates
  const recentlyAdded = 0 // TODO: Calculate based on card creation dates

  if (loading && userId) {
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
          Loading your collection...
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      {/* User Management Modal */}
      {!userId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <UserManager onUserSet={handleUserSet} />
          </div>
        </div>
      )}

      {/* Card Form Modal */}
      {showCardForm && userId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Add New Card</h2>
              <button 
                onClick={() => setShowCardForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#64748b',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            </div>
            <CardForm userId={userId} onCardCreated={handleCardCreated} />
          </div>
        </div>
      )}

      {/* Header */}
      {userId && <Header username={username} onLogout={handleLogout} />}

      {/* Stats Bar */}
      <StatsBar 
        totalCards={totalCards}
        collectionValue={collectionValue}
        monthlyChange={monthlyChange}
        recentlyAdded={recentlyAdded}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Sidebar */}
        <Sidebar cards={cards} onFilterChange={handleFilterChange} />

        {/* Cards Section */}
        <CardsSection cards={filteredCards} />
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleAddCard} />
    </div>
  )
}