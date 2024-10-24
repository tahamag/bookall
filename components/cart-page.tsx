"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X } from "lucide-react"

type CartItem = {
  name: string
  rentalType: string
  price: number
  startDate: string
  endDate: string
  nights: number
  totalPrice: number
  city: string
  clientId: string
  rentalId: string
}

type Notification = {
  type: 'success' | 'error'
  title: string
  message: string
}

export function CartPageComponent() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      name: "Luxury Suite",
      rentalType: "Hotel",
      price: 200,
      startDate: "2024-11-01",
      endDate: "2024-11-05",
      nights: 4,
      totalPrice: 800,
      city: "Paris",
      clientId: "client123",
      rentalId: "rental456"
    },
    {
      name: "Cozy Apartment",
      rentalType: "Apartment",
      price: 150,
      startDate: "2024-12-15",
      endDate: "2024-12-20",
      nights: 5,
      totalPrice: 750,
      city: "London",
      clientId: "client123",
      rentalId: "rental789"
    }
  ])
  const [notification, setNotification] = useState<Notification | null>(null)

  const handleReservation = async () => {
    try {
      // Here you would typically make an API call to process the reservation
      // For demonstration purposes, we'll simulate an API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000))

      // If the reservation is successful, clear the cart and show a success message
      setCartItems([])
      setNotification({
        type: 'success',
        title: 'Reservation Successful',
        message: 'Your reservations have been confirmed.'
      })

      // Redirect to a confirmation page or the user's bookings after a short delay
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (error) {
      console.error("Reservation failed:", error)
      setNotification({
        type: 'error',
        title: 'Reservation Failed',
        message: 'There was an error processing your reservation. Please try again.'
      })
    }
  }

  const totalAmount = cartItems.reduce((sum, item) => sum + item.totalPrice, 0)

  return (
    <div className="container mx-auto py-10">
      {notification && (
        <Alert className={`mb-4 ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
          <Button 
            className="absolute top-2 right-2" 
            variant="ghost" 
            size="icon"
            onClick={() => setNotification(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Nights</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.rentalType}</TableCell>
                  <TableCell>{item.city}</TableCell>
                  <TableCell>{`${item.startDate} to ${item.endDate}`}</TableCell>
                  <TableCell>{item.nights}</TableCell>
                  <TableCell className="text-right">${item.totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</div>
          <Button onClick={handleReservation} disabled={cartItems.length === 0}>
            Complete Reservation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}