import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Plus, Tag } from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (candidate: CandidateProfile) => void;
  candidateToEdit?: CandidateProfile | null;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  candidateToEdit,
}) => {
  const [name, setName] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [preferredRole, setPreferredRole] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Bangalore / Remote');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (candidateToEdit) {
      setName(candidateToEdit.name);
      setQualification(candidateToEdit.qualification || candidateToEdit.highestQualification || '');
      setExperienceYears(candidateToEdit.experienceYears ?? 0);
      setPreferredRole(candidateToEdit.preferredRole || '');
      setPreferredLocation(candidateToEdit.preferredLocation || 'Bangalore / Remote');
      setEmail(candidateToEdit.email || '');
      setBio(candidateToEdit.bio || '');
      setSkills(candidateToEdit.skills || []);
    } else {
      setName('');
      setQualification('B.Tech in Computer Science');
      setExperienceYears(0);
      setPreferredRole('Full Stack Developer');
      setPreferredLocation('Bangalore / Remote');
      setEmail('');
      setBio('');
      setSkills(['React', 'JavaScript', 'HTML', 'CSS']);
    }
    setSkillInput('');
  }, [candidateToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSkill = (skillText?: string) => {
    const raw = (skillText !== undefined ? skillText : skillInput).trim();
    if (!raw) return;

    // Handle comma-separated skills if pasted
    const splitSkills = raw
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newSkills = [...skills];
    splitSkills.forEach((s) => {
      if (!newSkills.some((existing) => existing.toLowerCase() === s.toLowerCase())) {
        newSkills.push(s);
      }
    });

    setSkills(newSkills);
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let expLevel: CandidateProfile['experienceLevel'] = 'Fresher (0 yrs)';
    if (experienceYears >= 4) expLevel = '4+ Years';
    else if (experienceYears >= 2) expLevel = '2-4 Years';
    else if (experienceYears >= 1) expLevel = '1-2 Years';

    const qual = qualification.trim() || 'Graduate';
    let degCategory: CandidateProfile['degreeCategory'] = 'Other';
    const qLower = qual.toLowerCase();
    if (qLower.includes('b.tech') || qLower.includes('b.e')) degCategory = 'B.Tech / B.E.';
    else if (qLower.includes('mca')) degCategory = 'MCA';
    else if (qLower.includes('m.tech')) degCategory = 'M.Tech';
    else if (qLower.includes('bca') || qLower.includes('b.sc')) degCategory = 'B.Sc / BCA';
    else if (qLower.includes('diploma')) degCategory = 'Diploma';

    const candidateData: CandidateProfile = {
      id: candidateToEdit ? candidateToEdit.id : `cand-${Date.now()}`,
      name: name.trim(),
      qualification: qual,
      highestQualification: qual,
      experienceYears: Number(experienceYears),
      experienceLevel: expLevel,
      degreeCategory: degCategory,
      preferredRole: preferredRole.trim() || 'Software Engineer',
      preferredLocation: preferredLocation.trim() || 'Any / Remote',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
      phone: candidateToEdit?.phone || '+91 98000 12345',
      bio: bio.trim() || `Profile of ${name.trim()} focusing on ${preferredRole.trim() || 'software engineering'}.`,
      skills: skills.length > 0 ? skills : ['Problem Solving', 'Computer Science Fundamentals'],
    };

    onSave(candidateData);
    onClose();
  };

  const sampleSkillsPool = [
    'Python',
    'React',
    'JavaScript',
    'TypeScript',
    'SQL',
    'Node.js',
    'Docker',
    'Java',
    'MongoDB',
    'Git',
    'Tailwind CSS',
    'AWS',
    'PostgreSQL',
    'Machine Learning',
    'Power BI',
    'Selenium',
  ].filter((s) => !skills.some((curr) => curr.toLowerCase() === s.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">
              {candidateToEdit ? 'Edit Candidate Profile' : 'Create New Candidate Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            {candidateToEdit
              ? 'Update the candidate details below. The AI recommendation engine will instantly recalculate all job rankings.'
              : 'Add a new candidate profile to test the recommendation engine against their specific skills and qualifications.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Candidate Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Highest Qualification */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Highest Qualification *
              </label>
              <input
                type="text"
                placeholder="e.g. B.Tech in Computer Science / MCA"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Years of Experience *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="15"
                  step="0.5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {experienceYears === 0 ? 'Fresher (0 yrs)' : `${experienceYears} yrs`}
                </span>
              </div>
            </div>

            {/* Preferred Job Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Job Role *
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer / Data Analyst"
                value={preferredRole}
                onChange={(e) => setPreferredRole(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Preferred Location */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Location
              </label>
              <input
                type="text"
                placeholder="e.g. Bangalore / Remote / Pune"
                value={preferredLocation}
                onChange={(e) => setPreferredLocation(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="candidate@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Skills (as a list of strings) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Skills (List of Competencies) *
              </label>
              <span className="text-[11px] text-slate-500">
                {skills.length} skills added
              </span>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-lg border border-slate-200 bg-[#F8FAFC] min-h-12 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#EFF6FF] text-[#1E293B] border border-blue-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {skills.length === 0 && (
                <span className="text-xs text-slate-400 italic">
                  No skills added yet. Type below and press Enter or click Add.
                </span>
              )}
            </div>

            {/* Skill Input Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Type a skill (e.g. React, Python, Docker) and press Enter..."
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-3 py-2 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded-md shadow-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Quick Suggestions */}
            {sampleSkillsPool.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-400 font-medium">Suggestions:</span>
                {sampleSkillsPool.slice(0, 6).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleAddSkill(s)}
                    className="text-[10px] text-slate-600 hover:text-[#2563EB] bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bio / Profile Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Summary / Academic Projects
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of candidate achievements or academic project focus..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{candidateToEdit ? 'Save Changes' : 'Create Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
