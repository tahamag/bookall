'use client'
import React from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

const Navbar = () => (
  <header className="bg-white shadow">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      <Button variant="ghost" className="flex items-center space-x-2">
        <LogOut size={20} /> 
        <span>Logout</span>
      </Button>
    </div>
  </header>
)

export default Navbar;