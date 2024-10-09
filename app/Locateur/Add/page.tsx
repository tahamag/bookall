"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { X, Upload } from "lucide-react";

let rentalId: string;
let additionalImages: File[];

type FormData = {
  name: string;
  description: string;
  price: string;
  city: string;
  disposability: boolean;
  mainImage: File;
  additionalImages: File[];
  address: string;
  nbrChamber: string;
  wifi: boolean;
  parking: boolean;
  piscine: boolean;
  restoration: boolean;
  model: string;
  marque: string;
  automatique: boolean;
  typeCars: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};
export default function Add() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [rentalType, setRentalType] = useState();
  const [idClient, setIdClient] = useState();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    city: "",
    disposability: false,
    mainImage: null,
    additionalImages: [],
    address: "",
    nbrChamber: "",
    wifi: false,
    parking: false,
    piscine: false,
    restoration: false,
    model: "",
    marque: "",
    automatique: false,
    typeCars: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  /*
    if (sessionStatus === 'authenticated')
        var v= 1
    else
        router.replace("/Locateur/Login");*/

  useEffect(() => {
    if (session?.user?.rental) {
      setRentalType(session.user.rental);
    }
    if (session?.user?.id) {
      setIdClient(session.user.id);
    }
  }, [session]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (name: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, mainImage: e.target.files![0] }));
      setErrors((prev) => ({ ...prev, mainImage: "" }));
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        additionalImages: [
          ...prev.additionalImages,
          ...Array.from(e.target.files),
        ],
      }));
    }
  };

  const removeMainImage = () => {
    setFormData((prev) => ({ ...prev, mainImage: null }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }
    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
      isValid = false;
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }
    if (!formData.mainImage) {
      newErrors.mainImage = "Main image is required";
      isValid = false;
    }

    if (rentalType === "Hotel" || rentalType === "Apartment") {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
        isValid = false;
      }
      if (!formData.nbrChamber.trim()) {
        newErrors.nbrChamber = "Number of rooms is required";
        isValid = false;
      }
    }

    if (rentalType === "Car") {
      if (!formData.model.trim()) {
        newErrors.model = "Model is required";
        isValid = false;
      }
      if (!formData.marque.trim()) {
        newErrors.marque = "Brand is required";
        isValid = false;
      }
      if (!formData.typeCars.trim()) {
        newErrors.typeCars = "Car type is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };
  const uploadImage = async () => {
    if (additionalImages.length > 0) {
      for (let i = 0; i < additionalImages.length; i++) {
        const image = additionalImages[i];
        console.log("img", image);
        console.log("rental:", rentalId);
        const formData = new FormData();
        formData.append("image", image);
        formData.append("rentalId", rentalId);

        const res = await fetch("/api/uploadimg", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          throw new Error("Failed to upload image");
        } else router.push("/Locateur");
      }
    }
    return "null";
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // todo : generete error validation form
      return;
    }
    setIsSubmitting(true);
    try {
      console.log("full data ", formData);

      const data = new FormData();
      // Prepare rental data
      // generale data
      data.append("idClient", idClient);
      data.append("rentalType", rentalType);
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", parseFloat(formData.price));
      data.append("city", formData.city);
      data.append("disposability", formData.disposability);
      data.append("mainImage", formData.mainImage);
      data.append("additionalImages", additionalImages);

      //Hotel AND Apartment data
      if (rentalType === "Hotel" || rentalType === "Apartment") {
        data.append("address", formData.address);
        data.append("nbrChamber", parseInt(formData.nbrChamber));
        data.append("wifi", formData.wifi);
        data.append("parking", formData.parking);
        data.append("piscine", formData.piscine);
      }

      if (rentalType === "Hotel") {
        data.append("restoration", formData.restoration);
      }
      //Car data
      if (rentalType === "Car") {
        data.append("model", formData.model);
        data.append("marque", formData.marque);
        data.append("automatique", formData.automatique);
        data.append("typeCars", formData.typeCars);
      }
      console.log("full data ", formData);
      // Send data to API
      const response = await fetch("/api/rental", {
        method: "POST",
        body: data,
      });
      if (response.status === 200) {
        const returnData = await response.json();
        rentalId = returnData.rentalId;
        additionalImages = formData.additionalImages;
        if (formData.additionalImages != null) {
          uploadImage();
        }
        //router.push("/Locateur");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Add New {rentalType?.charAt(0).toUpperCase() + rentalType?.slice(1)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-error">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              {errors.price && (
                <p className="text-sm text-error">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            {errors.description && (
              <p className="text-sm text-error">{errors.description}</p>
            )}
          </div>
          {/* city*/}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Image (Required)</Label>
              <div className="relative">
                <Input
                  id="mainImage"
                  name="mainImage"
                  type="file"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  required
                  className="hidden"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById("mainImage")?.click()}
                  className="w-full flex items-center justify-center"
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Main Image
                </Button>
              </div>
              {errors.mainImage && (
                <p className="text-sm text-error">{errors.mainImage}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              {errors.city && (
                <p className="text-sm text-error">{errors.city}</p>
              )}
            </div>
          </div>

          {formData.mainImage && (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(formData.mainImage)}
                  alt="Main image preview"
                  className="w-40 h-40 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-0 right-0 bg-error text-white rounded-full p-1"
                  aria-label="Remove main image"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="additionalImages">
              Additional Images (Optional)
            </Label>
            <div className="relative">
              <Input
                id="additionalImages"
                name="additionalImages"
                type="file"
                onChange={handleAdditionalImagesChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                onClick={() =>
                  document.getElementById("additionalImages")?.click()
                }
                className="w-full flex items-center justify-center"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Additional Images
              </Button>
            </div>
          </div>
          {formData.additionalImages.length > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.additionalImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Additional image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-0 right-0 bg-error text-white rounded-full p-1"
                      aria-label={`Remove additional image ${index + 1}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disposability"
              checked={formData.disposability}
              onCheckedChange={() => handleCheckboxChange("disposability")}
            />
            <Label htmlFor="disposability">Available</Label>
          </div>

          {(rentalType === "Hotel" || rentalType === "Apartment") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                {errors.address && (
                  <p className="text-sm text-error">{errors.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nbrChamber">Number of Rooms</Label>
                <Input
                  id="nbrChamber"
                  name="nbrChamber"
                  type="number"
                  value={formData.nbrChamber}
                  onChange={handleInputChange}
                  required
                />
                {errors.nbrChamber && (
                  <p className="text-sm text-error">{errors.nbrChamber}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wifi"
                    checked={formData.wifi}
                    onCheckedChange={() => handleCheckboxChange("wifi")}
                  />
                  <Label htmlFor="wifi">WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={formData.parking}
                    onCheckedChange={() => handleCheckboxChange("parking")}
                  />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="piscine"
                    checked={formData.piscine}
                    onCheckedChange={() => handleCheckboxChange("piscine")}
                  />
                  <Label htmlFor="piscine">Swimming Pool</Label>
                </div>
                {rentalType === "Hotel" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="restoration"
                      checked={formData.restoration}
                      onCheckedChange={() =>
                        handleCheckboxChange("restoration")
                      }
                    />
                    <Label htmlFor="restoration">Restaurant</Label>
                  </div>
                )}
              </div>
            </>
          )}
          {rentalType === "Car" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.model && (
                    <p className="text-sm text-error">{errors.model}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marque">Brand</Label>
                  <Input
                    id="marque"
                    name="marque"
                    value={formData.marque}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.marque && (
                    <p className="text-sm text-error">{errors.marque}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="automatique"
                  checked={formData.automatique}
                  onCheckedChange={() => handleCheckboxChange("automatique")}
                />
                <Label htmlFor="automatique">Automatic</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="typeCars">Car Type</Label>
                <Input
                  id="typeCars"
                  name="typeCars"
                  value={formData.typeCars}
                  onChange={handleInputChange}
                  required
                />
                {errors.typeCars && (
                  <p className="text-sm text-red-500">{errors.typeCars}</p>
                )}
              </div>
            </>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Adding Rental..." : "Add Rental"}
        </Button>
      </CardFooter>
    </Card>
  );
}
