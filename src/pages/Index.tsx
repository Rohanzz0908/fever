import React, { useState } from 'react';
import { PatientProfile } from '@/components/PatientProfile';
import { TriageChatbot } from '@/components/TriageChatbot';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Users, Smartphone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PatientData {
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  currentMedications: string;
  allergies: string;
  previousVisits: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'profile' | 'triage'>('profile');
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  const handleProfileComplete = (profile: PatientData) => {
    setPatientData(profile);
    setCurrentStep('triage');
  };

  const handleBack = () => {
    window.location.href = "https://arogyasewa.vercel.app/";
  };

  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen medical-gradient">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Activity className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Arogya Sevak</h1>
                <p className="text-muted-foreground">AI-Powered Rural Healthcare Triage System</p>
              </div>
            </div>
            <div className="flex justify-center space-x-2 mb-6">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Smart India Hackathon 2025
              </Badge>
              <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                Team Binary Beast
              </Badge>
            </div>
          </div>

          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="medical-card p-6 text-center">
              <div className="p-3 rounded-full bg-primary/10 mx-auto w-fit mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-muted-foreground">
                HIPAA-compliant data handling with end-to-end encryption
              </p>
            </Card>
            
            <Card className="medical-card p-6 text-center">
              <div className="p-3 rounded-full bg-accent/10 mx-auto w-fit mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Rural Healthcare</h3>
              <p className="text-sm text-muted-foreground">
                Bridging healthcare gaps in remote and underserved areas
              </p>
            </Card>
            
            <Card className="medical-card p-6 text-center">
              <div className="p-3 rounded-full bg-secondary/10 mx-auto w-fit mb-4">
                <Smartphone className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Triage</h3>
              <p className="text-sm text-muted-foreground">
                Intelligent symptom analysis and care pathway routing
              </p>
            </Card>
          </div>

          <PatientProfile onProfileComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen medical-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Header with Patient Info */}
        <div className="mb-6">
          <Card className="medical-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Health Assessment Session</h2>
                  <p className="text-sm text-muted-foreground">
                    Patient: {patientData?.name} • Age: {patientData?.age} • Gender: {patientData?.gender}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Active Session
              </Badge>
            </div>
          </Card>
        </div>

        <TriageChatbot />
      </div>
    </div>
  );
};

export default Index;
