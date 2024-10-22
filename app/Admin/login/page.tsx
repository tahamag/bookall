"use client";
import React, {  useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  email: string;
  password: string;
}
interface FormErrors {
  email?: string;
  password?: string;
  login?: string;
}

export default function Login() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');


    useEffect(() => {
        if (status === "authenticated" && session?.user?.role === "admin") {
            router.replace("/Admin"); 

        } else if (status === "unauthenticated") {
          router.replace("/Admin/login"); 
        }
      }, [status, session, router]);


    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

        if (!formData.password.trim()) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            setApiError('');
            try {
                const res = await signIn("credentials", {
                    redirect: false,
                    email: formData.email,
                    password: formData.password,
                });
                if (res?.error) {
                    setErrors(prev => ({ ...prev, login: res.error }));
                } else {
                    setErrors({});
                    router.push("/Admin");
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                setApiError('An unexpected error occurred. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
                {apiError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{apiError}</AlertDescription>
                    </Alert>
                )}
                <div className="flex items-center justify-center h-full">
                    <div className="mx-auto w-[350px] space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-gray-500 dark:text-gray-400">Enter your email below to login to your account</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="ml-auto inline-block text-sm underline text-accent" prefetch={false}>
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <Button className="w-full" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Logging in...
                                    </>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                            {errors.login && <p className="text-red-500 text-xs mt-1">{errors.login}</p>}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}