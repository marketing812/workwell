
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { useUser } from "@/contexts/UserContext"; 
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

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, loading: userLoading, deleteUserAccount } = useUser();
  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    const result = await deleteUserAccount();
    if (!result.success) {
      // El toast de error ya se muestra en el context, así que no es necesario duplicarlo aquí
      setIsSubmitting(false);
    }
    // El éxito ya se maneja en el context (logout y redirect)
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
