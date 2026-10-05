import React from 'react';
import { Briefcase, UserCheck, Sparkles, Plus, BookOpen, Layers } from 'lucide-react';
import { CandidateProfile } from '../types';

interface NavbarProps {
  candidates: CandidateProfile[];
  selectedCandidate: CandidateProfile;
  onSelectCandidate: (candidate: CandidateProfile) => void;
  activeTab: 'recommendations' | 'profile' | 'allJobs' | 'vivaDemo';
  setActiveTab: (tab: 'recommendations' | 'profile' | 'allJobs' | 'vivaDemo') => void;
  onOpenAddJob: () => void;
  onOpenCreateCandidate: () => void;
  recommendedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  candidates,
  selectedCandidate,
  onSelectCandidate,
  activeTab,
  setActiveTab,
  onOpenAddJob,
  onOpenCreateCandidate,
  recommendedCount,
}) => {
  return (
    <header className="bg-[#0F172A] text-white sticky top-0 z-40 shadow-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center font-bold text-white shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold tracking-tight text-white">JobMatch</span>
                  <span className="text-[11px] font-medium bg-blue-950 text-blue-300 border border-blue-800/80 px-2 py-0.5 rounded">
                    AI Project
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-none hidden sm:block">
                  Recommendation System
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'recommendations'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommendations</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">
                {recommendedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Candidates</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-black/20 rounded-full">
                {candidates.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('allJobs')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'allJobs'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Jobs Database</span>
            </button>

            <button
              onClick={() => setActiveTab('vivaDemo')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'vivaDemo'
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Viva & Algorithm Demo</span>
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Candidate Selector for College Demo */}
            <div className="relative">
              <label htmlFor="candidate-select" className="sr-only">
                Select Candidate
              </label>
              <select
                id="candidate-select"
                value={selectedCandidate.id}
                onChange={(e) => {
                  const found = candidates.find((c) => c.id === e.target.value);
                  if (found) onSelectCandidate(found);
                }}
                className="bg-slate-800 text-xs text-white border border-slate-700 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium cursor-pointer"
                title="Switch candidate profile to demonstrate dynamic recommendation changes"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.preferredRole.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Add Candidate Button */}
            <button
              onClick={onOpenCreateCandidate}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white rounded-md transition-colors whitespace-nowrap"
              title="Create a new candidate profile"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Candidate</span>
            </button>

            {/* Add Job Button */}
            <button
              onClick={onOpenAddJob}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#2563EB] hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors whitespace-nowrap"
              title="Add a custom job posting to test recommendations"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden flex border-t border-slate-800 bg-slate-900/95 px-2 py-1.5 justify-around text-center">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-2.5 py-1 text-xs rounded font-medium ${
            activeTab === 'recommendations' ? 'text-white bg-blue-600' : 'text-slate-400'
          }`}
        >
          Recommendations
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-2.5 py-1 text-xs rounded font-medium ${
            activeTab === 'profile' ? 'text-white bg-blue-600' : 'text-slate-400'
          }`}
        >
          Candidate
        </button>
        <button
          onClick={() => setActiveTab('allJobs')}
          className={`px-2.5 py-1 text-xs rounded font-medium ${
            activeTab === 'allJobs' ? 'text-white bg-blue-600' : 'text-slate-400'
          }`}
        >
          Jobs ({recommendedCount})
        </button>
        <button
          onClick={() => setActiveTab('vivaDemo')}
          className={`px-2.5 py-1 text-xs rounded font-medium ${
            activeTab === 'vivaDemo' ? 'text-white bg-blue-600' : 'text-slate-400'
          }`}
        >
          Algorithm Demo
        </button>
      </div>
    </header>
  );
};
