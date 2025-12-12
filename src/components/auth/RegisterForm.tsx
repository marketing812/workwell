
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase/provider"; // Usar el hook
import { doc, setDoc } from "firebase/firestore";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar los términos y condiciones.",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const { user: contextUser, loading: userLoading } = useUser();
  const auth = useAuth();
  const db = useFirestore();

  const [formData, setFormData] = useState<Omit<RegisterFormData, 'agreeTerms'>>({
    name: '',
    email: '',
    password: '',
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<z.ZodError<RegisterFormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && contextUser) {
      router.push("/dashboard");
    }
  }, [contextUser, userLoading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!auth || !db) {
      setServerError("El servicio de autenticación no está disponible. Inténtalo más tarde.");
      return;
    }

    setErrors(null);
    setServerError(null);
    setIsSubmitting(true);

    const dataToValidate = { ...formData, agreeTerms };
    const validationResult = registerSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      setErrors(validationResult.error);
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Create user with Firebase Auth (Client-side)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        validationResult.data.email,
        validationResult.data.password
      );
      const firebaseUser = userCredential.user;

      // 2. Save user profile to Firestore
      const userProfileData = {
        id: firebaseUser.uid,
        name: validationResult.data.name,
        email: validationResult.data.email,
        ageRange: null,
        gender: null,
        initialEmotionalState: null,
        createdAt: new Date().toISOString(),
      };
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, userProfileData);

      toast({
        title: t.registrationSuccessTitle,
        description: t.registrationSuccessLoginPrompt,
      });
      router.push("/login");

    } catch (error: any) {
      let errorMessage = "Ocurrió un error durante el registro.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Este correo electrónico ya está en uso.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es demasiado débil.";
      }
      setServerError(errorMessage);
      toast({
        title: t.errorOccurred,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldErrors = errors?.flatten().fieldErrors;
  
  if (userLoading || (!userLoading && contextUser)) {
    return <div className="flex h-screen items-center justify-center bg-transparent">
        <Loader2 className="h-12 w-12 animate-spin text-primary-foreground" />
    </div>;
  }

  return (
    <Card className="w-full shadow-xl bg-card/70 text-card-foreground">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">{t.register}</CardTitle>
        <CardDescription>{t.welcomeToWorkWell}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">{t.name}</Label>
            <Input id="name" name="name" required value={formData.name} onChange={handleInputChange} />
            {fieldErrors?.name && <p className="text-sm text-destructive pt-1">{fieldErrors.name[0]}</p>}
          </div>
          <div>
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleInputChange} />
            {fieldErrors?.email && <p className="text-sm text-destructive pt-1">{fieldErrors.email[0]}</p>}
          </div>
          <div>
            <Label htmlFor="password">{t.password}</Label>
            <Input id="password" name="password" type="password" required value={formData.password} onChange={handleInputChange} />
            {fieldErrors?.password && <p className="text-sm text-destructive pt-1">{fieldErrors.password[0]}</p>}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="agreeTerms" name="agreeTerms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
            <Label htmlFor="agreeTerms" className="text-sm font-normal text-muted-foreground">{t.agreeToTerms}</Label>
          </div>
          {fieldErrors?.agreeTerms && <p className="text-sm text-destructive pt-1">{fieldErrors.agreeTerms[0]}</p>}
          
          {serverError && <p className="text-sm font-medium text-destructive">{serverError}</p>}
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !auth}>
            {isSubmitting || !auth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (auth ? t.register : 'Inicializando...')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-primary-foreground hover:underline">
            {t.login}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
