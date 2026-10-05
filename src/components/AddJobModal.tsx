import React, { useState } from 'react';
import { X, Plus, Building, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddJob: (job: Job) => void;
}

export const AddJobModal: React.FC<AddJobModalProps> = ({
  isOpen,
  onClose,
  onAddJob,
}) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('Bangalore');
  const [workplaceType, setWorkplaceType] = useState<Job['workplaceType']>('Hybrid');
  const [salary, setSalary] = useState('₹6 - 10 LPA');
  const [experienceRequired, setExperienceRequired] = useState('0-1 Years');
  const [minExp, setMinExp] = useState(0);
  const [maxExp, setMaxExp] = useState(1);
  const [qualification, setQualification] = useState('B.Tech / B.E. in CS / IT or equivalent');
  const [skillsString, setSkillsString] = useState('React, JavaScript, Git');
  const [description, setDescription] = useState(
    'Seeking passionate software engineer to build modern frontend and backend services in an agile environment.'
  );
  const [department, setDepartment] = useState('Engineering');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim()) return;

    const parsedSkills = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const initials = company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 3)
      .toUpperCase() || 'CO';

    const newJob: Job = {
      id: `custom-job-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      logoText: initials,
      logoBg: '#2563EB',
      location,
      workplaceType,
      jobType: 'Full-Time',
      salary,
      experienceRequired,
      minExp,
      maxExp,
      qualification,
      requiredSkills: parsedSkills,
      preferredSkills: [],
      description,
      postedDate: 'Just now',
      openings: 2,
      department,
      applied: false,
      saved: false,
    };

    onAddJob(newJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-xl w-full overflow-hidden">
        <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold">Add New Job Opportunity</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500">
            Add a custom job posting to test how the AI recommendation engine scores and ranks it against candidate profiles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Junior Web Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Tata Consultancy Services"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Chennai">Chennai</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Workplace Type
              </label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Salary Package
              </label>
              <input
                type="text"
                placeholder="e.g. ₹6 - 9 LPA"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Band
              </label>
              <select
                value={experienceRequired}
                onChange={(e) => {
                  const val = e.target.value;
                  setExperienceRequired(val);
                  if (val === '0-1 Years') {
                    setMinExp(0);
                    setMaxExp(1);
                  } else if (val === '0-2 Years') {
                    setMinExp(0);
                    setMaxExp(2);
                  } else if (val === '1-3 Years') {
                    setMinExp(1);
                    setMaxExp(3);
                  } else {
                    setMinExp(2);
                    setMaxExp(5);
                  }
                }}
                className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="0-1 Years">0-1 Years (Fresher friendly)</option>
                <option value="0-2 Years">0-2 Years</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="2-4 Years">2-4 Years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Skills (comma-separated) *
            </label>
            <input
              type="text"
              placeholder="e.g. React, JavaScript, Node.js, SQL"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Required Qualification
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech / B.E. / MCA in CS / IT"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-md p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-blue-700 rounded-md shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add & Recalculate Ranks</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
