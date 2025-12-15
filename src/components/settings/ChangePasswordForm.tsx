"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuth, useUser } from "@/firebase/provider";
import { useRouter } from "next/navigation"; 

export function ChangePasswordForm() {
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.email || !auth) {
      toast({ title: "Error", description: "No se ha encontrado el email del usuario o el servicio de autenticación no está disponible.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un correo para restablecer tu contraseña.",
      });
      router.push("/settings");
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      let errorMessage = "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto.";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "El formato del correo electrónico no es válido.";
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive"});
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (userLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  
  if (!user) { 
    router.push('/login');
    return null;
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Se enviará un correo electrónico a <strong>{user.email}</strong> con un enlace para que puedas restablecer tu contraseña de forma segura.
      </p>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Enviar correo de restablecimiento
      </Button>
    </form>
  );
}
