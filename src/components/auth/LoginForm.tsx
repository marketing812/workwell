
"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { loginUser, resetPassword, type LoginState } from "@/actions/auth";
import { useUser, type User as ContextUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

const initialState: LoginState = {
  message: null,
  errors: {},
  user: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  const t = useTranslations();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.login}
    </Button>
  );
}

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user: contextUser, loading: userLoading, login: loginContext } = useUser();
  const router = useRouter();
  const [state, formAction] = useActionState(loginUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handlePasswordReset = async () => {
    if (!resetEmail) {
      toast({ title: "Email requerido", description: "Por favor, introduce tu email.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    const result = await resetPassword(resetEmail);
    if (result.success) {
      toast({ title: "Correo enviado", description: result.message });
    } else {
      toast({ title: "Error", description: result.message, variant: "destructive" });
    }
    setIsResetting(false);
  }

  useEffect(() => {
    if (state?.user) {
      loginContext({ user: state.user as ContextUser });
      toast({
        title: t.login,
        description: state.message!,
      });
    } else if (state?.errors?._form) {
      toast({
        title: t.loginFailed,
        description: state.errors._form[0],
        variant: "destructive",
      });
    }
  }, [state, toast, t, loginContext]);

  useEffect(() => {
    if (!userLoading && contextUser) {
      const welcomeSeen = typeof window !== 'undefined' && localStorage.getItem(WELCOME_SEEN_KEY);
      if (welcomeSeen === 'true') {
        router.push("/dashboard");
      } else {
        router.push("/welcome");
      }
    }
  }, [contextUser, userLoading, router]);

  if (userLoading || (!userLoading && contextUser)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="w-full shadow-xl bg-card/70 text-card-foreground">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{t.login}</CardTitle>
        <CardDescription>{t.welcomeToWorkWell}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" placeholder="tu@ejemplo.com" required onChange={(e) => setResetEmail(e.target.value)} />
            {state?.errors?.email && <p className="text-sm text-destructive pt-1">{state.errors.email[0]}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.password}</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="link" className="text-sm p-0 h-auto text-primary-foreground/80 hover:text-primary-foreground">
                    {t.forgotPassword}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restablecer Contraseña</AlertDialogTitle>
                    <AlertDialogDescription>
                      Introduce tu correo electrónico para enviarte un enlace de restablecimiento.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input id="reset-email-dialog" type="email" placeholder="tu@ejemplo.com" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting}>
                       {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Enviar enlace
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex items-center justify-center h-full px-3 text-muted-foreground hover:text-secondary"
                onClick={toggleShowPassword}
                aria-label={showPassword ? t.hidePassword : t.showPassword}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </Button>
            </div>
            {state?.errors?.password && <p className="text-sm text-destructive pt-1">{state.errors.password[0]}</p>}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link href="/register" className="font-medium text-primary-foreground hover:underline">
            {t.register}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
