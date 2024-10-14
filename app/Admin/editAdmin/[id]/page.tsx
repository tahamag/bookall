'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface AdminFormData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  role: string
  password?: string
}

export default function EditAdminPage() {
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    role: 'admin',
    password: '',
  })
  const [loading, setLoading] = useState(true)
  
  const params = useParams<{ id: string }>()
  const id = params.id
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const GetDataAdmin = async () => {
        console.log('Admin ID:', id); // Debugging line
  if (!id) {
    console.error('Admin ID is missing');
    return;
  }
      try {
        const response = await fetch(`/api/Admin/manageAdmins/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch admin data')
        }
        const adminData = await response.json()
        setFormData({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          phoneNumber: adminData.phoneNumber,
          email: adminData.email,
          role: adminData.role,
          password: '', // Don't pre-fill password for security reasons
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching admin data:', error)
        toast({
          title: "Error",
          description: "Unable to load admin data.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    GetDataAdmin()
  }, [id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log('handleSubmit appelé');
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/Admin/manageAdmins/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update admin')
      }

      toast({
        title: "Success",
        description: "Admin updated successfully.",
      })
      setTimeout(() => {
        router.push('/Admin/manageAdmins')
      }, 2000) 
    } catch (error) {
      console.error('Error updating admin:', error)
      toast({
        title: "Error",
        description: "An error occurred while updating the admin.",
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
          <CardTitle className="text-2xl font-bold">Edit Administrator</CardTitle>
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
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} value={formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password (leave blank to keep current)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Administrator'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}