'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, WifiIcon, CarIcon, PoolIcon, UtensilsIcon } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"
import { cn } from "@/lib/utils"

export function HotelSearchPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [city, setCity] = useState("")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [rooms, setRooms] = useState(1)
  const [wifi, setWifi] = useState(false)
  const [parking, setParking] = useState(false)
  const [pool, setPool] = useState(false)
  const [restaurant, setRestaurant] = useState(false)

  // Mock hotel data
  const hotels = [
    { id: 1, name: "Luxury Resort & Spa", price: 350, image: "/placeholder.svg?height=200&width=300" },
    { id: 2, name: "City Center Hotel", price: 180, image: "/placeholder.svg?height=200&width=300" },
    { id: 3, name: "Beachfront Paradise", price: 420, image: "/placeholder.svg?height=200&width=300" },
    { id: 4, name: "Mountain View Lodge", price: 250, image: "/placeholder.svg?height=200&width=300" },
    { id: 5, name: "Historic Boutique Hotel", price: 200, image: "/placeholder.svg?height=200&width=300" },
    { id: 6, name: "Modern Business Suites", price: 280, image: "/placeholder.svg?height=200&width=300" },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-cover bg-center" style={{backgroundImage: "url('/placeholder.svg?height=1080&width=1920')"}}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Your Perfect Stay</h1>
          <p className="text-xl md:text-2xl">Luxury accommodations for unforgettable experiences</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white shadow-lg -mt-8 relative z-10 mx-4 md:mx-auto max-w-4xl rounded-lg p-6 flex flex-wrap gap-4 justify-between items-end">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} className="w-full md:w-auto" />
        <Input
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full md:w-auto"
        />
        <Button className="w-full md:w-auto">Search</Button>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto mt-12 p-4 flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Price Range</Label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-2">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
              <div>
                <Label>Number of Rooms</Label>
                <Input
                  type="number"
                  min={1}
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="wifi">WiFi</Label>
                <Switch id="wifi" checked={wifi} onCheckedChange={setWifi} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="parking">Parking</Label>
                <Switch id="parking" checked={parking} onCheckedChange={setParking} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pool">Swimming Pool</Label>
                <Switch id="pool" checked={pool} onCheckedChange={setPool} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="restaurant">Restaurant</Label>
                <Switch id="restaurant" checked={restaurant} onCheckedChange={setRestaurant} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Hotel Cards */}
        <div className="w-full md:w-3/4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {hotels.map(hotel => (
              <Card key={hotel.id} className="overflow-hidden">
                <img src={hotel.image} alt={hotel.name} className="w-full h-48 object-cover" />
                <CardHeader>
                  <CardTitle>{hotel.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${hotel.price}/night</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Check In</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}