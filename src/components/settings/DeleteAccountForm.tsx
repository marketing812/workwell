
"use client";

import { useActionState, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { deleteUserAccount, type DeleteAccountState } from "@/actions/auth";
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

const initialState: DeleteAccountState = {
  message: null,
  errors: {},
  success: false,
};

export function DeleteAccountForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user, logout, loading: userLoading } = useUser();
  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  
  // Asocia la acción con el email del usuario.
  const deleteUserAccountWithEmail = deleteUserAccount.bind(null, user?.email || "");
  const [state, formAction] = useActionState(deleteUserAccountWithEmail, initialState);

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast({
        title: t.deleteAccountSuccessTitle,
        description: state.message ?? "Cuenta eliminada.",
      });
      setTimeout(() => {
        logout(); 
        router.push('/login'); 
      }, 2000);
    } else if (state.errors?._form) {
      toast({
        title: t.deleteAccountErrorTitle,
        description: state.errors._form[0],
        variant: "destructive",
      });
    }
  }, [state, logout, router, toast, t]);

  if (userLoading) {
    return <div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  return (
    <form action={formAction}>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full"
            onClick={(e) => { e.preventDefault(); setIsAlertDialogOpen(true); }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t.deleteAccountButtonLabel}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteAccountPageTitle}</AlertDialogTitle>
            <AlertDialogDescription className="w-full max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 break-words">
              {t.deleteAccountWarningMessage}
              <br/><br/>
              <strong>{t.deleteAccountConfirmationPrompt}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t.cancelDeleteAccountButton}
            </AlertDialogCancel>
            {/* Este botón ahora envía el formulario */}
            <Button 
              type="submit"
              className={cn("bg-destructive hover:bg-destructive/90 text-destructive-foreground")}
            >
               <Trash2 className="mr-2 h-4 w-4" />
               {t.confirmDeleteAccountButton}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
