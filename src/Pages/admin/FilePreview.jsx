import React from 'react';

const FilePreview = ({ fileUrl }) => {
  const fileType = fileUrl?.split('.').pop()?.toLowerCase();

  if (!fileUrl) return <div>No file available</div>;

  if (['doc', 'docx', 'ppt', 'pptx'].includes(fileType)) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
        width="100%"
        height="400px"
        frameBorder="0"
      />
    );
  }

  return (
    <div className="text-center p-4">
      <a 
        href={fileUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700"
      >
        Open file in new tab
      </a>
    </div>
  );
};

export default FilePreview;
