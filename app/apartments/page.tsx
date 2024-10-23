"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navrbar } from "@/components/component/navbar";
import { motion } from "framer-motion";
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

const apartments = () => {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [rooms, setRooms] = useState(1);
  const [wifi, setWifi] = useState(true);
  const [parking, setParking] = useState(true);
  const [pool, setPool] = useState(true);
  const [loading, setLoading] = useState(true);
  const [apartments, setApartments] = useState<Rental[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<Rental[]>([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [priceRange, rooms, wifi, parking, pool, apartments]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here

    applyFilters();
  };

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const link = `/api/rental?rentalType=Apartment`;
      const response = await fetch(link);
      if (!response.ok) throw new Error("Failed to fetch apartments");
      else {
        const data = await response.json();
        setApartments(Array.isArray(data.rentals) ? data.rentals : []);
        setFilteredApartments(apartments);
      }
    } catch (err) {
      console.log("Failed to fetch rentals");
    } finally {
        setLoading(false);
    }
  };
  const applyFilters = () => {
    const filtered = apartments.filter(
      (apartment) =>
        apartment.price >= priceRange[0] &&
        apartment.price <= priceRange[1] &&
        apartment.nbrChamber >= rooms &&
        apartment.wifi == wifi &&
        apartment.parking == parking &&
        apartment.piscine == pool
    );
    setFilteredApartments(filtered);
    console.log(apartments)
    console.log("filtered",filtered)
  };
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handleRoomsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRooms(parseInt(e.target.value) || 1);
  };

  const handleCheckboxChange =
    (setter: React.Dispatch<React.SetStateAction<boolean>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.checked);
    };

  return (
    <div>
      <Navrbar></Navrbar>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div
          className="relative h-[50vh] bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center ">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-accent">
              Discover Your Perfect Stay
            </h1>
            <p className="text-xl md:text-2xl font-bold ">
              Luxury accommodations for unforgettable experiences
            </p>
          </div>
        </div>

        {/* Search Bar */}
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
                              {checkOut
                                ? format(checkOut, "PPP")
                                : "Select date"}
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
                    max={5000}
                    step={50}
                    value={priceRange}
                    onValueChange={handlePriceRangeChange}
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
                    onChange={handleRoomsChange}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="wifi">WiFi</Label>
                  <input
                    id="wifi"
                    type="checkbox"
                    checked={wifi}
                    onChange={handleCheckboxChange(setWifi)}
                    className="toggle toggle-info"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="parking">Parking</Label>
                  <input
                    id="wifi"
                    type="checkbox"
                    checked={parking}
                    onChange={handleCheckboxChange(setParking)}
                    className="toggle toggle-info"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pool">Swimming Pool</Label>
                  <input
                    id="wifi"
                    type="checkbox"
                    checked={pool}
                    onChange={handleCheckboxChange(setPool)}
                    className="toggle toggle-info"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Hotel Cards */}
          <div className="w-full md:w-3/4">
            {loading ? (
              <span className="loading loading-ring loading-lg w-1/2 ml-1/4"></span>
            ) : !Array.isArray(apartments) || apartments.length === 0 ? (
              <span className="loading loading-ring loading-lg w-1/2 ml-1/4">
                No apartments found. Please try different search criteria.
              </span>
            ) : (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                {filteredApartments.map((apartment) => (
                    <motion.div
                        key={apartment._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Link href={`/apartments/${apartment._id}`}>
                            <Card className="overflow-hidden">
                                <img
                                    src={`data:image/jpeg;base64,${Buffer.from(apartment.mainImage).toString("base64")}`}
                                    alt={apartment.name}
                                    className="w-full h-48 object-cover"
                                />
                                <CardHeader>
                                    <CardTitle>{apartment.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">${apartment.price}/night</p>
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
                                    <Button className="w-full">Check In</Button>
                                </CardFooter>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default apartments;