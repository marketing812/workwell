
"use client";

import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { Eye, EyeOff, Loader2, Save } from "lucide-react";
import { resetPassword } from "@/actions/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation"; 

export function ChangePasswordForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser(); 
  const router = useRouter(); 
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user?.email) {
      toast({ title: "Error", description: "No se ha encontrado el email del usuario.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const result = await resetPassword(user.email);
    if (result.success) {
      toast({
        title: "Correo enviado",
        description: result.message,
      });
      router.push("/settings");
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
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
