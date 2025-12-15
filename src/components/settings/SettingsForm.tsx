
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import { useTranslations } from "@/lib/translations";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from 'lucide-react'; 

export function SettingsForm() {
  const t = useTranslations();
  const { user, updateUser, loading: userLoading } = useUser();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAgeRange(user.ageRange || '');
      setGender(user.gender || '');
    }
  }, [user]);

  const ageRanges = [
    { value: "under_18", label: t.age_under_18 }, { value: "18_24", label: t.age_18_24 },
    { value: "25_34", label: t.age_25_34 }, { value: "35_44", label: t.age_35_44 },
    { value: "45_54", label: t.age_45_54 }, { value: "55_64", label: t.age_55_64 },
    { value: "65_plus", label: t.age_65_plus },
  ];

  const genders = [
    { value: "male", label: t.gender_male }, { value: "female", label: t.gender_female },
    { value: "non_binary", label: t.gender_non_binary }, { value: "other", label: t.gender_other },
    { value: "prefer_not_to_say", label: t.gender_prefer_not_to_say },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    
    try {
      const profileData = {
        name,
        ageRange,
        gender,
      };

      await updateUser(profileData);
      
      toast({
        title: "Configuración Guardada",
        description: "Tus cambios han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error al Guardar",
        description: "No se pudieron guardar los cambios.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (userLoading && !user) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!user) {
    return <p className="text-muted-foreground">No se pudo cargar la información del usuario.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div>
            <Label htmlFor="name">{t.name}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
            <Label htmlFor="emailStatic">{t.email}</Label>
            <Input id="emailStatic" type="email" value={user.email || ''} disabled className="bg-muted/50" />
            <p className="text-xs text-muted-foreground mt-1">El correo electrónico no se puede cambiar desde aquí.</p>
        </div>
        <div>
            <Label htmlFor="ageRange">{t.ageRange}</Label>
            <Select value={ageRange || ''} onValueChange={setAgeRange}>
            <SelectTrigger id="ageRange"><SelectValue placeholder={t.ageRangePlaceholder} /></SelectTrigger>
            <SelectContent>
                {ageRanges.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="gender">{t.gender}</Label>
            <Select value={gender || ''} onValueChange={setGender}>
            <SelectTrigger id="gender"><SelectValue placeholder={t.genderPlaceholder} /></SelectTrigger>
            <SelectContent>
                {genders.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
            </SelectContent>
            </Select>
        </div>
      </div>
      <Button type="submit" disabled={isSaving || userLoading} className="w-full md:w-auto">
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {t.saveChanges}
      </Button>
    </form>
  );
}
