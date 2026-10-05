import { AlgorithmWeights, CandidateProfile, Job, MatchScoreBreakdown } from '../types';

export const DEFAULT_WEIGHTS: AlgorithmWeights = {
  skillWeight: 50,
  roleWeight: 25,
  experienceWeight: 15,
  qualificationWeight: 10,
};

// Skill aliases & normalization dictionary for realistic AI matching
const SKILL_ALIASES: Record<string, string> = {
  'react.js': 'react',
  'reactjs': 'react',
  'node.js': 'node',
  'nodejs': 'node',
  'express.js': 'express',
  'expressjs': 'express',
  'vue.js': 'vue',
  'vuejs': 'vue',
  'next.js': 'nextjs',
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'postgres': 'postgresql',
  'mongo': 'mongodb',
  'rest': 'rest api',
  'restful apis': 'rest api',
  'rest apis': 'rest api',
  'tailwind': 'tailwind css',
  'aws cloud': 'aws',
  'amazon web services': 'aws',
  'docker containers': 'docker',
  'git/github': 'git',
  'github': 'git',
  'ml': 'machine learning',
  'ai': 'artificial intelligence',
  'power bi': 'powerbi',
  'ms excel': 'excel',
  'advanced excel': 'excel',
  'ci/cd': 'cicd',
  'ui/ux': 'ui ux',
};

export function normalizeSkill(skill: string): string {
  const cleaned = skill.trim().toLowerCase();
  return SKILL_ALIASES[cleaned] || cleaned;
}

// Tokenize text for semantic matching
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

// Calculate Jaccard similarity and skill overlap
export function calculateSkillOverlap(
  candidateSkills: string[],
  jobRequiredSkills: string[],
  jobPreferredSkills: string[] = []
): {
  score: number;
  matched: string[];
  missing: string[];
} {
  if (!jobRequiredSkills || jobRequiredSkills.length === 0) {
    return { score: 100, matched: [], missing: [] };
  }

  const normalizedCandidate = candidateSkills.map(normalizeSkill);
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];

  jobRequiredSkills.forEach((reqSkill) => {
    const normReq = normalizeSkill(reqSkill);
    const hasMatch = normalizedCandidate.some(
      (cSkill) =>
        cSkill === normReq ||
        cSkill.includes(normReq) ||
        normReq.includes(cSkill)
    );

    if (hasMatch) {
      matchedRequired.push(reqSkill);
    } else {
      missingRequired.push(reqSkill);
    }
  });

  // Calculate base score from required skills
  const requiredRatio = matchedRequired.length / jobRequiredSkills.length;
  let baseScore = requiredRatio * 100;

  // Add small bonus for preferred skills matched (up to 10%)
  if (jobPreferredSkills && jobPreferredSkills.length > 0) {
    let preferredMatchedCount = 0;
    jobPreferredSkills.forEach((prefSkill) => {
      const normPref = normalizeSkill(prefSkill);
      if (normalizedCandidate.some((c) => c === normPref || c.includes(normPref) || normPref.includes(c))) {
        preferredMatchedCount++;
      }
    });
    const bonus = (preferredMatchedCount / jobPreferredSkills.length) * 10;
    baseScore = Math.min(100, baseScore + bonus);
  }

  return {
    score: Math.round(baseScore),
    matched: matchedRequired,
    missing: missingRequired,
  };
}

// Calculate Role Similarity using token overlap & role keyword alignment
export function calculateRoleAffinity(candidateRole: string, jobTitle: string, jobDepartment: string): number {
  if (!candidateRole || !jobTitle) return 60;

  const candidateTokens = tokenize(candidateRole);
  const jobTokens = [...tokenize(jobTitle), ...tokenize(jobDepartment)];

  // Synonym mappings for roles
  const synonyms: Record<string, string[]> = {
    developer: ['engineer', 'programmer', 'coder', 'specialist', 'technologist'],
    engineer: ['developer', 'programmer', 'specialist'],
    frontend: ['front', 'ui', 'web', 'client', 'react', 'javascript'],
    backend: ['back', 'server', 'api', 'systems', 'python', 'java', 'node'],
    fullstack: ['full', 'stack', 'software', 'web'],
    data: ['analyst', 'analytics', 'scientist', 'bi', 'machine', 'learning'],
    ai: ['machine', 'learning', 'ml', 'deep', 'data'],
    qa: ['tester', 'test', 'quality', 'automation', 'sdet'],
  };

  let matchPoints = 0;
  let totalPoints = candidateTokens.length;

  candidateTokens.forEach((cToken) => {
    if (jobTokens.includes(cToken)) {
      matchPoints += 1.0;
    } else {
      // Check synonyms
      const synList = synonyms[cToken] || [];
      const hasSyn = synList.some((s) => jobTokens.includes(s));
      if (hasSyn) {
        matchPoints += 0.75;
      }
    }
  });

  const ratio = Math.min(1, matchPoints / Math.max(1, totalPoints));
  // Baseline minimum of 40 so non-exact matches don't completely tank the score
  return Math.round(40 + ratio * 60);
}

// Calculate Qualification compatibility
export function calculateQualificationScore(candidateQual: string, jobQual: string): number {
  if (!jobQual) return 100;
  const cLower = candidateQual.toLowerCase();
  const jLower = jobQual.toLowerCase();

  // If any degree or bachelor's accepted
  if (jLower.includes('any graduate') || jLower.includes('any degree') || jLower.includes('bachelor')) {
    return 100;
  }

  // Exact or category overlap
  if (cLower.includes('b.tech') || cLower.includes('b.e.') || cLower.includes('engineering')) {
    if (jLower.includes('b.tech') || jLower.includes('b.e') || jLower.includes('engineering') || jLower.includes('cs') || jLower.includes('it')) {
      return 100;
    }
    return 85;
  }

  if (cLower.includes('mca') || cLower.includes('m.tech')) {
    if (jLower.includes('mca') || jLower.includes('m.tech') || jLower.includes('post graduate') || jLower.includes('master')) {
      return 100;
    }
    return 95;
  }

  if (cLower.includes('bca') || cLower.includes('b.sc')) {
    if (jLower.includes('bca') || jLower.includes('b.sc') || jLower.includes('graduate')) {
      return 100;
    }
    return 75;
  }

  return 70;
}

// Calculate Experience Score
export function calculateExperienceScore(candidateYears: number, minExp: number, maxExp: number): number {
  if (candidateYears >= minExp && candidateYears <= maxExp) {
    return 100;
  }
  // Fresher applying to 0-1 or 0-2 yrs
  if (candidateYears === 0 && minExp === 0) {
    return 100;
  }
  // Candidate has less experience than min
  if (candidateYears < minExp) {
    const diff = minExp - candidateYears;
    if (diff <= 1) return 75; // 1 year gap is trainable
    if (diff <= 2) return 50;
    return 30;
  }
  // Candidate has more experience than max (slight overqualification or lateral fit)
  if (candidateYears > maxExp) {
    const over = candidateYears - maxExp;
    if (over <= 2) return 90;
    return 80;
  }
  return 80;
}

// Determine Match Tier label
function getMatchTier(score: number): MatchScoreBreakdown['matchTier'] {
  if (score >= 85) return 'Exceptional Match';
  if (score >= 70) return 'Strong Match';
  if (score >= 55) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
}

// Full matching computation for a single job and candidate
export function computeJobMatch(
  job: Job,
  candidate: CandidateProfile,
  weights: AlgorithmWeights = DEFAULT_WEIGHTS
): MatchScoreBreakdown {
  const skillRes = calculateSkillOverlap(
    candidate.skills,
    job.requiredSkills,
    job.preferredSkills
  );

  const roleScore = calculateRoleAffinity(
    candidate.preferredRole,
    job.title,
    job.department
  );

  const qualScore = calculateQualificationScore(
    candidate.qualification,
    job.qualification
  );

  const expScore = calculateExperienceScore(
    candidate.experienceYears,
    job.minExp,
    job.maxExp
  );

  const totalWeight =
    weights.skillWeight +
    weights.roleWeight +
    weights.experienceWeight +
    weights.qualificationWeight;

  const rawOverall =
    (skillRes.score * weights.skillWeight +
      roleScore * weights.roleWeight +
      expScore * weights.experienceWeight +
      qualScore * weights.qualificationWeight) /
    (totalWeight || 1);

  const overallScore = Math.min(100, Math.max(0, Math.round(rawOverall)));

  // Generate explainability points for presentation
  const explanationPoints: string[] = [];

  const matchedCount = skillRes.matched.length;
  const totalReq = job.requiredSkills.length;
  explanationPoints.push(
    `Skill Overlap: ${matchedCount}/${totalReq} required skills matched (${skillRes.score}%)`
  );

  if (skillRes.matched.length > 0) {
    explanationPoints.push(`Core competencies matched: ${skillRes.matched.slice(0, 3).join(', ')}${skillRes.matched.length > 3 ? ` +${skillRes.matched.length - 3} more` : ''}`);
  }

  if (skillRes.missing.length > 0) {
    explanationPoints.push(`Skill gap: recommend learning ${skillRes.missing.slice(0, 2).join(', ')}`);
  }

  if (expScore >= 90) {
    explanationPoints.push(`Experience level matches ideal candidate band (${job.experienceRequired})`);
  } else if (candidate.experienceYears < job.minExp) {
    explanationPoints.push(`Entry requirement asks for ${job.experienceRequired}; candidate has ${candidate.experienceYears} yrs`);
  }

  if (roleScore >= 80) {
    explanationPoints.push(`Strong career trajectory alignment with target role "${candidate.preferredRole}"`);
  }

  return {
    overallScore,
    skillScore: skillRes.score,
    roleScore,
    qualificationScore: qualScore,
    experienceScore: expScore,
    matchedSkills: skillRes.matched,
    missingSkills: skillRes.missing,
    matchTier: getMatchTier(overallScore),
    explanationPoints,
  };
}
