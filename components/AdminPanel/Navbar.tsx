'use client'
import React from 'react';
import { LogoutButton } from './LogoutButton';


const Navbar = () => {
  return(
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      < LogoutButton />
    </div>
  </header>
)
}
export default Navbar;