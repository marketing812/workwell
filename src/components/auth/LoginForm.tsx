"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useFirebase } from "@/firebase/provider";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const { user: contextUser, loading: userLoading, setUserAndData } = useUser();
  const { auth, db } = useFirebase();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handlePasswordReset = async () => {
    if (!auth) {
        toast({ title: "Error", description: "Servicio de autenticación no disponible.", variant: "destructive" });
        return;
    }
    if (!resetEmail) {
      toast({ title: "Email requerido", description: "Por favor, introduce tu email.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({ title: "Correo enviado", description: "Se ha enviado un correo para restablecer tu contraseña." });
    } catch(error: any) {
        console.error("Error sending password reset email:", error);
        toast({ title: "Error", description: "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto.", variant: "destructive"});
    }
    setIsResetting(false);
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth || !db) {
        toast({ title: "Error", description: "Servicios de autenticación no disponibles.", variant: "destructive" });
        return;
    }
    setIsLoggingIn(true);
    setLoginError(null);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged en UserContext se encargará del resto
        toast({
            title: t.login,
            description: t.loginSuccessMessage,
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        let errorMessage = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
        }
        setLoginError(errorMessage);
    } finally {
        setIsLoggingIn(false);
    }
  }

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
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" placeholder="tu@ejemplo.com" required value={email} onChange={(e) => {setEmail(e.target.value); setResetEmail(e.target.value);}} />
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          </div>
          {loginError && <p className="text-sm text-destructive pt-1">{loginError}</p>}
          <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t.login}
          </Button>
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
