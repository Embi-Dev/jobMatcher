import { useState, useRef } from "react";
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export default function UploadResume({ onExtracted }){
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file || file.type !== "application/pdf") {
            alert("Please upload a valid PDF file.");
            return;
        }

        setIsLoading(true);
        try {
            const file = event.target.files[0];
            const reader = new FileReader();
            let fullText = '';
            reader.onload = async function(e) {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                onExtracted(fullText);
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error("Error extracting text from PDF:", error);
            alert("Failed to extract text from the PDF. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="mb-6">
            <label className="block text-lg font-semibold mb-2 text-gray-700">
                Upload Resume (PDF)
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    disabled={isLoading}
                />
                    {isLoading && (
                        <div className="text-gray-500">Extracting text...</div>
                    )}
            </div>
        </div>
    )
}