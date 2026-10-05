import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  GraduationCap,
  MapPin,
  Clock,
  Plus
} from 'lucide-react';
import { JobWithMatch } from '../types';

interface AllJobsViewProps {
  jobs: JobWithMatch[];
  onSelectJob: (job: JobWithMatch) => void;
  onOpenAddJob: () => void;
}

export const AllJobsView: React.FC<AllJobsViewProps> = ({
  jobs,
  onSelectJob,
  onOpenAddJob,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept =
      filterDept === 'ALL' || job.department.toLowerCase() === filterDept.toLowerCase();

    return matchesSearch && matchesDept;
  });

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Job Corpus Database
              </span>
              <span className="text-xs text-slate-500">· {jobs.length} Total Postings</span>
            </div>
            <h1 className="text-xl font-bold text-[#0F172A]">
              Comprehensive Job Corpus & Multi-Attribute Database
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Browse the complete repository of job vacancies with active candidate match scoring.
            </p>
          </div>

          <button
            onClick={onOpenAddJob}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job</span>
          </button>
        </div>

        {/* Search & Dept Filter */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <input
              type="text"
              placeholder="Filter by title, company, technology (e.g. Python, Razorpay)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-3 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Database Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0F172A] text-white border-b border-slate-700">
                <th className="py-3 px-4 font-semibold">Job Title & Company</th>
                <th className="py-3 px-3 font-semibold">Location</th>
                <th className="py-3 px-3 font-semibold">Experience</th>
                <th className="py-3 px-3 font-semibold">Required Skills</th>
                <th className="py-3 px-3 font-semibold text-right">Match %</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => onSelectJob(job)}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0F172A] hover:text-[#2563EB]">
                      {job.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{job.company}</div>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-600">
                    <div>{job.location}</div>
                    <span className="text-[10px] text-slate-400">{job.workplaceType}</span>
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                    {job.experienceRequired}
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {job.requiredSkills.map((s) => {
                        const isMatched = job.match.matchedSkills.includes(s);
                        return (
                          <span
                            key={s}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                              isMatched
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right whitespace-nowrap">
                    <span className="text-sm font-extrabold text-[#16A34A] tabular-nums">
                      {job.match.overallScore}%
                    </span>
                    <div className="text-[10px] text-slate-400">
                      {job.match.matchTier}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 rounded transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
