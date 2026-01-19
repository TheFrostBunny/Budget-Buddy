import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useBudget } from "@/components/budget-provider";
import { Settings as SettingsIcon, Languages, Laptop, Palette, Leaf, PlayCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DIETARY_LABELS, DietaryInfo } from "@/types";
import { usePreferences } from "@/hooks/useLocalStorage";
import { useTranslation } from "react-i18next";
import { useTour } from "@reactour/tour";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const { completePeriod } = useBudget();
  const { preferences, toggleDietaryPreference } = usePreferences();
  const [isDevMode, setIsDevMode] = useState(false);
  const [betaEnabled, setBetaEnabled] = useState(() => localStorage.getItem("beta_features") === "true");
  const { t, i18n } = useTranslation();
  const { setIsOpen, setCurrentStep } = useTour();

  const dietaryOptions: DietaryInfo[] = [
    "vegetar",
    "vegan",
    "glutenfri",
    "laktosefri",
    "økologisk",
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const resetOnboarding = () => {
    localStorage.removeItem("onboarding_completed");
    toast({
      title: "Onboarding tilbakestilt",
      description: "Du vil se onboarding-guiden neste gang du laster siden på nytt.",
    });
  };

  const startOnboarding = () => {
    setCurrentStep(0);
    setIsOpen(true);
    toast({
      title: "Onboarding startet",
      description: "Følg guiden for å lære hvordan appen fungerer.",
    });
  };

  return (
    <div className="space-y-4 p-4 pb-24 pt-6">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <SettingsIcon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>
      </header>

      {/* Dietary Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Leaf className="h-4 w-4" />
            {t("settings.dietary.title")}
          </CardTitle>
          <CardDescription>{t("settings.dietary.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {dietaryOptions.map((diet) => (
            <Badge
              key={diet}
              variant={preferences.dietaryPreferences.includes(diet) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleDietaryPreference(diet)}
            >
              {t(`diet.${diet}`)}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />
              {t("settings.appearance.title")}
            </CardTitle>
            <CardDescription>{t("settings.appearance.description")}</CardDescription>
          </div>
          <ModeToggle />
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Languages className="h-4 w-4" />
            {t("settings.language.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="w-full rounded border px-3 py-2 text-base bg-background text-foreground border-border dark:bg-dark-background dark:text-dark-foreground dark:border-dark-border"
          >
            <option value="no">Norsk</option>
            <option value="en">English</option>
            <option value="nn">Nynorsk</option>
            <option value="de">Deutsch</option>
          </select>
        </CardContent>
      </Card>

     {/* Beta Features */}
      <Card className="mb-4 border-2 border-dashed border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <Leaf className="h-5 w-5" />
            {t("settings.beta.title")}
          </CardTitle>
          <CardDescription className="text-yellow-700 dark:text-yellow-300">
            {t("settings.beta.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className="text-yellow-700 dark:text-yellow-300">{t("settings.beta.toggleLabel")}</span>
            <Switch
              checked={betaEnabled}
              onCheckedChange={checked => {
                setBetaEnabled(checked);
                localStorage.setItem("beta_features", checked ? "true" : "false");
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Test */}
      <Card className="border-2 border-dashed border-blue-400 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <PlayCircle className="h-5 w-5" />
            Test Onboarding
          </CardTitle>
          <CardDescription className="text-blue-700 dark:text-blue-300">
            Test onboarding-funksjonen som nye brukere vil se
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2">
            <Button 
              onClick={startOnboarding}
              variant="outline"
              className="w-full border-blue-400 text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Start onboarding nå
            </Button>
            <Button 
              onClick={resetOnboarding}
              variant="outline"
              size="sm"
              className="w-full border-blue-400 text-blue-700 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/40"
            >
              Tilbakestill som ny bruker
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Developer Mode */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Laptop className="h-4 w-4" />
              {t("settings.developer.title")}
            </CardTitle>
            <CardDescription>{t("settings.developer.description")}</CardDescription>
          </div>
          <Switch checked={isDevMode} onCheckedChange={setIsDevMode} />
        </CardHeader>
        <CardContent>
          {isDevMode && (
            <div className="mt-4 border-t pt-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col gap-2">
                <p className="mb-2 text-sm font-medium">{t("settings.developer.debugTools")}</p>
                <Button
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => {
                    if (confirm(t("settings.developer.confirmSimulation"))) {
                      completePeriod();
                    }
                  }}
                >
                  {t("settings.developer.simulateNewDay")}
                </Button>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("settings.developer.simulateDescription")}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="pt-8 text-center text-xs text-muted-foreground">
        <p>{t("settings.footer")}</p>
      </div>
    </div>
  );
};

export default Settings;
