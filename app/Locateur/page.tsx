"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SideBar from "@/components/component/sideBar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Rental = {
  _id: string;
  name: string;
  price: number;
  city: string;
  disposability: string;
  mainImage: string;
};
const dashboard = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [idCLient, setIdCLient] = useState();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {

    if (sessionStatus === "authenticated") {
      const userId = session.user.id;
      if (userId) {
          setIdCLient(userId);
          fetchRentals(userId);
      }
  } else if (sessionStatus === "unauthenticated") {
      router.replace("/Locateur/Login");
  }
  }, []);


  const fetchRentals = async (idClient: string) => {
    try {
      const response = await fetch(`/api/rental?idClient=${idClient}`);
      if (!response.ok) throw new Error("Failed to fetch rentals");
      else {
        const data = await response.json();
        const rentals = data.rentals;
        setRentals(rentals);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch rentals");
      setLoading(false);
    }
  };

  const handleUpdate = async (rentalId: string) => {
    try {
      router.push(`/Locateur/${rentalId}`);
    } catch (err) {
      setError("Failed to update rental");
    }
  };
  const handleDelete = async (retanlId: string) => {
    try {
      const response = await fetch(`/api/rental`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ retanlId }),
      });
      if (!response.ok) throw new Error("Failed to delete rental");
      else fetchRentals(idCLient);
    } catch (err) {
      setError("Failed to delete rental");
    }
  };

  return (
    <div className="flex flex-row">
      <SideBar></SideBar>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Rental list</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.map((rental) => (
              <TableRow key={rental._id}>
                <TableCell>
                  <Image
                    src={`data:image/jpeg;base64,${Buffer.from(
                      rental.mainImage
                    ).toString("base64")}`}
                    alt={rental.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{rental.name}</TableCell>
                <TableCell>{rental.price}</TableCell>
                <TableCell>{rental.city}</TableCell>
                <TableCell>
                  {rental.disposability ? "Available" : "not Available"}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleUpdate(rental._id)}
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => handleDelete(rental._id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default dashboard;
