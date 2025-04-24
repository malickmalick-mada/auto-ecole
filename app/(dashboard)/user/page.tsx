"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function UserDashboardPage() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar />
        <main className="flex-1 relative">
          <div className="absolute top-0 left-0 p-4">
            <SidebarTrigger />
          </div>
          <div className="p-6 mt-10">
            <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Essai de conduite</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Réservez un essai de conduite pour découvrir nos véhicules.
                  </p>
                  <Link href="/user/test-drive">
                    <Button variant={"destructive"}>Réserver un essai</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
