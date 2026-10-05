import React from 'react';
import {
  X,
  MapPin,
  Clock,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  Calendar,
  Share2,
  Bookmark,
  BookmarkCheck,
  Check,
  Percent
} from 'lucide-react';
import { JobWithMatch, CandidateProfile } from '../types';

interface JobDetailModalProps {
  job: JobWithMatch | null;
  candidate: CandidateProfile;
  onClose: () => void;
  onApply: (jobId: string) => void;
  onToggleSave: (jobId: string) => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  candidate,
  onClose,
  onApply,
  onToggleSave,
}) => {
  if (!job) return null;

  const match = job.match;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg text-white font-bold text-base flex items-center justify-center shadow-xs"
              style={{ backgroundColor: job.logoBg || '#2563EB' }}
            >
              {job.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-300 font-medium">
                  {job.department}
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-400">{job.postedDate}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {job.title}
              </h2>
              <p className="text-xs text-slate-300">{job.company}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* AI Recommendation System Score Banner */}
          <div className="bg-[#EFF6FF] border border-blue-200 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    Recommendation Match Evaluation
                  </h3>
                  <p className="text-xs text-slate-600">
                    Calculated for candidate <strong>{candidate.name}</strong>
                  </p>
                </div>
              </div>

              {/* Total Match % */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs">
                <span className="text-xs font-semibold text-slate-500">Overall Match:</span>
                <span className="text-xl font-extrabold text-[#16A34A] tabular-nums">
                  {match.overallScore}%
                </span>
                <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {match.matchTier}
                </span>
              </div>
            </div>

            {/* 4 Multi-Attribute Dimension Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-blue-100">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-500">
                  Skill Match (50%)
                </div>
                <div className="text-base font-bold text-[#16A34A] tabular-nums">
                  {match.skillScore}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {match.matchedSkills.length}/{job.requiredSkills.length} skills matched
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-500">
                  Role Affinity (25%)
                </div>
                <div className="text-base font-bold text-[#0F172A] tabular-nums">
                  {match.roleScore}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Semantic alignment
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-500">
                  Experience Fit (15%)
                </div>
                <div className="text-base font-bold text-[#0F172A] tabular-nums">
                  {match.experienceScore}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Band: {job.experienceRequired}
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/80">
                <div className="text-[11px] font-semibold text-slate-500">
                  Qualification (10%)
                </div>
                <div className="text-base font-bold text-[#0F172A] tabular-nums">
                  {match.qualificationScore}%
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Eligibility verified
                </div>
              </div>
            </div>

            {/* Explanation Rationale List for College Demo */}
            <div className="mt-3 pt-3 border-t border-blue-100">
              <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block mb-1">
                AI Recommendation Rationale:
              </span>
              <ul className="space-y-1 text-xs text-slate-700">
                {match.explanationPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#2563EB] font-bold mt-0.5">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Location & Type
              </span>
              <span className="text-xs font-bold text-[#0F172A]">
                {job.location} ({job.workplaceType})
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Salary Package
              </span>
              <span className="text-xs font-bold text-[#0F172A]">{job.salary}</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Experience Band
              </span>
              <span className="text-xs font-bold text-[#0F172A]">
                {job.experienceRequired}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Open Positions
              </span>
              <span className="text-xs font-bold text-[#0F172A]">
                {job.openings} Openings
              </span>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Role Overview & Responsibilities
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-100">
              {job.description}
            </p>
          </div>

          {/* Detailed Skill Comparison: Matched vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Candidate Competencies Matched ({match.matchedSkills.length})</span>
              </div>
              {match.matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {match.matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-white text-emerald-800 border border-emerald-300"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No direct required skill overlap</p>
              )}
            </div>

            {/* Missing Skills / Skills to Learn */}
            <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Skill Gaps / Recommended to Learn ({match.missingSkills.length})</span>
              </div>
              {match.missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {match.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-xs font-medium bg-white text-amber-800 border border-amber-300"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-medium">
                  Zero skill gaps! Full 100% required skill coverage.
                </p>
              )}
            </div>
          </div>

          {/* Eligibility & Education Requirements */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1">
              Required Educational Qualification
            </h4>
            <p className="text-xs text-slate-700">{job.qualification}</p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(job.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border transition-colors ${
                job.saved
                  ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                  : 'text-slate-700 hover:bg-white border-slate-300'
              }`}
            >
              {job.saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#2563EB]" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>Save Job</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => onApply(job.id)}
              disabled={job.applied}
              className={`px-5 py-2 text-xs font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5 ${
                job.applied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-[#2563EB] hover:bg-blue-700 text-white'
              }`}
            >
              {job.applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Application Submitted</span>
                </>
              ) : (
                <span>Submit Job Application</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
