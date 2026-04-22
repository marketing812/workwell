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
} from "../ui/alert-dialog";
import { signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification, signOut, type User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/firebase/provider";
import { sendLegacyData } from "@/data/userUtils";

const WELCOME_SEEN_KEY = "workwell-welcome-seen";
const LEGACY_USER_SYNC_KEY_PREFIX = "workwell-legacy-user-synced-";
const LEGACY_PENDING_USER_DATA_PREFIX = "workwell-legacy-pending-user-";
const LAST_LOGIN_AT_KEY = "workwell-last-login-at";
const LOGIN_TIMEOUT_MS = 12000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

export function LoginForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const completeVerifiedLogin = async (fbUser: FirebaseUser) => {
    const legacySyncKey = `${LEGACY_USER_SYNC_KEY_PREFIX}${fbUser.uid}`;
    const alreadySynced = typeof window !== "undefined" && localStorage.getItem(legacySyncKey) === "1";

    if (!alreadySynced) {
      let pendingData: any = {};
      let hasPendingPayload = false;
      if (typeof window !== "undefined") {
        const pendingRaw = localStorage.getItem(`${LEGACY_PENDING_USER_DATA_PREFIX}${fbUser.uid}`);
        if (pendingRaw) {
          hasPendingPayload = true;
          try {
            pendingData = JSON.parse(pendingRaw);
          } catch {
            pendingData = {};
          }
        }
      }

      void sendLegacyData(
        {
          id: fbUser.uid,
          email: fbUser.email || "",
          name: fbUser.displayName || "",
          gender: pendingData.gender || "",
          initialEmotionalState: pendingData.initialEmotionalState ?? "",
          ageRange: pendingData.ageRange || "",
          department_code: pendingData.department_code || "",
          verifiedAt: new Date().toISOString(),
        },
        "usuario"
      );

        if (typeof window !== "undefined" && success) {
          localStorage.setItem(legacySyncKey, "1");
          localStorage.removeItem(`${LEGACY_PENDING_USER_DATA_PREFIX}${fbUser.uid}`);
        }
      }
    }

    void sendLegacyData({ id: fbUser.uid }, "guardarlogin");

    if (typeof window !== "undefined") {
      localStorage.setItem(LAST_LOGIN_AT_KEY, String(Date.now()));
    }

    toast({
      title: t.login,
      description: t.loginSuccessMessage,
    });

    const welcomeSeen = localStorage.getItem(WELCOME_SEEN_KEY);
    if (welcomeSeen) {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !auth) {
      toast({ title: "Email requerido", description: "Por favor, introduce tu email.", variant: "destructive" });
      return;
    }
    setIsResetting(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast({ title: "Correo enviado", description: "Se ha enviado un correo para restablecer tu contrasena." });
    } catch (error: any) {
      console.error("Error sending password reset email:", error);
      let errorMessage = "No se pudo enviar el correo de restablecimiento. Verifica que el email sea correcto.";
      if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del correo electronico no es valido.";
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    }
    setIsResetting(false);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setLoginError("El servicio de autenticacion no esta disponible. Intentalo mas tarde.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const userCredential = await withTimeout(
        signInWithEmailAndPassword(auth, email, password),
        LOGIN_TIMEOUT_MS,
        "El inicio de sesion ha tardado demasiado."
      );

      try {
        await withTimeout(
          userCredential.user.reload(),
          4000,
          "No se pudo refrescar el usuario autenticado."
        );
      } catch (reloadError) {
        console.warn("Login reload skipped after timeout/failure:", reloadError);
      }

      if (userCredential.user.email && !userCredential.user.emailVerified) {
        auth.languageCode = "es";
        await withTimeout(
          sendEmailVerification(userCredential.user),
          5000,
          "No se pudo enviar el email de verificacion."
        );
        await signOut(auth);
        setLoginError("Debes verificar tu correo antes de entrar. Te hemos reenviado un email de verificacion.");
        return;
      }

      await completeVerifiedLogin(userCredential.user);
    } catch (error: any) {
      console.error("Login Error:", error);
      let errorMessage = "Credenciales invalidas. Por favor, intentalo de nuevo.";
      if (error.code === "auth/network-request-failed") {
        errorMessage = "Error de red. Por favor, revisa tu conexion a internet.";
      } else if (error.code === "auth/firebase-app-check-token-is-invalid.") {
        errorMessage = "Firebase esta rechazando el token de seguridad de esta app en iOS. Cierra la app del simulador, vuelve a compilar y prueba otra vez.";
      } else if (error.message === "El inicio de sesion ha tardado demasiado.") {
        errorMessage = "El login esta tardando demasiado. Revisa la conexion del simulador e intentalo otra vez.";
      } else if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contrasena.";
      }
      setLoginError(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

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
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@ejemplo.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setResetEmail(e.target.value);
              }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t.password}</Label>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="link" className="text-sm p-0 h-auto text-muted-foreground hover:text-foreground">
                    {t.forgotPassword}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Restablecer Contrasena</AlertDialogTitle>
                    <AlertDialogDescription>
                      Introduce tu correo electronico para enviarte un enlace de restablecimiento.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Input
                    id="reset-email-dialog"
                    type="email"
                    placeholder="tu@ejemplo.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
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
          <Button type="submit" className="w-full" disabled={isLoggingIn || !auth}>
            {isLoggingIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {auth ? t.login : "Inicializando..."}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t.noAccount}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t.register}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
