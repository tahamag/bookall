"use client"
import { useState ,useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export default function RegisterForm() {

        const router = useRouter();
        const [formData, setFormData] = useState({
            firstName: '',
            lastName: '',
            email: '',
            birthday:'',
            phoneNumber:'',
            identifiant:'',
            adress :'',
            password: '',
            confirmPassword: '',
        })
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const { data: session , status : sessionStatus } = useSession();

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/Locateur");
        }
    }, [sessionStatus, router]);


    const handleChange = (e) => {
        console.log("handle change")
        const { name, value } = e.target
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }))
        // Clear the specific field error when the user starts typing
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }))
        // Clear the API error when the user modifies the form
        setApiError('')
        }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.birthday.trim()) newErrors.birthday = "birthday date is required"
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
        if (!formData.identifiant.trim()) newErrors.identifiant = "CIN or Passport number is required"
        if (!formData.adress.trim()) newErrors.adress = "adress is required"

        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"

        if (!formData.password) newErrors.password = "Password is required"
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (formData.password != formData.confirmPassword ) newErrors.confirmPassword = "the password must match"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e ) => {
        e.preventDefault();
        const firstName = e.target[0].value;
        const lastName = e.target[1].value;
        const email = e.target[2].value;
        const birthday = e.target[3].value;
        const phoneNumber = e.target[4].value;
        const identifiant = e.target[5].value;
        const adress  = e.target[6].value;
        const password = e.target[7].value;
        const type = "Locateur";//rental
        //const formData = new FormData(e.currentTarget)
       // const rental = formData.get('rental')
        const rental = e.target['rental'].value;

        if (validateForm()) {
            setIsLoading(true)
            setApiError('')
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({firstName ,lastName ,email ,birthday ,phoneNumber ,identifiant ,adress ,password,type,rental}),
                });
                if (res.status === 400) {
                    console.log('Email already exists');
                    const data = await res.json();
                    if (data.error === 'Email already exists') {
                        setErrors(prevErrors => ({
                        ...prevErrors,
                        email: 'This email is already registered'
                        }))
                    } else {
                        setApiError(data.error || 'An error occurred during registration')
                    }
                }
                if (res.status === 200) {
                    setErrors("");
                    router.push("/Locateur/Login");
                }
            } catch (error) {
                console.error('Error submitting form:', error)
                setApiError('An unexpected error occurred. Please try again later.')
            } finally {
            setIsLoading(false)
            }
        }
    }
    return (
        <div className="flex justify-center items-center h-screen mt-130">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Create a new account to get started.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                    {apiError && (
                        <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{apiError}</AlertDescription>
                        </Alert>
                    )}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First name</Label>
                                <Input
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={errors.firstName ? "border-red-500" : ""}
                                />
                                {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last name</Label>
                                <Input
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={errors.lastName ? "border-red-500" : ""}
                                />
                                {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="birthday">birthday date</Label>
                                <Input
                                    id="birthday"
                                    name="birthday"
                                    type="date"
                                    value={formData.birthday}
                                    onChange={handleChange}
                                    className={errors.birthday ? "border-red-500" : ""}
                                />
                                {errors.birthday && <p className="text-error text-xs mt-1">{errors.birthday}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className={errors.phoneNumber ? "border-red-500" : ""}
                                />
                                {errors.phoneNumber && <p className="text-error text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="adress">adress</Label>
                            <Input
                            id="adress"
                            name="adress"
                            value={formData.adress}
                            onChange={handleChange}
                            className={errors.adress ? "border-red-500" : ""}
                            />
                            {errors.adress && <p className="text-error text-xs mt-1">{errors.adress}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="identifiant">CIN or Passport number</Label>
                            <Input
                            id="identifiant"
                            name="identifiant"
                            value={formData.identifiant}
                            onChange={handleChange}
                            className={errors.identifiant ? "border-red-500" : ""}
                            />
                            {errors.identifiant && <p className="text-error text-xs mt-1">{errors.identifiant}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            className={errors.confirmpassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                        <Label >Rental Type</Label>
                        <RadioGroup defaultValue="Car" name="rental" className="flex space-x-4">
                            {["Car", "Hotel", "Apartment"].map((option) => (
                                <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={`${option}`} id={`${option}`} />
                                <Label htmlFor={`${option}`} className="capitalize">
                                    {option}
                                </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <Button className="w-full"  disabled={isLoading}>
                        {isLoading ? (
                            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    )
}
