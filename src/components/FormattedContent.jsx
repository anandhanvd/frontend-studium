import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const FormattedContent = ({ content }) => {
  const formatSection = (section) => {
    if (section.startsWith('Note:') || section.startsWith('Important:')) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
          <p className="font-semibold">{section}</p>
        </div>
      );
    }

    // Handle LaTeX math expressions
    if (section.includes('$$')) {
      const parts = section.split('$$');
      return (
        <div className="my-4 text-center">
          <Latex>{parts[1]}</Latex>
        </div>
      );
    }

    if (section.includes(':>')) {
      return (
        <div className="bg-gray-50 p-4 my-4 rounded-lg">
          {section.split('\n').map((line, index) => {
            const [speaker, message] = line.split(':>');
            return (
              <div key={index} className="mb-2">
                <span className="font-bold">{speaker}:</span>
                <span className="ml-2">{message}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        className="prose max-w-none"
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-bold my-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold my-2" {...props} />,
          p: ({node, ...props}) => <p className="my-2 leading-relaxed" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc ml-6 my-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal ml-6 my-2" {...props} />,
          code: ({node, ...props}) => (
            <code className="bg-gray-100 px-2 py-1 rounded" {...props} />
          )
        }}
      >
        {section}
      </ReactMarkdown>
    );
  };

  return (
    <div className="space-y-4">
      {content.split('\n\n').map((section, index) => (
        <div key={index}>{formatSection(section.trim())}</div>
      ))}
    </div>
  );
};

export default FormattedContent; 