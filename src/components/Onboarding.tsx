import React from 'react';
import { useTour } from '@reactour/tour';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Onboarding = () => {
  const { setIsOpen, setCurrentStep } = useTour();

  React.useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    
    if (!hasCompletedOnboarding) {
      // Wait a bit for the page to load, then start the tour
      const timer = setTimeout(() => {
        setCurrentStep(0);
        setIsOpen(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [setIsOpen, setCurrentStep]);

  const startTour = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    startTour();
  };

  // Show a welcome card for new users
  const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
  
  if (!hasCompletedOnboarding) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Velkommen! 👋</CardTitle>
            <CardDescription>
              La oss ta en rask gjennomgang av appen for å komme i gang.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={startTour} className="w-full">
              Start omvisning
            </Button>
            <Button 
              variant="outline" 
              onClick={() => localStorage.setItem('onboarding_completed', 'true')}
              className="w-full"
            >
              Hopp over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default Onboarding;