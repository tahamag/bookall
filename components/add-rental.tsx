'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { X, Upload } from 'lucide-react'

type RentalType = 'hotel' | 'apartment' | 'car'

type FormData = {
  name: string
  description: string
  price: string
  city: string
  disponibilite: boolean
  mainImage: File | null
  additionalImages: File[]
  adresse: string
  nbrchambre: string
  wifi: boolean
  parking: boolean
  picine: boolean
  restauration: boolean
  model: string
  marque: string
  automatique: boolean
  typecars: string
}

export function AddRentalComponent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [rentalType, setRentalType] = useState<RentalType>('hotel')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    city: '',
    disponibilite: false,
    mainImage: null,
    additionalImages: [],
    adresse: '',
    nbrchambre: '',
    wifi: false,
    parking: false,
    picine: false,
    restauration: false,
    model: '',
    marque: '',
    automatique: false,
    typecars: '',
  })

  useEffect(() => {
    if (session?.user?.clientType) {
      setRentalType(session.user.clientType as RentalType)
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: keyof FormData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }))
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, mainImage: e.target.files![0] }))
    }
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ 
        ...prev, 
        additionalImages: [...prev.additionalImages, ...Array.from(e.target.files)]
      }))
    }
  }

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, mainImage: null }))
  }

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here you would typically send the formData to your API
      console.log(formData)
      toast({
        title: "Rental added successfully",
        description: "Your new rental has been added to the system.",
      })
      // After successful submission, redirect to a confirmation page or rental list
      router.push('/rentals')
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: "Error",
        description: "There was a problem adding your rental. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New {rentalType.charAt(0).toUpperCase() + rentalType.slice(1)}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Image (Required)</Label>
              <div className="relative">
                <Input
                  id="mainImage"
                  name="mainImage"
                  type="file"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  required
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById('mainImage')?.click()}
                  className="w-full flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Main Image
                </Button>
              </div>
            </div>
          </div>
          {formData.mainImage && (
            <div className="space-y-2">
              <Label>Main Image Preview</Label>
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(formData.mainImage)}
                  alt="Main image preview"
                  className="w-40 h-40 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  aria-label="Remove main image"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images (Optional)</Label>
            <div className="relative">
              <Input
                id="additionalImages"
                name="additionalImages"
                type="file"
                onChange={handleAdditionalImagesChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('additionalImages')?.click()}
                className="w-full flex items-center justify-center"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Additional Images
              </Button>
            </div>
          </div>
          {formData.additionalImages.length > 0 && (
            <div className="space-y-2">
              <Label>Additional Images Preview</Label>
              <div className="flex flex-wrap gap-2">
                {formData.additionalImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Additional image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      aria-label={`Remove additional image ${index + 1}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox id="disponibilite" checked={formData.disponibilite} onCheckedChange={() => handleCheckboxChange('disponibilite')} />
            <Label htmlFor="disponibilite">Available</Label>
          </div>

          {(rentalType === 'hotel' || rentalType === 'apartment') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="adresse">Address</Label>
                <Input id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nbrchambre">Number of Rooms</Label>
                <Input id="nbrchambre" name="nbrchambre" type="number" value={formData.nbrchambre} onChange={handleInputChange} required />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="wifi" checked={formData.wifi} onCheckedChange={() => handleCheckboxChange('wifi')} />
                  <Label htmlFor="wifi">WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parking" checked={formData.parking} onCheckedChange={() => handleCheckboxChange('parking')} />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="picine" checked={formData.picine} onCheckedChange={() => handleCheckboxChange('picine')} />
                  <Label htmlFor="picine">Swimming Pool</Label>
                </div>
              </div>
            </>
          )}

          {rentalType === 'hotel' && (
            <div className="flex items-center space-x-2">
              <Checkbox id="restauration" checked={formData.restauration} onCheckedChange={() => handleCheckboxChange('restauration')} />
              <Label htmlFor="restauration">Restaurant</Label>
            </div>
          )}

          {rentalType === 'car' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" name="model" value={formData.model} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marque">Brand</Label>
                  <Input id="marque" name="marque" value={formData.marque} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="automatique" checked={formData.automatique} onCheckedChange={() => handleCheckboxChange('automatique')} />
                <Label htmlFor="automatique">Automatic</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="typecars">Car Type</Label>
                <Select name="typecars" value={formData.typecars} onValueChange={(value) => setFormData(prev => ({ ...prev, typecars: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="truck">Truck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full">Add Rental</Button>
      </CardFooter>
    </Card>
  )
}