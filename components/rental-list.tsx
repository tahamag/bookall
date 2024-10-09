'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type Rental = {
  id: number
  name: string
  price: number
  city: string
  availability: string
  mainImage: string
}

export function RentalListComponent() {
  const [rentals, setRentals] = useState<Rental[]>([
    { id: 1, name: "Cozy Apartment", price: 1200, city: "New York", availability: "Available", mainImage: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Luxury Villa", price: 5000, city: "Los Angeles", availability: "Booked", mainImage: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Beach House", price: 2500, city: "Miami", availability: "Available", mainImage: "/placeholder.svg?height=100&width=100" },
    { id: 4, name: "Mountain Cabin", price: 1800, city: "Denver", availability: "Available", mainImage: "/placeholder.svg?height=100&width=100" },
  ])

  const handleUpdate = (id: number) => {
    // Implement update logic here
    console.log(`Update rental with id: ${id}`)
  }

  const handleDelete = (id: number) => {
    setRentals(rentals.filter(rental => rental.id !== id))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Rental Properties</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.id}>
              <TableCell>
                <Image
                  src={rental.mainImage}
                  alt={rental.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              </TableCell>
              <TableCell>{rental.name}</TableCell>
              <TableCell>${rental.price}</TableCell>
              <TableCell>{rental.city}</TableCell>
              <TableCell>{rental.availability}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button onClick={() => handleUpdate(rental.id)} variant="outline">
                    Update
                  </Button>
                  <Button onClick={() => handleDelete(rental.id)} variant="destructive">
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}