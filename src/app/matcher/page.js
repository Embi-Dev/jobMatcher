// app/matcher/page.js
'use client';

import { useState } from 'react';
import TextSection from '../../components/TextSection';
import ResultsView from '../../components/ResultsView';
import UploadResume from '@/components/uploadResume';

export default function MatcherPage() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    setLoading(true);
    try {
        setResults(null)
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        }, body: JSON.stringify({ resumeText, jdText})
      })
      if(!response.ok){
        const errorData = await response.json(); 
        console.error("API error:", errorData);
        if(errorData.error === "Failed to extract."){
            alert("Please try again, its just issue from llm extracting resume and jd. It will work");
            return;
        }
        alert('Something went wrong, please try again');
        return;
      }
      const data = await response.json();
      console.log(data)
      setResults(data)
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onExtracted = (text) => {
    if (!text) {
      alert("No text extracted from the resume. Please try again.");
      return;
    }
    setResumeText(text);
  }

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      {/* Header */}
      <div className="pt-6 px-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Resume-JD Matcher
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Upload your resume and job description to get precise matching insights
        </p>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden px-6 pb-4 gap-6">
        {/* Left Column (Two Rows) */}
        <div className="flex flex-col w-1/2 gap-6">
          {/* Resume Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-1/2">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Your Resume
              </h2>
            </div>
            <div className="p-4 flex flex-col flex-1 overflow-hidden">
              <UploadResume onExtracted={onExtracted} />
              <div className="mt-3 flex-1 overflow-hidden">
                <TextSection
                  value={resumeText}
                  onChange={setResumeText}
                  placeholder="Resume text will appear here after upload..."
                />
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-1/2">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Job Description
              </h2>
            </div>
            <div className="p-4 flex-1 overflow-hidden">
              <TextSection
                value={jdText}
                onChange={setJdText}
                placeholder="Paste the job description here..."
              />
            </div>
          </div>
        </div>

        {/* Right Column (Results) */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-1/2">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Matching Results
            </h2>
          </div>
          
          <div className="p-6 h-[calc(100%-68px)] overflow-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-gray-600 text-lg">Analyzing your documents...</p>
                <p className="text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : results ? (
              <ResultsView data={results} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Results will appear here</h3>
                <p className="text-gray-500 max-w-md">
                  Upload your resume and job description, then click "Match Now" to see the analysis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Button */}
      <div className="py-4 px-6 border-t border-gray-200 bg-white">
        <button
          onClick={handleMatch}
          disabled={!resumeText || !jdText || loading}
          className={`
            w-full max-w-md mx-auto block px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300
            ${!resumeText || !jdText || loading
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Match Now'
          )}
        </button>
      </div>
    </div>
  );
}