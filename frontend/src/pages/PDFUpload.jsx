import { useState } from 'react';
import axios from 'axios';
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Sparkles,
  Upload,
} from 'lucide-react';

const formatLabel = value => {
  if (!value) return 'Unknown';

  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
};

const formatScore = score => `${Math.round((score || 0) * 100)}% match`;

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const onFileChange = event => {
    const selected = event.target.files[0];

    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setResult(null);
      setStatus({ type: 'selected', message: selected.name });
      return;
    }

    setFile(null);
    setResult(null);
    setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      setStatus({ type: 'loading', message: 'Analyzing resume...' });
      const response = await axios.post('/api/upload', formData);
      const payload = response.data?.data;

      setResult(payload);
      setStatus({
        type: 'success',
        message: `Analysis complete. Found ${
          payload?.recommendations?.length || 0
        } recommended jobs.`,
      });
    } catch (error) {
      setResult(null);
      setStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Upload failed. Please try again.',
      });
    }
  };

  const inferredRoles = result?.parsedResume?.inferred_roles || [];
  const extractedSkills = result?.userProfile?.skills || [];
  const recommendations = result?.recommendations || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6 sm:p-8">
      <div className="space-y-6 p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-100">
            Resume Intelligence
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Upload your resume in PDF format to generate a structured profile
            and rank the jobs already collected inside Caliber.
          </p>
        </div>

        <div
          className={`relative group border-2 border-dashed rounded-2xl p-10 transition-colors flex flex-col items-center justify-center gap-4 ${
            file
              ? 'border-accent bg-accent/5'
              : 'border-slate-800 hover:border-slate-700'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="p-4 bg-slate-950 rounded-full border border-slate-800 group-hover:border-accent transition-colors">
            <Upload
              className={`w-6 h-6 ${file ? 'text-accent' : 'text-slate-500'}`}
            />
          </div>

          <div className="text-center">
            <p className="text-slate-100 font-medium">
              {file ? file.name : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">
              PDF files only
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={uploadFile}
            disabled={!file || status.type === 'loading'}
            className="w-full py-3 px-4 bg-accent text-white rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {status.type === 'loading'
              ? 'Processing...'
              : 'Start Recommendation Engine'}
          </button>

          {status.message && (
            <div
              className={`flex items-center gap-2 text-sm font-medium p-3 rounded-xl bg-slate-950 border border-slate-800 ${
                status.type === 'error'
                  ? 'text-rose-400'
                  : status.type === 'success'
                    ? 'text-emerald-400'
                    : 'text-slate-300'
              }`}
            >
              {status.type === 'error' ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
              {status.message}
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="grid gap-6 lg:grid-cols-[1fr,1.4fr]">
          <section className="space-y-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
            <div className="flex items-center gap-2 text-slate-100">
              <Sparkles size={18} className="text-accent" />
              <h3 className="text-lg font-semibold">Profile Snapshot</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Seniority
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-100">
                  {formatLabel(result.userProfile?.seniority)}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  Jobs Evaluated
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-100">
                  {result.totalJobsEvaluated || 0}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Inferred roles
              </p>

              {inferredRoles.length ? (
                <div className="flex flex-wrap gap-2">
                  {inferredRoles.map(role => (
                    <span
                      key={`${role.role}-${role.confidence}`}
                      className="px-3 py-2 text-sm rounded-full bg-slate-950 border border-slate-800 text-slate-200"
                    >
                      {role.role} • {Math.round(role.confidence * 100)}%
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No role signals were extracted from this resume yet.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Extracted skills
              </p>

              {extractedSkills.length ? (
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-2 text-sm rounded-full bg-accent/10 border border-accent/20 text-accent"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No skills were extracted from this resume yet.
                </p>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                Resume preview
              </p>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-sm leading-6 text-slate-400 max-h-72 overflow-y-auto whitespace-pre-wrap">
                {result.parsedResume?.extracted_text_preview ||
                  'No preview available.'}
              </div>
            </div>
          </section>

          <section className="space-y-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-md">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-slate-100">
                Recommended Jobs
              </h3>
              <p className="text-sm text-slate-400">
                Ranked against the jobs already stored in the project.
              </p>
            </div>

            {recommendations.length ? (
              recommendations.map((item, index) => (
                <article
                  key={`${item.job?.job_id || index}-${index}`}
                  className="p-5 rounded-2xl border border-slate-800 bg-slate-950 space-y-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent">
                        {formatScore(item.score)}
                      </p>
                      <h4 className="text-xl font-semibold text-slate-100">
                        {item.job?.title}
                      </h4>

                      <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                        <span className="inline-flex items-center gap-2">
                          <Briefcase size={14} />
                          {item.job?.company}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <MapPin size={14} />
                          {item.job?.location || 'Not specified'}
                        </span>
                        <span>{formatLabel(item.job?.remote_type)}</span>
                        <span>{formatLabel(item.job?.seniority)}</span>
                        <span>{formatLabel(item.job?.source)}</span>
                      </div>
                    </div>

                    {item.job?.job_url && (
                      <a
                        href={item.job.job_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 self-start px-3 py-2 rounded-xl border border-slate-700 text-sm font-medium text-slate-200 hover:border-accent hover:text-accent transition-colors"
                      >
                        Open job
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>

                  {item.explanation?.reasons?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {item.explanation.reasons.map(reason => (
                        <span
                          key={reason}
                          className="px-3 py-2 rounded-full text-sm bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {(item.job?.time_posted || item.job?.salary) && (
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      {item.job?.time_posted && (
                        <span>Posted: {item.job.time_posted}</span>
                      )}
                      {item.job?.salary && <span>Salary: {item.job.salary}</span>}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 text-sm text-slate-400">
                No recommendations were generated yet. This can happen when the
                job database is still empty.
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
