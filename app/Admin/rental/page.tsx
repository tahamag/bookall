'use client'
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Building, Home } from "lucide-react"
import Image from "next/image"
import { LoadingSkeleton } from "@/components/component/LoadingSkeleton"
import { ErrorMessage } from "@/components/component/ErrorMessage"

type Rental = {
  _id: string;
  type: 'car' | 'hotel' | 'apartment';
  ref: string;
  name: string;
  image: string;
  price: number;
  city: string;
  isValidated: boolean;
}

export default function ClientBookings() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/rental')
      if (!response.ok) {
        throw new Error('Failed to fetch rental')
      }
      const data = await response.json()
      setRentals(data.rentals)
      console.log("Fetched rentals:", rentals);
    } catch (error) {
      setError('Error fetching rentals')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour basculer la validation d'une réservation
  const toggleValidation = async (id: string) => {
    try {
        setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental._id === id ? { ...rental, isValidated: !rental.isValidated } : rental
        )
      )
      
      const response = await fetch(`/api/rental/${id}/toggle`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error('Error updating location')
      }
      
      const data = await response.json()
      console.log(data.message)
      
    } catch (err) {
      console.error(err)
      setRentals(prevRentals => 
        prevRentals.map(rental => 
          rental._id === id ? { ...rental, isValidated: !rental.isValidated } : rental
        )
      )
      alert('Error updating location. Please try again.')
    }
  }
  

  const getIcon = (type: 'car' | 'hotel' | 'apartment') => {
    switch (type) {
      case 'car': return <Car className="h-5 w-5" />
      case 'hotel': return <Building className="h-5 w-5" />
      case 'apartment': return <Home className="h-5 w-5" />
    }
  }
  if (isLoading) {
    return <LoadingSkeleton />
    } 
    if (error) {
    return <ErrorMessage message={error} />
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rentals.map((rental : any) => (
          <Card key={rental.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getIcon(rental.type)} {rental.name}
              </CardTitle>
              <Badge variant={rental.isValidated ? "default" : "secondary"}>
                {rental.isValidated ? "Validated" : "Pending"}
              </Badge>
            </CardHeader>
            <CardContent>
              <Image
                src={rental.image} 
                alt={rental.name} 
                className="w-full h-40 object-cover rounded-md mb-4"
                height={800}
                width={800}
              />
              <div className="space-y-1">
                <p className="text-sm font-medium">Ref: {rental.ref}</p>
                <p className="text-sm">City: {rental.city}</p>
                <p className="text-sm font-bold">Prix: {rental.price}$ / nuit </p>
              </div>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button 
                className="w-full" 
                variant={rental.isValidated ? "destructive" : "default"}
                onClick={() => toggleValidation(rental._id)}
              >
                {rental.isValidated ? "Invalidate" : "Validate"} the reservation
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}