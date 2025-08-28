
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-xl ring-1 ring-slate-900/5 p-6 sm:p-8 animate-fade-in">
      <h2 className="text-3xl font-bold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">About IndexFlow</h2>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          IndexFlow is a simple, free tool designed to provide a quick on-page SEO audit and generate an XML sitemap for your website. It's built to help website owners, developers, and marketers get instant insights into critical SEO elements without any complexity.
        </p>
        <p>
          Our goal is to make basic SEO analysis accessible to everyone. Just enter your URL, and IndexFlow will check for:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li><strong>Status Code:</strong> Ensuring your page is accessible to search engines.</li>
          <li><strong>Title Tag:</strong> Checking for optimal length and presence.</li>
          <li><strong>Meta Description:</strong> Analyzing length and keyword inclusion.</li>
          <li><strong>H1 Tag:</strong> Verifying the main heading is present.</li>
          <li><strong>Robots.txt:</strong> Checking for its presence.</li>
        </ul>
        <p>
          This application serves as a demonstration of building a modern, functional web tool. Please note that to prevent misuse and overcome browser security limitations (CORS), the analysis is currently based on mock data. In a full production environment, this analysis would be performed by a server-side backend.
        </p>
        <p>
          For questions or feedback, please contact us at <a href="mailto:indexflow@pm.me" className="font-medium text-sky-600 hover:text-sky-800 hover:underline">indexflow@pm.me</a>.
        </p>
      </div>
    </div>
  );
};

export default About;