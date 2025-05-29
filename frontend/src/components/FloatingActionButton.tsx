'use client'

interface FloatingActionButtonProps {
  onClick: () => void
}

export default function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button 
      className="fab" 
      title="Add New Card"
      onClick={onClick}
    >
      +
    </button>
  )
}
