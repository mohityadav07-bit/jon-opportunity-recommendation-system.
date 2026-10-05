import React, { useState } from 'react';
import { User, GraduationCap, Clock, Target, MapPin, X, Plus, Edit3, CheckCircle2, RotateCcw } from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateProfileCardProps {
  candidate: CandidateProfile;
  onUpdateCandidate: (updated: CandidateProfile) => void;
  onResetCandidate: () => void;
  onCreateCandidate: () => void;
  onViewAllCandidates: () => void;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({
  candidate,
  onUpdateCandidate,
  onResetCandidate,
  onCreateCandidate,
  onViewAllCandidates,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  
  // Local edit form state
  const [formData, setFormData] = useState<CandidateProfile>(candidate);

  // Sync if parent updates candidate
  React.useEffect(() => {
    setFormData(candidate);
  }, [candidate]);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (candidate.skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;

    const updated = {
      ...candidate,
      skills: [...candidate.skills, trimmed],
    };
    onUpdateCandidate(updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = {
      ...candidate,
      skills: candidate.skills.filter((s) => s !== skillToRemove),
    };
    onUpdateCandidate(updated);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCandidate(formData);
    setIsEditing(false);
  };

  const popularSuggestedSkills = [
    'Docker',
    'TypeScript',
    'Python',
    'SQL',
    'AWS',
    'Java',
    'React',
    'Kubernetes',
    'MongoDB',
    'Tailwind CSS',
    'Machine Learning',
  ].filter((s) => !candidate.skills.includes(s));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs mb-6 overflow-hidden">
      {/* Top Banner Accent */}
      <div className="bg-[#EFF6FF] border-b border-blue-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse"></span>
          <span className="text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
            Active Candidate Profile (Input Vector)
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            · Changes immediately recalculate matching ranks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateCandidate}
            className="flex items-center gap-1 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 px-2.5 py-1 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Candidate</span>
          </button>
          <button
            onClick={onViewAllCandidates}
            className="flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-[#2563EB] bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
          >
            <span>All Profiles</span>
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-blue-800 bg-white border border-blue-200 px-3 py-1 rounded-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Close Editor' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={onResetCandidate}
            className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors"
            title="Reset to default college profile"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {!isEditing ? (
          <div>
            {/* Main Profile Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {/* Candidate Info */}
              <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {candidate.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] leading-tight">
                      {candidate.name}
                    </h2>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{candidate.preferredLocation}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{candidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Education, Experience & Role Attributes */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Highest Qualification */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                    <span>Highest Qualification</span>
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A] line-clamp-2">
                    {candidate.qualification || candidate.highestQualification}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Category: {candidate.degreeCategory || 'Verified'}
                  </div>
                </div>

                {/* Years of Experience */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Clock className="w-4 h-4 text-[#2563EB]" />
                    <span>Years of Experience</span>
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    {candidate.experienceYears === 0
                      ? '0 Years (College Fresher)'
                      : `${candidate.experienceYears} Years`}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Level: {candidate.experienceLevel}
                  </div>
                </div>

                {/* Preferred Job Role */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    <Target className="w-4 h-4 text-[#2563EB]" />
                    <span>Preferred Job Role</span>
                  </div>
                  <div className="text-sm font-semibold text-[#0F172A]">
                    {candidate.preferredRole}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Target Career Path
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Skills Section */}
            <div className="mt-5 pt-4 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Candidate Skills Portfolio ({candidate.skills.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    · Matched against job requirement vectors
                  </span>
                </div>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap items-center gap-2">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#EFF6FF] text-[#1E293B] border border-blue-200"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-600 transition-colors p-0.5 rounded"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Inline Quick Add Input */}
                <div className="inline-flex items-center gap-1.5">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill(newSkillInput);
                      }
                    }}
                    placeholder="+ Add custom skill..."
                    className="text-xs border border-slate-300 rounded-md px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 bg-white"
                  />
                  {newSkillInput && (
                    <button
                      onClick={() => handleAddSkill(newSkillInput)}
                      className="p-1 rounded bg-[#2563EB] text-white hover:bg-blue-700 text-xs"
                      title="Add skill"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              {popularSuggestedSkills.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                  <span className="font-medium text-[11px] text-slate-400">Quick add for demo:</span>
                  {popularSuggestedSkills.slice(0, 5).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAddSkill(s)}
                      className="text-[11px] font-medium text-slate-600 hover:text-[#2563EB] bg-slate-100 hover:bg-blue-50 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Profile Edit Form */
          <form onSubmit={handleSaveForm} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-[#0F172A]">
                Edit Candidate Information
              </h3>
              <p className="text-xs text-slate-500">
                Update parameters to test recommendation algorithm response
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree / Qualification
                </label>
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) =>
                    setFormData({ ...formData, qualification: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Job Role
                </label>
                <input
                  type="text"
                  value={formData.preferredRole}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredRole: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience (Years)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.5"
                    value={formData.experienceYears}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      let level: CandidateProfile['experienceLevel'] = 'Fresher (0 yrs)';
                      if (val >= 4) level = '4+ Years';
                      else if (val >= 2) level = '2-4 Years';
                      else if (val >= 1) level = '1-2 Years';
                      setFormData({
                        ...formData,
                        experienceYears: val,
                        experienceLevel: level,
                      });
                    }}
                    className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500 whitespace-nowrap">
                    {formData.experienceYears === 0 ? 'Fresher' : 'Yrs'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Location
                </label>
                <input
                  type="text"
                  value={formData.preferredLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredLocation: e.target.value })
                  }
                  className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Candidate Bio / Profile Summary
              </label>
              <textarea
                rows={2}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full text-xs border border-slate-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-sm transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
