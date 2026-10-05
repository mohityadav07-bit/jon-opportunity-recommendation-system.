import React from 'react';
import { MapPin, Briefcase, GraduationCap, Clock, Check, ArrowRight, Bookmark, BookmarkCheck, CheckCircle } from 'lucide-react';
import { JobWithMatch } from '../types';

interface JobCardProps {
  job: JobWithMatch;
  rank: number;
  onSelectJob: (job: JobWithMatch) => void;
  onToggleSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  rank,
  onSelectJob,
  onToggleSave,
  onApply,
}) => {
  const match = job.match;
  const isHighMatch = match.overallScore >= 75;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-xs transition-all hover:shadow-sm relative flex flex-col justify-between">
      <div>
        {/* Top Header Row: Company Logo + Title + Match Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Company Avatar with clean initials */}
            <div
              className="w-11 h-11 rounded-lg text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: job.logoBg || '#0F172A' }}
            >
              {job.logoText}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  #{rank} Recommended
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{job.postedDate}</span>
              </div>
              <h3
                onClick={() => onSelectJob(job)}
                className="text-base font-bold text-[#0F172A] hover:text-[#2563EB] cursor-pointer transition-colors leading-snug"
              >
                {job.title}
              </h3>
              <p className="text-xs font-medium text-slate-700">{job.company}</p>
            </div>
          </div>

          {/* Match Score Badge (using #16A34A) */}
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-base font-extrabold text-[#16A34A] tabular-nums">
                {match.overallScore}%
              </span>
              <span className="text-[11px] font-semibold text-[#16A34A]">Match</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5">
              {match.matchTier}
            </span>
          </div>
        </div>

        {/* Key Job Attributes Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2.5 px-3 bg-[#F8FAFC] rounded-lg border border-slate-100 text-xs text-slate-700 mb-3.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location} ({job.workplaceType})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Exp: {job.experienceRequired}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <span className="font-semibold text-slate-900">{job.salary}</span>
          </div>
        </div>

        {/* Qualification Requirement */}
        <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3">
          <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">
            <strong className="text-slate-800">Eligibility:</strong> {job.qualification}
          </span>
        </div>

        {/* Required Skills & Candidate Overlap Breakdown */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-semibold text-[#0F172A] uppercase tracking-wider">
              Skills Breakdown ({match.matchedSkills.length}/{job.requiredSkills.length} Matched)
            </span>
            <span className="text-[11px] text-[#16A34A] font-semibold">
              Skill Overlap: {match.skillScore}%
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.requiredSkills.map((skill) => {
              const isMatched = match.matchedSkills.includes(skill);
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                  title={isMatched ? `Candidate has ${skill} ✓` : `Missing skill ${skill}`}
                >
                  {isMatched && <Check className="w-3 h-3 text-[#16A34A]" />}
                  <span>{skill}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleSave(job.id)}
            className={`p-1.5 rounded-md border text-xs transition-colors ${
              job.saved
                ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                : 'text-slate-500 hover:text-slate-700 border-slate-200 bg-white'
            }`}
            title={job.saved ? 'Saved in shortlist' : 'Save for later'}
          >
            {job.saved ? (
              <BookmarkCheck className="w-4 h-4 text-[#2563EB]" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          {job.applied ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Applied</span>
            </span>
          ) : (
            <button
              onClick={() => onApply(job.id)}
              className="text-xs font-medium text-slate-700 hover:text-[#2563EB] hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md transition-colors"
            >
              Quick Apply
            </button>
          )}
        </div>

        <button
          onClick={() => onSelectJob(job)}
          className="flex items-center gap-1 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 px-3.5 py-1.5 rounded-md shadow-xs transition-colors"
        >
          <span>Match Rationale</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
