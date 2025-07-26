import { useState, useRef } from 'react';

export const FileDropzone = ({ onFileSelect }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file type (JPG, PNG, or PDF)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    onFileSelect(file);
  };

  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
        ${dragOver 
          ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20 dark:border-brand-400 dark:bg-brand-900/20' 
          : 'border-gray-300 bg-gray-50 hover:bg-brand-50 hover:border-brand-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-brand-900/20'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="space-y-3">
        <div className="text-4xl">📸</div>
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Click to upload or drag and drop your ID document
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Accepted: JPG, PNG, PDF (max 5MB)
        </p>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};
