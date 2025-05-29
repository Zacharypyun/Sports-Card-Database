'use client'

interface StatsBarProps {
  totalCards?: number
  collectionValue?: number
  monthlyChange?: number
  recentlyAdded?: number
}

export default function StatsBar({ 
  totalCards = 0, 
  collectionValue = 0, 
  monthlyChange = 0, 
  recentlyAdded = 0 
}: StatsBarProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value}`
  }

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${formatCurrency(value)}`
  }

  return (
    <section className="stats-bar">
      <div className="stat-card">
        <div className="stat-number">{totalCards.toLocaleString()}</div>
        <div className="stat-label">Total Cards</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{formatCurrency(collectionValue)}</div>
        <div className="stat-label">Collection Value</div>
      </div>
      <div className="stat-card">
        <div className="stat-number" style={{ color: monthlyChange >= 0 ? '#059669' : '#dc2626' }}>
          {formatChange(monthlyChange)}
        </div>
        <div className="stat-label">This Month</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{recentlyAdded}</div>
        <div className="stat-label">Recently Added</div>
      </div>
    </section>
  )
}
