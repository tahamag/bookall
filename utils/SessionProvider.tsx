"use client";
import React from "react";
import { SessionProvider } from "next-auth/react" //https://www.npmjs.com/package/next-auth/v/4.23.1
import { ReactNode } from "react";


const AuthProvider = ({ children }: { children : ReactNode }) => {
    return <SessionProvider>{children}</SessionProvider>;
};
export default AuthProvider;