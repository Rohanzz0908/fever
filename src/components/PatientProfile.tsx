import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, MapPin, Phone, Heart, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface PatientProfileProps {
  onProfileComplete: (profile: PatientData) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ onProfileComplete }) => {
  const [profileData, setProfileData] = useState<PatientData>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    previousVisits: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof PatientData, value: string | number) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!profileData.name || !profileData.age || !profileData.gender || !profileData.phone) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate profile creation delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: "Profile Created",
      description: "Patient profile has been successfully created",
    });

    onProfileComplete(profileData);
    setIsLoading(false);
  };

  const isFormValid = profileData.name && profileData.age && profileData.gender && profileData.phone;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="medical-card">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Patient Profile Creation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Arogya Sewa Health Registration</p>
            </div>
          </div>
          <div className="flex justify-center space-x-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Step 1 of 2
            </Badge>
            <Badge variant="outline" className="bg-info/10 text-info border-info/20">
              Confidential
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <User className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-primary">Basic Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profileData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-primary">Contact Information</h3>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={profileData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <Heart className="w-4 h-4 text-primary" />
                <h3 className="font-medium text-primary">Medical Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Textarea
                    id="medications"
                    value={profileData.currentMedications}
                    onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                    placeholder="List current medications"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={profileData.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    placeholder="List any allergies"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="history">Medical History</Label>
                <Textarea
                  id="history"
                  value={profileData.medicalHistory}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  placeholder="Previous medical conditions, surgeries, etc."
                  rows={3}
                />
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <FileText className="w-4 h-4 text-info mt-0.5" />
                <div className="text-sm">
                  <p className="text-info font-medium">Privacy & Consent</p>
                  <p className="text-info/80 mt-1">
                    Your medical information will be kept confidential and shared only with authorized healthcare providers for treatment purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <Button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="medical-button px-8"
              >
                {isLoading ? (
                  <>
                    <Plus className="w-4 h-4 mr-2 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Profile & Continue
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
