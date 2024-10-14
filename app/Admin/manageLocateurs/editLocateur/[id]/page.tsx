'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface LocateurFormData {
  firstName: string
  lastName: string
  email: string
  birthday: string
  phoneNumber: string
  identifiant: string
  adress: string
  rental: string
}

export default function EditLocateurPage() {
  const [formData, setFormData] = useState<LocateurFormData>({
    firstName: '',
    lastName: '',
    email: '',
    birthday: '',
    phoneNumber: '',
    identifiant: '',
    adress: '',
    rental: '',
  })
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const getLocateurData = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Locateur ID is missing",
          variant: "destructive",
        })
        router.push('/Admin/manageLocateurs')
        return
      }

      try {
        const response = await fetch(`/api/Admin/manageLocateurs/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch locateur data')
        }
        const locateurData = await response.json()
        setFormData({
          firstName: locateurData.firstName,
          lastName: locateurData.lastName,
          email: locateurData.email,
          birthday: new Date(locateurData.birthday).toISOString().split('T')[0],
          phoneNumber: locateurData.phoneNumber,
          identifiant: locateurData.identifiant,
          adress: locateurData.adress,
          rental: locateurData.rental,
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching locateur data:', error)
        toast({
          title: "Error",
          description: "Unable to load locateur data.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    getLocateurData()
  }, [id, toast, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/Admin/manageLocateurs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update locateur')
      }

      toast({
        title: "Success",
        description: "Locateur updated successfully.",
      })
      router.push('/Admin/manageLocateurs')
    } catch (error) {
      console.error('Error updating locateur:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the locateur.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Locateur</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                value={formData.birthday}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="identifiant">Identifiant</Label>
              <Input
                id="identifiant"
                name="identifiant"
                value={formData.identifiant}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adress">Address</Label>
              <Input
                id="adress"
                name="adress"
                value={formData.adress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rental">Rental</Label>
              <Input
                id="rental"
                name="rental"
                value={formData.rental}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Locateur'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}