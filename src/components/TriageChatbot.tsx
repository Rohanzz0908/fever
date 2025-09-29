import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, User, Bot, AlertTriangle, CheckCircle, AlertCircle, Heart, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface TriageResult {
  severity: 'low' | 'medium' | 'high';
  condition: string;
  recommendation: string;
  urgency: string;
  nextSteps: string[];
  confidence: number;
}

// Dynamic conversation system that analyzes user input
const analyzeUserResponse = (userInput: string, conversationContext: string[]): { nextQuestion: string; isComplete: boolean } => {
  const input = userInput.toLowerCase();
  const context = conversationContext.join(' ').toLowerCase();
  
  // Determine what information we still need
  const hasMainSymptom = context.includes('pain') || context.includes('ache') || context.includes('fever') || 
                         context.includes('cough') || context.includes('nausea') || context.includes('tired') ||
                         context.includes('dizzy') || context.includes('hurt') || context.includes('sick') ||
                         context.includes('symptom');
  
  const hasDuration = context.includes('day') || context.includes('week') || context.includes('hour') || 
                      context.includes('month') || context.includes('since') || context.includes('ago') ||
                      context.includes('started') || context.includes('begin');
  
  const hasSeverity = context.includes('severe') || context.includes('mild') || context.includes('moderate') ||
                      /\b([1-9]|10)\b/.test(context) || context.includes('scale') || context.includes('rate');
  
  const hasVitalSigns = context.includes('fever') || context.includes('temperature') || context.includes('chills') ||
                        context.includes('hot') || context.includes('cold') || context.includes('sweating');
  
  const hasMedications = context.includes('medication') || context.includes('medicine') || context.includes('drug') ||
                         context.includes('pill') || context.includes('allergy') || context.includes('allergic');

  // Generate contextual follow-up questions
  if (!hasMainSymptom) {
    return {
      nextQuestion: "I understand you're not feeling well. Can you tell me more specifically what symptoms you're experiencing? For example, are you having pain, fever, nausea, or something else?",
      isComplete: false
    };
  }
  
  if (!hasDuration) {
    return {
      nextQuestion: `I see you're experiencing ${extractSymptoms(input)}. When did these symptoms start? Was it today, yesterday, or longer ago?`,
      isComplete: false
    };
  }
  
  if (!hasSeverity) {
    return {
      nextQuestion: "On a scale of 1-10, with 10 being the worst pain or discomfort you can imagine, how would you rate what you're feeling right now?",
      isComplete: false
    };
  }
  
  if (!hasVitalSigns) {
    return {
      nextQuestion: "Have you noticed any fever, chills, or unusual changes in your body temperature along with these symptoms?",
      isComplete: false
    };
  }
  
  if (!hasMedications) {
    return {
      nextQuestion: "Are you currently taking any medications, or do you have any known allergies I should be aware of?",
      isComplete: false
    };
  }
  
  return {
    nextQuestion: "Thank you for all that information. Let me analyze your symptoms and provide a health assessment.",
    isComplete: true
  };
};

const extractSymptoms = (input: string): string => {
  const symptoms = [];
  if (input.includes('pain') || input.includes('hurt') || input.includes('ache')) symptoms.push('pain');
  if (input.includes('fever') || input.includes('hot')) symptoms.push('fever');
  if (input.includes('cough')) symptoms.push('cough');
  if (input.includes('nausea') || input.includes('sick')) symptoms.push('nausea');
  if (input.includes('tired') || input.includes('fatigue')) symptoms.push('fatigue');
  if (input.includes('dizzy')) symptoms.push('dizziness');
  
  return symptoms.length > 0 ? symptoms.join(', ') : 'these symptoms';
};

const intelligentTriageAnalysis = (conversationHistory: string[]): TriageResult => {
  const fullContext = conversationHistory.join(' ').toLowerCase();
  
  // Emergency symptoms detection
  const emergencyKeywords = ['chest pain', 'difficulty breathing', 'can\'t breathe', 'severe pain', 
                            'unconscious', 'bleeding', 'choking', 'heart attack', 'stroke', 'seizure'];
  const hasEmergency = emergencyKeywords.some(keyword => fullContext.includes(keyword));
  
  // High severity symptoms
  const highSeverityKeywords = ['severe', '8', '9', '10', 'unbearable', 'excruciating', 'worst', 
                               'can\'t walk', 'can\'t move', 'very high fever'];
  const hasHighSeverity = highSeverityKeywords.some(keyword => fullContext.includes(keyword));
  
  // Medium severity symptoms  
  const mediumSeverityKeywords = ['moderate', '5', '6', '7', 'fever', 'vomiting', 'persistent', 
                                 'getting worse', 'several days'];
  const hasMediumSeverity = mediumSeverityKeywords.some(keyword => fullContext.includes(keyword));
  
  // Analyze symptom combinations
  const hasRespiratory = fullContext.includes('cough') || fullContext.includes('breathing');
  const hasFever = fullContext.includes('fever') || fullContext.includes('temperature');
  const hasPain = fullContext.includes('pain') || fullContext.includes('hurt');
  
  if (hasEmergency || hasHighSeverity) {
    return {
      severity: 'high',
      condition: 'Urgent Medical Attention Required',
      recommendation: 'Immediate teleconsultation with doctor',
      urgency: 'HIGH PRIORITY - Within 15 minutes',
      nextSteps: [
        'Initiate emergency teleconsultation protocol',
        'Monitor patient continuously',
        'Prepare for possible emergency referral',
        'Document all symptoms for emergency team'
      ],
      confidence: 92
    };
  }
  
  if (hasMediumSeverity || (hasFever && hasPain) || (hasRespiratory && hasFever)) {
    return {
      severity: 'medium',
      condition: 'Medical Consultation Recommended',
      recommendation: 'Schedule teleconsultation within 2-4 hours',
      urgency: 'MEDIUM PRIORITY - Within 4 hours',
      nextSteps: [
        'Schedule teleconsultation appointment',
        'Continue monitoring symptoms',
        'Prepare detailed symptom timeline',
        'Consider symptomatic relief measures'
      ],
      confidence: 87
    };
  }
  
  return {
    severity: 'low',
    condition: 'Routine Healthcare Guidance',
    recommendation: 'General health advice and routine consultation',
    urgency: 'LOW PRIORITY - Within 24 hours',
    nextSteps: [
      'Provide basic health guidance',
      'Schedule routine consultation if symptoms persist',
      'Monitor for any changes in condition',
      'Consider self-care measures'
    ],
    confidence: 81
  };
};

export const TriageChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isTriageComplete, setIsTriageComplete] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Start conversation with dynamic greeting
    const initialMessage: Message = {
      id: '1',
      text: "Hello! I'm your AI health assistant here to help assess your health concerns. What brings you here today? Please tell me about any symptoms or health issues you're experiencing.",
      isUser: false,
      timestamp: new Date()
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setConversationHistory(prev => [...prev, currentInput]);
    
    const currentInputCopy = currentInput;
    setCurrentInput('');
    setIsLoading(true);

    // Simulate AI processing delay for realistic interaction
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Analyze user response and determine next action
    const updatedHistory = [...conversationHistory, currentInputCopy];
    const analysis = analyzeUserResponse(currentInputCopy, updatedHistory);

    if (analysis.isComplete) {
      // Complete triage analysis
      const result = intelligentTriageAnalysis(updatedHistory);
      setTriageResult(result);
      setIsTriageComplete(true);
      
      const triageMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thank you for providing all that information. Based on our conversation, I've completed your health assessment. Please review the results below and follow the recommended next steps.`,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, triageMessage]);
      
      toast({
        title: "Health Assessment Complete",
        description: `Assessment completed with ${result.confidence}% confidence`,
      });
    } else {
      // Ask follow-up question based on context
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: analysis.nextQuestion,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }

    setIsLoading(false);
  };

  const handleSaveAssessment = () => {
    if (!triageResult) return;
    
    const assessmentData = {
      patientResponses: conversationHistory,
      triageResult,
      timestamp: new Date().toISOString(),
      assessmentId: `TRIAGE_${Date.now()}`
    };
    
    // Save to localStorage for demo (in real app, this would save to database)
    localStorage.setItem('latestAssessment', JSON.stringify(assessmentData));
    
    toast({
      title: "Assessment Saved",
      description: "Patient assessment has been saved successfully",
    });
  };

  const handleProceedToTeleconsultation = () => {
    if (!triageResult) return;
    
    toast({
      title: "Initiating Teleconsultation",
      description: `Starting ${triageResult.severity === 'high' ? 'emergency' : 'scheduled'} consultation...`,
    });
    
    // In real implementation, this would:
    // 1. Connect to teleconsultation platform
    // 2. Queue patient based on priority
    // 3. Notify available doctors
    // 4. Prepare patient data for consultation
    
    setTimeout(() => {
      toast({
        title: "Teleconsultation Ready",
        description: "A doctor will be with you shortly. Please ensure your camera and microphone are working.",
      });
    }, 2000);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <AlertCircle className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="medical-card p-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">AI Health Triage Assistant</h1>
            <p className="text-sm text-muted-foreground">Arogya Sewa Digital Health Assessment</p>
          </div>
          <div className="ml-auto">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              SIH 2025
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col medical-card">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  <AvatarFallback className={message.isUser ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'}>
                    {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[80%] ${message.isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Analyzing symptoms...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        {!isTriageComplete && (
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Type your response..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !currentInput.trim()}
                className="medical-button"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Triage Results */}
      {triageResult && (
        <Card className={`mt-4 p-6 border-2 ${getSeverityClass(triageResult.severity)}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getSeverityIcon(triageResult.severity)}
                <div>
                  <h3 className="text-lg font-semibold">{triageResult.condition}</h3>
                  <p className="text-sm opacity-80">{triageResult.urgency}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {triageResult.confidence}% Confidence
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Recommendation</h4>
                <p className="text-sm opacity-90">{triageResult.recommendation}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Next Steps</h4>
                <ul className="text-sm space-y-1">
                  {triageResult.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-current mt-2 shrink-0" />
                      <span className="opacity-90">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t border-current/20">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSaveAssessment}
              >
                Save Assessment
              </Button>
              <Button 
                className="medical-button" 
                size="sm"
                onClick={handleProceedToTeleconsultation}
              >
                Proceed to {triageResult.severity === 'high' ? 'Emergency Care' : 'Teleconsultation'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
