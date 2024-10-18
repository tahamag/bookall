import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';

async function AdminPage() {
  const session = await getServerSession(authOptions)
  if(session.user.role !== admin)
  {
    return(
      <section className='py-24'>
        <div className='container'>
          <h1 className='text-2xl font-bold'>
            You are not authorized to view this page.
          </h1>
        </div>
      </section>
    )
  }
  return (
    <div> Home Page </div>
  )
}

export default AdminPage;