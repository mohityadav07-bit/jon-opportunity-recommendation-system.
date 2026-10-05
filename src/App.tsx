import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { CandidateProfileCard } from './components/CandidateProfileCard';
import { CandidateModal } from './components/CandidateModal';
import { FilterBar } from './components/FilterBar';
import { JobCard } from './components/JobCard';
import { JobDetailModal } from './components/JobDetailModal';
import { AddJobModal } from './components/AddJobModal';
import { VivaDemoView } from './components/VivaDemoView';
import { CandidateProfileFullView } from './components/CandidateProfileFullView';
import { AllJobsView } from './components/AllJobsView';
import { SAMPLE_CANDIDATES, INITIAL_JOBS } from './data/mockData';
import { CandidateProfile, Job, JobWithMatch, AlgorithmWeights } from './types';
import { computeJobMatch, DEFAULT_WEIGHTS } from './utils/recommendationEngine';
import { Sparkles, CheckCircle2, Bookmark, Info, GraduationCap, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // Candidate Profile State
  const [candidates, setCandidates] = useState<CandidateProfile[]>(SAMPLE_CANDIDATES);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(SAMPLE_CANDIDATES[0].id);

  // Job Corpus State
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);

  // Algorithm Weights (tunable during college demo)
  const [weights, setWeights] = useState<AlgorithmWeights>(DEFAULT_WEIGHTS);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'recommendations' | 'profile' | 'allJobs' | 'vivaDemo'>('recommendations');

  // Modals
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobWithMatch | null>(null);
  const [isAddJobOpen, setIsAddJobOpen] = useState(false);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<CandidateProfile | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [selectedSkill, setSelectedSkill] = useState('ALL');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'experience' | 'company'>('match');

  // Feedback Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Find active candidate object
  const currentCandidate = useMemo(() => {
    return candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  }, [candidates, selectedCandidateId]);

  // Compute recommendation scores for all jobs against the current candidate & weights
  const jobsWithMatches: JobWithMatch[] = useMemo(() => {
    return jobs.map((job) => {
      const match = computeJobMatch(job, currentCandidate, weights);
      return {
        ...job,
        match,
      };
    });
  }, [jobs, currentCandidate, weights]);

  // Derive unique filter lists
  const allLocations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location))).sort();
  }, [jobs]);

  const allRoles = useMemo(() => {
    const roles = jobs.map((j) => {
      if (j.title.toLowerCase().includes('frontend')) return 'Frontend';
      if (j.title.toLowerCase().includes('backend')) return 'Backend';
      if (j.title.toLowerCase().includes('full stack')) return 'Full Stack';
      if (j.title.toLowerCase().includes('data')) return 'Data & Analytics';
      if (j.title.toLowerCase().includes('qa') || j.title.toLowerCase().includes('test')) return 'QA Testing';
      if (j.title.toLowerCase().includes('cloud') || j.title.toLowerCase().includes('devops')) return 'DevOps / Cloud';
      return 'Software Engineering';
    });
    return Array.from(new Set(roles)).sort();
  }, [jobs]);

  const allSkills = useMemo(() => {
    const skillSet = new Set<string>();
    jobs.forEach((j) => {
      j.requiredSkills.forEach((s) => skillSet.add(s));
    });
    return Array.from(skillSet).sort();
  }, [jobs]);

  // Filter & Sort Recommended Jobs
  const filteredAndSortedJobs: JobWithMatch[] = useMemo(() => {
    let result = jobsWithMatches.filter((job) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesLocation = job.location.toLowerCase().includes(q);
        const matchesSkills = job.requiredSkills.some((s) =>
          s.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesCompany && !matchesLocation && !matchesSkills) {
          return false;
        }
      }

      // Role category filter
      if (selectedRole !== 'ALL') {
        const titleLower = job.title.toLowerCase();
        if (selectedRole === 'Frontend' && !titleLower.includes('frontend') && !titleLower.includes('ui') && !titleLower.includes('react')) return false;
        if (selectedRole === 'Backend' && !titleLower.includes('backend') && !titleLower.includes('node') && !titleLower.includes('python')) return false;
        if (selectedRole === 'Full Stack' && !titleLower.includes('full stack') && !titleLower.includes('mern')) return false;
        if (selectedRole === 'Data & Analytics' && !titleLower.includes('data') && !titleLower.includes('analyst') && !titleLower.includes('intelligence')) return false;
        if (selectedRole === 'QA Testing' && !titleLower.includes('qa') && !titleLower.includes('test') && !titleLower.includes('sdet')) return false;
        if (selectedRole === 'DevOps / Cloud' && !titleLower.includes('cloud') && !titleLower.includes('devops')) return false;
      }

      // Location filter
      if (selectedLocation !== 'ALL' && job.location !== selectedLocation) {
        return false;
      }

      // Skill filter
      if (selectedSkill !== 'ALL' && !job.requiredSkills.includes(selectedSkill)) {
        return false;
      }

      // Min Match % filter
      if (minMatchScore > 0 && job.match.overallScore < minMatchScore) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'match') {
        return b.match.overallScore - a.match.overallScore;
      }
      if (sortBy === 'salary') {
        // Simple extraction of high range number
        const getHigh = (s: string) => {
          const num = s.match(/₹([0-9.]+)/);
          return num ? parseFloat(num[1]) : 0;
        };
        return getHigh(b.salary) - getHigh(a.salary);
      }
      if (sortBy === 'experience') {
        return a.minExp - b.minExp;
      }
      if (sortBy === 'company') {
        return a.company.localeCompare(b.company);
      }
      return 0;
    });

    return result;
  }, [jobsWithMatches, searchQuery, selectedRole, selectedLocation, selectedSkill, minMatchScore, sortBy]);

  // Handler: Candidate Update
  const handleUpdateCandidate = (updated: CandidateProfile) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    showToast(`Updated candidate profile for ${updated.name}. Rankings refreshed!`);
  };

  // Handler: Open Create Candidate Modal
  const handleOpenCreateCandidate = () => {
    setCandidateToEdit(null);
    setIsCandidateModalOpen(true);
  };

  // Handler: Open Edit Candidate Modal
  const handleOpenEditCandidate = (cand: CandidateProfile) => {
    setCandidateToEdit(cand);
    setIsCandidateModalOpen(true);
  };

  // Handler: Save from CandidateModal (Create or Edit)
  const handleSaveCandidateModal = (candidateData: CandidateProfile) => {
    if (candidateToEdit) {
      // Edit existing
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateData.id ? candidateData : c))
      );
      showToast(`Updated profile for ${candidateData.name}. Rankings refreshed!`);
    } else {
      // Create new
      setCandidates((prev) => [candidateData, ...prev]);
      setSelectedCandidateId(candidateData.id);
      showToast(`Created new profile for ${candidateData.name}! Set as active.`);
    }
  };

  // Handler: Delete Candidate Profile
  const handleDeleteCandidate = (candidateId: string) => {
    if (candidates.length <= 1) {
      showToast('Cannot delete the last remaining candidate profile.');
      return;
    }

    const target = candidates.find((c) => c.id === candidateId);
    const remaining = candidates.filter((c) => c.id !== candidateId);
    setCandidates(remaining);

    // If active candidate was deleted, switch to the first remaining candidate
    if (selectedCandidateId === candidateId) {
      setSelectedCandidateId(remaining[0].id);
      showToast(`Deleted ${target?.name || 'profile'}. Active profile switched to ${remaining[0].name}.`);
    } else {
      showToast(`Deleted profile for ${target?.name || 'candidate'}.`);
    }
  };

  // Handler: Restore Sample Candidates
  const handleRestoreSampleCandidates = () => {
    setCandidates(SAMPLE_CANDIDATES);
    setSelectedCandidateId(SAMPLE_CANDIDATES[0].id);
    showToast('Restored initial sample candidate profiles.');
  };

  // Handler: Candidate Reset
  const handleResetCandidate = () => {
    const original = SAMPLE_CANDIDATES.find((c) => c.id === currentCandidate.id);
    if (original) {
      handleUpdateCandidate(original);
      showToast('Profile restored to initial state.');
    } else {
      showToast('Current profile is custom-created.');
    }
  };

  // Handler: Toggle Save Job
  const handleToggleSave = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j))
    );
    const targetJob = jobs.find((j) => j.id === jobId);
    if (targetJob && !targetJob.saved) {
      showToast(`Shortlisted "${targetJob.title}" at ${targetJob.company}`);
    }
  };

  // Handler: Apply for Job
  const handleApply = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applied: true } : j))
    );
    const targetJob = jobs.find((j) => j.id === jobId);
    if (targetJob) {
      showToast(`Application submitted successfully for ${targetJob.title}!`);
    }
    // Update active modal instance if opened
    if (selectedJobForModal && selectedJobForModal.id === jobId) {
      setSelectedJobForModal({
        ...selectedJobForModal,
        applied: true,
      });
    }
  };

  // Handler: Add New Job
  const handleAddJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`Added "${newJob.title}" to database! Recalculated rankings.`);
  };

  // Handler: Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('ALL');
    setSelectedLocation('ALL');
    setSelectedSkill('ALL');
    setMinMatchScore(0);
    setSortBy('match');
  };

  // Saved & Applied lists
  const savedJobs = jobsWithMatches.filter((j) => j.saved);
  const appliedJobs = jobsWithMatches.filter((j) => j.applied);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F172A] text-white text-xs font-semibold px-4 py-3 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce-in">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        candidates={candidates}
        selectedCandidate={currentCandidate}
        onSelectCandidate={(cand) => {
          setSelectedCandidateId(cand.id);
          showToast(`Switched active candidate to ${cand.name}`);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddJob={() => setIsAddJobOpen(true)}
        onOpenCreateCandidate={handleOpenCreateCandidate}
        recommendedCount={jobs.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VIEW 1: RECOMMENDATIONS (MAIN HOME VIEW) */}
        {activeTab === 'recommendations' && (
          <div>
            {/* Active Candidate Profile Card on Home Page */}
            <CandidateProfileCard
              candidate={currentCandidate}
              onUpdateCandidate={handleUpdateCandidate}
              onResetCandidate={handleResetCandidate}
              onCreateCandidate={handleOpenCreateCandidate}
              onViewAllCandidates={() => setActiveTab('profile')}
            />

            {/* Project Notice Banner for Viva Presentation */}
            <div className="mb-6 p-4 rounded-xl bg-white border border-blue-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#0F172A]">
                    AI Recommendation Engine Active
                  </h3>
                  <p className="text-xs text-slate-600">
                    Showing top opportunities ranked by multi-attribute similarity against{' '}
                    <strong>{currentCandidate.name}</strong>'s qualification, skills, and target role.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('vivaDemo')}
                  className="text-xs font-semibold text-[#2563EB] hover:text-blue-800 bg-blue-50 hover:bg-blue-100/80 border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Tune Weights / Viva Demo →
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              selectedSkill={selectedSkill}
              setSelectedSkill={setSelectedSkill}
              minMatchScore={minMatchScore}
              setMinMatchScore={setMinMatchScore}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allLocations={allLocations}
              allRoles={allRoles}
              allSkills={allSkills}
              totalResults={filteredAndSortedJobs.length}
              onResetFilters={handleResetFilters}
            />

            {/* Recommendations Job Grid */}
            {filteredAndSortedJobs.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
                <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#0F172A] mb-1">
                  No matching job opportunities found
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
                  No job matches the selected filter criteria or minimum match score. Try lowering the score threshold or clearing search filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAndSortedJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    rank={index + 1}
                    onSelectJob={(j) => setSelectedJobForModal(j)}
                    onToggleSave={handleToggleSave}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: FULL CANDIDATE PROFILE */}
        {activeTab === 'profile' && (
          <CandidateProfileFullView
            candidate={currentCandidate}
            allCandidates={candidates}
            onSelectCandidate={(c) => {
              setSelectedCandidateId(c.id);
              showToast(`Switched active candidate to ${c.name}`);
            }}
            onUpdateCandidate={handleUpdateCandidate}
            onCreateCandidate={handleOpenCreateCandidate}
            onEditCandidate={handleOpenEditCandidate}
            onDeleteCandidate={handleDeleteCandidate}
            onRestoreSampleCandidates={handleRestoreSampleCandidates}
            savedJobs={savedJobs}
            appliedJobs={appliedJobs}
            onSelectJob={(j) => setSelectedJobForModal(j)}
          />
        )}

        {/* VIEW 3: ALL JOBS DATABASE */}
        {activeTab === 'allJobs' && (
          <AllJobsView
            jobs={jobsWithMatches}
            onSelectJob={(j) => setSelectedJobForModal(j)}
            onOpenAddJob={() => setIsAddJobOpen(true)}
          />
        )}

        {/* VIEW 4: VIVA & ALGORITHM DEMO VIEW */}
        {activeTab === 'vivaDemo' && (
          <VivaDemoView
            weights={weights}
            onUpdateWeights={(newWeights) => {
              setWeights(newWeights);
              showToast('Algorithmic weights updated! Ranks refreshed.');
            }}
            candidate={currentCandidate}
            topJobs={filteredAndSortedJobs}
          />
        )}
      </main>

      {/* College Project Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[#0F172A]">JobMatch</span>
            <span className="text-slate-400 mx-1.5">·</span>
            <span>College AI Project: Job Opportunity Recommendation System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Algorithm: Multi-Attribute Weighted Similarity (Jaccard + Token Overlap)</span>
            <span>·</span>
            <span className="text-[#16A34A] font-semibold">Ready for Viva & Presentation</span>
          </div>
        </div>
      </footer>

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <JobDetailModal
          job={selectedJobForModal}
          candidate={currentCandidate}
          onClose={() => setSelectedJobForModal(null)}
          onApply={handleApply}
          onToggleSave={handleToggleSave}
        />
      )}

      {/* Add Custom Job Modal */}
      <AddJobModal
        isOpen={isAddJobOpen}
        onClose={() => setIsAddJobOpen(false)}
        onAddJob={handleAddJob}
      />

      {/* Create / Edit Candidate Modal */}
      <CandidateModal
        isOpen={isCandidateModalOpen}
        onClose={() => {
          setIsCandidateModalOpen(false);
          setCandidateToEdit(null);
        }}
        onSave={handleSaveCandidateModal}
        candidateToEdit={candidateToEdit}
      />
    </div>
  );
}
