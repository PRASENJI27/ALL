import { Download, CheckCircle2, AlertCircle, Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';
import { ResumeData, CoverLetterResult } from '../types';
import { cn } from '../lib/utils';

interface Props {
  data: ResumeData;
  coverLetter?: CoverLetterResult;
}

export default function CoverLetterPreview({ data, coverLetter }: Props) {
  const handleDownload = () => {
    window.print();
  };

  if (!coverLetter) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
        <p className="font-medium">Optimize a job description to generate your cover letter</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      {/* ATS Score Header */}
      <div className={cn(
        "p-6 rounded-2xl flex flex-col gap-4 border",
        coverLetter.atsScore >= 80 ? "bg-green-50 border-green-100" : "bg-yellow-50 border-yellow-100"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              coverLetter.atsScore >= 80 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
            )}>
              {coverLetter.atsScore >= 80 ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Cover Letter Score</h3>
              <p className="text-sm text-slate-500">Persuasion and keywords match</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-slate-900">{coverLetter.atsScore}%</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Match Score</div>
          </div>
        </div>
      </div>

      {/* The Letter */}
      <div className="flex-1 bg-white shadow-2xl rounded-sm p-16 overflow-y-auto print:shadow-none print:p-0 print:overflow-visible font-sans text-[#1a1a1a] border border-slate-100 print:border-none" style={{ fontFamily: '"Inter", "Arial", sans-serif' }}>
        <header className="mb-10">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
            {data.personalInfo.fullName || "Your Full Name"}
          </h1>
          <div className="text-[11px] text-slate-700 flex flex-col gap-1">
            {data.personalInfo.location && (
              <span className="flex items-center gap-1"><MapPin size={10} className="text-slate-400" /> {data.personalInfo.location}</span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1"><Phone size={10} className="text-slate-400" /> {data.personalInfo.phone}</span>
            )}
            {data.personalInfo.email && (
              <span className="flex items-center gap-1"><Mail size={10} className="text-slate-400" /> {data.personalInfo.email}</span>
            )}
            {data.personalInfo.linkedin && (
              <span className="flex items-center gap-1"><Linkedin size={10} className="text-slate-400" /> {data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo.github && (
              <span className="flex items-center gap-1"><Github size={10} className="text-slate-400" /> {data.personalInfo.github}</span>
            )}
          </div>
        </header>

        <div className="text-[13px] leading-relaxed whitespace-pre-wrap text-slate-800">
          {coverLetter.content}
        </div>

        <div className="mt-12 text-[13px] text-slate-800">
          <p>Sincerely,</p>
          <p className="font-bold mt-4">{data.personalInfo.fullName}</p>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="w-full py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 shadow-lg shadow-slate-200 transition-all active:scale-[0.98] print:hidden"
      >
        <Download size={20} /> Download PDF
      </button>
    </div>
  );
}
