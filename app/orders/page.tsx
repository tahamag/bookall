"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Navrbar } from "@/components/component/navbar"
import Footer from "@/components/component/footer";
import { useSession  } from "next-auth/react";
import { useRouter } from "next/navigation"

type Rental = {
    name: string
    rentalType: string
    price: number
    startDate: string
    endDate: string
    nights: number
    totalPrice: number
    city: string
}

type Booking = {
    reference: string
    price: number
    operationDate: string
    rentals: Rental[]
}


const booking = () => {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            if (session?.user?.id) {
                fetchBookings(session?.user?.id)
            }
        } else if (sessionStatus === "unauthenticated") {
            localStorage.setItem("redirectPath", router.asPath);
            router.push(localStorage);
        }
    }, [session]);

    const fetchBookings = async (idCLient : string) => {
        try {
            setLoading(true);
            const link = `/api/booking?clientId=${idCLient}`;
            const response = await fetch(link);
            if (!response.ok) throw new Error("Failed to fetch hotels");
            else {
            const data = await response.json();
                console.log(data.Bookings)
                setBookings(data.Bookings);
            }
        } catch (err) {
            console.log("Failed to fetch rentals");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div>
        <Navrbar/>
        <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Your Bookings</h1>
        {bookings.map((booking, index) => (
            <Card key={booking.reference} className="mb-6">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                Booking Reference: {booking.reference}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                <p><strong>Total Price:</strong> ${booking.price.toFixed(2)}</p>
                <p><strong>Operation Date:</strong> {booking.operationDate}</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger>View Rentals</AccordionTrigger>
                    <AccordionContent>
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
                        {booking.rentals.map((rental, rentalIndex) => (
                            <TableRow key={rentalIndex}>
                            <TableCell className="font-medium">{rental.name}</TableCell>
                            <TableCell>{rental.rentalType}</TableCell>
                            <TableCell>{rental.city}</TableCell>
                            <TableCell>{`${rental.startDate} to ${rental.endDate}`}</TableCell>
                            <TableCell>{rental.nights}</TableCell>
                            <TableCell className="text-right">${rental.totalPrice.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
            </Card>
        ))}
        </div>
        <Footer/>
    </div>
  )
}

export default booking
