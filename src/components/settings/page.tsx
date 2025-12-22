
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/lib/translations";
import { Loader2, Palette, Trash2, ShieldAlert, KeyRound, FileText } from 'lucide-react'; 
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { SettingsForm } from './SettingsForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';

export default function SettingsPage() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();

  const [language, setLanguage] = useState('es');
  const [dailyCheckIn, setDailyCheckIn] = useState(true);
  const [moduleReminders, setModuleReminders] = useState(true);
  const [motivationalQuotes, setMotivationalQuotes] = useState(false);
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    setAppVersion(`B-1.0-09-2025`);
  }, []);

  const themeOptions = [
    { value: "light", label: t.themeLight },
    { value: "dark", label: t.themeDark },
    { value: "system", label: t.themeSystem },
  ];

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{t.settingsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{t.personalInformation}</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><Palette className="mr-2 h-5 w-5" />{t.themeSettingsTitle}</CardTitle>
                <CardDescription>{t.selectThemePrompt}</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="themeSelector">
                  <SelectValue placeholder={t.selectThemePrompt} />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.language}</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={setLanguage} disabled>
                <SelectTrigger id="language"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl">{t.notificationPreferences}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="dailyCheckIn" className="flex flex-col space-y-1">
                  <span>Check-in Emocional Diario</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Recibe recordatorios para tu check-in emocional.
                  </span>
                </Label>
                <Switch id="dailyCheckIn" checked={dailyCheckIn} onCheckedChange={setDailyCheckIn} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="moduleReminders" className="flex flex-col space-y-1">
                  <span>Recordatorios de Módulo</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Notificaciones sobre tu progreso en las rutas.
                  </span>
                </Label>
                <Switch id="moduleReminders" checked={moduleReminders} onCheckedChange={setModuleReminders} />
              </div>
               <div className="flex items-center justify-between rounded-lg border p-4">
                <Label htmlFor="motivationalQuotes" className="flex flex-col space-y-1">
                  <span>Frases Motivadoras</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Recibe frases inspiradoras periódicamente.
                  </span>
                </Label>
                <Switch id="motivationalQuotes" checked={motivationalQuotes} onCheckedChange={setMotivationalQuotes} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle className="text-xl flex items-center"><KeyRound className="mr-2 h-5 w-5" />{t.securitySettings}</CardTitle>
            </CardHeader>
            <CardContent>
                <Button variant="outline" asChild>
                  <Link href="/settings/change-password">
                    {t.changePasswordButtonLabel}
                  </Link>
                </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader className="bg-destructive/5 dark:bg-destructive/10">
                <CardTitle className="text-xl flex items-center text-destructive">
                    <ShieldAlert className="mr-2 h-5 w-5" />
                    {t.deleteAccountSectionTitle}
                </CardTitle>
                <CardDescription className="text-destructive/90">
                {t.deleteAccountWarningMessage.split('.')[0]}.
                </CardDescription>
            </CardHeader>
            <CardContent className="bg-destructive/5 dark:bg-destructive/10">
                <Button variant="destructive" asChild>
                <Link href="/settings/delete-account">
                    {t.deleteAccountButtonLabel}
                </Link>
                </Button>
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="flex-col items-start gap-4 p-6 border-t">
            <Button variant="link" asChild className="p-0 h-auto">
              <Link href="/settings/legal">
                <FileText className="mr-2 h-4 w-4" />
                Aviso Legal y Política de Privacidad
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground w-full text-right pt-2 mt-2">
              Versión: {appVersion}
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
