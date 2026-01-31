import React, { useState, useEffect, useRef } from 'react';

const steps = [
  {
    title: 'Velkommen til Budget Buddy!',
    description: 'Denne guiden viser deg de viktigste funksjonene i appen.'
  },
  {
    title: 'Legg til budsjett',
    description:
      'Gå til Profil og skriv inn ønsket beløp for budsjettet ditt. Velg om det skal gjelde per uke, måned eller dag.\n\n' +
      '• Ukentlig: Budsjettet gjelder for én uke.\n' +
      '• Månedlig: Budsjettet gjelder for én måned.\n' +
      '• Daglig: Budsjettet gjelder for én dag, og du kan velge hvor mange dager det skal gjelde.\n' +
      'Appen viser hvor mye du har brukt og hvor mye du har igjen.'
  },
  {
    title: 'Legg til utgift',
    description: 'Trykk på "Legg til utgift" for å registrere en ny utgift i budsjettet ditt.'
  },
  {
    title: 'Valutakalkulator',
    description: 'Bruk valutakalkulatoren for å regne om mellom ulike valutaer.'
  },
  {
    title: 'Se budsjett og historikk',
    description: 'Få oversikt over hvor mye du har brukt og hvor mye du har igjen.'
  },
  {
    title: 'Innstillinger',
    description: 'Tilpass appen med språk, tema og beta-funksjoner.'
  },
  {
    title: 'Ferdig!',
    description: 'Du er klar til å bruke Budget Buddy! Lykke til med sparingen.'
  }
];


const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);
  const nextBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        localStorage.setItem('onboardingComplete', 'true');
        setVisible(false);
        onFinish();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, onFinish]);

  useEffect(() => {
    nextBtnRef.current?.focus();
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('onboardingComplete', 'true');
      setVisible(false);
      onFinish();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingComplete', 'true');
    setVisible(false);
    onFinish();
  };

  if (localStorage.getItem('onboardingComplete') || !visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Steg {step + 1} av {steps.length}</span>
          <button
            className="text-xs text-muted-foreground hover:underline"
            onClick={handleSkip}
            tabIndex={0}
          >
            Hopp over
          </button>
        </div>
        <h2 className="text-2xl font-bold mb-2 transition-all duration-300">{steps[step].title}</h2>
        <p className="mb-6 text-muted-foreground transition-all duration-300">{steps[step].description}</p>
        <div className="flex justify-center gap-2 mb-4">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${i === step ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            />
          ))}
        </div>
        <div className="flex justify-between gap-2">
          <button
            className="px-4 py-2 rounded bg-muted text-muted-foreground font-medium disabled:opacity-50"
            onClick={handleBack}
            disabled={step === 0}
            tabIndex={0}
          >
            Tilbake
          </button>
          <button
            ref={nextBtnRef}
            className="bg-primary text-primary-foreground px-6 py-2 rounded font-medium hover:bg-primary/90 transition"
            onClick={handleNext}
            tabIndex={0}
          >
            {step === steps.length - 1 ? 'Start appen' : 'Neste'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
