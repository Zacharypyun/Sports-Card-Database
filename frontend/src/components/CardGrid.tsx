'use client'
import { useState, useEffect } from 'react'
import { Card, cardService } from '@/services/api'
import CardForm from './CardForm'
import UserManager from './UserManager'

export default function CardGrid() {
  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<number | null>(null)

  const fetchCards = async () => {
    try {
      const data = await cardService.getAllCards()
      setCards(data)
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  const handleCardCreated = () => {
    fetchCards()
  }

  const handleDeleteCard = async (cardId: number) => {
    try {
      await cardService.deleteCard(cardId)
      fetchCards()
    } catch (error) {
      console.error('Error deleting card:', error)
    }
  }

  if (loading) return <div>Loading cards...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Card Collection</h1>
      
      {/* User Management */}
      {!userId && <UserManager onUserSet={setUserId} />}
      
      {/* Card Creation Form */}
      {userId && <CardForm userId={userId} onCardCreated={handleCardCreated} />}
      
      {/* Cards Display */}
      {cards.length === 0 ? (
        <p>No cards found. {userId ? 'Add some cards to your collection!' : 'Register a user first to add cards.'}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{card.playerName}</h3>
                {card.sold && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    SOLD
                  </span>
                )}
              </div>
              <p className="text-gray-600">{card.year} {card.brand}</p>
              <p className="text-sm text-gray-500">{card.setName}</p>
              <p className="text-sm">#{card.cardNumber}</p>
              <p className="text-sm">Sport: {card.sport}</p>
              <p className="text-sm">Condition: {card.condition}</p>
              {card.value && <p className="text-green-600 font-semibold">${card.value}</p>}
              {card.front_image_url && (
                <img 
                  src={`http://localhost:8000${card.front_image_url}`} 
                  alt={`${card.playerName} front`}
                  className="w-full h-32 object-cover rounded mt-2"
                />
              )}
              {userId && (
                <button
                  onClick={() => card.id && handleDeleteCard(card.id)}
                  className="mt-3 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}