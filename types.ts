
export type SkillLevel = 0 | 1 | 2 | 3 | 4;

export interface Skill {
  id: string;
  name: string;
  category: 'Machine' | 'Process' | 'Quality' | 'Safety';
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuedDate: string;
  expiryDate: string;
  isValid: boolean;
}

export interface Operator {
  id: string;
  name: string;
  role: string;
  shift: 'Morning' | 'Evening' | 'Night';
  avatar: string; // URL
  skills: Record<string, SkillLevel>; // skillId -> level
  certifications: Certification[];
}

export interface Machine {
  id: string;
  name: string;
  type: string;
  requiredSkills: { skillId: string; minLevel: SkillLevel }[];
  status: 'Operational' | 'Maintenance' | 'Down';
}

export interface Recommendation {
  operatorId: string;
  score: number; // 0-100
  reasoning: string;
  missingSkills: string[];
}

export interface TrainingPlan {
  operatorId: string;
  recommendedSkills: string[];
  focusArea: string;
  estimatedHours: number;
}

// Changed to string to support the extensive list of market connectors
export type IntegrationType = string;

export interface DataSource {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'Connected' | 'Error' | 'Disconnected';
  lastSync: string;
  config: Record<string, string>;
}

// Enterprise Module Types
export type ModuleId = 
  | 'workforce' 
  | 'core-hr' 
  | 'talent' 
  | 'learning' 
  | 'recruiting' 
  | 'time' 
  | 'payroll' 
  | 'service';

export interface EnterpriseModule {
    id: ModuleId;
    name: string;
    description: string;
    icon: any; // React Component
    color: string;
}