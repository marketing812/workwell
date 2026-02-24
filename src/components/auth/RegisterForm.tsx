
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAuth, useFirestore } from "@/firebase/provider";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { sendLegacyData } from "@/data/userUtils";

const DEBUG_REGISTER_FETCH_URL_KEY = "workwell-debug-register-fetch-url";

const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Correo electrónico inválido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  ageRange: z.string().optional(),
  gender: z.string().optional(),
  token: z.string().optional(), // New field for department code
  initialEmotionalState: z.coerce.number().min(1).max(5).optional(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "Debes aceptar la Política de Privacidad.",
  }),
  agreeHealthData: z.boolean().refine((val) => val === true, {
    message: "Debes consentir el tratamiento de datos de salud.",
  }),
  agreeAI: z.boolean().refine((val) => val === true, {
    message: "Debes autorizar el uso de IA para recomendaciones.",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const t = useTranslations();
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();

  const [formData, setFormData] = useState<Omit<RegisterFormData, 'agreeTerms' | 'initialEmotionalState' | 'agreeHealthData' | 'agreeAI'>>({
    name: '',
    email: '',
    password: '',
    ageRange: '',
    gender: '',
    token: '',
  });
  const [initialEmotionalState, setInitialEmotionalState] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeHealthData, setAgreeHealthData] = useState(false);
  const [agreeAI, setAgreeAI] = useState(false);
  const [errors, setErrors] = useState<z.ZodError<RegisterFormData> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: 'ageRange' | 'gender') => (value: string) => {
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

    const dataToValidate = { ...formData, initialEmotionalState, agreeTerms, agreeHealthData, agreeAI };
    const validationResult = registerSchema.safeParse(dataToValidate);

    if (!validationResult.success) {
      setErrors(validationResult.error);
      setIsSubmitting(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        validationResult.data.email,
        validationResult.data.password
      );
      const firebaseUser = userCredential.user;

      const { name, email, ageRange, gender, initialEmotionalState, token } = validationResult.data;
      const userProfileData = {
        id: firebaseUser.uid,
        name,
        email,
        ageRange: ageRange || null,
        gender: gender || null,
        token: token || null,
        initialEmotionalState: initialEmotionalState || null,
        createdAt: new Date().toISOString(),
      };
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      setDocumentNonBlocking(userDocRef, userProfileData, { merge: false });

      // Prepare data for the legacy platform
      const legacyPayload = {
        id: firebaseUser.uid,
        department_code: userProfileData.token, // This is the department code from the form
        // Other profile data can be sent here, excluding name and email as requested
        ageRange: userProfileData.ageRange,
        gender: userProfileData.gender,
        initialEmotionalState: userProfileData.initialEmotionalState,
        createdAt: userProfileData.createdAt,
      };

      // Send data to legacy URL and store debug URL
      const { debugUrl } = await sendLegacyData(legacyPayload, 'usuario');
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(DEBUG_REGISTER_FETCH_URL_KEY, debugUrl);
      }

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
  
  const ageRanges = [
    { value: "under_18", label: t.age_under_18 },
    { value: "18_24", label: t.age_18_24 },
    { value: "25_34", label: t.age_25_34 },
    { value: "35_44", label: t.age_35_44 },
    { value: "45_54", label: t.age_45_54 },
    { value: "55_64", label: t.age_55_64 },
    { value: "65_plus", label: t.age_65_plus },
  ];

  const genders = [
    { value: "male", label: t.gender_male },
    { value: "female", label: t.gender_female },
    { value: "non_binary", label: t.gender_non_binary },
    { value: "other", label: t.gender_other },
    { value: "prefer_not_to_say", label: t.gender_prefer_not_to_say },
  ];

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
          <div>
            <Label htmlFor="token">Código de Departamento (opcional)</Label>
            <Input id="token" name="token" value={formData.token || ''} onChange={handleInputChange} />
            <p className="text-xs text-muted-foreground mt-1">Si indicas un dato válido en el campo "Código de Departamento" estarás a punto de unirte al entorno corporativo de tu organización. Esto permitirá que tu cuenta quede asociada a dicha organización.</p>
            {fieldErrors?.token && <p className="text-sm text-destructive pt-1">{fieldErrors.token[0]}</p>}
          </div>
          <div>
            <Label htmlFor="ageRange">{t.ageRange}</Label>
            <Select name="ageRange" onValueChange={handleSelectChange('ageRange')} value={formData.ageRange}>
              <SelectTrigger id="ageRange">
                <SelectValue placeholder={t.ageRangePlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map(range => <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>)}
              </SelectContent>
            </Select>
             {fieldErrors?.ageRange && <p className="text-sm text-destructive pt-1">{fieldErrors.ageRange[0]}</p>}
          </div>
          <div>
            <Label htmlFor="gender">{t.gender}</Label>
            <Select name="gender" onValueChange={handleSelectChange('gender')} value={formData.gender}>
              <SelectTrigger id="gender">
                <SelectValue placeholder={t.genderPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {genders.map(gender => <SelectItem key={gender.value} value={gender.value}>{gender.label}</SelectItem>)}
              </SelectContent>
            </Select>
            {fieldErrors?.gender && <p className="text-sm text-destructive pt-1">{fieldErrors.gender[0]}</p>}
          </div>
           <div>
            <Label htmlFor="initialEmotionalStateSlider">{t.initialEmotionalState}: {initialEmotionalState}</Label>
            <input type="hidden" name="initialEmotionalState" value={initialEmotionalState} />
            <Slider
              id="initialEmotionalStateSlider"
              min={1} max={5} step={1}
              defaultValue={[initialEmotionalState]}
              onValueChange={(value) => setInitialEmotionalState(value[0])}
              className="mt-2"
            />
            {fieldErrors?.initialEmotionalState && <p className="text-sm text-destructive pt-1">{fieldErrors.initialEmotionalState[0]}</p>}
          </div>
          
          <div className="space-y-4 pt-4 border-t">
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
                  <p className="font-bold">Información básica de protección de datos</p>
                  <p><strong>Responsable:</strong> FUTUVER CONSULTING, S.L.</p>
                  <p><strong>Finalidad:</strong> gestionar tu cuenta y prestar el servicio de seguimiento y acompañamiento emocional.</p>
                  <p><strong>Base legal:</strong> ejecución del servicio y consentimiento explícito para el tratamiento de datos de salud.</p>
                  <p><strong>Conservación:</strong> mientras la cuenta esté activa y hasta 24 meses tras la última actividad.</p>
                  <p><strong>Destinatarios:</strong> proveedores tecnológicos necesarios (Firebase, hosting y proveedores de IA).</p>
                  <p><strong>Derechos:</strong> acceso, rectificación y supresión en lopd@futuver.com</p>
                  <p><strong>Delegado de protección de datos:</strong> dpo@futuver.com</p>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="agreeTerms" name="agreeTerms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreeTerms" className="text-sm font-normal">
                    He leído y acepto la{' '}
                    <Link href="/settings/legal" className="underline hover:text-primary" target="_blank" rel="noopener noreferrer">
                      Política de Privacidad
                    </Link>
                    {' '}y entiendo el tratamiento de mis datos personales.
                  </Label>
                  {fieldErrors?.agreeTerms && <p className="text-sm text-destructive">{fieldErrors.agreeTerms[0]}</p>}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="agreeHealthData" name="agreeHealthData" checked={agreeHealthData} onCheckedChange={(checked) => setAgreeHealthData(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreeHealthData" className="text-sm font-normal">
                      Consiento de forma explícita el tratamiento de mis datos de salud y bienestar emocional, incluyendo información relacionada con mi estado psicológico, con la finalidad de prestar el servicio de acompañamiento y seguimiento terapéutico.
                  </Label>
                  {fieldErrors?.agreeHealthData && <p className="text-sm text-destructive">{fieldErrors.agreeHealthData[0]}</p>}
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox id="agreeAI" name="agreeAI" checked={agreeAI} onCheckedChange={(checked) => setAgreeAI(checked as boolean)} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="agreeAI" className="text-sm font-normal">
                      Autorizo el uso de sistemas de inteligencia artificial para generar recomendaciones personalizadas y respuestas automáticas, siendo consciente de que no sustituyen la intervención de un profesional sanitario.
                  </Label>
                  {fieldErrors?.agreeAI && <p className="text-sm text-destructive">{fieldErrors.agreeAI[0]}</p>}
                </div>
              </div>
          </div>
          
          {serverError && <p className="text-sm font-medium text-destructive">{serverError}</p>}
          
          <Button type="submit" className="w-full" disabled={isSubmitting || !auth || !db}>
            {isSubmitting || !auth || !db ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t.register}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t.alreadyHaveAccount}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t.login}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

    