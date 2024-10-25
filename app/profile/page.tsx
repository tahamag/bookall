"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import Footer from "@/components/component/footer";
import { Navrbar } from "@/components/component/navbar";

interface LocateurFormData {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  phoneNumber: string;
  identifiant: string;
  adress: string;
  password: string;
  role: string;
}
const profile = () => {
  const [formData, setFormData] = useState<LocateurFormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    phoneNumber: "",
    identifiant: "",
    adress: "",
    password: "",
    role: "locateur",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status: sessionStatus } = useSession();
  const [idCLient, setIdCLient] = useState();

  useEffect(() => {
    console.log(sessionStatus);
    if (sessionStatus === "authenticated") {
      const userId = session.user.id;
      if (userId) {
        getUserData(userId);
        setIdCLient(userId);
      }
    } else if (sessionStatus === "unauthenticated") {
      router.replace("/Locateur/Login");
    }
  }, []);
  const getUserData = async (id: string) => {
    console.log("User ID:", id);
    if (!id) {
      console.error("User ID is missing");
      return;
    }
    try {
      const response = await fetch(`/api/Admin/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const { user } = await response.json();

      const isoDateString = user.birthday;
      const date = new Date(isoDateString);
      const formattedDate = date.toISOString().split("T")[0];
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        password: "",
        birthday: formattedDate,
        identifiant: user.identifiant,
        adress: user.adress,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Unable to load user data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        role: "locataire",
        ...(formData.password && { password: formData.password }),
        birthday: formData.birthday,
        identifiant: formData.identifiant,
        adress: formData.adress,
      };

      const response = await fetch(`/api/Admin/${idCLient}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }
      const { user } = await response.json();
      toast({
        title: "Success",
        description: `Admin ${user.firstName} ${user.lastName} updated successfully.`,
      });
      await router.push("/Locateur");
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while updating the user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-row">
        <div className="container mx-auto py-10">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Edit compte</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">Birthday</Label>
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="identifiant">Identifiant</Label>
                  <Input
                    id="identifiant"
                    name="identifiant"
                    value={formData.identifiant}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adress">Address</Label>
                  <Input
                    id="adress"
                    name="adress"
                    value={formData.adress}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">
                    New Password (leave blank to keep current)
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={handleSelectChange("role")}
                    value={formData.role}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="locataire">locataire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Locataire"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default profile;
