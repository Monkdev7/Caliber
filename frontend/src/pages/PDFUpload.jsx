import { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react'; // Optional: for the calm icon vibe

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const onFileChange = e => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setStatus({ type: 'selected', message: selected.name });
    } else {
      setStatus({ type: 'error', message: 'Please select a valid PDF file.' });
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      setStatus({ type: 'loading', message: 'Analyzing resume...' });
      const res = await axios.post('/api/upload', formData);
      setStatus({
        type: 'success',
        message: 'Analysis complete. Redirecting to results...',
      });
      console.log(res.data);
    } catch (err) {
      setStatus({ type: 'error', message: 'Upload failed. Please try again.' });
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-8 bg-slate-900 border border-slate-800 rounded-lg shadow-md">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-100">
          Resume Analysis
        </h2>
        <p className="text-sm text-slate-400">
          Upload your resume in PDF format. Our AI will extract your skills and
          match you with compatible roles.
        </p>
      </div>

      <div
        className={`relative group border-2 border-dashed rounded-lg p-10 transition-colors flex flex-col items-center justify-center gap-4 ${
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
            PDF Files only (Max 5MB)
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={uploadFile}
          disabled={!file || status.type === 'loading'}
          className="w-full py-3 px-4 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {status.type === 'loading'
            ? 'Processing...'
            : 'Start Recommendation Engine'}
        </button>

        {status.message && (
          <div
            className={`flex items-center gap-2 text-sm font-medium p-3 rounded-md bg-slate-950 border border-slate-800 ${
              status.type === 'error'
                ? 'text-rose-500'
                : status.type === 'success'
                  ? 'text-emerald-500'
                  : 'text-slate-400'
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
  );
}
