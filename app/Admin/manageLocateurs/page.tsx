'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Pencil, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"

interface Locateur {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  identifiant: string;
  adress: string;
  role: string;
  rental: string;
}

export default function LocateursList() {
  const [locateurs, setLocateurs] = useState<Locateur[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const getLocateurs = async () => {
    try {
      const response = await fetch('/api/Admin/manageLocateurs', {
        cache: 'no-store',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch locateurs')
      }
      const data = await response.json()
      setLocateurs(data)
    } catch (error) {
      console.error('Error fetching locateurs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch locateurs. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLocateurs()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this locateur?")) {
      try {
        const response = await fetch(`/api/Admin/manageLocateurs/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Locateur has been successfully deleted.",
          })
          getLocateurs() 
          throw new Error('Error during deletion')
        }
      } catch (error) {
        console.error('Error deleting locateur:', error)
        toast({
          title: "Error",
          description: "An error occurred while deleting the locateur.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Locateurs</h2>
      <Card>
        <CardHeader>
          <CardTitle>Locateurs List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Rental</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locateurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No locateurs found</TableCell>
                  </TableRow>
                ) : (
                  locateurs.map((locateur) => (
                    <TableRow key={locateur.id}>
                      <TableCell>{`${locateur.firstName} ${locateur.lastName}`}</TableCell>
                      <TableCell>{locateur.email}</TableCell>
                      <TableCell>{locateur.phoneNumber}</TableCell>
                      <TableCell>{locateur.rental}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">
                              <Eye className="h-4 w-4 mr-1" /> Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Locateur Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div>First Name: {locateur.firstName}</div>
                              <div>Last Name: {locateur.lastName}</div>
                              <div>Email: {locateur.email}</div>
                              <div>Birthday: {new Date(locateur.birthday).toLocaleDateString()}</div>
                              <div>Phone Number: {locateur.phoneNumber}</div>
                              <div>Identifiant: {locateur.identifiant}</div>
                              <div>Address: {locateur.adress}</div>
                              <div>Role: {locateur.role}</div>
                              <div>Rental: {locateur.rental}</div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Link href={`/Admin/editLocateur/${locateur.id}`} passHref>
                          <Button variant="outline" size="sm" className="mr-2">
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(locateur.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}