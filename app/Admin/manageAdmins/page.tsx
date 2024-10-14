'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

export default function AdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]) 
  const [loading, setLoading] = useState(true) 

  // Fonction pour récupérer les admins depuis l'API
  const GetAdmins = async () => {
    try {
      const response = await fetch('/api/Admin/manageAdmins', {
        cache: 'no-store',
      })
      if (!response.ok) {
        throw new Error('Failed to fetch admins')
      }
      const data = await response.json()
      setAdmins(data) 
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false) 
    }
  }

  useEffect(() => {
    GetAdmins()
  }, [])
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        const response = await fetch(`/api/Admin/manageAdmin/${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          toast({
            title: "Success",
            description: "Administrator has been successfully deleted.",
          })
          GetAdmins() // Reload the admin list
        } else {
          throw new Error('Error during deletion')
        }
      } catch (error) {
        console.error('Error deleting admin:', error)
        toast({
          title: "Error",
          description: "An error occurred while deleting the administrator.",
          variant: "destructive",
        })
      }
    }
  };


  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Admins</h2>
      <Card>
        <CardHeader>
          <CardTitle>Admins List</CardTitle>
          <div className='text-right'>
          <Link href={`/Admin/addAdmin`} >
                          <Button variant="outline" size="sm" className="mr-2">
                            <PlusCircle className="mr-2 h-4 w-4"  /> Create New Admin
                          </Button>
                        </Link>
           </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p> 
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                <TableHead>Id</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No admins found</TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.id}</TableCell>
                      <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                      <TableCell>{admin.phoneNumber}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell>
                      <Link href={`/Admin/editAdmin/${admin.id}`} >
                          <Button variant="outline" size="sm" className="mr-2">
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(admin.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
              </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}