import React, { useState } from 'react';

const FilePreview = ({ fileUrl }) => {
  const [isLoading, setIsLoading] = useState(true);
  const fileType = fileUrl?.split('.').pop()?.toLowerCase();

  if (!fileUrl) return <div>No file available</div>;

  // Handle PDF files
  if (fileType === 'pdf') {
    return (
      <div className="relative w-full h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <object
          data={fileUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          onLoad={() => setIsLoading(false)}
        >
          <p>Unable to display PDF. <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Download PDF</a></p>
        </object>
      </div>
    );
  }

  // Handle Office documents
  if (['doc', 'docx', 'ppt', 'pptx'].includes(fileType)) {
    return (
      <div className="relative w-full h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    );
  }

  // Fallback for other file types
  return (
    <div className="text-center p-4">
      <div className="space-y-4">
        <p className="text-gray-600">File type: {fileType}</p>
        <div className="flex justify-center space-x-4">
          <a 
            href={fileUrl} 
            download
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Download File
          </a>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Open in New Tab
          </a>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
