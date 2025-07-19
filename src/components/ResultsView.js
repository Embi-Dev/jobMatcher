// components/ResultsView.js
import React from 'react';

export default function ResultsView({ data }) {
  // Calculate average percentages per category
  const calculateCategoryAverage = (items) => {
    if (!items || items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + item.similarityPercentage, 0);
    return Math.round((total / items.length) * 100);
  };

  const averages = {
    hard_skills: calculateCategoryAverage(data.hard_skills),
    soft_skills: calculateCategoryAverage(data.soft_skills),
    education: calculateCategoryAverage(data.education),
    experiences: calculateCategoryAverage(data.experiences),
    others: calculateCategoryAverage(data.others)
  };

  // Function to render a skill category
  const renderCategory = (title, items, color) => {
    if (!items || items.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className={`text-lg font-semibold ${color} mb-4 flex items-center`}>
          {title}
          <span className="ml-auto text-base font-normal">
            Average: <span className={`font-bold ${averages[title.toLowerCase().replace(' ', '_')] >= 70 ? 'text-green-600' : averages[title.toLowerCase().replace(' ', '_')] >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages[title.toLowerCase().replace(' ', '_')]}%
            </span>
          </span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow min-h-[120px]"
            >
              <div className="flex justify-between">
                <div className="w-4/5">
                  <div className="font-medium text-gray-800 break-words">
                    Required: {item.required}
                  </div>
                  {item.similarText && (
                    <div className="text-sm text-gray-600 mt-1 break-words">
                      Closest keyword in resume: <span className="font-medium">{item.similarText}</span>
                    </div>
                  )}
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold min-w-[60px] h-fit text-center ${
                  item.similarityPercentage >= 0.7 ? 'bg-green-100 text-green-800' :
                  item.similarityPercentage >= 0.4 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {Math.round(item.similarityPercentage * 100)}%
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full" 
                  style={{ 
                    width: `${Math.round(item.similarityPercentage * 100)}%`,
                    backgroundColor: item.similarityPercentage >= 0.7 ? '#10B981' : 
                                    item.similarityPercentage >= 0.4 ? '#FBBF24' : '#EF4444'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Category Averages Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Category Averages
        </h2>
        
        <div className="flex flex-wrap gap-3">
          {/* Hard Skills */}
          <div className="flex items-center bg-blue-100 px-3 py-2 rounded-lg">
            <div className="font-medium text-blue-800 mr-2">Hard Skills</div>
            <div className={`text-base font-bold ${averages.hard_skills >= 70 ? 'text-green-600' : averages.hard_skills >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages.hard_skills}%
            </div>
          </div>
          
          {/* Soft Skills */}
          <div className="flex items-center bg-purple-100 px-3 py-2 rounded-lg">
            <div className="font-medium text-purple-800 mr-2">Soft Skills</div>
            <div className={`text-base font-bold ${averages.soft_skills >= 70 ? 'text-green-600' : averages.soft_skills >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages.soft_skills}%
            </div>
          </div>
          
          {/* Education */}
          <div className="flex items-center bg-green-100 px-3 py-2 rounded-lg">
            <div className="font-medium text-green-800 mr-2">Education</div>
            <div className={`text-base font-bold ${averages.education >= 70 ? 'text-green-600' : averages.education >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages.education}%
            </div>
          </div>
          
          {/* Experiences */}
          <div className="flex items-center bg-indigo-100 px-3 py-2 rounded-lg">
            <div className="font-medium text-indigo-800 mr-2">Experiences</div>
            <div className={`text-base font-bold ${averages.experiences >= 70 ? 'text-green-600' : averages.experiences >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages.experiences}%
            </div>
          </div>
          
          {/* Other Factors */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
            <div className="font-medium text-gray-800 mr-2">Other Factors</div>
            <div className={`text-base font-bold ${averages.others >= 70 ? 'text-green-600' : averages.others >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
              {averages.others}%
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Results - Scrollable Area */}
      <div className="flex-1 overflow-auto pr-2">
        {/* Hard Skills */}
        {renderCategory(
          "Hard Skills", 
          data.hard_skills, 
          "text-blue-600"
        )}

        {/* Soft Skills */}
        {renderCategory(
          "Soft Skills", 
          data.soft_skills, 
          "text-purple-600"
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
              Education
              <span className="ml-auto text-base font-normal">
                Average: <span className={`font-bold ${averages.education >= 70 ? 'text-green-600' : averages.education >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {averages.education}%
                </span>
              </span>
            </h3>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              {data.education.map((edu, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between">
                    <div className="w-4/5">
                      <div className="font-medium text-gray-800 break-words">
                        Required: {edu.required}
                      </div>
                      {edu.similarText && (
                        <div className="text-sm text-gray-700 mt-1 break-words">
                          Closest match in resume:  <span className="font-medium">{edu.similarText}</span>
                        </div>
                      )}
                    </div>
                    <div className={`font-bold ${edu.similarityPercentage >= 0.7 ? 'text-green-600' : edu.similarityPercentage >= 0.4 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(edu.similarityPercentage * 100)}%
                    </div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${Math.round(edu.similarityPercentage * 100)}%`,
                        backgroundColor: edu.similarityPercentage >= 0.7 ? '#10B981' : 
                                        edu.similarityPercentage >= 0.4 ? '#FBBF24' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experiences */}
        {data.experiences && data.experiences.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center">
              Experiences
              <span className="ml-auto text-base font-normal">
                Average: <span className={`font-bold ${averages.experiences >= 70 ? 'text-green-600' : averages.experiences >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {averages.experiences}%
                </span>
              </span>
            </h3>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              {data.experiences.map((exp, index) => (
                <div key={index} className="mb-3 last:mb-0">
                  <div className="flex justify-between">
                    <div className="w-4/5">
                      <div className="font-medium text-gray-800 break-words">
                        Required: {exp.required}
                      </div>
                      {exp.similarText && (
                        <div className="text-sm text-gray-700 mt-1 break-words">
                          Closest match in resume: <span className="font-medium">{exp.similarText}</span>
                        </div>
                      )}
                    </div>
                    <div className={`font-bold ${exp.similarityPercentage >= 0.7 ? 'text-green-600' : exp.similarityPercentage >= 0.4 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {Math.round(exp.similarityPercentage * 100)}%
                    </div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full" 
                      style={{ 
                        width: `${Math.round(exp.similarityPercentage * 100)}%`,
                        backgroundColor: exp.similarityPercentage >= 0.7 ? '#10B981' : 
                                        exp.similarityPercentage >= 0.4 ? '#FBBF24' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Factors */}
        {renderCategory(
          "Other Factors", 
          data.others, 
          "text-gray-600"
        )}
      </div>
    </div>
  );
}