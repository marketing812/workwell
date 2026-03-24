"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WelcomeIntroContent } from "@/components/welcome/WelcomeIntroContent";

export default function BienvenidaPage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Bienvenida</CardTitle>
          <CardDescription>Introducción general de la app.</CardDescription>
        </CardHeader>
        <CardContent>
          <WelcomeIntroContent />
        </CardContent>
      </Card>
    </div>
  );
}
