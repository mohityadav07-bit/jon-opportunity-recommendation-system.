import React, { useState } from 'react';
import {
  X,
  Send,
  Building,
  CheckCircle2,
  FileText,
  UploadCloud,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Percent,
  Check
} from 'lucide-react';
import { JobWithMatch, CandidateProfile } from '../types';

interface EasyApplyModalProps {
  job: JobWithMatch | null;
  candidate: CandidateProfile;
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplication: (
    jobId: string,
    applicantData: { note: string; resumeFile: string }
  ) => void;
  onOpenResumeUpload: () => void;
}

export const EasyApplyModal: React.FC<EasyApplyModalProps> = ({
  job,
  candidate,
  isOpen,
  onClose,
  onSubmitApplication,
  onOpenResumeUpload,
}) => {
  const [applicantNote, setApplicantNote] = useState('');
  const [attachedResumeName, setAttachedResumeName] = useState(
    candidate.resumeFileName || `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState('');

  if (!isOpen || !job) return null;

  const match = job.match;

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appId = `APP-${job.logoText}-${Math.floor(10000 + Math.random() * 90000)}`;
    setGeneratedAppId(appId);
    onSubmitApplication(job.id, {
      note: applicantNote,
      resumeFile: attachedResumeName,
    });
    setIsSubmitted(true);
  };

  const companyPortalUrl =
    job.applyUrl ||
    `https://careers.${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/jobs/${job.id}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0"
              style={{ backgroundColor: job.logoBg || '#2563EB' }}
            >
              {job.logoText}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-blue-300">
                  Easy Apply Portal
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-300">{job.company}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-tight">
                {job.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <form onSubmit={handleApplySubmit} className="p-6 space-y-4">
            {/* Match Percentage Banner */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-[#EFF6FF] border border-blue-200">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#2563EB]" />
                <span className="text-xs font-bold text-[#0F172A]">
                  Candidate Profile Match Score:
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-[#16A34A] tabular-nums">
                  {match.overallScore}%
                </span>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  {match.matchTier}
                </span>
              </div>
            </div>

            {/* Pre-filled Applicant Information */}
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                Applicant Information (From Profile)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px]">Full Name</span>
                  <span className="font-bold text-[#0F172A]">{candidate.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Email Address</span>
                  <span className="text-slate-800 font-medium">{candidate.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Highest Qualification</span>
                  <span className="text-slate-800 font-medium">
                    {candidate.qualification || candidate.highestQualification}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Experience</span>
                  <span className="text-slate-800 font-medium">
                    {candidate.experienceYears === 0
                      ? 'Fresher (0 yrs)'
                      : `${candidate.experienceYears} Years`}
                  </span>
                </div>
              </div>
            </div>

            {/* Matched Skills for this role */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Matched Required Skills ({match.matchedSkills.length}/{job.requiredSkills.length})
                </span>
                <span className="text-[#16A34A] font-semibold text-[11px]">
                  {match.skillScore}% Competency Coverage
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.requiredSkills.map((s) => {
                  const isMatch = match.matchedSkills.includes(s);
                  return (
                    <span
                      key={s}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                        isMatch
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      {isMatch && <Check className="w-3 h-3 text-[#16A34A]" />}
                      <span>{s}</span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Attached Resume Section */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider text-[11px]">
                  Attached Resume Document
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenResumeUpload();
                  }}
                  className="text-xs font-semibold text-[#2563EB] hover:text-blue-800"
                >
                  Upload New Resume (PDF / DOC / DOCX)
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-[#EFF6FF] text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <div>
                    <span className="font-bold text-[#0F172A]">{attachedResumeName}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {candidate.resumeFileSize || 'PDF/DOCX Document · Ready to transmit'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Attached ✓
                </span>
              </div>
            </div>

            {/* Optional Note to Recruiter */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider text-[11px] mb-1">
                Note for Hiring Manager (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Share any specific interest in this role, project highlights, or earliest joining date..."
                value={applicantNote}
                onChange={(e) => setApplicantNote(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Direct Career Portal Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Verified Direct Campus Channel</span>
              </span>
              <a
                href={companyPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Apply on {job.company} Career Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Easy Application</span>
              </button>
            </div>
          </form>
        ) : (
          /* Submission Success State */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#0F172A]">
                Easy Application Submitted!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been transmitted with your attached resume.
              </p>
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-3 text-xs max-w-sm mx-auto space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">Tracking Reference:</span>
                <span className="font-mono font-bold text-[#0F172A]">{generatedAppId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold">{candidate.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Attached Resume:</span>
                <span className="font-medium text-blue-600 truncate max-w-[170px]">{attachedResumeName}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-6 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
