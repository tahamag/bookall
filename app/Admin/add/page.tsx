'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"

interface AdminFormData {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  role: string
  password: string
}

    
export default function AddAdminPage() {
  
  const [formData, setFormData] = useState<AdminFormData>({
    firstName: '',
    lastName: '', 
    phoneNumber: '',
    email: '',
    role: 'admin', 
    password: '',
  })
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    if(!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.email 
      || !formData.password) { 
        alert('required')
    }
    try {
      const response = await fetch('/api/Admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create admin')
      }
      toast({
        title: "Success",
        description: "New admin created successfully.",
      })
      setTimeout(() => {
        router.push('/Admin/accounts')
        }, 2000)
    } catch (error) {
      console.error('Error creating admin:', error)
      toast({
        title: "Error",
        description: "Failed to create admin. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Admin</CardTitle>
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
                placeholder='Enter your first name'
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
                placeholder='Enter your last name'
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
                placeholder='Enter your phone number'
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
                placeholder='Enter your email'
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleRoleChange} defaultValue={formData.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Enter your password'
                required
              />
            </div>
            <Button type="submit" onClick={handleSubmit} className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Admin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
