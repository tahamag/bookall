'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from '@/components/ui/button'
//import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { CalendarIcon, Eye } from 'lucide-react'
import Link from 'next/link'

interface Locateur {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  identifiant: string;
  adress: string;
  role: string;
  rental: string;
}

export default function LocateursList() {
  const [locateurs, setLocateurs] = useState<Locateur[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const getUsersByRole = async (role : string) => {
    try {
      const res = await fetch(`/api/Admin?role=${role}`, {
        cache: 'no-store',
      })
      if (!res.ok) {
        throw new Error(`Failed to fetch users with role: ${role}`);
      }
      const data = await res.json();
      setLocateurs(data);
    } catch (error) {
      console.error('Error fetching locateurs:', error)
    } finally {
      setLoading(false) 
    }
  }
  
  useEffect(() => {
    getUsersByRole('locateur');

  }, []);
  
  const modalRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal()
      setIsOpen(true)
    }
  }

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close()
      setIsOpen(false)
    }
  }
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Locateurs</h2>
      <Card>
        <CardHeader>
          <CardTitle>Locateurs List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Rental</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locateurs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5}>No locateurs found</TableCell>
                  </TableRow>
                ) : (
                  locateurs.map((locateur) => (
                    <TableRow key={locateur._id}>
                      <TableCell>{`${locateur.firstName} ${locateur.lastName}`}</TableCell>
                      <TableCell>{locateur.email}</TableCell>
                      <TableCell>{locateur.phoneNumber}</TableCell>
                      <TableCell>{locateur.rental}</TableCell>
                      <TableCell>
                      <Button variant="outline" size="sm" className="mr-2" onClick={openModal}>
                       <Eye className="h-4 w-4 mr-1" /> Details
                      </Button>
                  <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                   <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Locateur Details</h3>
                     <div className="grid gap-2">
                     <div><span className="font-medium">First Name:</span> {locateur.firstName}</div>
                     <div><span className="font-medium">Last Name:</span> {locateur.lastName}</div>
                     <div><span className="font-medium">Email:</span> {locateur.email}</div>
                     <div><span className="font-medium">Birthday:</span> {new Date(locateur.birthday).toLocaleDateString()}</div>
                     <div><span className="font-medium">Phone Number:</span> {locateur.phoneNumber}</div>
                     <div><span className="font-medium">Identifiant:</span> {locateur.identifiant}</div>
                     <div><span className="font-medium">Address:</span> {locateur.adress}</div>
                     <div><span className="font-medium">Role:</span> {locateur.role}</div>
                     <div><span className="font-medium">Rental:</span> {locateur.rental}</div>
                   </div>
                   <div className="modal-action">
                    <form method="dialog">
                    <Button onClick={closeModal}>Close</Button>
                    </form>
                   </div>
                   </div>
                   </dialog>
                   <Link href={`/Admin/rental`} >
                   <Button variant="outline" size="sm" className="mr-2">
                    <CalendarIcon className="h-4 w-4 mr-1" /> Rental
                    </Button>
                     </Link>
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