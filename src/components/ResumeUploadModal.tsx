import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  FileCode,
  Tag,
  ArrowRight,
  RefreshCw,
  Plus,
  Check
} from 'lucide-react';
import { CandidateProfile } from '../types';
import {
  readResumeFile,
  parseResumeContent,
  ParsedResumeData,
  SAMPLE_RESUMES
} from '../utils/resumeParser';

interface ResumeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsedCandidate: (
    candidate: CandidateProfile,
    actionType: 'updateCurrent' | 'createNew'
  ) => void;
  currentCandidateName: string;
}

export const ResumeUploadModal: React.FC<ResumeUploadModalProps> = ({
  isOpen,
  onClose,
  onApplyParsedCandidate,
  currentCandidateName,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [applyMode, setApplyMode] = useState<'updateCurrent' | 'createNew'>('updateCurrent');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setParsedData(null);

    const fileSizeFormatted = `${(file.size / 1024).toFixed(1)} KB`;

    try {
      setProcessingStep('Reading document binary stream (PDF / DOC / DOCX / TXT)...');
      await new Promise((r) => setTimeout(r, 400));

      const { text, fileType } = await readResumeFile(file);

      setProcessingStep('Analyzing text structure, sections, and entity patterns...');
      await new Promise((r) => setTimeout(r, 450));

      setProcessingStep('Extracting skills, highest qualification, experience & target role...');
      await new Promise((r) => setTimeout(r, 350));

      const parsed = parseResumeContent(text, file.name, fileSizeFormatted, fileType);
      setParsedData(parsed);
      setIsProcessing(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'Could not parse file. Please upload a standard .pdf, .doc, .docx, or .txt resume.'
      );
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Load pre-configured sample resume for instant demonstration
  const handleLoadSampleResume = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find((s) => s.id === sampleId);
    if (!sample) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingStep(`Parsing sample resume: ${sample.fileName}...`);

    setTimeout(() => {
      const parsed = parseResumeContent(
        sample.textContent,
        sample.fileName,
        sample.fileSize,
        sample.fileType
      );
      setParsedData(parsed);
      setIsProcessing(false);
    }, 600);
  };

  // Add / Remove skill in preview
  const handleAddSkillToPreview = () => {
    if (!parsedData || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!parsedData.skills.includes(trimmed)) {
      setParsedData({
        ...parsedData,
        skills: [...parsedData.skills, trimmed],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkillFromPreview = (skillToRemove: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      skills: parsedData.skills.filter((s) => s !== skillToRemove),
    });
  };

  // Final confirmation to apply candidate & calculate recommendations
  const handleFinalSubmit = () => {
    if (!parsedData) return;

    const candidateProfile: CandidateProfile = {
      id: applyMode === 'createNew' ? `cand-${Date.now()}` : 'active-candidate',
      name: parsedData.name,
      email: parsedData.email,
      phone: parsedData.phone,
      qualification: parsedData.highestQualification,
      highestQualification: parsedData.highestQualification,
      experienceYears: parsedData.experienceYears,
      experienceLevel: parsedData.experienceLevel,
      preferredRole: parsedData.preferredRole,
      preferredLocation: parsedData.preferredLocation,
      skills: parsedData.skills,
      bio: parsedData.summary,
      resumeFileName: parsedData.fileName,
      resumeFileSize: parsedData.fileSize,
      resumeUploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onApplyParsedCandidate(candidateProfile, applyMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Resume Upload & AI Recommendation</h3>
              <p className="text-[11px] text-slate-300">
                Supports multiple formats: PDF (.pdf), Word Document (.doc, .docx) & Text (.txt)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!parsedData && !isProcessing && (
            <div>
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-[#2563EB] bg-blue-50/70'
                    : 'border-slate-300 hover:border-[#2563EB] hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3 border border-blue-100">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h4 className="text-sm font-bold text-[#0F172A] mb-1">
                  Click to select your resume or drag and drop
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Accepts <strong>.PDF</strong>, <strong>.DOC</strong>, <strong>.DOCX</strong>, or <strong>.TXT</strong> (Max 10 MB)
                </p>

                <div className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                  <span>📄 Multi-Format Resume Parser Ready</span>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* College Presentation Quick Demo Resumes */}
              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Quick Demo: Load College Sample Resumes</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Instant test without file upload
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SAMPLE_RESUMES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleLoadSampleResume(sample.id)}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors bg-white flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A] mb-1">
                          <FileText className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                          <span className="truncate">{sample.fileName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mb-2">
                          {sample.targetProfile}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                        <span className="font-semibold text-blue-600">
                          {sample.fileType.split(' ')[0]}
                        </span>
                        <span>{sample.fileSize}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-blue-200 border-t-[#2563EB] animate-spin mx-auto"></div>
              <h4 className="text-sm font-bold text-[#0F172A]">
                AI Parser Extracting Resume Entities...
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">{processingStep}</p>
            </div>
          )}

          {/* Parsed Results Review */}
          {parsedData && !isProcessing && (
            <div className="space-y-4">
              {/* File Info & Confidence Banner */}
              <div className="bg-[#EFF6FF] border border-blue-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#0F172A]">
                        Resume Successfully Parsed
                      </h4>
                      <span className="text-[10px] font-bold bg-emerald-100 text-[#16A34A] border border-emerald-300 px-2 py-0.5 rounded">
                        {parsedData.confidenceScore}% Confidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      File: <strong>{parsedData.fileName}</strong> ({parsedData.fileSize} · {parsedData.fileType})
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setParsedData(null)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Upload Another</span>
                </button>
              </div>

              {/* Extracted Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Extracted Name */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Candidate Full Name
                  </label>
                  <input
                    type="text"
                    value={parsedData.name}
                    onChange={(e) =>
                      setParsedData({ ...parsedData, name: e.target.value })
                    }
                    className="w-full font-bold text-[#0F172A] bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Preferred Job Role */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Inferred Target Job Role
                  </label>
                  <input
                    type="text"
                    value={parsedData.preferredRole}
                    onChange={(e) =>
                      setParsedData({ ...parsedData, preferredRole: e.target.value })
                    }
                    className="w-full font-bold text-[#0F172A] bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Highest Qualification */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    value={parsedData.highestQualification}
                    onChange={(e) =>
                      setParsedData({
                        ...parsedData,
                        highestQualification: e.target.value,
                      })
                    }
                    className="w-full font-medium text-slate-800 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Years of Experience */}
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                  <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Years of Experience
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="15"
                      value={parsedData.experienceYears}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setParsedData({
                          ...parsedData,
                          experienceYears: val,
                        });
                      }}
                      className="w-full font-bold text-[#0F172A] bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="text-slate-500 font-medium whitespace-nowrap">
                      {parsedData.experienceYears === 0 ? 'Fresher' : 'Years'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Extracted Skills List */}
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Extracted Technical Skills ({parsedData.skills.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Will be matched against job corpus
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {parsedData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium bg-[#EFF6FF] text-[#1E293B] border border-blue-200"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveSkillFromPreview(skill)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Custom Skill input */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <input
                    type="text"
                    placeholder="Add missing skill..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkillToPreview();
                      }
                    }}
                    className="text-xs border border-slate-300 rounded px-2.5 py-1.5 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddSkillToPreview}
                    className="px-3 py-1.5 text-xs font-semibold bg-[#2563EB] hover:bg-blue-700 text-white rounded transition-colors"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Target Profile Mode Selection */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                <span className="font-bold text-[#0F172A] block mb-2">
                  Recommendation Application Mode:
                </span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applyMode"
                      checked={applyMode === 'updateCurrent'}
                      onChange={() => setApplyMode('updateCurrent')}
                      className="accent-[#2563EB]"
                    />
                    <span>
                      Apply to Active Profile (<strong>{currentCandidateName}</strong>)
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="applyMode"
                      checked={applyMode === 'createNew'}
                      onChange={() => setApplyMode('createNew')}
                      className="accent-[#2563EB]"
                    />
                    <span>
                      Save as New Candidate Profile (<strong>{parsedData.name}</strong>)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
          >
            Cancel
          </button>

          {parsedData && (
            <button
              onClick={handleFinalSubmit}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <span>Get Job Recommendations from Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
