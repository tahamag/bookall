"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import Link from "next/link";

type Rental = {
  _id: string;
  name: string;
  price: number;
  city: string;
  disposability: boolean;
  mainImage: string;
  rentalType: string;
  nbrChamber: number;
  wifi: boolean;
  parking: boolean;
  piscine: boolean;
  restoration: boolean;
};
export function ApartmentSection() {
  const [loading, setLoading] = useState(true);
  const [apartments, setApartment] = useState<Rental[]>([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const link = `/api/rental?rentalType=Apartment`;
      const response = await fetch(link);
      if (!response.ok) throw new Error("Failed to fetch apartments");
      else {
        const data = await response.json();
        const Data = data.rentals.slice(0, 8);
        setApartment(Array.isArray(Data) ? Data : []);
      }
    } catch (err) {
      console.log("Failed to fetch rentals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Apartments</h2>
        {loading ? (
          <span className="loading loading-ring loading-lg w-1/4 ml-1/4 ml-[37%]"></span>
        ) : !Array.isArray(apartments) || apartments.length === 0 ? (
          <span className="loading loading-ring loading-lg w-1/4 ml-1/4 ml-[37%]">
            No apartments found. Please try different search criteria.
          </span>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {apartments.map((apartment) => (
                  <CarouselItem
                    key={apartment._id}
                    className="md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="p-1">
                      <Link href={`/apartments/${apartment._id}`}>
                        <Card>
                          <CardContent className="flex flex-col items-center p-6">
                            <div className="relative w-full h-48 mb-4">
                              <img
                                src={`data:image/jpeg;base64,${Buffer.from(
                                  apartment.mainImage
                                ).toString("base64")}`}
                                width="280px"
                                alt={apartment.name}
                                className="rounded-md object-cover"
                              />
                            </div>
                          </CardContent>
                          <br />
                          <CardHeader>
                            <CardTitle>{apartment.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-2xl font-bold">
                              ${apartment.price}/night
                            </p>
                            <span className="flex items-center space-x-2">
                              {apartment.wifi && (
                                <img
                                  width="28"
                                  height="28"
                                  src="https://img.icons8.com/fluency/48/wifi-logo.png"
                                  alt="wifi-logo"
                                />
                              )}
                              {apartment.parking && (
                                <img
                                  width="28"
                                  height="28"
                                  src="https://img.icons8.com/fluency/28/parking.png"
                                  alt="parking"
                                />
                              )}
                              {apartment.piscine && (
                                <img
                                  width="28"
                                  height="28"
                                  src="https://img.icons8.com/color/48/outdoor-swimming-pool.png"
                                  alt="outdoor-swimming-pool"
                                />
                              )}
                            </span>
                          </CardContent>
                          <CardFooter>
                            <Button className="w-full">Book Now</Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>
    </section>
  );
}
