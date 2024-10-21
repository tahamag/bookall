"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navrbar } from "@/components/component/navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


    // Mock data for the current hotel
    const hotel = {
        id: '1',
        name: 'Luxury Resort & Spa',
        price: 350,
        description: 'Experience unparalleled luxury in our resort, featuring stunning views, world-class amenities, and exceptional service.',
        city: 'Paradise City',
        address: '123 Ocean Drive, Paradise City, 12345',
        rooms: 5,
        images: [
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
            '/placeholder.svg?height=400&width=600',
        ]
    }

    // Mock data for similar hotels
    const similarHotels = [
        { id: '2', name: 'Seaside Retreat', price: 280, image: '/placeholder.svg?height=200&width=300' },
        { id: '3', name: 'Mountain View Lodge', price: 320, image: '/placeholder.svg?height=200&width=300' },
        { id: '4', name: 'Urban Oasis Hotel', price: 250, image: '/placeholder.svg?height=200&width=300' },
        { id: '5', name: 'Riverside Inn', price: 200, image: '/placeholder.svg?height=200&width=300' },
        { id: '6', name: 'Beachfront Paradise', price: 400, image: '/placeholder.svg?height=200&width=300' },
    ]
    type Rental = {
        id: string;
        name: string;
        description: string;
        price: number;
        city: string;
        disposability: boolean;
        mainImage: string;
        additionalImages: string[];
        address?: string;
        nbrChamber?: number;
        wifi?: boolean;
        parking?: boolean;
        piscine?: boolean;
        restoration?: boolean;
        model?: string;
        marque?: string;
        automatique?: boolean;
        rentalType: "Hotel" | "Apartment" | "Car";
    };

const hotelDetails = () => {
    const { id } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [nights, setNights] = useState(1)
    const [isLoading, setIsLoading] = useState(true);
    const [rental, setRental] = useState<Rental | null>(null);
    const [additionalImages, setAdditionalImages] = useState<string[]>([]);

    useEffect(() => {
        fetchRental(id as string)
        fetchAdditionalImages(id as string)
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + hotel.images.length) % hotel.images.length)
    }

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % hotel.images.length)
    }
    const fetchRental = async (rentalId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/rental?rentalId=${rentalId}`);
            if (!response.ok) throw new Error("Failed to fetch rental");
            const data = await response.json();
            setRental(data.rentals);
            console.log(data.rentals)
        } catch (err) {
            console.error(err);
        }
    };
    const fetchAdditionalImages = async (rentalId: string) => {
        try {
            const response = await fetch(`/api/uploadimg?rentalId=${rentalId}`);
            if (!response.ok) throw new Error("Failed to fetch additional images");
            const data = await response.json();
            setAdditionalImages(data.images);
            console.log(data.images)
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
    <div>
        <Navrbar></Navrbar>
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Gallery */}
                <div className="lg:w-1/2 relative">
                <motion.img
                    key={currentImageIndex}
                    src={hotel.images[currentImageIndex]}
                    alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-[400px] object-cover rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 left-4 transform -translate-y-1/2"
                    onClick={handlePrevImage}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-1/2 right-4 transform -translate-y-1/2"
                    onClick={handleNextImage}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                </div>

                {/* Hotel Details */}
                <div className="lg:w-1/2">
                <h1 className="text-3xl font-bold mb-4">{rental?.name}</h1>
                <p className="text-2xl font-semibold mb-4">${rental?.price} / night</p>
                <p className="mb-4">{rental?.description}</p>
                <p className="mb-2"><strong>City:</strong> {rental?.city}</p>
                <p className="mb-2"><strong>Address:</strong> {rental?.address}</p>
                <p className="mb-4"><strong>Number of Rooms:</strong> {rental?.nbrChamber}</p>

                <div className="flex items-end gap-4 mt-8">
                    <div>
                    <Label htmlFor="nights">Number of Nights</Label>
                    <Input
                        id="nights"
                        type="number"
                        min={1}
                        value={nights}
                        onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-24"
                    />
                    </div>
                    <Button size="lg">
                    Add to Cart - ${hotel.price * nights}
                    </Button>
                </div>
                </div>
            </div>

            {/* Similar Hotels Slider */}
            <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Similar Hotels</h2>
                <div className="relative">
                <div className="overflow-x-auto pb-4">
                    <div className="flex gap-6">
                    {similarHotels.map((similarHotel) => (
                        <Card key={similarHotel.id} className="w-64 flex-shrink-0">
                        <img
                            src={similarHotel.image}
                            alt={similarHotel.name}
                            className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                            <CardTitle className="text-lg">{similarHotel.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">${similarHotel.price} / night</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">View Details</Button>
                        </CardFooter>
                        </Card>
                    ))}
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default hotelDetails
