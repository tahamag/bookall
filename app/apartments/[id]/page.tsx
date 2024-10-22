"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navrbar } from "@/components/component/navbar";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nights, setNights] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [IsLoadingImg, setIsLoadingImg] = useState(true);
  const [IsLoadingSimilar, setIsLoadingSimilar] = useState(true);
  const [rental, setRental] = useState<Rental | null>(null);
  const [rentalSimilar, setRentalSimilar] = useState<Rental | null>(null);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useEffect(() => {
    fetchRental(id as string);
    fetchAdditionalImages(id as string);
    fetchRentalSimilar("Apartment", id as string);
  }, [id]);

  const handlePrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + additionalImages.length + 1) %
        (additionalImages.length + 1)
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % (additionalImages.length + 1)
    );
  };

  const fetchRentalSimilar = async (rentalType: string, rentalId: string) => {
    setIsLoadingSimilar(true);
    try {
      const response = await fetch(
        `/api/rental?rentalId=${rentalId}&rentalType=${rentalType}`
      );
      if (!response.ok) throw new Error("Failed to fetch rental");
      const data = await response.json();
      setRentalSimilar(data.rentals);
      console.log("similar", data.rentals);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSimilar(false);
    }
  };
  const fetchRental = async (rentalId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/rental?rentalId=${rentalId}`);
      if (!response.ok) throw new Error("Failed to fetch rental");
      const data = await response.json();
      setRental(data.rentals);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchAdditionalImages = async (rentalId: string) => {
    setIsLoadingImg(true);
    try {
      const response = await fetch(`/api/uploadimg?rentalId=${rentalId}`);
      if (!response.ok) throw new Error("Failed to fetch additional images");
      const data = await response.json();
      setAdditionalImages(data.images);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingImg(false);
    }
  };

  const getCurrentImage = () => {
    if (!rental) return null;
    if (currentImageIndex === 0) {
      return `data:image/jpeg;base64,${Buffer.from(rental.mainImage).toString(
        "base64"
      )}`;
    } else {
      return `data:image/jpeg;base64,${Buffer.from(
        additionalImages[currentImageIndex - 1]["image"]
      ).toString("base64")}`;
    }
  };

  return (
    <div>
      <Navrbar></Navrbar>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Image Gallery */}
          {rental && !IsLoadingImg ? (
            <div className="lg:w-1/2 relative">
              <motion.img
                key={currentImageIndex}
                src={getCurrentImage()}
                alt={`${rental?.name} - Image ${currentImageIndex + 1}`}
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
          ) : (
            <span className="loading loading-bars loading-lg w-1/4 ml-1/4"></span>
          )}
          {/* Hotel Details */}
          {rental && !isLoading ? (
            <div className="lg:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{rental?.name}</h1>
              <p className="text-2xl font-semibold mb-4">
                ${rental?.price} / night
              </p>
              <p className="mb-4">{rental?.description}</p>
              <p className="mb-2">
                <strong>City:</strong> {rental?.city}
              </p>
              <p className="mb-2">
                <strong>Address:</strong> {rental?.address}
              </p>
              <p className="mb-4">
                <strong>Number of Rooms:</strong> {rental?.nbrChamber}
              </p>

              <div className="flex items-end gap-4 mt-8">
                <div>
                  <Label htmlFor="nights">Number of Nights</Label>
                  <Input
                    id="nights"
                    type="number"
                    min={1}
                    value={nights}
                    onChange={(e) =>
                      setNights(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24"
                  />
                </div>
                <Button size="lg">
                  Add to Cart - ${rental?.price * nights}
                </Button>
              </div>
            </div>
          ) : (
            <span className="loading loading-bars loading-lg w-1/4 ml-1/4 ml-[10%]"></span>
          )}
        </div>

        {/* Similar Apartment Slider */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Similar Apartment</h2>
          <div className="relative">
            <div className="overflow-x-auto pb-4">
              {IsLoadingSimilar ? (
                <span className="loading loading-ring loading-lg w-1/4 ml-1/4"></span>
              ) : !Array.isArray(rentalSimilar) ||
                rentalSimilar.length === 0 ? (
                <span className="loading loading-ring loading-lg w-1/4 ml-1/4">
                  No Apartment found. Please try different search criteria.
                </span>
              ) : (
                <div className="flex gap-6">
                  {rentalSimilar.map((rental) => (
                    <Link href={`/apartments/${rental._id}`}>
                      <Card key={rental._id} className="w-64 flex-shrink-0">
                        <img
                          src={`data:image/jpeg;base64,${Buffer.from(
                            rental.mainImage
                          ).toString("base64")}`}
                          alt={rental.name}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {rental.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold">
                            ${rental.price} / night
                          </p>
                          <span className="flex items-center space-x-2">
                            {rental.wifi && (
                              <img
                                width="28"
                                height="28"
                                src="https://img.icons8.com/fluency/48/wifi-logo.png"
                                alt="wifi-logo"
                              />
                            )}
                            {rental.parking && (
                              <img
                                width="28"
                                height="28"
                                src="https://img.icons8.com/fluency/28/parking.png"
                                alt="parking"
                              />
                            )}
                            {rental.piscine && (
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
                          <Button variant="outline" className="w-full">
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default hotelDetails;
