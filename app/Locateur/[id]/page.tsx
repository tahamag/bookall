"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
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
import Image from "next/image";

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
  typeCars?: string;
  rentalType: "Hotel" | "Apartment" | "Car";
};

type FormData = Omit<Rental, 'id' | 'mainImage' | 'additionalImages'> & {
  mainImage: File | null;
  additionalImages: File[];
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

const UpdateRental = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [rental, setRental] = useState<Rental | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    price: 0,
    city: "",
    disposability: false,
    mainImage: null,
    additionalImages: [],
    address: "",
    nbrChamber: 0,
    wifi: false,
    parking: false,
    piscine: false,
    restoration: false,
    model: "",
    marque: "",
    automatique: false,
    typeCars: "",
    rentalType: "Hotel",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useEffect(() => {
    if (sessionStatus === "authenticated" && session?.user?.id) {
        fetchRental(id as string);
        fetchAdditionalImages(id as string);
    } else if (sessionStatus === "unauthenticated") {
        router.replace("/Locateur/Login");
    }
  }, [sessionStatus, session, id, router]);

const fetchRental = async (rentalId: string) => {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/rental?rentalId=${rentalId}`);
        if (!response.ok) throw new Error("Failed to fetch rental");
        const data = await response.json();
        setRental(data.rentals);
        setFormData(prev => ({
            ...prev,
            ...data.rentals,
            mainImage: null,
            additionalImages: [],
        }));
    } catch (err) {
        console.error(err);
    } finally {
        setIsLoading(false);
    }
};
const fetchAdditionalImages = async (rentalId: string) => {
    try {
        const response = await fetch(`/api/uploadimg?rentalId=${rentalId}`);
        if (!response.ok) throw new Error("Failed to fetch additional images");
        const data = await response.json();
        setAdditionalImages(data.images);
    } catch (err) {
        console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleCheckboxChange = (name: keyof FormData) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, mainImage: e.target.files![0] }));
      setErrors(prev => ({ ...prev, mainImage: "" }));
    }
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [
          ...prev.additionalImages,
          ...Array.from(e.target.files),
        ],
      }));
    }
  };

  const removeMainImage = () => {
    setFormData(prev => ({ ...prev, mainImage: null }));
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
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
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (formData.rentalType === "Hotel" || formData.rentalType === "Apartment") {
      if (!formData.address?.trim()) {
        newErrors.address = "Address is required";
        isValid = false;
      }
      if (!formData.nbrChamber || formData.nbrChamber <= 0) {
        newErrors.nbrChamber = "Number of rooms must be greater than 0";
        isValid = false;
      }
    }

    if (formData.rentalType === "Car") {
      if (!formData.model?.trim()) {
        newErrors.model = "Model is required";
        isValid = false;
      }
      if (!formData.marque?.trim()) {
        newErrors.marque = "Brand is required";
        isValid = false;
      }
      if (!formData.typeCars?.trim()) {
        newErrors.typeCars = "Car type is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDelete = async (retanlId: string) => {
    try {
      const response = await fetch(`/api/uploadimg`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ retanlId }),
      });
      if (!response.ok) throw new Error("Failed to delete rental");
      
    } catch (err) {
      console.error(err )
    }
  };

  const uploadImage = async () => {
    if (formData.additionalImages.length > 0) {
      
      handleDelete(id)
      for (let i = 0; i < formData.additionalImages.length; i++) {
        const image = formData.additionalImages[i];
        const FD = new FormData();
        FD.append("image", image);
        FD.append("rentalId", id);
       const res = await fetch("/api/uploadimg", {
          method: "POST",
          body: FD,
        });
        if (!res.ok) {
          throw new Error("Failed to upload image");
        } else router.push("/Locateur");
       /**/}
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        
       /*if (key === "additionalImages") {
          uploadImage();
          (value as File[]).forEach((file, index) => {
            data.append(`additionalImages[${index}]`, file);
            //.log("file ",file)

          });
        }*/
        if (key === "mainImage" && value instanceof File) {
          data.append(key, value);
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });

      console.log("all data",formData)

      const response = await fetch(`/api/rental?rentalId=${id}`, {
        method: "PUT",
        body: data,
      });
      if (response.status == 200) {
        console.log(formData.additionalImages)
        uploadImage();
        //router.push("/Locateur");
      } else {
        throw new Error("Failed to update rental");
      }/**/
    } catch (error) {
      console.error("Error updating rental:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!rental) {
    return <div className="flex justify-center items-center h-screen">Rental not found</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Update {formData.rentalType}
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
                value={formData.name }
                onChange={handleInputChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
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
                <p className="text-sm text-red-500">{errors.price}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={ formData.description}
              onChange={handleInputChange}
              required
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="mainImage">Main Image</Label>
            {rental.mainImage && (
              <div className="relative w-full h-48 mb-2">
                <Image
                    src={`data:image/jpeg;base64,${Buffer.from(
                      rental.mainImage
                    ).toString("base64")}`}
                  alt="Current main image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                />
              </div>
            )}
            <div className="relative">
              <Input
                id="mainImage"
                name="mainImage"
                type="file"
                onChange={handleMainImageChange}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById("mainImage")?.click()}
                className="w-full flex items-center justify-center"
              >
                <Upload className="mr-2 h-4 w-4" /> Upload New Main Image
              </Button>
            </div>
          </div>
          {formData.mainImage && (
            <div className="space-y-2">
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(formData.mainImage)}
                  alt="New main image preview"
                  className="w-full h-48 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={removeMainImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  aria-label="Remove new main image"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}
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
              <p className="text-sm text-red-500">{errors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="additionalImages">Additional Images</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {additionalImages.map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={`data:image/jpeg;base64,${Buffer.from(
                      img.image
                    ).toString("base64")}`}
                    alt={`Additional image ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
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
                onClick={() => document.getElementById("additionalImages")?.click()}
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
                      alt={`New additional image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
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
          {(formData.rentalType === "Hotel" || formData.rentalType === "Apartment") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={ formData.address}
                  onChange={handleInputChange}
                  required
                />
                {errors.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nbrChamber">Number of Rooms</Label>
                <Input
                  id="nbrChamber"
                  name="nbrChamber"
                  type="number"
                  value={ formData.nbrChamber}
                  onChange={handleInputChange}
                  required
                />
                {errors.nbrChamber && (
                  <p className="text-sm text-red-500">{errors.nbrChamber}</p>
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
                {formData.rentalType === "Hotel" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="restoration"
                      checked={formData.restoration}
                      onCheckedChange={() => handleCheckboxChange("restoration")}
                    />
                    <Label htmlFor="restoration">Restaurant</Label>
                  </div>
                )}
              </div>
            </>
          )}
          {formData.rentalType === "Car" && (
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
                    <p className="text-sm text-red-500">{errors.model}</p>
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
                    <p className="text-sm text-red-500">{errors.marque}</p>
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
          {isSubmitting ? "Updating Rental..." : "Update Rental"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpdateRental;