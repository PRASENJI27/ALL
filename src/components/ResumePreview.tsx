import { Download, CheckCircle2, AlertCircle, Mail, Phone, MapPin, Linkedin, Github, GraduationCap, Briefcase, Code, FileText } from 'lucide-react';
import { ResumeData, ATSOptimizationResult } from '../types';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Props {
  data: ResumeData;
  optimization?: ATSOptimizationResult;
}

export default function ResumePreview({ data, optimization }: Props) {
  const experiences = optimization?.optimizedExperiences || data.experiences;
  const skills = optimization?.optimizedSkills || data.skills;
  const summary = optimization?.optimizedSummary || data.summary;

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-in fade-in duration-700">
      {/* ATS Score Header (Only if optimized) */}
      {optimization && (
        <div className={cn(
          "p-6 rounded-2xl flex flex-col gap-4 border",
          optimization.atsScore >= 80 ? "bg-green-50 border-green-100" : "bg-yellow-50 border-yellow-100"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                optimization.atsScore >= 80 ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
              )}>
                {optimization.atsScore >= 80 ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">ATS Match Strategy</h3>
                <p className="text-sm text-slate-500">Based on job description requirements</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-slate-900">{optimization.atsScore}%</div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Match Score</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-600">AI Recommendations</h4>
            <ul className="grid grid-cols-1 gap-1.5">
              {optimization.suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="mt-1.5 w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* The Resume */}
      <div className="flex-1 bg-white shadow-2xl rounded-sm p-12 overflow-y-auto print:shadow-none print:p-0 print:overflow-visible font-sans text-[#1a1a1a] border border-slate-100 print:border-none" style={{ fontFamily: '"Inter", "Arial", sans-serif' }}>
        <header className="text-center mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wide mb-2">
            {data.personalInfo.fullName || "Your Full Name"}
          </h1>
          <div className="text-[11px] text-slate-700 flex flex-wrap justify-center items-center gap-3 gap-y-2">
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

        {summary && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-0.5 mb-2 tracking-wider flex items-center gap-2">
               <FileText size={12} className="text-slate-400" /> Professional Summary
            </h2>
            <p className="text-[12px] leading-relaxed text-slate-800">{summary}</p>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-0.5 mb-2 tracking-wider flex items-center gap-2">
               <Briefcase size={12} className="text-slate-400" /> Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-bold text-[13px]">{exp.company}</h3>
                    <span className="text-[11px] font-medium text-slate-600">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <p className="text-[12px] italic text-slate-700">{exp.position}</p>
                  </div>
                  <div className="text-[12px] leading-relaxed pl-5 prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-li:my-0.5 text-slate-800">
                    <ReactMarkdown>{exp.description}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-0.5 mb-2 tracking-wider flex items-center gap-2">
               <Code size={12} className="text-slate-400" /> Skills
            </h2>
            <p className="text-[12px] leading-relaxed text-slate-800">
              {skills.join(', ')}
            </p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-5">
            <h2 className="text-xs font-bold uppercase border-b border-slate-300 pb-0.5 mb-2 tracking-wider flex items-center gap-2">
               <GraduationCap size={12} className="text-slate-400" /> Education
            </h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[13px]">{edu.school}</h3>
                    <span className="text-[11px] font-medium text-slate-600">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p className="text-[12px] text-slate-700">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}
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
