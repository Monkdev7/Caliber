import { useState } from 'react';
import axios from 'axios';

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const onFileChange = e => {
    const selected = e.target.files[0];
    // Check if it's actually a PDF
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setStatus(`Selected: ${selected.name}`);
    } else {
      alert('Please select a PDF file.');
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('pdfFile', file); // 'pdfFile' must match the backend key

    try {
      setStatus('Uploading...');
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Upload Successful!');
      console.log(res.data);
    } catch (err) {
      setStatus('Upload Failed.');
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 border-2 border-dashed rounded-xl">
      <input type="file" accept=".pdf" onChange={onFileChange} />
      <button
        onClick={uploadFile}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Upload to Server
      </button>
      <p className="text-sm text-gray-500">{status}</p>
    </div>
  );
}
