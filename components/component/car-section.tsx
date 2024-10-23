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
  automatique: boolean;
};
export function CarSection() {
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<Rental[]>([]);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const link = `/api/rental?rentalType=Car`;
      const response = await fetch(link);
      if (!response.ok) throw new Error("Failed to fetch cars");
      else {
        const data = await response.json();
        const validItems = data.rentals.filter(
          (car) => car.disposability === true && car.isValidated === true
        );
        const Data = validItems.slice(0, 8);
        setCars(Array.isArray(Data) ? Data : []);
        console.log(cars.length);
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
        <h2 className="text-3xl font-bold text-center mb-8">cars</h2>
        {loading ? (
          <span className="loading loading-ring loading-lg w-1/4 ml-1/4 ml-[37%]"></span>
        ) : !Array.isArray(cars) || cars.length === 0 ? (
          <span className=" w-1/4 ml-1/4 ml-[37%]">
            No cars found. Please try different search criteria.
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
              {cars.map((car) => (
                <CarouselItem
                  key={car._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Link href={`/cars/${car._id}`}>
                      <Card>
                        <CardContent className="flex flex-col items-center p-6">
                          <div className="relative w-full h-48 mb-4">
                            <img
                              src={`data:image/jpeg;base64,${Buffer.from(
                                car.mainImage
                              ).toString("base64")}`}
                              alt={car.name}
                              className="rounded-md object-cover"
                            />
                          </div>
                        </CardContent>

                        <br />
                        <CardHeader>
                          <CardTitle>{car.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            ${car.price}/night
                          </p>
                          <span className="flex items-center space-x-2">
                            {car.automatique ? (
                              <img
                                width="28"
                                height="28"
                                src="https://img.icons8.com/pulsar-gradient/48/gearbox.png"
                                alt="gearbox"
                              />
                            ) : (
                              <br />
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
