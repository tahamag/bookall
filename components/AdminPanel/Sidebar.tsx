'use client'
import React from 'react'
import Link from 'next/link'
import { Home, Users } from 'lucide-react'

const SideBar = () => (
  <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
    <nav className="space-y-4">
      <Link href="/admin" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
        <Home size={20} />
        <span>Admin Page</span>
      </Link>
      <Link href="/admin/manageAdmins" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
        <Users size={20} />
        <span>Admins</span>
      </Link>
      <Link href="/admin/locateurs" className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded">
        <Users size={20} />
        <span>Locateurs</span>
      </Link>
    </nav>
  </aside>
)

export default SideBar;