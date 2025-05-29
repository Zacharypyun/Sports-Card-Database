'use client'
import { useState, useEffect } from 'react'
import { Card, cardService } from '@/services/api'

interface CardFormProps {
  userId: number
  onCardCreated: (card: Card) => void
  initialCard?: Card
  isEditing?: boolean
}

const AVAILABLE_FEATURES = [
  'rookie',
  'numbered',
  'autograph',
  'relic',
  'graded',
  'parallel',
  'insert',
  'variation',
  'error',
  'short_print',
  'chase',
  'limited_edition'
]

export default function CardForm({ userId, onCardCreated, initialCard, isEditing = false }: CardFormProps) {
  const [formData, setFormData] = useState({
    playerName: '',
    year: new Date().getFullYear(),
    brand: '',
    setName: '',
    sport: '',
    cardNumber: '',
    condition: '',
    value: '',
    features: {} as Record<string, boolean>,
    sold: false
  })
  
  const [frontImage, setFrontImage] = useState<File | null>(null)
  const [backImage, setBackImage] = useState<File | null>(null)
  const [frontImagePreview, setFrontImagePreview] = useState<string>('')
  const [backImagePreview, setBackImagePreview] = useState<string>('')
  const [frontImageRemoved, setFrontImageRemoved] = useState<boolean>(false)
  const [backImageRemoved, setBackImageRemoved] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Initialize form with existing card data if editing
  useEffect(() => {
    if (initialCard) {
      console.log('Initializing form with card:', initialCard)
      setFormData({
        playerName: initialCard.playerName,
        year: initialCard.year,
        brand: initialCard.brand,
        setName: initialCard.setName,
        sport: initialCard.sport,
        cardNumber: initialCard.cardNumber,
        condition: initialCard.condition,
        value: initialCard.value?.toString() || '',
        features: initialCard.features || {},
        sold: initialCard.sold
      })
      
      // Reset removed flags
      setFrontImageRemoved(false)
      setBackImageRemoved(false)
      
      // Check localStorage for any newly uploaded images first
      const storedFrontImage = localStorage.getItem(`card_${initialCard.id}_front_image`)
      const storedBackImage = localStorage.getItem(`card_${initialCard.id}_back_image`)
      
      if (storedFrontImage) {
        console.log('Loading front image from localStorage')
        setFrontImagePreview(storedFrontImage)
      } else if (initialCard.front_image_url && !frontImagePreview) {
        console.log('Setting front image preview from existing card')
        const url = initialCard.front_image_url.startsWith('data:image/') ? initialCard.front_image_url : `http://localhost:8000${initialCard.front_image_url}`
        setFrontImagePreview(url)
      } else {
        setFrontImagePreview('')
      }
      
      if (storedBackImage) {
        console.log('Loading back image from localStorage')
        setBackImagePreview(storedBackImage)
      } else if (initialCard.back_image_url && !backImagePreview) {
        console.log('Setting back image preview from existing card')
        const url = initialCard.back_image_url.startsWith('data:image/') ? initialCard.back_image_url : `http://localhost:8000${initialCard.back_image_url}`
        setBackImagePreview(url)
      } else {
        setBackImagePreview('')
      }
    }
  }, [initialCard, frontImagePreview, backImagePreview])

  // Debug image preview changes
  useEffect(() => {
    console.log('Front image preview changed:', frontImagePreview ? 'has preview' : 'no preview')
  }, [frontImagePreview])

  useEffect(() => {
    console.log('Back image preview changed:', backImagePreview ? 'has preview' : 'no preview')
  }, [backImagePreview])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Build payload with explicit nulls if images were removed
      const payload: any = {
        ...formData,
        user_id: userId,
        value: formData.value ? parseFloat(formData.value) : undefined,
        year: parseInt(formData.year.toString()),
      }

      if (frontImageRemoved) {
        payload.front_image_url = null
      } else if (frontImagePreview) {
        payload.front_image_url = frontImagePreview
      }

      if (backImageRemoved) {
        payload.back_image_url = null
      } else if (backImagePreview) {
        payload.back_image_url = backImagePreview
      }

      let createdCard: Card
      
      if (isEditing && initialCard?.id) {
        createdCard = await cardService.updateCard(initialCard.id, payload)
        console.log('Updated card with images:', createdCard)
        // Clear removed flags after successful save
        setFrontImageRemoved(false)
        setBackImageRemoved(false)
      } else {
        createdCard = await cardService.createCard(payload)
      }
      
      onCardCreated(createdCard)
    } catch (error) {
      console.error('Error creating card:', error)
      setError('Failed to create card. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked
      }
    }))
  }

  const handleImageChange = (file: File | null, type: 'front' | 'back') => {
    console.log('handleImageChange called:', { type, file })
    
    if (type === 'front') {
      setFrontImageRemoved(false)
      setFrontImage(file)
      if (file) {
        console.log('Processing front image:', file.name, file.size)
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log('Front image loaded, result length:', e.target?.result?.toString().length)
          const imageData = e.target?.result as string
          setFrontImagePreview(imageData)
          
          // Store in localStorage for edited cards
          if (isEditing && initialCard?.id) {
            localStorage.setItem(`card_${initialCard.id}_front_image`, imageData)
          }
        }
        reader.onerror = (e) => {
          console.error('Error reading front image:', e)
        }
        reader.readAsDataURL(file)
      } else {
        setFrontImagePreview('')
        // Remove from localStorage
        if (isEditing && initialCard?.id) {
          localStorage.removeItem(`card_${initialCard.id}_front_image`)
        }
      }
    } else {
      setBackImageRemoved(false)
      setBackImage(file)
      if (file) {
        console.log('Processing back image:', file.name, file.size)
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log('Back image loaded, result length:', e.target?.result?.toString().length)
          const imageData = e.target?.result as string
          setBackImagePreview(imageData)
          
          // Store in localStorage for edited cards
          if (isEditing && initialCard?.id) {
            localStorage.setItem(`card_${initialCard.id}_back_image`, imageData)
          }
        }
        reader.onerror = (e) => {
          console.error('Error reading back image:', e)
        }
        reader.readAsDataURL(file)
      } else {
        setBackImagePreview('')
        // Remove from localStorage
        if (isEditing && initialCard?.id) {
          localStorage.removeItem(`card_${initialCard.id}_back_image`)
        }
      }
    }
  }

  const removeImage = (type: 'front' | 'back') => {
    if (type === 'front') {
      setFrontImage(null)
      setFrontImagePreview('')
      setFrontImageRemoved(true)
      if (isEditing && initialCard?.id) {
        localStorage.removeItem(`card_${initialCard.id}_front_image`)
      }
    } else {
      setBackImage(null)
      setBackImagePreview('')
      setBackImageRemoved(true)
      if (isEditing && initialCard?.id) {
        localStorage.removeItem(`card_${initialCard.id}_back_image`)
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Card' : 'Add New Card'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Player Name *
              </label>
              <input
                type="text"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                min="1900"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Set Name *
              </label>
              <input
                type="text"
                name="setName"
                value={formData.setName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sport *
              </label>
              <select
                name="sport"
                value={formData.sport}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Sport</option>
                <option value="Baseball">Baseball</option>
                <option value="Basketball">Basketball</option>
                <option value="Football">Football</option>
                <option value="Hockey">Hockey</option>
                <option value="Soccer">Soccer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition *
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Condition</option>
                <option value="Mint">Mint</option>
                <option value="Near Mint">Near Mint</option>
                <option value="Excellent">Excellent</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value ($)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="sold"
                checked={formData.sold}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Sold
              </label>
            </div>
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Special Features</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AVAILABLE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center">
                <input
                  type="checkbox"
                  id={feature}
                  checked={formData.features[feature] || false}
                  onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={feature} className="ml-2 block text-sm text-gray-700 capitalize">
                  {feature.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Image Uploads */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Card Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Front Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Front Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {frontImagePreview ? (
                  <div className="relative">
                    <img 
                      src={frontImagePreview} 
                      alt="Front preview" 
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('front')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'front')}
                      className="hidden"
                      id="front-image"
                    />
                    <label htmlFor="front-image" className="cursor-pointer">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>Click to upload front image</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Back Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Back Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {backImagePreview ? (
                  <div className="relative">
                    <img 
                      src={backImagePreview} 
                      alt="Back preview" 
                      className="w-full h-48 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('back')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null, 'back')}
                      className="hidden"
                      id="back-image"
                    />
                    <label htmlFor="back-image" className="cursor-pointer">
                      <div className="text-gray-400">
                        <svg className="mx-auto h-12 w-12 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p>Click to upload back image</p>
                      </div>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Card' : 'Add Card')}
          </button>
        </div>
      </form>
    </div>
  )
} 