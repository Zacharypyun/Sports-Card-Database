'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, cardService } from '@/services/api'

interface HeaderProps {
  username?: string
  onLogout?: () => void
}

export default function Header({ username = 'User', onLogout }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Card[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debug dropdown state changes
  useEffect(() => {
    console.log('Profile dropdown state changed:', showProfileDropdown)
  }, [showProfileDropdown])

  // Debug search query changes
  useEffect(() => {
    console.log('Search query changed:', searchQuery)
  }, [searchQuery])

  // Debug search results changes
  useEffect(() => {
    console.log('Search results changed:', searchResults.length, 'results')
  }, [searchResults])

  const handleLogoClick = () => {
    router.push('/')
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    console.log('Search input changed:', query)
    setSearchQuery(query)
    
    if (query.trim().length === 0) {
      setSearchResults([])
      setShowSearchResults(false)
    } else {
      // Search immediately
      handleSearch(e)
    }
  }

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    console.log('handleSearch called with query:', query)
    
    if (query.trim().length === 0) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const allCards = await cardService.getAllCards()
      console.log('All cards fetched:', allCards.length)
      const filtered = allCards.filter(card => 
        card.playerName.toLowerCase().includes(query.toLowerCase()) ||
        card.brand.toLowerCase().includes(query.toLowerCase()) ||
        card.setName.toLowerCase().includes(query.toLowerCase()) ||
        card.sport.toLowerCase().includes(query.toLowerCase()) ||
        card.year.toString().includes(query)
      )
      console.log('Filtered results:', filtered.length)
      setSearchResults(filtered)
      setShowSearchResults(filtered.length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleCardClick = (card: Card) => {
    setShowSearchResults(false)
    setSearchQuery('')
    router.push(`/card/${card.id}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('userId')
    setShowProfileDropdown(false)
    if (onLogout) {
      onLogout()
    } else {
      router.push('/')
    }
  }

  const handleProfileClick = () => {
    console.log('Profile icon clicked, current state:', showProfileDropdown)
    setShowProfileDropdown(!showProfileDropdown)
  }

  return (
    <header className="header">
      <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        🏆 CardVault
      </div>
      
      <div className="search-container" ref={searchRef}>
        <div className="search-icon">🔍</div>
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search cards, players, or sets..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          onFocus={() => searchQuery.trim().length > 0 && setShowSearchResults(true)}
          style={{ color: 'black' }}
        />
        
        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((card) => (
              <div 
                key={card.id} 
                className="search-result-item"
                onClick={() => handleCardClick(card)}
              >
                <div className="search-result-content">
                  <div className="search-result-title">{card.playerName}</div>
                  <div className="search-result-details">
                    {card.year} {card.brand} • {card.sport}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="profile-section" ref={profileRef}>
        <span>Welcome back, {username}!</span>
        <div 
          className="profile-icon"
          onClick={handleProfileClick}
        >
          👤
        </div>
        
        {/* Profile Dropdown */}
        {showProfileDropdown && (
          <div className="profile-dropdown" style={{ border: '2px solid red' }}>
            <div className="dropdown-item" onClick={handleLogout}>
              🚪 Logout
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
