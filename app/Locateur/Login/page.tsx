"use client";
import React, { useEffect,useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Login() {
    const router = useRouter();
    const { data: session , status : sessionStatus } = useSession();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const newErrors = {};

    useEffect(() => {
        if (sessionStatus === "authenticated") {
            router.replace("/Locateur");
        }
    }, [sessionStatus, router]);

    function validateForm (email , password)  {
        if (!email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid"

        if (!password.trim()) newErrors.password = "Password is required";
        else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e ) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        if (validateForm(email , password )) {
            setIsLoading(true)
            setApiError('')
            try {
                const res = await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });
                console.log('Response:', res);
                if (res?.error)
                    newErrors.login =res.error;
                else{
                    setErrors("");
                    router.push("/Locateur");
                }
            } catch (error) {
                console.log('Error submitting form:', error)
                setApiError('An unexpected error occurred. Please try again later.')
            } finally {
                setIsLoading(false)
                setErrors(newErrors);
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
                            type="text"
                            placeholder="m@example.com"
                            className={errors.email ? "border-red-500" : ""}/>
                        </div>
                        {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="ml-auto inline-block text-sm underline  text-accent" prefetch={false}>
                                Forgot your password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className={errors.password ? "border-red-500" : ""} />
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                    </div>
                        <Button className="w-full"  disabled={isLoading}>
                            {isLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging  Account...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                        {errors.login && <p className="text-error text-xs mt-1">{errors.login}</p>}
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?
                        <Link href="/Locateur/Register" className="underline text-accent" prefetch={false}>
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    </div>
    )
}