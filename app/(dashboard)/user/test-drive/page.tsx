'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface TestDrive {
  id: string
  date: string
  createdAt: string
}

export default function TestDrivePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [testDrives, setTestDrives] = useState<TestDrive[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTestDrives()
  }, [])

  const fetchTestDrives = async () => {
    try {
      const response = await fetch('/api/test-drive')
      if (!response.ok) throw new Error('Erreur lors de la récupération des essais')
      const data = await response.json()
      setTestDrives(data)
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la récupération des essais')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date) {
      toast.error('Veuillez sélectionner une date')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/test-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date }),
      })

      if (!response.ok) throw new Error('Erreur lors de la réservation')

      toast.success('Essai de conduite réservé avec succès')
      fetchTestDrives()
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la réservation')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Réservation d'essai de conduite</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Réserver un essai</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sélectionnez une date</label>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  disabled={(date) => date < new Date()}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Réservation en cours...' : 'Réserver'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes essais programmés</CardTitle>
          </CardHeader>
          <CardContent>
            {testDrives.length === 0 ? (
              <p className="text-gray-500">Aucun essai programmé</p>
            ) : (
              <div className="space-y-4">
                {testDrives.map((testDrive) => (
                  <div key={testDrive.id} className="border rounded-lg p-4">
                    <p className="font-medium">
                      {format(new Date(testDrive.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Réservé le {format(new Date(testDrive.createdAt), 'dd/MM/yyyy')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 