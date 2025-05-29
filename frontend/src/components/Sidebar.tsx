'use client'
import { useState, useMemo } from 'react'
import { Card } from '@/services/api'

interface SidebarProps {
  cards: Card[]
  onFilterChange?: (filters: FilterState) => void
}

interface FilterState {
  sport: string
  condition: string
  yearRange: string
  special: string
}

export default function Sidebar({ cards, onFilterChange }: SidebarProps) {
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    sport: '',
    condition: '',
    yearRange: '',
    special: ''
  })

  // Calculate dynamic counts based on actual card data
  const filterCounts = useMemo(() => {
    const counts = {
      sports: {
        baseball: 0,
        basketball: 0,
        football: 0,
        hockey: 0
      },
      conditions: {
        mint: 0,
        'near-mint': 0,
        excellent: 0,
        good: 0
      },
      yearRanges: {
        '2020-2024': 0,
        '2010-2019': 0,
        '2000-2009': 0,
        '1990-1999': 0
      },
      special: {
        rookie: 0,
        autographed: 0,
        'serial-numbered': 0,
        graded: 0,
        sold: 0
      }
    }

    cards.forEach(card => {
      // Count by sport
      if (card.sport.toLowerCase() === 'baseball') counts.sports.baseball++
      else if (card.sport.toLowerCase() === 'basketball') counts.sports.basketball++
      else if (card.sport.toLowerCase() === 'football') counts.sports.football++
      else if (card.sport.toLowerCase() === 'hockey') counts.sports.hockey++

      // Count by condition
      if (card.condition.toLowerCase() === 'mint') counts.conditions.mint++
      else if (card.condition.toLowerCase() === 'near-mint') counts.conditions['near-mint']++
      else if (card.condition.toLowerCase() === 'excellent') counts.conditions.excellent++
      else if (card.condition.toLowerCase() === 'good') counts.conditions.good++

      // Count by year range
      if (card.year >= 2020 && card.year <= 2024) counts.yearRanges['2020-2024']++
      else if (card.year >= 2010 && card.year <= 2019) counts.yearRanges['2010-2019']++
      else if (card.year >= 2000 && card.year <= 2009) counts.yearRanges['2000-2009']++
      else if (card.year >= 1990 && card.year <= 1999) counts.yearRanges['1990-1999']++

      // Count by special features
      if (card.features?.rookie) counts.special.rookie++
      if (card.features?.autographed) counts.special.autographed++
      if (card.features?.serialNumbered) counts.special['serial-numbered']++
      if (card.features?.graded) counts.special.graded++
      if (card.sold) counts.special.sold++
    })

    return counts
  }, [cards])

  const handleFilterClick = (filterType: keyof FilterState, value: string) => {
    const newFilters = { ...activeFilters }
    
    // Toggle filter - if same value is clicked, clear it
    if (activeFilters[filterType] === value) {
      newFilters[filterType] = ''
    } else {
      newFilters[filterType] = value
    }
    
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const clearAllFilters = () => {
    const newFilters = {
      sport: '',
      condition: '',
      yearRange: '',
      special: ''
    }
    setActiveFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const isActive = (filterType: keyof FilterState, value: string) => {
    return activeFilters[filterType] === value
  }

  const hasActiveFilters = Object.values(activeFilters).some(value => value !== '')

  return (
    <aside className="sidebar">
      {/* Clear All Filters Button */}
      {hasActiveFilters && (
        <div className="filter-group">
          <button 
            onClick={clearAllFilters}
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
          >
            🗑️ Clear All Filters
          </button>
        </div>
      )}

      <div className="filter-group">
        <h3>Sports</h3>
        <div 
          className={`filter-option ${isActive('sport', 'baseball') ? 'active' : ''}`}
          onClick={() => handleFilterClick('sport', 'baseball')}
        >
          ⚾ Baseball ({filterCounts.sports.baseball})
        </div>
        <div 
          className={`filter-option ${isActive('sport', 'basketball') ? 'active' : ''}`}
          onClick={() => handleFilterClick('sport', 'basketball')}
        >
          🏀 Basketball ({filterCounts.sports.basketball})
        </div>
        <div 
          className={`filter-option ${isActive('sport', 'football') ? 'active' : ''}`}
          onClick={() => handleFilterClick('sport', 'football')}
        >
          🏈 Football ({filterCounts.sports.football})
        </div>
        <div 
          className={`filter-option ${isActive('sport', 'hockey') ? 'active' : ''}`}
          onClick={() => handleFilterClick('sport', 'hockey')}
        >
          🏒 Hockey ({filterCounts.sports.hockey})
        </div>
      </div>

      <div className="filter-group">
        <h3>Condition</h3>
        <div 
          className={`filter-option ${isActive('condition', 'mint') ? 'active' : ''}`}
          onClick={() => handleFilterClick('condition', 'mint')}
        >
          💎 Mint ({filterCounts.conditions.mint})
        </div>
        <div 
          className={`filter-option ${isActive('condition', 'near-mint') ? 'active' : ''}`}
          onClick={() => handleFilterClick('condition', 'near-mint')}
        >
          ✨ Near Mint ({filterCounts.conditions['near-mint']})
        </div>
        <div 
          className={`filter-option ${isActive('condition', 'excellent') ? 'active' : ''}`}
          onClick={() => handleFilterClick('condition', 'excellent')}
        >
          📱 Excellent ({filterCounts.conditions.excellent})
        </div>
        <div 
          className={`filter-option ${isActive('condition', 'good') ? 'active' : ''}`}
          onClick={() => handleFilterClick('condition', 'good')}
        >
          📄 Good ({filterCounts.conditions.good})
        </div>
      </div>

      <div className="filter-group">
        <h3>Year Range</h3>
        <div 
          className={`filter-option ${isActive('yearRange', '2020-2024') ? 'active' : ''}`}
          onClick={() => handleFilterClick('yearRange', '2020-2024')}
        >
          🕰️ 2020-2024 ({filterCounts.yearRanges['2020-2024']})
        </div>
        <div 
          className={`filter-option ${isActive('yearRange', '2010-2019') ? 'active' : ''}`}
          onClick={() => handleFilterClick('yearRange', '2010-2019')}
        >
          📅 2010-2019 ({filterCounts.yearRanges['2010-2019']})
        </div>
        <div 
          className={`filter-option ${isActive('yearRange', '2000-2009') ? 'active' : ''}`}
          onClick={() => handleFilterClick('yearRange', '2000-2009')}
        >
          🎯 2000-2009 ({filterCounts.yearRanges['2000-2009']})
        </div>
        <div 
          className={`filter-option ${isActive('yearRange', '1990-1999') ? 'active' : ''}`}
          onClick={() => handleFilterClick('yearRange', '1990-1999')}
        >
          ⚡ 1990-1999 ({filterCounts.yearRanges['1990-1999']})
        </div>
      </div>

      <div className="filter-group">
        <h3>Special</h3>
        <div 
          className={`filter-option ${isActive('special', 'rookie') ? 'active' : ''}`}
          onClick={() => handleFilterClick('special', 'rookie')}
        >
          🌟 Rookie Cards ({filterCounts.special.rookie})
        </div>
        <div 
          className={`filter-option ${isActive('special', 'autographed') ? 'active' : ''}`}
          onClick={() => handleFilterClick('special', 'autographed')}
        >
          ✍️ Autographed ({filterCounts.special.autographed})
        </div>
        <div 
          className={`filter-option ${isActive('special', 'serial-numbered') ? 'active' : ''}`}
          onClick={() => handleFilterClick('special', 'serial-numbered')}
        >
          🔢 Serial Numbered ({filterCounts.special['serial-numbered']})
        </div>
        <div 
          className={`filter-option ${isActive('special', 'graded') ? 'active' : ''}`}
          onClick={() => handleFilterClick('special', 'graded')}
        >
          🏆 Graded ({filterCounts.special.graded})
        </div>
        <div 
          className={`filter-option ${isActive('special', 'sold') ? 'active' : ''}`}
          onClick={() => handleFilterClick('special', 'sold')}
        >
          💰 Sold ({filterCounts.special.sold})
        </div>
      </div>
    </aside>
  )
}
