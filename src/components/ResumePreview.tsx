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
  const projects = optimization?.optimizedProjects || data.projects;
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
          "p-6 rounded-2xl flex flex-col gap-4 border print:hidden",
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

      {/* The Resume: Jake Ryan Style */}
      <div className="resume-container flex-1 bg-white shadow-2xl rounded-sm p-12 overflow-y-auto print:shadow-none print:p-0 print:overflow-visible font-serif text-[#111111] border border-slate-100 print:border-none" style={{ fontFamily: '"Libre Baskerville", "Times New Roman", serif' }}>
        <header className="text-center mb-6">
          <h1 className="text-3xl font-normal leading-tight mb-2">
            {data.personalInfo.fullName || "Your Full Name"}
          </h1>
          <div className="text-[11px] text-slate-800 flex flex-wrap justify-center items-center gap-x-2 gap-y-1">
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.email && (
              <>
                <span className="hidden sm:inline"> | </span>
                <a href={`mailto:${data.personalInfo.email}`} className="hover:underline">{data.personalInfo.email}</a>
              </>
            )}
            {data.personalInfo.linkedin && (
              <>
                <span className="hidden sm:inline"> | </span>
                <a href={data.personalInfo.linkedin.startsWith('http') ? data.personalInfo.linkedin : `https://${data.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {data.personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
            {data.personalInfo.github && (
              <>
                <span className="hidden sm:inline"> | </span>
                <a href={data.personalInfo.github.startsWith('http') ? data.personalInfo.github : `https://${data.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {data.personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </>
            )}
          </div>
        </header>

        {summary && (
          <section className="mb-4">
            <h2 className="text-[13px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-widest">Summary</h2>
            <p className="text-[11px] leading-relaxed text-slate-800">{summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[13px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-widest">Education</h2>
            <div className="space-y-2">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[12px]">{edu.school}</h3>
                    <span className="text-[11px] font-bold">{data.personalInfo.location || "Location"}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-[11px] italic">{edu.degree}</p>
                    <span className="text-[11px] italic">{edu.startDate} – {edu.endDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experiences.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[13px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-widest">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-[12px]">{exp.company}</h3>
                    <span className="text-[11px] font-bold uppercase tracking-tighter">{data.personalInfo.location || "Remote"}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="text-[11px] italic">{exp.position}</p>
                    <span className="text-[11px] italic">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div className="text-[11px] leading-tight pl-5 list-disc prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0.5 text-black">
                    <ReactMarkdown>{exp.description}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[13px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-widest">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-[12px]">
                      {proj.name} {proj.link && <span className="font-normal italic">| {proj.link}</span>}
                    </h3>
                    <span className="text-[11px]">{data.education[0]?.startDate || "Present"} – {data.education[0]?.endDate || "Present"}</span>
                  </div>
                  <div className="text-[11px] leading-tight pl-5 list-disc prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-li:my-0.5 text-black">
                    <ReactMarkdown>{proj.description}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-4">
            <h2 className="text-[13px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-widest">Technical Skills</h2>
            <div className="text-[11px] leading-relaxed">
              <p className="flex flex-wrap gap-x-1">
                <span className="font-bold">Skills:</span> {skills.join(', ')}
              </p>
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
