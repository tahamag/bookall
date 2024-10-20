"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, CarIcon, HomeIcon, Hotel, Search } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const searchbar = () => {
    const [location, setLocation] = useState("")
    const [checkIn, setCheckIn] = useState<Date>()
    const [checkOut, setCheckOut] = useState<Date>()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        // Implement search functionality here
    }

    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <Card className="w-full max-w-4xl mx-auto">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch}>
                            <div className="space-y-6">

                                <div className="grid gap-4 md:grid-cols-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                        id="location"
                                        placeholder="Where do you want to  stay"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                <div>
                                    <Label htmlFor="check-in">Check-in</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !checkIn && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {checkIn ? format(checkIn, "PPP") : "Select date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                            mode="single"
                                            selected={checkIn}
                                            onSelect={setCheckIn}
                                            initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div>
                                    <Label htmlFor="check-out">Check-out</Label>
                                    <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !checkOut && "text-muted-foreground"
                                        )}
                                        >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {checkOut ? format(checkOut, "PPP") : "Select date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                        mode="single"
                                        selected={checkOut}
                                        onSelect={setCheckOut}
                                        initialFocus
                                        />
                                    </PopoverContent>
                                    </Popover>
                                </div>
                                </div>

                                <Button type="submit" className="w-full">
                                    <Search className="mr-2 h-4 w-4" />
                                    Search
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default searchbar
