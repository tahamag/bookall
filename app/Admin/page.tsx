'use client';
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Zap, CheckCircle } from 'lucide-react'

type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'locateur'
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { id: '2', name: 'Locateur 1', email: 'locateur1@example.com', role: 'locateur' },
    { id: '3', name: 'Locateur 2', email: 'locateur2@example.com', role: 'locateur' },
  ])

  return (
    <Tabs defaultValue="stats" className="space-y-4">
      <TabsList>
        <TabsTrigger value="stats">Statistiques</TabsTrigger>
      </TabsList>

      <TabsContent value="stats">
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Aperçu des statistiques du système.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total des utilisateurs</p>
                      <p className="text-2xl font-bold">{users.length}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">21% de plus que le mois dernier</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Admins</p>
                      <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">5% de plus que la semaine dernière</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Locateurs</p>
                      <p className="text-2xl font-bold">{users.filter(u => u.role === 'locateur').length}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">3 nouveaux cette semaine</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}