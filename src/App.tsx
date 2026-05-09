import { useState } from 'react';
import { Sparkles, FileText, CheckCircle, Zap, ShieldCheck, Mail } from 'lucide-react';
import { ResumeData, ATSOptimizationResult, CoverLetterResult } from './types';
import { optimizeResume, optimizeCoverLetter } from './services/gemini';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import CoverLetterPreview from './components/CoverLetterPreview';
import { cn } from './lib/utils';
console.log("Check API Key:", import.meta.env.VITE_GEMINI_API_KEY);

const INITIAL_DATA: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  summary: '',
};

export default function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA);
  const [optimization, setOptimization] = useState<ATSOptimizationResult | undefined>();
  const [coverLetter, setCoverLetter] = useState<CoverLetterResult | undefined>();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [started, setStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'resume' | 'cover-letter'>('resume');

  const handleOptimize = async (jobDescription: string) => {
    setIsOptimizing(true);
    try {
      const [resumeResult, letterResult] = await Promise.all([
        optimizeResume(data, jobDescription),
        optimizeCoverLetter(data, jobDescription)
      ]);
      setOptimization(resumeResult);
      setCoverLetter(letterResult);
    } catch (error) {
      console.error(error);
      alert('Failed to optimize content. Please check your API key or connection.');
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-4xl w-full text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-widest animate-bounce">
              <Sparkles size={14} /> AI Powered
            </div>
            <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">
              ResuBeat<span className="text-slate-400">.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Generate 100% ATS-optimized resumes and cover letters that beat any tracker. 
              Our AI intelligently transforms your experience into a candidate profiles robots can't ignore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            {[
              { icon: Zap, title: "Speed", desc: "Optimized in seconds" },
              { icon: ShieldCheck, title: "Security", desc: "Bot-proof formatting" },
              { icon: CheckCircle, title: "Success", desc: "Higher callback rate" }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-transform hover:-translate-y-1 cursor-default">
                <div className="p-2 mb-4 bg-slate-50 rounded-lg w-fit text-slate-900">
                  <feature.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-snug">{feature.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="group px-12 py-5 bg-slate-900 text-white rounded-3xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3 mx-auto active:scale-95"
          >
            Start Building
            <FileText className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 lg:p-12">
      <header className="max-w-7xl mx-auto mb-10 flex items-center justify-between print:hidden">
        <button 
          onClick={() => setStarted(false)} 
          className="text-2xl font-black text-slate-900 tracking-tighter hover:opacity-70 transition-opacity"
        >
          ResuBeat<span className="text-slate-400">.</span>
        </button>
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> ATS Protected</span>
          <span className="flex items-center gap-1.5"><Sparkles size={14} /> AI Engine Active</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 h-[calc(100vh-180px)] print:block print:h-auto">
        <div className="h-full min-h-0 print:hidden">
          <ResumeForm
            data={data}
            onChange={setData}
            onSubmit={handleOptimize}
            isOptimizing={isOptimizing}
          />
        </div>
        <div className="h-full min-h-0 flex flex-col gap-4 print:block print:h-auto">
          <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit print:hidden">
            <button
              onClick={() => setActiveTab('resume')}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === 'resume' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <FileText size={14} /> Resume
            </button>
            <button
              onClick={() => setActiveTab('cover-letter')}
              className={cn(
                "px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                activeTab === 'cover-letter' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Mail size={14} /> Cover Letter
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden print:overflow-visible print:block">
            {activeTab === 'resume' ? (
              <ResumePreview
                data={data}
                optimization={optimization}
              />
            ) : (
              <CoverLetterPreview
                data={data}
                coverLetter={coverLetter}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest print:hidden">
        <div>© 2026 RESUBEAT AI SYSTEMS</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
