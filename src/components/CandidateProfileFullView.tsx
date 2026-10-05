import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Clock,
  Target,
  MapPin,
  Mail,
  Phone,
  Edit2,
  Trash2,
  Plus,
  UserPlus,
  CheckCircle2,
  BookmarkCheck,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react';
import { CandidateProfile, JobWithMatch } from '../types';

interface CandidateProfileFullViewProps {
  candidate: CandidateProfile;
  allCandidates: CandidateProfile[];
  onSelectCandidate: (candidate: CandidateProfile) => void;
  onUpdateCandidate: (candidate: CandidateProfile) => void;
  onCreateCandidate: () => void;
  onEditCandidate: (candidate: CandidateProfile) => void;
  onDeleteCandidate: (candidateId: string) => void;
  onRestoreSampleCandidates: () => void;
  savedJobs: JobWithMatch[];
  appliedJobs: JobWithMatch[];
  onSelectJob: (job: JobWithMatch) => void;
}

export const CandidateProfileFullView: React.FC<CandidateProfileFullViewProps> = ({
  candidate,
  allCandidates,
  onSelectCandidate,
  onUpdateCandidate,
  onCreateCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onRestoreSampleCandidates,
  savedJobs,
  appliedJobs,
  onSelectJob,
}) => {
  const [activeTab, setActiveTab] = useState<'profilesDirectory' | 'activeDetails' | 'saved' | 'applied'>('profilesDirectory');
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateProfile | null>(null);

  const confirmDelete = () => {
    if (candidateToDelete) {
      onDeleteCandidate(candidateToDelete.id);
      setCandidateToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card with Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-200">
                Candidate Management
              </span>
              <span className="text-xs text-slate-500">
                · {allCandidates.length} Registered Profiles
              </span>
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              Candidate Profiles Directory & Management
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Create, view, edit, and delete multiple candidate profiles. The recommendation algorithm evaluates each profile's skills, highest qualification, experience, and role.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRestoreSampleCandidates}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Reset candidates to initial sample dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Samples</span>
            </button>

            <button
              onClick={onCreateCandidate}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create New Candidate</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('profilesDirectory')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profilesDirectory'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>All Candidate Profiles</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full">
              {allCandidates.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('activeDetails')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'activeDetails'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Active Profile Details: {candidate.name}</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Shortlisted Jobs</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full">
              {savedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('applied')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'applied'
                ? 'border-[#2563EB] text-[#2563EB]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Applied Applications</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded-full">
              {appliedJobs.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: ALL CANDIDATE PROFILES (CREATE, VIEW, EDIT, DELETE) */}
      {activeTab === 'profilesDirectory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <span>
              Click <strong>"Set as Active"</strong> to run recommendation engine for that candidate, or edit their skills and qualifications.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {allCandidates.map((c) => {
              const isActive = c.id === candidate.id;
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-all relative flex flex-col justify-between ${
                    isActive
                      ? 'border-[#2563EB] ring-1 ring-blue-500/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Candidate Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                          {c.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                              {c.name}
                            </h3>
                            {isActive && (
                              <span className="text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
                      </div>

                      {/* Edit and Delete Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onEditCandidate(c)}
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-blue-50 rounded-md transition-colors"
                          title={`Edit ${c.name}'s profile`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setCandidateToDelete(c)}
                          disabled={allCandidates.length <= 1}
                          className={`p-1.5 rounded-md transition-colors ${
                            allCandidates.length <= 1
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title={
                            allCandidates.length <= 1
                              ? 'At least one candidate profile must remain'
                              : `Delete ${c.name}`
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Candidate Details Grid */}
                    <div className="space-y-2 py-3 border-y border-slate-100 text-xs mb-3">
                      {/* Preferred Job Role */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Preferred Job Role:</span>
                        </span>
                        <span className="font-bold text-[#0F172A]">
                          {c.preferredRole}
                        </span>
                      </div>

                      {/* Highest Qualification */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Highest Qualification:</span>
                        </span>
                        <span className="font-semibold text-slate-800 truncate max-w-[210px]" title={c.qualification || c.highestQualification}>
                          {c.qualification || c.highestQualification}
                        </span>
                      </div>

                      {/* Years of Experience */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Years of Experience:</span>
                        </span>
                        <span className="font-semibold text-slate-800">
                          {c.experienceYears === 0
                            ? '0 Years (Fresher)'
                            : `${c.experienceYears} Years`}
                        </span>
                      </div>

                      {/* Preferred Location */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>Target Location:</span>
                        </span>
                        <span className="text-slate-700">{c.preferredLocation || 'Any / Remote'}</span>
                      </div>
                    </div>

                    {/* Skills (as a list of strings) */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-bold text-[#0F172A] uppercase tracking-wider">
                          Skills List ({c.skills.length})
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#EFF6FF] text-[#1E293B] border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Select Active Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      ID: {c.id}
                    </span>

                    {isActive ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#16A34A] bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active for Recommendations</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectCandidate(c)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-[#2563EB] hover:text-white hover:bg-[#2563EB] border border-blue-200 rounded-lg transition-colors"
                      >
                        Set as Active Candidate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE CANDIDATE DETAILS VIEW */}
      {activeTab === 'activeDetails' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0F172A] text-white font-bold text-2xl flex items-center justify-center shadow-xs">
                {candidate.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-[#0F172A]">{candidate.name}</h2>
                  <span className="text-xs font-medium bg-blue-50 text-[#2563EB] border border-blue-200 px-2 py-0.5 rounded">
                    Active Profile
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  Preferred Role: {candidate.preferredRole}
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {candidate.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    {candidate.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {candidate.preferredLocation}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditCandidate(candidate)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit This Profile</span>
              </button>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <GraduationCap className="w-4 h-4 text-[#2563EB]" />
                <span>Highest Qualification</span>
              </div>
              <div className="text-sm font-bold text-[#0F172A]">
                {candidate.qualification || candidate.highestQualification}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Degree Category: {candidate.degreeCategory || 'Verified'}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>Years of Experience</span>
              </div>
              <div className="text-sm font-bold text-[#0F172A]">
                {candidate.experienceYears === 0
                  ? '0 Years (College Fresher)'
                  : `${candidate.experienceYears} Years`}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Level: {candidate.experienceLevel}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                <Target className="w-4 h-4 text-[#2563EB]" />
                <span>Preferred Job Role</span>
              </div>
              <div className="text-sm font-bold text-[#0F172A]">
                {candidate.preferredRole}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Primary Career Preference
              </div>
            </div>
          </div>

          {/* Skills Portfolio List */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
              Skills Portfolio ({candidate.skills.length} competencies)
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-[#EFF6FF] text-[#1E293B] border border-blue-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bio */}
          {candidate.bio && (
            <div>
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Candidate Summary / Academic Notes
              </h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200 leading-relaxed">
                {candidate.bio}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SHORTLISTED / SAVED JOBS */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3">
            Shortlisted Opportunities for {candidate.name} ({savedJobs.length})
          </h3>
          {savedJobs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <BookmarkCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                No saved opportunities yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click the bookmark icon on any job card in Recommendations to shortlist it.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg border border-slate-200 flex items-center justify-between gap-4 hover:border-blue-300 transition-colors"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#0F172A]">{job.title}</h4>
                    <p className="text-xs text-slate-600">
                      {job.company} · {job.location} · {job.salary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#16A34A] tabular-nums">
                      {job.match.overallScore}% Match
                    </span>
                    <button
                      onClick={() => onSelectJob(job)}
                      className="text-xs font-medium text-white bg-[#2563EB] px-3 py-1.5 rounded-md hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: APPLIED APPLICATIONS TRACK */}
      {activeTab === 'applied' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#0F172A] mb-3">
            Submitted Applications by {candidate.name} ({appliedJobs.length})
          </h3>
          {appliedJobs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-medium">
                No job applications submitted yet.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Apply to recommended jobs to track candidate applications here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {appliedJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/30 flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0F172A]">{job.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Submitted ✓
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {job.company} · {job.location} · {job.salary}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-[#16A34A] tabular-nums">
                      {job.match.overallScore}% Match
                    </span>
                    <button
                      onClick={() => onSelectJob(job)}
                      className="text-xs font-medium text-slate-700 border border-slate-300 px-3 py-1.5 rounded-md hover:bg-white"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {candidateToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A] mb-1">
              Delete Candidate Profile?
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete <strong>{candidateToDelete.name}</strong>? This profile and its associated skill portfolio will be removed.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setCandidateToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
              >
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
