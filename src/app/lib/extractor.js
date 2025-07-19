async function request(message) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_APIKEY}`,
        },
        body: JSON.stringify({
            model: getRandomChatModel(),
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}
function getRandomChatModel() {
  const topModels = [
    "llama3-70b-8192",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "gemma2-9b-it",
    "llama-3.1-8b-instant",
    "deepseek-r1-distill-llama-70b"
  ];

  const randomIndex = Math.floor(Math.random() * topModels.length);
  return topModels[randomIndex];
}
function extractJsonFromLLM(output) {
    console.log("LLM Output", output)
    // Common JSON patterns in LLM outputs
    const patterns = [
        /```json\n([\s\S]*?)\n```/,  // Markdown JSON code block
        /```\n([\s\S]*?)\n```/,      // Generic code block
        /\{[\s\S]*\}/                 // Loose JSON
    ];
    
    for (const pattern of patterns) {
        const match = output.match(pattern);
        if (match) {
            try {
                // Try to extract from the first capture group
                const jsonString = match[1] || match[0];
                return JSON.parse(jsonString);
            } catch (e) {
                // Continue to next pattern if parsing fails
                continue;
            }
        }
    }
    
    // Fallback: Try parsing entire output if no patterns matched
    try {
        return JSON.parse(output);
    } catch (e) {
        throw new Error(`No valid JSON found.`);
    }
}
export async function resumeExtractor(resumeText) {
    const mesagge = `
Extract these 5 fields from the resume as a JSON object.

Output Format:
{
  "hard_skills": [all hard skills] , //array
  "soft_skills": [all soft skills] , //array
  "education": [all education], //array
  "experiences": [ all expreiences], //array
  "others": [all other informations] //array
}

RULES:
1. SKILLS: Normalize (JS→JavaScript) 
2. EDUCATION: Format as "degree field" (e.g. "BS Computer Science") - Array
3. SOFT SKILLS : Normalize : ( Strong collaboration and communication abilities ) -> ["Strong Collaboration Ability", "Strong coomunication ability" ]
3. EXPERIENCES: Normalize : (" 2 years of expereicne Developing full-stack applications using Node.js and Python for backend, React and CSS for frontend") -> ["2 years of expereicne Developing full-stack applications using Node.js", "2 years of expereicne Developing full-stack applications using Python", "2 years of designing frontend using react and css"]- Array
4. Ensure all information in resume in on output object - Array
5. ONLY RETURN VALID JSON OBJECT, NO EXPLANATIONS OR ADDITIONAL TEXT - Array

Resume Text:
${resumeText}
    `;
    const extractedInfo = await request(mesagge);
    const jsonData = extractJsonFromLLM(extractedInfo);
    return jsonData;

}
export async function jobDescriptionExtractor(jdText) {
    const message = `
Extract these 5 requirements fields from the job description as a JSON object.

Output Format:
{
  "hard_skills": [ all hard skills explicitly required ], //array
  "soft_skills": [ all soft skills or personality traits or similar ], //array 
  "education": [ all education requirements ], //array
  "experiences": [ required experience ], //array
  "others": [ other requirements from candidate must have that is not  yet included above ] //array
}

RULES:
1. SKILLS: Normalize (JS → JavaScript, ML → Machine Learning)
2. EDUCATION: Format as "degree field," (e.g. "BS Computer Science")
3. EXPERIENCE: Format as "[number]years if present - title/role" (e.g. "3 years of mobile app development using React Native.")
4. ONLY RETURN VALID JSON OBJECT NO EXPLANATIONS OR ADDITIONAL TEXT

Job Description Text:
${jdText}
    `;
    
    const extractedInfo = await request(message);
    const jsonData = extractJsonFromLLM(extractedInfo);
    return jsonData;
}