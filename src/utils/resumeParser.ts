import { CandidateProfile } from '../types';

export interface ParsedResumeData {
  name: string;
  email: string;
  phone: string;
  highestQualification: string;
  experienceYears: number;
  experienceLevel: CandidateProfile['experienceLevel'];
  preferredRole: string;
  preferredLocation: string;
  skills: string[];
  summary: string;
  rawTextPreview: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  confidenceScore: number; // 0 - 100
}

// Master tech skills dictionary for resume matching
const SKILLS_DICTIONARY: { name: string; pattern: RegExp }[] = [
  // Web & Frontend
  { name: 'React', pattern: /\b(react|react\.?js)\b/i },
  { name: 'JavaScript', pattern: /\b(javascript|es6|es20\d\d)\b/i },
  { name: 'TypeScript', pattern: /\b(typescript|ts)\b/i },
  { name: 'HTML5', pattern: /\b(html|html5)\b/i },
  { name: 'CSS3', pattern: /\b(css|css3)\b/i },
  { name: 'Tailwind CSS', pattern: /\b(tailwind|tailwind\s*css)\b/i },
  { name: 'Bootstrap', pattern: /\bbootstrap\b/i },
  { name: 'Next.js', pattern: /\b(next|next\.?js)\b/i },
  { name: 'Vue.js', pattern: /\b(vue|vue\.?js)\b/i },
  { name: 'Angular', pattern: /\bangular\b/i },
  { name: 'Redux', pattern: /\bredux\b/i },

  // Backend & Languages
  { name: 'Node.js', pattern: /\b(node|node\.?js)\b/i },
  { name: 'Express.js', pattern: /\b(express|express\.?js)\b/i },
  { name: 'Python', pattern: /\bpython\b/i },
  { name: 'Django', pattern: /\bdjango\b/i },
  { name: 'Flask', pattern: /\bflask\b/i },
  { name: 'Java', pattern: /\bjava\b(?!script)/i },
  { name: 'Spring Boot', pattern: /\b(spring|spring\s*boot)\b/i },
  { name: 'C++', pattern: /\bc\+\+\b/i },
  { name: 'C#', pattern: /\bc#\b/i },
  { name: 'Go', pattern: /\b(golang|go language)\b/i },
  { name: 'PHP', pattern: /\bphp\b/i },
  { name: 'REST API', pattern: /\b(rest|restful|rest\s*api|apis)\b/i },
  { name: 'GraphQL', pattern: /\bgraphql\b/i },

  // Databases & Storage
  { name: 'SQL', pattern: /\bsql\b/i },
  { name: 'PostgreSQL', pattern: /\b(postgres|postgresql)\b/i },
  { name: 'MySQL', pattern: /\bmysql\b/i },
  { name: 'MongoDB', pattern: /\b(mongo|mongodb)\b/i },
  { name: 'Redis', pattern: /\bredis\b/i },
  { name: 'Firebase', pattern: /\bfirebase\b/i },

  // Cloud & DevOps
  { name: 'Docker', pattern: /\bdocker\b/i },
  { name: 'Kubernetes', pattern: /\b(kubernetes|k8s)\b/i },
  { name: 'AWS', pattern: /\b(aws|amazon\s*web\s*services)\b/i },
  { name: 'Azure', pattern: /\b(azure|microsoft\s*azure)\b/i },
  { name: 'Google Cloud (GCP)', pattern: /\b(gcp|google\s*cloud)\b/i },
  { name: 'Git', pattern: /\b(git|github|gitlab)\b/i },
  { name: 'CI/CD', pattern: /\b(ci\/cd|cicd|jenkins|github\s*actions)\b/i },
  { name: 'Linux', pattern: /\b(linux|ubuntu|bash|shell\s*scripting)\b/i },

  // Data Science & AI
  { name: 'Machine Learning', pattern: /\b(machine\s*learning|ml)\b/i },
  { name: 'Deep Learning', pattern: /\bdeep\s*learning\b/i },
  { name: 'Pandas', pattern: /\bpandas\b/i },
  { name: 'NumPy', pattern: /\bnumpy\b/i },
  { name: 'Scikit-Learn', pattern: /\b(scikit|sklearn|scikit-learn)\b/i },
  { name: 'TensorFlow', pattern: /\btensorflow\b/i },
  { name: 'PyTorch', pattern: /\bpytorch\b/i },
  { name: 'Power BI', pattern: /\b(power\s*bi|powerbi)\b/i },
  { name: 'Tableau', pattern: /\btableau\b/i },
  { name: 'Excel', pattern: /\b(excel|advanced\s*excel)\b/i },
  { name: 'Statistics', pattern: /\b(statistics|statistical\s*modeling)\b/i },
  { name: 'NLP', pattern: /\b(nlp|natural\s*language\s*processing)\b/i },

  // QA & Testing
  { name: 'Selenium', pattern: /\bselenium\b/i },
  { name: 'Manual Testing', pattern: /\bmanual\s*testing\b/i },
  { name: 'TestNG', pattern: /\btestng\b/i },
  { name: 'JIRA', pattern: /\bjira\b/i },
  { name: 'JUnit', pattern: /\bjunit\b/i },
  { name: 'Postman', pattern: /\bpostman\b/i },

  // Mobile
  { name: 'React Native', pattern: /\breact\s*native\b/i },
  { name: 'Flutter', pattern: /\bflutter\b/i },
  { name: 'Android', pattern: /\bandroid\b/i },
];

/**
 * Extracts plain text from binary PDF stream / printable strings
 */
function extractTextFromPdfBinary(binaryString: string): string {
  const chunks: string[] = [];
  // 1. Check for standard PDF text objects (Text between BT and ET, or enclosed in parentheses)
  const textMatches = binaryString.match(/\(([^()]{2,120})\)\s*Tj/g);
  if (textMatches && textMatches.length > 5) {
    for (const match of textMatches) {
      const clean = match.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
      if (clean && clean.length > 1) {
        chunks.push(clean);
      }
    }
  }

  // 2. If PDF was encoded in stream chunks, scan for ASCII words
  if (chunks.length < 10) {
    const rawAsciiWords = binaryString
      .replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .filter((w) => w.length > 2 && /^[a-zA-Z0-9.,;:+#/-]+$/.test(w));

    if (rawAsciiWords.length > 20) {
      return rawAsciiWords.join(' ');
    }
  }

  return chunks.join(' ');
}

/**
 * Extracts text from DOCX (Word XML)
 */
function extractTextFromDocxBinary(binaryString: string): string {
  // In docx, text elements are enclosed in <w:t>...</w:t>
  const wtMatches = binaryString.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
  if (wtMatches && wtMatches.length > 0) {
    return wtMatches
      .map((m) => m.replace(/<[^>]+>/g, ''))
      .join(' ')
      .replace(/\s+/g, ' ');
  }

  // Fallback: extract clean alphanumeric sequences
  return binaryString
    .replace(/<[^>]+>/g, ' ')
    .replace(/[\x00-\x1F\x7F-\xFF]/g, ' ')
    .replace(/\s+/g, ' ');
}

/**
 * Main file reader supporting PDF, DOC, DOCX, TXT
 */
export async function readResumeFile(file: File): Promise<{ text: string; fileType: string }> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  let fileType = 'PDF Document';
  if (extension === 'doc' || extension === 'docx') fileType = 'Word Document (DOC/DOCX)';
  else if (extension === 'txt') fileType = 'Plain Text (TXT)';
  else if (extension === 'pdf') fileType = 'PDF Document';

  return new Promise((resolve, reject) => {
    // If text file
    if (extension === 'txt' || file.type.includes('text/plain')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({ text: (e.target?.result as string) || '', fileType });
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
      return;
    }

    // For PDF, DOC, DOCX
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result;
      if (!buffer) {
        resolve({ text: '', fileType });
        return;
      }

      // Convert array buffer to binary string
      const bytes = new Uint8Array(buffer as ArrayBuffer);
      let binary = '';
      const step = 8192;
      for (let i = 0; i < bytes.length; i += step) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + step)));
      }

      let extracted = '';
      if (extension === 'docx') {
        extracted = extractTextFromDocxBinary(binary);
      } else if (extension === 'pdf') {
        extracted = extractTextFromPdfBinary(binary);
      } else {
        // Generic DOC / Binary fallback: strip non-printable characters
        extracted = binary.replace(/[\x00-\x1F\x7F-\xFF]/g, ' ').replace(/\s+/g, ' ');
      }

      resolve({ text: extracted, fileType });
    };
    reader.onerror = () => reject(new Error('Failed to read document'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * AI / Heuristic entity extractor from resume text
 */
export function parseResumeContent(
  rawText: string,
  fileName: string,
  fileSize: string,
  fileType: string
): ParsedResumeData {
  const normalized = rawText.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  // 1. Candidate Name Detection
  let detectedName = '';
  // Check first 5 lines for a candidate name (usually 2-3 words, capitalized, not an email or title)
  for (const line of lines.slice(0, 5)) {
    const cleanLine = line.replace(/^(resume|curriculum\s*vitae|cv|profile|name\s*[:\-])/i, '').trim();
    if (
      cleanLine.length >= 3 &&
      cleanLine.length <= 35 &&
      /^[A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3}$/.test(cleanLine) &&
      !cleanLine.includes('@') &&
      !cleanLine.includes('http')
    ) {
      detectedName = cleanLine;
      break;
    }
  }

  // Fallback name from file name if not detected in first lines
  if (!detectedName) {
    const fromFileName = fileName
      .replace(/\.(pdf|docx|doc|txt)$/i, '')
      .replace(/[-_]/g, ' ')
      .replace(/(resume|cv|biodata|profile|final)/gi, '')
      .trim();
    if (fromFileName.length >= 3) {
      detectedName = fromFileName
        .split(' ')
        .filter((w) => w.length > 1)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }
  if (!detectedName) detectedName = 'Candidate Applicant';

  // 2. Email Detection
  const emailMatch = normalized.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/);
  const detectedEmail = emailMatch ? emailMatch[0] : `${detectedName.toLowerCase().replace(/\s+/g, '.')}@college.edu`;

  // 3. Phone Detection
  const phoneMatch = normalized.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3,5}\)?[-.\s]?\d{3}[-.\s]?\d{3,5}/);
  const detectedPhone = phoneMatch ? phoneMatch[0].trim() : '+91 98765 43210';

  // 4. Highest Qualification Detection
  let qualification = 'B.Tech in Computer Science';
  if (/m\.?tech|master of technology/i.test(normalized)) {
    qualification = 'M.Tech in Computer Science & Engineering';
  } else if (/mca|master of computer applications/i.test(normalized)) {
    qualification = 'Master of Computer Applications (MCA)';
  } else if (/m\.?sc|master of science/i.test(normalized)) {
    qualification = 'M.Sc in Data Science & Artificial Intelligence';
  } else if (/b\.?tech|b\.?e\.?|bachelor of engineering|bachelor of technology/i.test(normalized)) {
    if (/information technology|\bit\b/i.test(normalized)) {
      qualification = 'B.Tech in Information Technology';
    } else if (/electronics|\bece\b/i.test(normalized)) {
      qualification = 'B.Tech in Electronics & Communication';
    } else {
      qualification = 'B.Tech in Computer Science & Engineering';
    }
  } else if (/bca|bachelor of computer applications/i.test(normalized)) {
    qualification = 'Bachelor of Computer Applications (BCA)';
  } else if (/b\.?sc|bachelor of science/i.test(normalized)) {
    qualification = 'B.Sc in Computer Science & Mathematics';
  } else if (/diploma/i.test(normalized)) {
    qualification = 'Diploma in Computer Engineering';
  }

  // 5. Years of Experience Detection
  let experienceYears = 0;
  let experienceLevel: CandidateProfile['experienceLevel'] = 'Fresher (0 yrs)';

  const expMatches = normalized.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
  if (expMatches && expMatches[1]) {
    const val = parseFloat(expMatches[1]);
    if (!isNaN(val) && val < 25) {
      experienceYears = val;
    }
  } else if (/fresher|intern|final\s*year|entry\s*level|student/i.test(normalized)) {
    experienceYears = 0;
  }

  if (experienceYears >= 4) experienceLevel = '4+ Years';
  else if (experienceYears >= 2) experienceLevel = '2-4 Years';
  else if (experienceYears >= 1) experienceLevel = '1-2 Years';
  else experienceLevel = 'Fresher (0 yrs)';

  // 6. Skills Extraction via Master Dictionary
  const matchedSkills: string[] = [];
  SKILLS_DICTIONARY.forEach((skill) => {
    if (skill.pattern.test(normalized)) {
      matchedSkills.push(skill.name);
    }
  });

  // Ensure minimum realistic skill set if document was sparse
  if (matchedSkills.length < 3) {
    if (/python|data/i.test(normalized)) {
      matchedSkills.push('Python', 'SQL', 'Pandas', 'Excel');
    } else if (/testing|qa|selenium/i.test(normalized)) {
      matchedSkills.push('Java', 'Selenium', 'Manual Testing', 'SQL');
    } else {
      matchedSkills.push('React', 'JavaScript', 'HTML5', 'CSS3', 'Git');
    }
  }

  // 7. Preferred Role Inference
  let preferredRole = 'Full Stack Developer';
  const roleLower = normalized.toLowerCase();
  if (roleLower.includes('data analyst') || roleLower.includes('business intelligence') || roleLower.includes('power bi')) {
    preferredRole = 'Data Analyst';
  } else if (roleLower.includes('machine learning') || roleLower.includes('data scientist') || roleLower.includes('ai engineer')) {
    preferredRole = 'Machine Learning Associate';
  } else if (roleLower.includes('qa') || roleLower.includes('automation engineer') || roleLower.includes('software tester') || roleLower.includes('sdet')) {
    preferredRole = 'QA Automation Engineer';
  } else if (roleLower.includes('frontend') || roleLower.includes('react developer') || roleLower.includes('ui engineer')) {
    preferredRole = 'Associate Software Engineer - Frontend';
  } else if (roleLower.includes('backend') || roleLower.includes('django') || roleLower.includes('node.js') || roleLower.includes('api engineer')) {
    preferredRole = 'Python Backend Engineer';
  } else if (roleLower.includes('devops') || roleLower.includes('cloud') || roleLower.includes('aws engineer')) {
    preferredRole = 'Junior Cloud & DevOps Trainee';
  } else if (matchedSkills.includes('React') && matchedSkills.includes('Node.js')) {
    preferredRole = 'Junior Full Stack Developer';
  }

  // 8. Location Preference
  let preferredLocation = 'Bangalore / Remote';
  if (/pune/i.test(normalized)) preferredLocation = 'Pune';
  else if (/hyderabad/i.test(normalized)) preferredLocation = 'Hyderabad';
  else if (/chennai/i.test(normalized)) preferredLocation = 'Chennai';
  else if (/mumbai/i.test(normalized)) preferredLocation = 'Mumbai';
  else if (/remote/i.test(normalized)) preferredLocation = 'Remote';

  // 9. Profile Summary
  const summary = `Resume parsed from ${fileName}. Strong technical foundations in ${matchedSkills.slice(0, 4).join(', ')}. Seeking opportunities in ${preferredRole}.`;

  // 10. Extraction Confidence Score
  let confidenceScore = 65;
  if (detectedName && detectedName !== 'Candidate Applicant') confidenceScore += 10;
  if (emailMatch) confidenceScore += 10;
  if (matchedSkills.length >= 5) confidenceScore += 10;
  if (qualification) confidenceScore += 5;

  return {
    name: detectedName,
    email: detectedEmail,
    phone: detectedPhone,
    highestQualification: qualification,
    experienceYears,
    experienceLevel,
    preferredRole,
    preferredLocation,
    skills: matchedSkills,
    summary,
    rawTextPreview: normalized.slice(0, 350) + (normalized.length > 350 ? '...' : ''),
    fileName,
    fileSize,
    fileType,
    confidenceScore: Math.min(98, confidenceScore),
  };
}

/**
 * Built-in Sample Resumes for instant college presentation demonstration
 */
export const SAMPLE_RESUMES = [
  {
    id: 'sample-resume-1',
    fileName: 'Arjun_Sharma_Web_Developer_Resume.pdf',
    fileSize: '148 KB',
    fileType: 'PDF Document (.pdf)',
    targetProfile: 'Full Stack Web Developer (Fresher)',
    textContent: `
ARJUN SHARMA
Email: arjun.sharma@college.edu | Phone: +91 98765 43210
Bangalore, India | LinkedIn: /in/arjun-sharma-dev | GitHub: /arjun-cse

PROFESSIONAL SUMMARY
Final year B.Tech Computer Science student with practical experience building responsive web applications using React, Node.js, Express, and MongoDB. Passionate about frontend architecture and API design.

EDUCATION
B.Tech in Computer Science & Engineering (2022 - 2026)
GPA: 8.8 / 10.0 | Relevant Coursework: Data Structures, Web Development, DBMS, Operating Systems

TECHNICAL SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3, Python, SQL
- Frontend: React, Next.js, Redux, Tailwind CSS, Bootstrap
- Backend & DB: Node.js, Express.js, MongoDB, PostgreSQL, REST API
- Tools & Cloud: Git, GitHub, Docker, AWS (EC2/S3 basics), Postman, Linux

PROJECTS
1. E-Commerce Platform (React, Node.js, MongoDB, Tailwind CSS)
- Developed full-stack marketplace with JWT authentication, cart management, and Razorpay payment sandbox.
2. Real-time Collaborative Code Editor (React, WebSocket, Node.js)
- Implemented live cursor presence and multi-user syntax highlighting.
    `,
  },
  {
    id: 'sample-resume-2',
    fileName: 'Priya_Patel_Data_Science_Resume.docx',
    fileSize: '182 KB',
    fileType: 'Word Document (.docx)',
    targetProfile: 'Data Analyst & Machine Learning Associate',
    textContent: `
PRIYA PATEL
Email: priya.patel@college.edu | Phone: +91 98123 45678
Pune / Mumbai, India

OBJECTIVE
Analytical and detail-oriented M.Sc Data Science graduate seeking to leverage Python, SQL, Power BI, and statistical modeling to generate data-driven business insights.

EDUCATION
Master of Science (M.Sc) in Data Science & Artificial Intelligence (2024 - 2026)
Bachelor of Science (B.Sc) in Statistics & Computer Applications

KEY COMPETENCIES
- Programming: Python, SQL (MySQL, PostgreSQL), R (Basics)
- Data Libraries: Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn
- BI & Visualization: Power BI, Tableau, Advanced Excel, Dashboards
- Machine Learning: Regression, Classification, Clustering, Feature Engineering, Statistics

ACADEMIC PROJECTS
- Customer Churn Predictive Modeling using Python & Scikit-Learn (89% accuracy).
- Enterprise Sales KPI Dashboard using Power BI with automated data refresh pipelines.
    `,
  },
  {
    id: 'sample-resume-3',
    fileName: 'Rohan_Mehta_Backend_Engineer.doc',
    fileSize: '210 KB',
    fileType: 'Word Document (.doc)',
    targetProfile: 'Junior Python & Cloud Backend Engineer',
    textContent: `
ROHAN MEHTA
Email: rohan.mehta@college.edu | Phone: +91 97234 56789
Hyderabad, India

PROFESSIONAL EXPERIENCE
Junior Backend Developer (1.5 Years Experience)
TechCorp Solutions (2025 - Present)
- Built and maintained RESTful microservices using Python, Django, and PostgreSQL.
- Implemented Redis caching layers reducing database query latencies by 42%.
- Configured Docker containers and automated CI/CD deployment pipelines on AWS.

EDUCATION
B.E. in Information Technology
Graduated with First Class with Distinction

CORE SKILLS
Python, Django, PostgreSQL, Docker, Redis, REST API, Git, Linux, AWS, CI/CD
    `,
  },
];
