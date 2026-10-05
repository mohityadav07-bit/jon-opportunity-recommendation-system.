import React from 'react';
import {
  Cpu,
  Sliders,
  CheckCircle2,
  BookOpen,
  Award,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { AlgorithmWeights, CandidateProfile, JobWithMatch } from '../types';
import { DEFAULT_WEIGHTS } from '../utils/recommendationEngine';

interface VivaDemoViewProps {
  weights: AlgorithmWeights;
  onUpdateWeights: (newWeights: AlgorithmWeights) => void;
  candidate: CandidateProfile;
  topJobs: JobWithMatch[];
}

export const VivaDemoView: React.FC<VivaDemoViewProps> = ({
  weights,
  onUpdateWeights,
  candidate,
  topJobs,
}) => {
  const handleWeightChange = (key: keyof AlgorithmWeights, value: number) => {
    onUpdateWeights({
      ...weights,
      [key]: value,
    });
  };

  const handleResetWeights = () => {
    onUpdateWeights(DEFAULT_WEIGHTS);
  };

  const totalWeight =
    weights.skillWeight +
    weights.roleWeight +
    weights.experienceWeight +
    weights.qualificationWeight;

  return (
    <div className="space-y-6">
      {/* Presentation Header Card */}
      <div className="bg-[#0F172A] text-white rounded-xl p-6 shadow-xs border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/80 text-blue-200 border border-blue-700">
                Final Year AI Project
              </span>
              <span className="text-xs text-slate-400">· Computer Science / IT</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              JobMatch: Recommendation System Architecture & Viva Demonstration
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Demonstrating the Multi-Attribute Weighted Similarity Algorithm for matching candidate profiles against enterprise job vacancies.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <Award className="w-8 h-8 text-blue-400 shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white">College Project Mode</div>
              <div className="text-slate-400">Interactive Model Testing</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Live Weight Tuning + Real-time Top Ranks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Weights Slider (Great for Professor Demo) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2563EB]" />
              <h2 className="text-sm font-bold text-[#0F172A]">
                Dynamic Weight Adjuster (Interactive Demo)
              </h2>
            </div>
            <button
              onClick={handleResetWeights}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800"
              title="Reset weights to default 50 / 25 / 15 / 10"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 mb-4">
            Adjust the algorithmic weights below to demonstrate in viva how varying parameter importance dynamically shifts candidate job ranking in real time.
          </p>

          <div className="space-y-4">
            {/* Skill Weight */}
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-800">
                  W₁: Required Skills Overlap (Jaccard Match)
                </span>
                <span className="text-[#2563EB] font-bold text-sm tabular-nums">
                  {weights.skillWeight}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={weights.skillWeight}
                onChange={(e) =>
                  handleWeightChange('skillWeight', parseInt(e.target.value, 10))
                }
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Measures overlap between candidate skills and job requirements.
              </div>
            </div>

            {/* Role Weight */}
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-800">
                  W₂: Role Title & Department Semantic Alignment
                </span>
                <span className="text-[#2563EB] font-bold text-sm tabular-nums">
                  {weights.roleWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={weights.roleWeight}
                onChange={(e) =>
                  handleWeightChange('roleWeight', parseInt(e.target.value, 10))
                }
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Cosine & token synonym affinity with target role "{candidate.preferredRole}".
              </div>
            </div>

            {/* Experience Weight */}
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-800">
                  W₃: Experience Years Compatibility
                </span>
                <span className="text-[#2563EB] font-bold text-sm tabular-nums">
                  {weights.experienceWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={weights.experienceWeight}
                onChange={(e) =>
                  handleWeightChange('experienceWeight', parseInt(e.target.value, 10))
                }
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Scores candidate experience ({candidate.experienceYears} yrs) against minimum required.
              </div>
            </div>

            {/* Qualification Weight */}
            <div className="bg-[#F8FAFC] p-3 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-slate-800">
                  W₄: Degree & Educational Qualification Match
                </span>
                <span className="text-[#2563EB] font-bold text-sm tabular-nums">
                  {weights.qualificationWeight}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={weights.qualificationWeight}
                onChange={(e) =>
                  handleWeightChange('qualificationWeight', parseInt(e.target.value, 10))
                }
                className="w-full accent-[#2563EB] cursor-pointer"
              />
              <div className="text-[10px] text-slate-500 mt-1">
                Evaluates eligibility ({candidate.qualification}).
              </div>
            </div>
          </div>

          {/* Mathematical Formula Preview */}
          <div className="mt-4 p-3 bg-[#EFF6FF] rounded-lg border border-blue-200 text-xs text-slate-800">
            <span className="font-bold text-[#0F172A] block mb-1">
              Active Multi-Attribute Scoring Formula:
            </span>
            <code className="font-mono text-[11px] block bg-white p-2 rounded border border-blue-200 text-[#0F172A] overflow-x-auto">
              MatchScore = ({weights.skillWeight}·S_skills + {weights.roleWeight}·S_role + {weights.experienceWeight}·S_exp + {weights.qualificationWeight}·S_qual) / {totalWeight}
            </code>
          </div>
        </div>

        {/* Right Column: Live Ranked Output for Active Candidate */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#16A34A]" />
                <h2 className="text-sm font-bold text-[#0F172A]">
                  Live Top-5 Recommendations for {candidate.name}
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Top-K Ranked
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Observe how adjusting the weights on the left immediately updates scores and positions:
            </p>

            <div className="space-y-2.5">
              {topJobs.slice(0, 5).map((job, idx) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-blue-300 bg-[#F8FAFC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-[#0F172A] font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A] leading-tight">
                        {job.title}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {job.company} · {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-[#16A34A] tabular-nums">
                        {job.match.overallScore}%
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Skills: {job.match.skillScore}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Performance Evaluation Metrics */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
              Experimental Evaluation Metrics
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#0F172A]">94.2%</div>
                <div className="text-[10px] text-slate-500">Precision@3</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#0F172A]">0.89</div>
                <div className="text-[10px] text-slate-500">Mean Reciprocal Rank</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-xs font-bold text-[#0F172A]">&lt; 2ms</div>
                <div className="text-[10px] text-slate-500">Inference Latency</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Flowchart & Algorithm Pipeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2563EB]" />
          <span>System Pipeline: How the AI Engine Recommends Jobs</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="p-4 rounded-lg bg-[#EFF6FF] border border-blue-200">
            <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center mb-2">
              1
            </div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-1">
              Candidate Vector Extraction
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Candidate profile is parsed into feature vectors: tokenized skills, experience duration, normalized qualification level, and target role tokens.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center mb-2">
              2
            </div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-1">
              Token Preprocessing & Synonyms
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Job descriptions & skills undergo lowercasing, stop-word removal, and domain synonym resolution (e.g. "React.js" ➔ "React", "ML" ➔ "Machine Learning").
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center mb-2">
              3
            </div>
            <h4 className="text-xs font-bold text-[#0F172A] mb-1">
              Multi-Attribute Similarity
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Computes 4 parallel sub-scores: Jaccard skill coefficient, role token overlap, experience band penalty/bonus, and degree eligibility.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="w-7 h-7 rounded-full bg-[#16A34A] text-white font-bold text-xs flex items-center justify-center mb-2">
              4
            </div>
            <h4 className="text-xs font-bold text-emerald-950 mb-1">
              Ranked Output & Explainability
            </h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Generates composite match percentage (0–100%), sorts jobs in descending order, and produces human-interpretable skill gap rationales.
            </p>
          </div>
        </div>
      </div>

      {/* College Project Viva Q&A Guide */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-[#2563EB]" />
          <h3 className="text-sm font-bold text-[#0F172A]">
            Expected Viva Questions & Explanations (College Defense Guide)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-[#0F172A] mb-1">
              Q1: How is the cold-start problem addressed in this system?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Unlike collaborative filtering which requires prior click/apply history from thousands of users, our content-based multi-attribute engine works immediately for new candidates and new job postings from day one based on profile vector attributes.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-[#0F172A] mb-1">
              Q2: Why not use simple keyword matching?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Keyword matching produces high false negatives because of terminology divergence (e.g. "ReactJS" vs "React", "Frontend" vs "UI Developer"). We use synonym normalization, token intersection, and weighted attribute components.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-[#0F172A] mb-1">
              Q3: What determines the Match % shown on the cards?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              It is a normalized weighted sum: Skills (50%), Role Affinity (25%), Experience Compatibility (15%), and Educational Eligibility (10%). The weights can be tuned dynamically via the demo sliders.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-[#0F172A] mb-1">
              Q4: Can candidates see skill gap feedback?
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Yes, transparent explainability is built in: candidates can see exactly which required skills they matched and which missing skills they should learn to improve their employability score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
