const API_BASE_URL = 'http://localhost:8000'

export interface Card {
  id?: number
  user_id: number
  playerName: string
  year: number
  brand: string
  setName: string
  sport: string
  cardNumber: string
  condition: string
  value?: number
  features: Record<string, any>
  sold: boolean
  front_image_url?: string
  back_image_url?: string
  createdAt?: string
}

export interface User {
  id: number
  email: string
  username: string
  createdAt: string
}

export const cardService = {
  async getAllCards(): Promise<Card[]> {
    const response = await fetch(`${API_BASE_URL}/cards`)
    if (!response.ok) throw new Error('Failed to fetch cards')
    return response.json()
  },

  async createCard(card: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })
    if (!response.ok) throw new Error('Failed to create card')
    return response.json()
  },

  async updateCard(cardId: number, card: Omit<Card, 'id' | 'createdAt'>): Promise<Card> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(card),
    })
    if (!response.ok) throw new Error('Failed to update card')
    return response.json()
  },

  async deleteCard(cardId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Failed to delete card')
  }
}

export const userService = {
  async registerUser(user: { email: string; username: string; password: string }): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    if (!response.ok) throw new Error('Failed to register user')
    return response.json()
  }
}