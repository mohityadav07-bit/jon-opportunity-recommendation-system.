import React from 'react';
import { Search, MapPin, Briefcase, Filter, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  selectedLocation: string;
  setSelectedLocation: (loc: string) => void;
  selectedSkill: string;
  setSelectedSkill: (skill: string) => void;
  minMatchScore: number;
  setMinMatchScore: (score: number) => void;
  sortBy: 'match' | 'salary' | 'experience' | 'company';
  setSortBy: (sort: 'match' | 'salary' | 'experience' | 'company') => void;
  allLocations: string[];
  allRoles: string[];
  allSkills: string[];
  totalResults: number;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedLocation,
  setSelectedLocation,
  selectedSkill,
  setSelectedSkill,
  minMatchScore,
  setMinMatchScore,
  sortBy,
  setSortBy,
  allLocations,
  allRoles,
  allSkills,
  totalResults,
  onResetFilters,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedRole !== 'ALL' ||
    selectedLocation !== 'ALL' ||
    selectedSkill !== 'ALL' ||
    minMatchScore > 0 ||
    sortBy !== 'match';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6">
      {/* Search Input and Sort Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-3">
        {/* Search Input */}
        <div className="md:col-span-8 relative">
          <label htmlFor="search-input" className="sr-only">
            Search opportunities
          </label>
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by job title, company name, technology (e.g. React, Python, Razorpay)..."
            className="w-full pl-10 pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[#F8FAFC] focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="md:col-span-4 flex items-center gap-2">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-600 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
          >
            <option value="match">Match % (AI Recommended)</option>
            <option value="salary">Salary (High to Low)</option>
            <option value="experience">Experience (Fresher First)</option>
            <option value="company">Company (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Selectors Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {/* Role Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Job Role
          </label>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Roles ({allRoles.length})</option>
              {allRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Locations ({allLocations.length})</option>
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Required Skill Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Skill Requirement
          </label>
          <div className="relative">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">Any Skill ({allSkills.length})</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Minimum Match % */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Min Match Score
            </label>
            <span className="text-xs font-bold text-[#16A34A]">
              {minMatchScore > 0 ? `${minMatchScore}%+` : 'All'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="80"
            step="10"
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(parseInt(e.target.value, 10))}
            className="w-full accent-[#2563EB] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
            <span>0%</span>
            <span>40%</span>
            <span>80%</span>
          </div>
        </div>
      </div>

      {/* Filter Status & Reset Action */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#0F172A]">
            Showing {totalResults} {totalResults === 1 ? 'Job' : 'Jobs'}
          </span>
          {minMatchScore > 0 && (
            <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
              Score ≥ {minMatchScore}%
            </span>
          )}
          {selectedRole !== 'ALL' && (
            <span className="text-[11px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
              Role: {selectedRole}
            </span>
          )}
          {selectedLocation !== 'ALL' && (
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {selectedLocation}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[11px] text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <X className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
