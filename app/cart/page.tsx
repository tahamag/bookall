"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import Footer from "@/components/component/footer";
import { Navrbar } from "@/components/component/navbar";
import { useSession } from "next-auth/react";
import booking from "@/models/booking";

type CartItem = {
  name: string;
  rentalType: string;
  price: number;
  startDate: string;
  endDate: string;
  nights: number;
  totalPrice: number;
  city: string;
  clientId: string;
  rentalId: string;
};

type Notification = {
  type: "success" | "error";
  title: string;
  message: string;
};
const cart = () => {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [idCLient, setIdCLient] = useState();
  const [reference, setReference] = useState();
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      if (session?.user?.id) {
        setIdCLient(session?.user?.id);
        fetchcart();
      }
    } else if (sessionStatus === "unauthenticated") {
      localStorage.setItem("redirectPath", router.asPath);
      router.push(localStorage);
    }
  }, [session]);

  const fetchcart = async () => {
    try {
      setLoading(true);
      const link = `/api/cart?clientId=${idCLient}`;
      const response = await fetch(link);
      if (!response.ok) throw new Error("Failed to fetch hotels");
      else {
        const data = await response.json();
        setCartItems(data.carts);
      }
    } catch (err) {
      console.log("Failed to fetch rentals");
    } finally {
      setLoading(false);
    }
  };
  function generateReferenceCode() {
    const set = "123456789SBND";

    const shuffledSet = set
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

    const randomChars = shuffledSet.substring(0, 6);

    const randomNumber = Math.floor(Math.random() * 100);

    const refCode = `RC${randomChars}${randomNumber}`;

    return refCode;
  }
  const insertDetail = async(bookingId : string)=>{
    for(let i = 0 ; i< cartItems.length ; i++){

        const DATA = {
            cartId: cartItems[i]._id,
            bookingId: bookingId,
        }
        console.log(DATA)
        const res = await fetch(`/api/Booking_Cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(DATA),
        });
        if (res.status === 200){
            setNotification({
                type: "success",
                title: "Reservation Successful",
                message: `Your reservations have been confirmed. `,
            });
            setCartItems([]);
        }
    }
  }
  const handleReservation = async () => {
    try {
        setLoading(true);
        const data = {
            reference: generateReferenceCode(),
            price: totalAmount,
            clientId : idCLient
        };

        const response = await fetch(`/api/booking`, {
            method: "POST",
            headers: { "Content-Type": "application/json",} ,
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const data = await response.json();
            setReference(data.bookingId)
            insertDetail(data.bookingId)
        }
    } catch (error) {
        console.error("Reservation failed:", error);
        setNotification({
            type: "error",
            title: "Reservation Failed",
            message: "There was an error processing your reservation. Please try again.",
        });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item?.totalPrice,
    0
  );
  return (
    <div>
      <Navrbar />
      <div className="container mx-auto py-10">
        {notification && (
          <Alert
            className={`mb-4 ${
              notification.type === "success" ? "bg-green-100" : "bg-red-100"
            }`}
          >
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
                    <TableCell className="text-right">
                      ${item.totalPrice.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-xl font-semibold">
              Total: ${totalAmount.toFixed(2)}
            </div>
            <Button
              onClick={handleReservation}
              disabled={cartItems.length === 0}
            >
              Complete Reservation
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default cart;
