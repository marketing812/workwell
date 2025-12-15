"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { useUser, useAuth } from "@/firebase/provider"; // Corrected import
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser } from "firebase/auth";

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, logout, loading: userLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDelete = async () => {
    const currentUser = auth?.currentUser;

    if (!currentUser) {
      toast({ title: "Error", description: "No se ha podido identificar al usuario para la baja.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteUser(currentUser);
      toast({
        title: t.deleteAccountSuccessTitle,
        description: "Tu cuenta ha sido eliminada permanentemente.",
      });
      logout();
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      let errorMessage = t.deleteAccountErrorMessage;
      if (error.code === 'auth/requires-recent-login') {
        errorMessage = "Esta operación es sensible y requiere una autenticación reciente. Por favor, cierra sesión y vuelve a iniciarla antes de intentarlo de nuevo.";
      }
      toast({
        title: t.deleteAccountErrorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsAlertDialogOpen(false);
    }
  };
  
  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          {t.deleteAccountButtonLabel}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.deleteAccountPageTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {t.deleteAccountWarningMessage}
            <br/><br/>
            <strong>{t.deleteAccountConfirmationPrompt}</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>{t.cancelDeleteAccountButton}</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmDelete} 
            disabled={isSubmitting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            {t.confirmDeleteAccountButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
