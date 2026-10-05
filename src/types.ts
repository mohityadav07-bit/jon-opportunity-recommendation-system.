export interface CandidateProfile {
  id: string;
  name: string;
  skills: string[]; // List of strings (required by user prompt)
  qualification: string; // Highest qualification
  highestQualification?: string; // Explicit alias for highest qualification
  experienceYears: number; // Years of experience (number)
  preferredRole: string; // Preferred job role
  email?: string;
  phone?: string;
  degreeCategory?: 'B.Tech / B.E.' | 'MCA' | 'B.Sc / BCA' | 'M.Tech' | 'Diploma' | 'Other';
  experienceLevel?: 'Fresher (0 yrs)' | '1-2 Years' | '2-4 Years' | '4+ Years';
  preferredLocation?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logoText: string;
  logoBg: string;
  location: string;
  workplaceType: 'On-site' | 'Hybrid' | 'Remote';
  jobType: 'Full-Time' | 'Internship' | 'Contract';
  salary: string;
  experienceRequired: string;
  minExp: number;
  maxExp: number;
  qualification: string;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  postedDate: string;
  openings: number;
  department: string;
  applied?: boolean;
  saved?: boolean;
}

export interface MatchScoreBreakdown {
  overallScore: number; // 0 - 100
  skillScore: number; // 0 - 100
  roleScore: number; // 0 - 100
  qualificationScore: number; // 0 - 100
  experienceScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  matchTier: 'Exceptional Match' | 'Strong Match' | 'Good Match' | 'Fair Match' | 'Low Match';
  explanationPoints: string[];
}

export interface JobWithMatch extends Job {
  match: MatchScoreBreakdown;
}

export interface AlgorithmWeights {
  skillWeight: number; // default 50
  roleWeight: number; // default 25
  experienceWeight: number; // default 15
  qualificationWeight: number; // default 10
}
