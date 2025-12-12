
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "@/lib/translations";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "@/firebase/provider"; // Usar el hook

const WELCOME_SEEN_KEY = 'workwell-welcome-seen';

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth(); // Obtener auth del provider
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handlePasswordReset = async () => {
    if (!resetEmail || !auth) {
      toast({ title: "Email requerido", description: "Por favor, introduce tu email.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    try {
        await sendPasswordResetEmail(auth, resetEmail);
        toast({ title: "Correo enviado", description: "Se ha enviado un correo para restablecer tu contraseña." });
    } catch(error: any) {
        console.error("Error sending password reset email:", error);
        let errorMessage = "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto.";
        if (error.code === 'auth/invalid-email') {
          errorMessage = "El formato del correo electrónico no es válido.";
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive"});
    }
    setIsResetting(false);
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setLoginError("El servicio de autenticación no está disponible. Inténtalo más tarde.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
        await signInWithEmailAndPassword(auth, email, password);
        toast({
            title: t.login,
            description: t.loginSuccessMessage,
        });

        const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
        if (welcomeSeen) {
          router.push('/dashboard');
        } else {
          router.push('/welcome');
        }
        
    } catch (error: any) {
        console.error("Login Error:", error);
        let errorMessage = "Credenciales inválidas. Por favor, inténtalo de nuevo.";
        if (error.code === 'auth/network-request-failed') {
            errorMessage = "Error de red. Por favor, revisa tu conexión a internet.";
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
        }
        setLoginError(errorMessage);
    } finally {
        setIsLoggingIn(false);
    }
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
                  <Button type="button" variant="link" className="text-sm p-0 h-auto text-[#444444] hover:text-foreground">
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
          <Link href="/register" className="font-medium text-[#444444] hover:text-foreground hover:underline">
            {t.register}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
