'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface Admin {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: string;
}

export default function AdminsList() {
  const [admins, setAdmins] = useState<Admin[]>([]) 
  const [loading, setLoading] = useState(true) 
  const router = useRouter();

  const GetUsersByRole = async (role : string) => {
    try {
      const res = await fetch(`/api/Admin?role=${role}`, {
        cache: 'no-store',
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch users with role: ${role}`);
      }
      const data = await res.json();
      const filteredAdmins = data.filter((user: Admin) => user.role === 'admin');
      setAdmins(filteredAdmins);
    } catch (error) {
      console.error('Error fetching admins:', error)
    } finally {
      setLoading(false) 
    }
  }
  useEffect(() => {
    GetUsersByRole('admin');
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this administrator?")) {
      try {
        const res = await fetch(`/api/Admin?id=${id}`, {
          method: 'DELETE',
        })

        if (res.ok) {
          toast({
            title: "Success",
            description: "Administrator has been successfully deleted.",
          })
          router.refresh();
          GetUsersByRole('admin'); 
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
          <Link href={`/Admin/add`} >
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
                    <TableRow key={admin._id}>
                      <TableCell>{`${admin.firstName} ${admin.lastName}`}</TableCell>
                      <TableCell>{admin.phoneNumber}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{admin.role}</TableCell>
                      <TableCell>
                      <Link href={`/Admin/${admin._id}`} >
                          <Button variant="outline" size="sm" className="mr-2">
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(admin._id)}>
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