"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const hotels = [
  {
    id: 1,
    name: "Luxury Resort & Spa",
    price: 299,
    image:
      "https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp",
  },
  {
    id: 2,
    name: "City Center Hotel",
    price: 199,
    image:
      "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  },
  {
    id: 3,
    name: "Beachfront Paradise",
    price: 349,
    image:
      "https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp",
  },
  {
    id: 4,
    name: "Mountain View Lodge",
    price: 249,
    image:
      "https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp",
  },
  {
    id: 5,
    name: "Historic Boutique Inn",
    price: 179,
    image:
      "https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp",
  },
];

export function CarSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Cars</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {hotels.map((hotel) => (
              <CarouselItem
                key={hotel.id}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <div className="relative w-full h-48 mb-4">
                        <img
                          src={hotel.image}
                          alt={hotel.name}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-center mb-2">
                        {hotel.name}
                      </h3>
                      <p className="text-green-600 font-bold mb-4">
                        ${hotel.price} / night
                      </p>
                      <Button className="w-full">Book Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
