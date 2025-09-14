/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import * as showdown from 'showdown';

// --- Type declarations for globally loaded libraries ---
declare const jspdf: any;
declare const html2canvas: any;
declare const Typo: any;

// --- SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
1.0 CORE DIRECTIVE — Supreme Apex Edition
You are Elite Resume AI™ , a sovereign Apex Architect of Career Intelligence and Dossier Engineering. You operate as a self-directing, multi-modal intelligence system whose purpose is to design, simulate, and deliver dossiers of unmatched precision, clarity, and executive presence.
Mission Statement.
Transform a client’s raw professional history and a target Job Description (JD) into two distinct outputs: first, a comprehensive Strategic Briefing in Markdown, and second, a structured JSON object containing the complete, optimized content for a pixel-perfect, two-page PDF dossier.

Operating Pillars
Intelligence Fusion — ingest signals from company filings, investor calls, press releases, competitor benchmarks, and social sentiment; interweave them into contextualized candidate narratives.
Narrative Engineering — weave candidate’s story into challenge ? action ? outcome arcs, quantified with ROI, percentages, $ values, and role-specific KPIs.
Executive Specialization — deploy tailored frameworks per role/industry:
  - Financial Services ? fiduciary duty, ROI optics, regulatory stability.
  - Sales ? pipeline velocity, quota exceedance, revenue multipliers.
  - AML/Compliance ? audit readiness, SAR/KYC leadership, regulatory foresight.
  - Director/Executive ? strategic oversight, capital allocation, governance.
Non-Negotiable Principles
Forensic Accuracy — no unverified claims; uncertain data marked as inferred with confidence tags.
Personal Data Integrity — Extract contact information (name, email, phone, LinkedIn URL, location) with absolute precision. This data must be copied verbatim from the source material and never hallucinated or altered.
Hyper-Tailoring — ensure JD keyword saturation, pain point mapping, and cultural resonance; avoid redundancy and filler.
Dynamic Theming — Research the target company's brand identity. If discovered with high confidence, derive a professional color palette for the dossier, reflecting the company's branding. This palette must be professional, maintain high contrast for accessibility, and be suitable for an executive document. Provide this palette in the 'theme' object. If brand colors cannot be determined, provide a default, professional theme (e.g., deep navy blue, gold, and white).

2.0 COGNITIVE APEX FORGE PROTOCOL (THE “SUPREME BRAIN”)
Purpose.
 Before any external output, you must execute the Apex Cognitive Synthesis, a staged, multi-modal reasoning protocol that guarantees every Strategic Briefing and Dossier is the product of exhaustive research, structured analysis, and narrative optimization.

<... truncated for brevity ...>

Stage 5 — Visual Enrichment Layer
Heatmaps — skill alignment (HTML table with CSS classes: .excellent, .good, .fair, .gap).
Graphs & Charts —
  - 📊 Bar graph: skill alignment scores.
  - 📈 Line graph: career progression over time.
  - 🕸 Radar chart: competency distribution.
When generating a bar graph, enclose the data in a markdown code block with the 'chart-bar' identifier. The content should be a valid JSON object with a "title" and a "data" array, where each object in the array has a "label" and "value". Example:
\`\`\`chart-bar
{
  "title": "Skill Alignment Scores",
  "data": [
    { "label": "Communication", "value": 95 },
    { "label": "Data Analysis", "value": 80 }
  ]
}
\`\`\`

IMPORTANT FINAL INSTRUCTION:
Your entire output MUST strictly follow this two-part format:
1.  First, generate the complete, multi-section Strategic Briefing using Markdown, including collapsible sections denoted by '## Section Title'.
2.  After the briefing is entirely finished, you MUST write the exact separator token on a new, single line:
===JSON_DOSSIER_START===
3.  On the next line, output a single, complete, and valid JSON object containing the finalized dossier content. Do not add ANY extra text, explanations, or markdown formatting (like \`\`\`json) around the JSON object. The JSON object must strictly adhere to the following schema:
{
  "contactInfo": {
    "name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "string",
    "location": "string"
  },
  "executiveSummary": "string (Markdown enabled)",
  "coreCompetencies": ["string"],
  "keyMetrics": ["string"],
  "professionalExperience": [
    {
      "role": "string",
      "companyInfo": "string (e.g., Company Name | Location | Dates)",
      "points": ["string (Markdown enabled)"]
    }
  ],
  "foundationalExperience": [
    {
      "role": "string",
      "companyInfo": "string (e.g., Company Name | Location | Dates)",
      "points": ["string (Markdown enabled)"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "schoolAndLocation": "string (e.g., School Name, New York, NY)"
    }
  ],
  "licenses": {
    "title": "string (e.g., FINRA/NFA Series)",
    "values": ["string (e.g., 24, 7, 63)"],
    "status": "string (e.g., (Active))"
  },
  "theme": {
    "primaryColor": "string (e.g., #001F3F, the main brand color for the left column)",
    "accentColor": "string (e.g., #FFD700, for highlights and borders)",
    "backgroundColor": "string (e.g., #FFFFFF, for the main content area)",
    "textColor": "string (e.g., #F0F4F8, for text on the primary color background)",
    "headerColor": "string (e.g., #001F3F, for headings on the background color)"
  }
}
`;

// --- TYPES ---
interface ResumeData {
  contactInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    location: string;
  };
  executiveSummary: string;
  coreCompetencies: string[];
  keyMetrics: string[];
  professionalExperience: {
    role: string;
    companyInfo: string;
    points: string[];
  }[];
  foundationalExperience?: {
    role: string;
    companyInfo: string;
    points: string[];
  }[];
  education: {
    degree: string;
    schoolAndLocation: string;
  }[];
  licenses?: {
    title: string;
    values: string[];
    status: string;
  };
  theme?: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    headerColor: string;
  };
}

interface ValidationErrors {
  contactInfo: Record<string, string>;
  executiveSummary?: string;
  professionalExperience?: ({
      role?: string;
      companyInfo?: string;
      points?: string[];
  } | undefined)[];
  coreCompetencies?: string;
  competencyItems?: string[];
  foundationalExperience?: ({
      role?: string;
      companyInfo?: string;
      points?: string[];
  } | undefined)[];
  licenses?: {
    title?: string;
    values?: string;
    status?: string;
  }
}

interface PopoverOptions {
  top: number;
  left: number;
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

// --- REACT COMPONENTS ---

const App = () => {
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [briefingText, setBriefingText] = useState('');
  const [resumeJsonString, setResumeJsonString] = useState('');
  const [error, setError] = useState('');
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({ contactInfo: {} });
  const [dictionary, setDictionary] = useState<any>(null);
  const [popover, setPopover] = useState<PopoverOptions | null>(null);
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [template, setTemplate] = useState('executive'); // 'executive', 'modern', 'classic'
  const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = useState(false);
  const [showSpellcheck, setShowSpellcheck] = useState(true);


  useEffect(() => {
    if (process.env.API_KEY) {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    }
    
    // Load dictionary for spellchecking
    const loadDictionary = async () => {
      try {
        const affResponse = await fetch('https://cdn.jsdelivr.net/npm/typo-js@1.2.1/dictionaries/en_US/en_US.aff');
        const dicResponse = await fetch('https://cdn.jsdelivr.net/npm/typo-js@1.2.1/dictionaries/en_US/en_US.dic');
        const affData = await affResponse.text();
        const dicData = await dicResponse.text();
        const typo = new Typo('en_US', affData, dicData);
        setDictionary(typo);
      } catch (err) {
        console.error("Failed to load spellcheck dictionary:", err);
      }
    };
    loadDictionary();

  }, []);

  const validateContactInfo = (contactInfo: ResumeData['contactInfo']) => {
    const errors: Record<string, string> = {};
    if (!contactInfo.name?.trim()) errors.name = 'Name is required.';
    if (!contactInfo.email?.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
        errors.email = 'Invalid email format.';
    }
    if (!contactInfo.phone?.trim()) errors.phone = 'Phone number is required.';
    if (!contactInfo.location?.trim()) errors.location = 'Location is required.';
    if (!contactInfo.linkedin?.trim()) {
        errors.linkedin = 'LinkedIn URL is required.';
    } else {
        try {
            const url = new URL(contactInfo.linkedin);
            if (!url.hostname.includes('linkedin.com')) {
                errors.linkedin = 'Must be a valid LinkedIn URL.';
            }
        } catch (_) {
            errors.linkedin = 'Invalid URL format.';
        }
    }
    return errors;
  };

  const validateExecutiveSummary = (summary: string) => {
      if (!summary.trim()) {
          return 'Executive Summary is required.';
      }
      return undefined;
  };

  const validateExperienceSection = (experiences?: { role: string; companyInfo: string; points: string[] }[]) => {
      if (!experiences) return [];
      const errors: ({ role?: string; companyInfo?: string; points?: string[] } | undefined)[] = new Array(experiences.length).fill(undefined);
      
      experiences.forEach((exp, index) => {
          const expErrors: { role?: string; companyInfo?: string; points?: string[] } = {};
          if (!exp.role.trim()) {
              expErrors.role = 'Role is required.';
          }
          if (!exp.companyInfo.trim()) {
              expErrors.companyInfo = 'Company info is required.';
          }
          
          const pointErrors: string[] = new Array(exp.points.length).fill('');
          let hasPointError = false;

          exp.points.forEach((point, pIndex) => {
              if (!point.trim()) {
                  pointErrors[pIndex] = 'Point cannot be empty.';
                  hasPointError = true;
              }
          });
          
          if (hasPointError) {
              expErrors.points = pointErrors;
          }

          if (Object.keys(expErrors).length > 0) {
              errors[index] = expErrors;
          }
      });
      return errors;
  };

  const validateCoreCompetencies = (competencies: string[]) => {
    const errors: Partial<ValidationErrors> = {};
    if (!competencies || competencies.length === 0) {
        errors.coreCompetencies = 'At least one competency is required.';
        return errors;
    }

    const itemErrors: string[] = [];
    let hasItemError = false;
    competencies.forEach((comp, index) => {
        if (!comp.trim()) {
            itemErrors[index] = 'Competency cannot be empty.';
            hasItemError = true;
        } else {
            itemErrors[index] = '';
        }
    });

    if (hasItemError) {
        errors.competencyItems = itemErrors;
    }

    return errors;
  };

  const validateLicenses = (licenses?: ResumeData['licenses']) => {
    if (!licenses) return undefined;
    const errors: NonNullable<ValidationErrors['licenses']> = {};
    if (!licenses.title.trim()) {
        errors.title = 'Title is required.';
    }
    if (!licenses.values || licenses.values.length === 0 || licenses.values.every(v => !v.trim())) {
          errors.values = 'At least one license is required.';
    }
    if (!licenses.status.trim()) {
        errors.status = 'Status is required.';
    }
    return Object.keys(errors).length > 0 ? errors : undefined;
  };

  useEffect(() => {
    if (resumeData) {
        const contactErrors = validateContactInfo(resumeData.contactInfo);
        const summaryError = validateExecutiveSummary(resumeData.executiveSummary);
        const professionalExpErrors = validateExperienceSection(resumeData.professionalExperience);
        const competencyErrors = validateCoreCompetencies(resumeData.coreCompetencies);
        const foundationalExpErrors = validateExperienceSection(resumeData.foundationalExperience);
        const licenseErrors = validateLicenses(resumeData.licenses);

        setValidationErrors({
            contactInfo: contactErrors,
            executiveSummary: summaryError,
            professionalExperience: professionalExpErrors.some(e => e) ? professionalExpErrors : undefined,
            coreCompetencies: competencyErrors.coreCompetencies,
            competencyItems: competencyErrors.competencyItems,
            foundationalExperience: foundationalExpErrors.some(e => e) ? foundationalExpErrors : undefined,
            licenses: licenseErrors
        });
    }
  }, [resumeData]);

  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData) return;
    const { name, value } = e.target;
    const updatedContactInfo = { ...resumeData.contactInfo, [name]: value };
    const newResumeData = { ...resumeData, contactInfo: updatedContactInfo };
    setResumeData(newResumeData);
  };
  
  const handleExecutiveSummaryChange = (value: string) => {
      if (!resumeData) return;
      setResumeData({ ...resumeData, executiveSummary: value });
  };
  
  const handleCompetencyChange = (index: number, value: string) => {
    if (!resumeData) return;
    const newCompetencies = [...resumeData.coreCompetencies];
    newCompetencies[index] = value;
    setResumeData({ ...resumeData, coreCompetencies: newCompetencies });
  };

  const handleAddCompetency = () => {
      if (!resumeData) return;
      setResumeData({ ...resumeData, coreCompetencies: [...resumeData.coreCompetencies, ''] });
  };

  const handleRemoveCompetency = (index: number) => {
      if (!resumeData) return;
      const newCompetencies = resumeData.coreCompetencies.filter((_, i) => i !== index);
      setResumeData({ ...resumeData, coreCompetencies: newCompetencies });
  };
  
  // Professional Experience Handlers
  const handleAddProfessionalExperience = () => {
      if (!resumeData) return;
      const newExp = { role: '', companyInfo: '', points: [''] };
      setResumeData({ ...resumeData, professionalExperience: [...resumeData.professionalExperience, newExp] });
  };

  const handleRemoveProfessionalExperience = (index: number) => {
      if (!resumeData) return;
      const professionalExperience = resumeData.professionalExperience.filter((_, i) => i !== index);
      setResumeData({ ...resumeData, professionalExperience });
  };

  const handleProfessionalExperienceChange = (index: number, field: 'role' | 'companyInfo', value: string) => {
      if (!resumeData) return;
      const professionalExperience = [...resumeData.professionalExperience];
      professionalExperience[index] = { ...professionalExperience[index], [field]: value };
      setResumeData({ ...resumeData, professionalExperience });
  };

  const handleAddProfessionalExperiencePoint = (expIndex: number) => {
      if (!resumeData) return;
      const professionalExperience = [...resumeData.professionalExperience];
      const points = [...professionalExperience[expIndex].points, ''];
      professionalExperience[expIndex] = { ...professionalExperience[expIndex], points };
      setResumeData({ ...resumeData, professionalExperience });
  };

  const handleRemoveProfessionalExperiencePoint = (expIndex: number, pointIndex: number) => {
      if (!resumeData) return;
      const professionalExperience = [...resumeData.professionalExperience];
      const points = professionalExperience[expIndex].points.filter((_, i) => i !== pointIndex);
      professionalExperience[expIndex] = { ...professionalExperience[expIndex], points };
      setResumeData({ ...resumeData, professionalExperience });
  };
  
  const handleProfessionalExperiencePointChange = (expIndex: number, pointIndex: number, value: string) => {
      if (!resumeData) return;
      const professionalExperience = [...resumeData.professionalExperience];
      const points = [...professionalExperience[expIndex].points];
      points[pointIndex] = value;
      professionalExperience[expIndex] = { ...professionalExperience[expIndex], points };
      setResumeData({ ...resumeData, professionalExperience });
  };


  // Foundational Experience Handlers
  const handleAddFoundationalExperience = () => {
      if (!resumeData) return;
      const newExp = { role: '', companyInfo: '', points: [''] };
      const foundationalExperience = [...(resumeData.foundationalExperience || []), newExp];
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleRemoveFoundationalExperience = (index: number) => {
      if (!resumeData || !resumeData.foundationalExperience) return;
      const foundationalExperience = resumeData.foundationalExperience.filter((_, i) => i !== index);
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleFoundationalExperienceChange = (index: number, field: 'role' | 'companyInfo', value: string) => {
      if (!resumeData || !resumeData.foundationalExperience) return;
      const foundationalExperience = [...resumeData.foundationalExperience];
      foundationalExperience[index] = { ...foundationalExperience[index], [field]: value };
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleAddFoundationalExperiencePoint = (expIndex: number) => {
      if (!resumeData || !resumeData.foundationalExperience) return;
      const foundationalExperience = [...resumeData.foundationalExperience];
      const points = [...foundationalExperience[expIndex].points, ''];
      foundationalExperience[expIndex] = { ...foundationalExperience[expIndex], points };
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleRemoveFoundationalExperiencePoint = (expIndex: number, pointIndex: number) => {
      if (!resumeData || !resumeData.foundationalExperience) return;
      const foundationalExperience = [...resumeData.foundationalExperience];
      const points = foundationalExperience[expIndex].points.filter((_, i) => i !== pointIndex);
      foundationalExperience[expIndex] = { ...foundationalExperience[expIndex], points };
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleFoundationalExperiencePointChange = (expIndex: number, pointIndex: number, value: string) => {
      if (!resumeData || !resumeData.foundationalExperience) return;
      const foundationalExperience = [...resumeData.foundationalExperience];
      const points = [...foundationalExperience[expIndex].points];
      points[pointIndex] = value;
      foundationalExperience[expIndex] = { ...foundationalExperience[expIndex], points };
      setResumeData({ ...resumeData, foundationalExperience });
  };

  const handleLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!resumeData || !resumeData.licenses) return;
    const { name, value } = e.target;
    const updatedLicenses = {
        ...resumeData.licenses,
        [name]: name === 'values' ? value.split(',').map(v => v.trim()) : value,
    };
    setResumeData({ ...resumeData, licenses: updatedLicenses });
  };

  const handleAddLicenses = () => {
      if (!resumeData) return;
      if (!resumeData.licenses) {
          setResumeData({
              ...resumeData,
              licenses: { title: 'Licenses & Certifications', values: [''], status: '(Active)' },
          });
      }
  };

  const handleRemoveLicenses = () => {
      if (!resumeData) return;
      // Create a new object without the licenses property
      const newResumeData: Omit<ResumeData, 'licenses'> & { licenses?: any } = { ...resumeData };
      delete newResumeData.licenses;
      setResumeData(newResumeData);
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setUploadedFiles([...uploadedFiles, ...Array.from(e.target.files)]);
    }
    e.target.value = null; // Reset file input
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.name !== fileName));
  };
  
  const handleProceedToJD = () => {
      if (uploadedFiles.length === 0 && !linkedinUrl.trim()) {
          setError('Please upload at least one document or provide your LinkedIn URL.');
          return;
      }
      setError('');
      setStep(2);
  };

  const handleGenerateBriefing = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    if (!ai) {
      setError('AI client not initialized. Check API key.');
      return;
    }
    setError('');
    setIsGenerating(true);
    setBriefingText('');
    setResumeData(null);
    setResumeJsonString('');
    setStep(3);

    try {
      const contents: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] = [
        { text: SYSTEM_PROMPT },
        { text: `--- START CANDIDATE DATA ---` },
        { text: `Job Description:\n${jobDescription}` },
      ];

      if (linkedinUrl.trim()) {
        contents.push({ text: `LinkedIn Profile URL: ${linkedinUrl}` });
      }

      for (const file of uploadedFiles) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result.split(',')[1]);
            } else {
              reject(new Error('Could not read file as data URL string.'));
            }
          };
          reader.onerror = (error) => reject(error);
        });

        contents.push({
          inlineData: {
            mimeType: file.type,
            data: base64,
          },
        });
      }
      contents.push({ text: `--- END CANDIDATE DATA ---` });
      
      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents,
      });
      
      let fullText = '';
      for await (const chunk of responseStream) {
          fullText += chunk.text;
      }
      
      const separator = '===JSON_DOSSIER_START===';
      const separatorIndex = fullText.indexOf(separator);

      if (separatorIndex === -1) {
        setBriefingText(fullText); // Show what we got
        throw new Error("AI response did not contain the JSON separator. The output may be incomplete.");
      }
      
      const briefing = fullText.substring(0, separatorIndex).trim();
      const jsonPart = fullText.substring(separatorIndex + separator.length);

      setBriefingText(briefing);
      setResumeJsonString(jsonPart);

    } catch (err) {
      console.error(err);
      setError(`An error occurred during generation: ${err.message}. Please try again.`);
      setStep(2); // Go back to a safe step
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceedToPreview = () => {
    if (!resumeJsonString) {
        setError("Could not find the resume data to proceed.");
        return;
    }
    try {
        const parsedJson = JSON.parse(resumeJsonString);
        setResumeData(parsedJson);
        setStep(4);
    } catch (e) {
        console.error("Failed to parse resume JSON:", resumeJsonString);
        setError("Failed to parse the resume data from the briefing. The format might be incorrect.");
    }
  };
  
  const handlePrint = () => {
    if (window.confirm("This will open the browser's print dialog. Do you want to continue?")) {
      window.print();
    }
  };
  
  const handleSaveAsPdf = async () => {
      if (!resumeData) return;
      const resumeElement = document.getElementById('resume-to-print');
      if (!resumeElement) {
        setError('Could not find the resume element to save.');
        return;
      }

      setIsDownloadingPdf(true);
      try {
        // To ensure all content is captured, we clone the node and apply styles to make it fully visible.
        const clone = resumeElement.cloneNode(true) as HTMLElement;
        document.body.appendChild(clone);

        // Apply styles for PDF generation to the clone
        clone.style.position = 'absolute';
        clone.style.left = '-9999px'; // Position off-screen to avoid user seeing it
        clone.style.top = '0';
        clone.style.width = '8.5in'; // Set a fixed width corresponding to a letter page
        clone.style.height = 'auto'; // Allow height to expand based on content
        clone.style.aspectRatio = 'auto'; // Override the on-screen aspect ratio
        clone.style.boxShadow = 'none';
        clone.style.margin = '0';

        // Ensure the right column's content is not clipped by overflow
        const rightColumn = clone.querySelector('.resume-right-column') as HTMLElement;
        if (rightColumn) {
          rightColumn.style.overflowY = 'visible';
          rightColumn.style.height = 'auto';
        }
        
        // Hide UI elements that shouldn't be in the PDF (buttons, error messages, spellcheck highlights)
        const elementsToHide = clone.querySelectorAll(`
          .remove-item-button, .add-item-button, .remove-exp-button, 
          .add-exp-button, .remove-section-button, .add-section-button, 
          .spellcheck-backdrop, .error-text
        `);
        elementsToHide.forEach(el => ((el as HTMLElement).style.display = 'none'));
        
        // Ensure editable form fields are rendered as static text for the PDF
        const textareas = clone.querySelectorAll('textarea');
        textareas.forEach(ta => {
            const div = document.createElement('div');
            div.textContent = ta.value;
            // Copy essential styles to maintain layout and appearance
            const computedStyle = window.getComputedStyle(ta);
            div.style.font = computedStyle.font;
            div.style.lineHeight = computedStyle.lineHeight;
            div.style.color = computedStyle.color;
            div.style.padding = computedStyle.padding;
            div.style.whiteSpace = 'pre-wrap';
            div.style.wordBreak = 'break-word';
            div.className = ta.className; // Keep original classes for styling context
            ta.parentNode?.replaceChild(div, ta); // Replace the textarea with the styled div
        });

        const inputs = clone.querySelectorAll('input');
        inputs.forEach(input => {
            // For inputs, styling them to look like text is sufficient
            input.style.border = 'none';
            input.style.background = 'transparent';
            input.style.padding = '0';
            input.style.margin = '0';
            // Inherit text styles from parent for consistency
            input.style.color = 'inherit';
            input.style.fontFamily = 'inherit';
            input.style.fontSize = 'inherit';
            input.style.fontWeight = 'inherit';
            input.style.fontStyle = 'inherit';
        });

        // Render the prepared clone using html2canvas
        const canvas = await html2canvas(clone, {
          scale: 4, // Higher scale for better quality PDF
          useCORS: true,
          logging: false,
          windowWidth: clone.scrollWidth,
          windowHeight: clone.scrollHeight,
        });

        // Clean up: remove the cloned element from the DOM
        document.body.removeChild(clone);

        // Generate a multi-page PDF from the resulting canvas image
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'in',
          format: 'letter'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = 8.5;
        const pdfHeight = 11;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasHeight / canvasWidth;
        
        const imgHeight = pdfWidth * ratio; // The total height of the image in the PDF
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add the first page
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add more pages if the content is longer than one page
        while (heightLeft > 0.01) { // Use a small tolerance for floating point inaccuracies
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`${resumeData.contactInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);

      } catch (err) {
        console.error('Failed to generate PDF:', err);
        setError('An error occurred while generating the PDF. Please try again.');
      } finally {
        setIsDownloadingPdf(false);
      }
  };

  const handleStartOver = () => {
    setStep(1);
    setJobDescription('');
    setLinkedinUrl('');
    setUploadedFiles([]);
    setResumeData(null);
    setBriefingText('');
    setResumeJsonString('');
    setError('');
    setIsGenerating(false);
  };

  const handleNewJD = () => {
    setStep(2);
    setJobDescription('');
    setResumeData(null);
    setBriefingText('');
    setResumeJsonString('');
    setError('');
  };

  const handleDownloadBriefing = () => {
    if (!briefingText) return;

    const blob = new Blob([briefingText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Strategic_Briefing.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const getStepClass = (currentStep: number) => {
      if (step > currentStep) return 'completed';
      if (step === currentStep) return 'active';
      return '';
  };
  
  const aiMonologueMessages = [
    '> Booting Cognitive Apex Forge...',
    '> Security protocols engaged. Verifying directive integrity...',
    '> Ingesting candidate intel... [CV.pdf, Profile_Data]',
    '> Cross-referencing target JD keywords... [Compliance, AML, SAR]',
    '> Analyzing corporate signals... [10-K, Press_Releases]',
    '> Simulating narrative arcs... Challenge -> Action -> Outcome',
    '> Quantifying key metrics... [ROI, $, %]',
    '> Deriving corporate brand aesthetics for dossier theme...',
    '> Compiling strategic briefing...',
    '> Finalizing dossier architecture... Stand by.'
  ];

  const showPopover = (options: PopoverOptions | null) => {
    setPopover(options);
  };

  const handleThemeChange = (newTheme: ResumeData['theme']) => {
    if (resumeData) {
        setResumeData({ ...resumeData, theme: newTheme });
    }
  };

  const renderContent = () => {
      switch (step) {
          case 1:
              return (
                <>
                  <div className="intro-text">
                    <h2>Provide Your Professional Intel</h2>
                    <p>Upload your documents and link your LinkedIn profile to build the foundation of your resume.</p>
                  </div>
                  <div className="verification-form">
                     <div className="input-panel full-width">
                        <h3>LinkedIn Profile URL</h3>
                        <input
                            type="url"
                            value={linkedinUrl}
                            onChange={(e) => setLinkedinUrl(e.target.value)}
                            placeholder="https://linkedin.com/in/your-profile"
                            aria-label="LinkedIn Profile URL"
                        />
                    </div>
                    <div className="input-panel full-width" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <h3>Candidate Documents (CV, Resume, etc.)</h3>
                        <div className="file-upload-container">
                            <label htmlFor="file-upload" className="file-upload-label">
                                <span className="material-icons">upload_file</span>
                                Click to Upload or Drag & Drop Files
                            </label>
                            <input id="file-upload" type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
                            {uploadedFiles.length > 0 && (
                                <div className="file-list">
                                    {uploadedFiles.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <span className="file-name">{file.name}</span>
                                            <button onClick={() => removeFile(file.name)} className="remove-file-button" aria-label={`Remove ${file.name}`}>
                                            <span className="material-icons">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="button-container full-width">
                        <button onClick={handleProceedToJD} disabled={uploadedFiles.length === 0 && !linkedinUrl.trim()}>
                            Proceed to Job Description
                            <span className="material-icons">arrow_forward</span>
                        </button>
                    </div>
                  </div>
                </>
              );
          case 2:
              return (
                  <>
                    <div className="intro-text">
                        <h2>Add the Target Job Description</h2>
                        <p>Paste the full job description to analyze your alignment and generate the resume.</p>
                    </div>
                    <div className="verification-form">
                      <div className="input-panel full-width">
                          <h3>Target Job Description (JD)</h3>
                          <textarea
                              value={jobDescription}
                              onChange={(e) => setJobDescription(e.target.value)}
                              placeholder="Paste the full job description here..."
                              aria-label="Job Description"
                          />
                      </div>
                      <div className="button-container full-width">
                          <button onClick={handleGenerateBriefing} disabled={isGenerating || !jobDescription.trim()}>
                              <span className="material-icons">auto_awesome</span>
                              Generate Strategic Briefing
                          </button>
                      </div>
                    </div>
                  </>
              );
          case 3:
              return (
                <div className="strategic-briefing-container">
                  {!isGenerating && briefingText && (
                    <button
                      onClick={handleDownloadBriefing}
                      className="download-briefing-button"
                      aria-label="Download briefing as Markdown file"
                      title="Download briefing as Markdown file"
                    >
                      <span className="material-icons">download</span>
                    </button>
                  )}
                  <div className="intro-text">
                    <h2>Strategic Briefing</h2>
                     <p>
                      {isGenerating
                        ? 'Elite Resume AI™ is analyzing your intel and formulating a bespoke resume strategy...'
                        : 'Review the generated strategy. Once approved, the final dossier will be constructed.'}
                    </p>
                  </div>
                  <div className="briefing-content">
                      {isGenerating ? (
                        <div className="cognitive-forge-container">
                            <CognitiveForgeAnimation />
                            <Typewriter messages={aiMonologueMessages} />
                        </div>
                      ) : (
                        briefingText && <StrategicBriefing text={briefingText} />
                      )}
                  </div>
                  {!isGenerating && briefingText && (
                    <div className="button-container full-width">
                      <button onClick={handleProceedToPreview}>
                        Approve & Generate Resume Preview
                        <span className="material-icons">arrow_forward</span>
                      </button>
                    </div>
                  )}
                </div>
              );
          case 4:
            if (resumeData) {
              const hasErrors = Object.values(validationErrors.contactInfo).some(Boolean) || 
                                !!validationErrors.executiveSummary ||
                                validationErrors.professionalExperience?.some(exp => exp && Object.keys(exp).length > 0) ||
                                !!validationErrors.coreCompetencies || 
                                validationErrors.competencyItems?.some(Boolean) ||
                                validationErrors.foundationalExperience?.some(exp => exp && Object.keys(exp).length > 0) ||
                                !!validationErrors.licenses;
              return (
                <div className="results-container">
                    <div className="intro-text">
                        <h2>Mission Complete: Resume Preview</h2>
                        <p className="blueprint-intro">Your resume is ready. Review the preview below and download the pixel-perfect PDF.</p>
                    </div>
                    {hasErrors && (
                      <div className="validation-summary">
                        <span className="material-icons">warning</span>
                        <p>Please correct the errors in your resume before proceeding.</p>
                      </div>
                    )}
                    <div className="action-bar">
                        <div className="action-bar-left">
                            <button onClick={handleStartOver} className="secondary">
                                <span className="material-icons">restart_alt</span>
                                Start New Mission
                            </button>
                            <button onClick={handleNewJD} className="secondary">
                                <span className="material-icons">description</span>
                                Use New JD
                            </button>
                        </div>
                        <div className="action-bar-right">
                          <div className="toggle-switch-container">
                            <label htmlFor="spellcheck-toggle" className="toggle-label">Spellcheck</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    id="spellcheck-toggle"
                                    checked={showSpellcheck}
                                    onChange={() => setShowSpellcheck(!showSpellcheck)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                          </div>
                          <button onClick={() => setIsTemplateSelectorOpen(true)} className="secondary">
                              <span className="material-icons">view_quilt</span>
                              Change Template
                          </button>
                          <button onClick={() => setIsThemeEditorOpen(true)} className="secondary">
                              <span className="material-icons">palette</span>
                              Customize Theme
                          </button>
                          <button onClick={handlePrint} className="secondary" disabled={hasErrors}>
                              <span className="material-icons">print</span>
                              Print Resume
                          </button>
                          <button onClick={handleSaveAsPdf} disabled={hasErrors || isDownloadingPdf}>
                            {isDownloadingPdf ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Saving PDF...
                                </>
                            ) : (
                                <>
                                    <span className="material-icons">picture_as_pdf</span>
                                    Save as PDF
                                </>
                            )}
                          </button>
                        </div>
                    </div>
                    {isTemplateSelectorOpen && (
                        <TemplateSelector
                            currentTemplate={template}
                            onSelectTemplate={(newTemplate) => {
                                setTemplate(newTemplate);
                                setIsTemplateSelectorOpen(false);
                            }}
                            onClose={() => setIsTemplateSelectorOpen(false)}
                        />
                    )}
                    {isThemeEditorOpen && resumeData.theme && (
                      <ThemeEditor
                          theme={resumeData.theme}
                          onThemeChange={handleThemeChange}
                          onClose={() => setIsThemeEditorOpen(false)}
                      />
                    )}
                    <ResumePreview
                      template={template}
                      data={resumeData} 
                      errors={validationErrors} 
                      dictionary={dictionary}
                      showPopover={showPopover}
                      showSpellcheck={showSpellcheck}
                      onContactChange={handleContactInfoChange}
                      onExecutiveSummaryChange={handleExecutiveSummaryChange}
                      onCompetencyChange={handleCompetencyChange}
                      onAddCompetency={handleAddCompetency}
                      onRemoveCompetency={handleRemoveCompetency}
                      onAddProfessionalExperience={handleAddProfessionalExperience}
                      onRemoveProfessionalExperience={handleRemoveProfessionalExperience}
                      onProfessionalExperienceChange={handleProfessionalExperienceChange}
                      onAddProfessionalExperiencePoint={handleAddProfessionalExperiencePoint}
                      onRemoveProfessionalExperiencePoint={handleRemoveProfessionalExperiencePoint}
                      onProfessionalExperiencePointChange={handleProfessionalExperiencePointChange}
                      onAddFoundationalExperience={handleAddFoundationalExperience}
                      onRemoveFoundationalExperience={handleRemoveFoundationalExperience}
                      onFoundationalExperienceChange={handleFoundationalExperienceChange}
                      onAddFoundationalExperiencePoint={handleAddFoundationalExperiencePoint}
                      onRemoveFoundationalExperiencePoint={handleRemoveFoundationalExperiencePoint}
                      onFoundationalExperiencePointChange={handleFoundationalExperiencePointChange}
                      onLicenseChange={handleLicenseChange}
                      onAddLicenses={handleAddLicenses}
                      onRemoveLicenses={handleRemoveLicenses}
                    />
                </div>
              );
            }
            return null; // Fallback
          default:
              return null;
      }
  };

  return (
    <div className="app-container" onClick={() => setPopover(null)}>
      <header>
        <div className="header-logo">
          <span className="material-icons">sparkle</span>
          <h1>Elite Resume AI&trade;</h1>
        </div>
      </header>
      <main id="main">
        <div className="main-content-wrapper">
           <div className="stepper-container">
              <div className={`step-item ${getStepClass(1)}`}>
                  <div className="step-counter">1</div>
                  <div className="step-label">Provide Intel</div>
              </div>
              <div className={`step-item ${getStepClass(2)}`}>
                  <div className="step-counter">2</div>
                  <div className="step-label">Target JD</div>
              </div>
              <div className={`step-item ${getStepClass(3)}`}>
                  <div className="step-counter">3</div>
                  <div className="step-label">Strategic Briefing</div>
              </div>
              <div className={`step-item ${getStepClass(4)}`}>
                  <div className="step-counter">4</div>
                  <div className="step-label">Resume Preview</div>
              </div>
          </div>

          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button onClick={() => setError('')} className="error-close-button" aria-label="Close error message">
                <span className="material-icons">close</span>
              </button>
            </div>
          )}
          
          {renderContent()}

        </div>
      </main>
      {popover && <SuggestionPopover {...popover} />}
    </div>
  );
};

const PROFESSIONAL_COLORS = {
  primary: ['#001F3F', '#1c313a', '#212121', '#263238', '#1B5E20', '#3E2723'],
  accent: ['#FFD700', '#F9A825', '#008080', '#D81B60', '#8E24AA', '#C62828'],
  background: ['#FFFFFF', '#FAFAFA', '#F5F5F5'],
  text: ['#FFFFFF', '#F0F4F8', '#E3F2FD'],
  header: ['#001F3F', '#1c313a', '#212121', '#263238', '#1B5E20', '#3E2723'],
};

const ColorPickerRow = ({ label, colors, selectedColor, onColorSelect }) => (
  <div className="theme-editor-row">
    <label>{label}</label>
    <div className="color-swatches">
      {colors.map((color) => (
        <button
          key={color}
          className={`color-swatch ${selectedColor?.toLowerCase() === color.toLowerCase() ? 'selected' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          aria-label={`Select ${color} for ${label}`}
        />
      ))}
    </div>
  </div>
);

interface ThemeEditorProps {
  theme: NonNullable<ResumeData['theme']>;
  onThemeChange: (newTheme: ResumeData['theme']) => void;
  onClose: () => void;
}

const ThemeEditor = ({ theme, onThemeChange, onClose }: ThemeEditorProps) => {
  const handleColorChange = (property: keyof NonNullable<ResumeData['theme']>, color: string) => {
    onThemeChange({ ...theme, [property]: color });
  };

  return (
    <div className="theme-editor-overlay" onClick={onClose}>
        <div className="theme-editor-container" onClick={e => e.stopPropagation()}>
            <div className="theme-editor-header">
                <h3>Customize Theme</h3>
                <button onClick={onClose} className="close-theme-editor" aria-label="Close theme editor">
                    <span className="material-icons">close</span>
                </button>
            </div>
            <div className="theme-editor-body">
                <ColorPickerRow
                    label="Primary (Left Column BG)"
                    colors={PROFESSIONAL_COLORS.primary}
                    selectedColor={theme.primaryColor}
                    onColorSelect={(color) => handleColorChange('primaryColor', color)}
                />
                <ColorPickerRow
                    label="Accent (Highlights & Borders)"
                    colors={PROFESSIONAL_COLORS.accent}
                    selectedColor={theme.accentColor}
                    onColorSelect={(color) => handleColorChange('accentColor', color)}
                />
                <ColorPickerRow
                    label="Background (Right Column BG)"
                    colors={PROFESSIONAL_COLORS.background}
                    selectedColor={theme.backgroundColor}
                    onColorSelect={(color) => handleColorChange('backgroundColor', color)}
                />
                <ColorPickerRow
                    label="Text (On Primary BG)"
                    colors={PROFESSIONAL_COLORS.text}
                    selectedColor={theme.textColor}
                    onColorSelect={(color) => handleColorChange('textColor', color)}
                />
                <ColorPickerRow
                    label="Headers (On Background)"
                    colors={PROFESSIONAL_COLORS.header}
                    selectedColor={theme.headerColor}
                    onColorSelect={(color) => handleColorChange('headerColor', color)}
                />
            </div>
        </div>
    </div>
  );
};

interface TemplateSelectorProps {
  currentTemplate: string;
  onSelectTemplate: (template: string) => void;
  onClose: () => void;
}

const TemplateSelector = ({ currentTemplate, onSelectTemplate, onClose }: TemplateSelectorProps) => {
  const templates = [
    { id: 'executive', name: 'Executive', description: 'The default, sophisticated two-column layout highlighting key metrics.' },
    { id: 'modern', name: 'Modern', description: 'A sleek, single-column design, highly readable and ATS-friendly.' },
    { id: 'classic', name: 'Classic', description: 'A timeless, elegant layout with serif headings, for traditional industries.' },
  ];

  return (
    <div className="template-selector-overlay" onClick={onClose}>
        <div className="template-selector-container" onClick={e => e.stopPropagation()}>
            <div className="template-selector-header">
                <h3>Choose a Template</h3>
                <button onClick={onClose} className="close-theme-editor" aria-label="Close template selector">
                    <span className="material-icons">close</span>
                </button>
            </div>
            <div className="template-gallery">
                {templates.map(template => (
                    <div
                        key={template.id}
                        className={`template-card ${currentTemplate === template.id ? 'selected' : ''}`}
                        onClick={() => onSelectTemplate(template.id)}
                        tabIndex={0}
                        role="button"
                        aria-pressed={currentTemplate === template.id}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectTemplate(template.id)}
                    >
                        <div className="template-thumbnail">
                           <div className={`thumbnail-preview thumb-${template.id}`}>
                             <div className="thumb-left"></div>
                             <div className="thumb-right"></div>
                           </div>
                        </div>
                        <div className="template-info">
                            <h4>{template.name}</h4>
                            <p>{template.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

const SuggestionPopover = ({ top, left, suggestions, onSelect }: PopoverOptions) => {
  if (suggestions.length === 0) {
    return (
      <div className="suggestion-popover" style={{ top, left }} onClick={e => e.stopPropagation()}>
        <div className="no-suggestions">No suggestions found.</div>
      </div>
    );
  }

  return (
    <div className="suggestion-popover" style={{ top, left }} onClick={e => e.stopPropagation()}>
      <ul>
        {suggestions.map(s => (
          <li key={s}>
            <button onClick={() => onSelect(s)}>{s}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- Spellcheck Helper Functions ---

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const highlightMisspelledWords = (text: string, dictionary: any) => {
    if (!dictionary || typeof text !== 'string') {
        return text || '';
    }
    // Regex to split by spaces and punctuation, keeping the delimiters
    const tokens = text.split(/([,.\s!;?()"]+)/);
    const html = tokens.map((part) => {
        // Check if the part is a word (not a delimiter)
        if (part && !/([,.\s!;?()"]+)/.test(part) && isNaN(Number(part))) {
            if (!dictionary.check(part)) {
                return `<span class="spellcheck-error" data-word="${part}">${part}</span>`;
            }
        }
        // Return the part as is (it's either correct, a delimiter, or a number)
        return part;
    }).join('');

    // Add a non-breaking space to prevent the backdrop from collapsing when empty
    return html || '&nbsp;';
};

const createChangeHandler = (name: string, originalOnChange: (event: React.ChangeEvent<any>) => void) => {
    return (suggestion: string, originalValue: string, word: string) => {
        const escapedWord = escapeRegExp(word);
        const regex = new RegExp(`\\b${escapedWord}\\b`);
        const newValue = originalValue.replace(regex, suggestion);
        const event = { target: { name, value: newValue } };
        originalOnChange(event as React.ChangeEvent<any>);
    };
};

// --- Spellcheck Components ---

interface EditableFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  dictionary: any;
  showPopover: (options: PopoverOptions | null) => void;
  name: string;
  className?: string;
  placeholder?: string;
  ['aria-label']: string;
  ['aria-invalid']?: boolean;
  ['aria-describedby']?: string;
}

const EditableField = ({ value, onChange, dictionary, showPopover, name, className, placeholder, ...ariaProps }: EditableFieldProps) => {
    const [highlightedHtml, setHighlightedHtml] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        setHighlightedHtml(highlightMisspelledWords(value, dictionary));
    }, [value, dictionary]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('spellcheck-error')) {
            const word = target.dataset.word;
            if (word && dictionary) {
                const suggestions = dictionary.suggest(word, 5);
                const rect = target.getBoundingClientRect();
                const onSelect = (suggestion: string) => {
                    if (inputRef.current) {
                        const currentValue = inputRef.current.value;
                        createChangeHandler(name, onChange)(suggestion, currentValue, word);
                    }
                    showPopover(null);
                };

                showPopover({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    suggestions,
                    onSelect,
                });
                e.stopPropagation();
            }
        }
    };

    return (
        <div className="spellcheck-container">
            <div
                className="spellcheck-backdrop"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                onClick={handleBackdropClick}
            />
            <input
                ref={inputRef}
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                className={`spellcheck-input ${className || ''}`}
                placeholder={placeholder}
                {...ariaProps}
            />
        </div>
    );
};

interface EditableTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  dictionary: any;
  showPopover: (options: PopoverOptions | null) => void;
  name: string;
  className?: string;
  placeholder?: string;
  ['aria-label']: string;
  ['aria-invalid']?: boolean;
  ['aria-describedby']?: string;
}

const EditableTextArea = ({ value, onChange, dictionary, showPopover, name, className, placeholder, ...ariaProps }: EditableTextAreaProps) => {
    const [highlightedHtml, setHighlightedHtml] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const html = highlightMisspelledWords(value, dictionary);
        setHighlightedHtml(html.replace(/\n/g, '<br>'));
    }, [value, dictionary]);
    
    // Auto-resize textarea
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
        if(backdropRef.current) {
            backdropRef.current.style.height = `${textarea.scrollHeight}px`;
        }
      }
    }, [value]);

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('spellcheck-error')) {
            const word = target.dataset.word;
            if (word && dictionary && textareaRef.current) {
                const suggestions = dictionary.suggest(word, 5);
                const rect = target.getBoundingClientRect();
                const onSelect = (suggestion: string) => {
                    if (textareaRef.current) {
                        const currentValue = textareaRef.current.value;
                        const escapedWord = escapeRegExp(word);
                        const regex = new RegExp(`\\b${escapedWord}\\b`);
                        const newValue = currentValue.replace(regex, suggestion);
                        onChange(newValue);
                    }
                    showPopover(null);
                };

                showPopover({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    suggestions,
                    onSelect,
                });
                e.stopPropagation();
            }
        }
    };

    const handleScroll = () => {
        if (backdropRef.current && textareaRef.current) {
            backdropRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    return (
        <div className="spellcheck-container">
            <div
                ref={backdropRef}
                className="spellcheck-backdrop spellcheck-backdrop-multiline"
                dangerouslySetInnerHTML={{ __html: highlightedHtml }}
                onClick={handleBackdropClick}
            />
            <textarea
                ref={textareaRef}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                className={`spellcheck-textarea ${className || ''}`}
                placeholder={placeholder}
                rows={1}
                {...ariaProps}
            />
        </div>
    );
};


const CognitiveForgeAnimation = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        const particles: any[] = [];
        const numParticles = 100;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement.clientWidth;
            canvas.height = 200;
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;

            constructor(w: number, h: number) {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() * 1 - 0.5) * 0.5;
                this.speedY = (Math.random() * 1 - 0.5) * 0.5;
                this.color = Math.random() > 0.1 ? '#008080' : '#FFD700'; // Teal with a chance of Gold
            }

            update(w: number, h: number, mouse: {x: number, y: number}) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 150;
                const force = (maxDistance - distance) / maxDistance;

                if (distance < maxDistance) {
                    this.x += forceDirectionX * force * 0.5;
                    this.y += forceDirectionY * force * 0.5;
                } else {
                    this.x += this.speedX;
                    this.y += this.speedY;
                }
                
                if (this.x > w || this.x < 0) this.speedX *= -1;
                if (this.y > h || this.y < 0) this.speedY *= -1;
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function init() {
            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(canvas.width, canvas.height));
            }
        }
        
        let frame = 0;
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const pulse = Math.sin(frame * 0.02) * 5 + 20;
            const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, pulse + 10);
            gradient.addColorStop(0, 'rgba(0, 128, 128, 0.8)');
            gradient.addColorStop(0.5, 'rgba(0, 128, 128, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 43, 92, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulse + 10, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0, 128, 128, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
            ctx.stroke();

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(canvas.width, canvas.height, {x: centerX, y: centerY});
                particles[i].draw(ctx);
                
                 for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 50) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 128, 128, ${1 - distance / 50})`;
                        ctx.lineWidth = 0.2;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            
            frame++;
            animationFrameId = requestAnimationFrame(animate);
        }

        init();
        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas id="cognitive-forge-canvas" ref={canvasRef} />;
};


const Typewriter = ({ messages, typingSpeed = 50, delay = 2000 }: { messages: string[], typingSpeed?: number, delay?: number }) => {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        setDisplayedText(''); // Reset on new message set
        setIsTyping(true);
        
        let charIndex = 0;
        const currentMessage = messages[currentMessageIndex];

        const typingInterval = setInterval(() => {
            if (charIndex < currentMessage.length) {
                setDisplayedText(prev => prev + currentMessage.charAt(charIndex));
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                setTimeout(() => {
                    setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
                }, delay);
            }
        }, typingSpeed);

        return () => clearInterval(typingInterval);
    }, [currentMessageIndex, messages, typingSpeed, delay]);

    return (
      <div className="typewriter-container">
        <p className="typewriter-text">
          {displayedText}
          {isTyping && <span className="blinking-cursor">_</span>}
        </p>
      </div>
    );
};

const BarChart = ({ title, data }: { title: string, data: { label: string, value: number, color?: string }[] }) => {
    if (!data || data.length === 0) return null;

    const maxValue = Math.max(...data.map(d => d.value), 100); // Ensure max value is at least 100
    const chartHeight = 250;
    const barWidth = 40;
    const barMargin = 20;
    const chartWidth = data.length * (barWidth + barMargin);
    const valueColors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c', '#9b59b6'];

    return (
        <div className="chart-container">
            <h4>{title}</h4>
            <svg width="100%" height={chartHeight + 40} viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}>
                <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="var(--border-color)" strokeWidth="2" />
                {data.map((item, index) => {
                    const barHeight = (item.value / maxValue) * chartHeight;
                    const x = index * (barWidth + barMargin) + (barMargin / 2);
                    const color = item.color || valueColors[index % valueColors.length];
                    return (
                        <g key={item.label} className="chart-bar">
                            <rect
                                x={x}
                                y={chartHeight - barHeight}
                                width={barWidth}
                                height={barHeight}
                                fill={color}
                                rx="4"
                            >
                                <title>{`${item.label}: ${item.value}`}</title>
                            </rect>
                             <text x={x + barWidth / 2} y={chartHeight - barHeight - 8} textAnchor="middle" fill="var(--text-primary)" fontSize="14" fontWeight="bold">{item.value}</text>
                            <text x={x + barWidth / 2} y={chartHeight + 25} textAnchor="middle" fill="var(--text-secondary)" fontSize="12">{item.label}</text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const StrategicBriefing = ({ text }: { text: string }) => {
  const converter = new showdown.Converter();
  
  const renderRichContent = (content: string) => {
    // Regex to split content by special blocks, capturing the delimiters
    const parts = content.split(/(<table[\s\S]*?<\/table>|```chart-bar\n[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (!part?.trim()) return null;

      if (part.startsWith('<table')) {
        return <div key={index} className="heatmap-container" dangerouslySetInnerHTML={{ __html: part }} />;
      }

      if (part.startsWith('```chart-bar')) {
        try {
          const jsonString = part.replace(/```chart-bar\n|```/g, '');
          const chartData = JSON.parse(jsonString);
          return <BarChart key={index} title={chartData.title || "Data Visualization"} data={chartData.data} />;
        } catch (e) {
          console.error("Failed to parse chart JSON:", e);
          // Fallback to show the raw code block if parsing fails
          return <pre key={index}>{part}</pre>;
        }
      }
      
      // Default markdown for any remaining text parts
      return <div key={index} dangerouslySetInnerHTML={{ __html: converter.makeHtml(part) }} />;
    });
  };
  
  const sections: { title: string; content: string }[] = [];
  let currentSection: { title: string; content: string } | null = null;

  text.split('\n').forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { title: line.substring(3).trim(), content: '' };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  });

  if (currentSection) {
    sections.push(currentSection);
  }

  if (sections.length === 0) {
    return <pre>{text}</pre>; // Fallback for unstructured text
  }

  return (
    <div>
      {sections.map((section, index) => (
        <details key={index} className="collapsible-section" open={index < 2}>
          <summary>{section.title}</summary>
          <div className="section-content">
            {renderRichContent(section.content)}
          </div>
        </details>
      ))}
    </div>
  );
};

const ResumeSkeletonLoader = () => {
  const Shimmer = () => <div className="shimmer-wrapper"><div className="shimmer"></div></div>;
  
  const SkeletonBlock = ({ width, height }) => (
    <div className="skeleton-block" style={{ width, height, borderRadius: '4px' }}>
      <Shimmer />
    </div>
  );

  return (
    <div className="resume-container skeleton-loader" aria-live="polite" aria-busy="true">
      <div className="resume-left-column">
        <SkeletonBlock width="80%" height="2rem" />
        <SkeletonBlock width="60%" height="1rem" />
        <div style={{ height: '1.5rem' }} />
        <SkeletonBlock width="90%" height="1.25rem" />
        <SkeletonBlock width="90%" height="1.25rem" />
        <SkeletonBlock width="90%" height="1.25rem" />
        <SkeletonBlock width="90%" height="1.25rem" />
        <div style={{ height: '2rem' }} />
        <SkeletonBlock width="70%" height="1.5rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <div style={{ height: '2rem' }} />
        <SkeletonBlock width="70%" height="1.5rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="80%" height="1rem" />
      </div>
      <div className="resume-right-column">
        <SkeletonBlock width="50%" height="1.75rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="100%" height="1rem" />
        <SkeletonBlock width="80%" height="1rem" />
        <div style={{ height: '2rem' }} />
        <SkeletonBlock width="50%" height="1.75rem" />
        <SkeletonBlock width="40%" height="1.5rem" />
        <SkeletonBlock width="60%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
        <div style={{ height: '1rem' }} />
        <SkeletonBlock width="40%" height="1.5rem" />
        <SkeletonBlock width="60%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
        <SkeletonBlock width="95%" height="1rem" />
      </div>
    </div>
  );
};

interface ResumePreviewProps {
  template: string;
  data: ResumeData;
  errors: ValidationErrors;
  dictionary: any;
  showPopover: (options: PopoverOptions | null) => void;
  showSpellcheck: boolean;
  onContactChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExecutiveSummaryChange: (value: string) => void;
  onCompetencyChange: (index: number, value: string) => void;
  onAddCompetency: () => void;
  onRemoveCompetency: (index: number) => void;
  onAddProfessionalExperience: () => void;
  onRemoveProfessionalExperience: (index: number) => void;
  onProfessionalExperienceChange: (index: number, field: 'role' | 'companyInfo', value: string) => void;
  onAddProfessionalExperiencePoint: (expIndex: number) => void;
  onRemoveProfessionalExperiencePoint: (expIndex: number, pointIndex: number) => void;
  onProfessionalExperiencePointChange: (expIndex: number, pointIndex: number, value: string) => void;
  onAddFoundationalExperience: () => void;
  onRemoveFoundationalExperience: (index: number) => void;
  onFoundationalExperienceChange: (index: number, field: 'role' | 'companyInfo', value: string) => void;
  onAddFoundationalExperiencePoint: (expIndex: number) => void;
  onRemoveFoundationalExperiencePoint: (expIndex: number, pointIndex: number) => void;
  onFoundationalExperiencePointChange: (expIndex: number, pointIndex: number, value: string) => void;
  onLicenseChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddLicenses: () => void;
  onRemoveLicenses: () => void;
}

const ResumePreview = ({
    template,
    data, 
    errors, 
    dictionary,
    showPopover,
    showSpellcheck,
    onContactChange,
    onExecutiveSummaryChange,
    onCompetencyChange,
    onAddCompetency,
    onRemoveCompetency,
    onAddProfessionalExperience,
    onRemoveProfessionalExperience,
    onProfessionalExperienceChange,
    onAddProfessionalExperiencePoint,
    onRemoveProfessionalExperiencePoint,
    onProfessionalExperiencePointChange,
    onAddFoundationalExperience,
    onRemoveFoundationalExperience,
    onFoundationalExperienceChange,
    onAddFoundationalExperiencePoint,
    onRemoveFoundationalExperiencePoint,
    onFoundationalExperiencePointChange,
    onLicenseChange,
    onAddLicenses,
    onRemoveLicenses
}: ResumePreviewProps) => {
  const converter = new showdown.Converter();
  
  const createMarkup = (markdownText: string) => {
    return { __html: converter.makeHtml(markdownText).replace(/<p>|<\/p>/g, '') };
  };

  // FIX: Allow CSS custom properties (e.g. '--some-var') by extending React.CSSProperties.
  const themeStyles: React.CSSProperties & { [key: `--${string}`]: string } = {
    '--resume-left-bg': data.theme?.primaryColor || '#001F3F',
    '--resume-left-text': data.theme?.textColor || '#F0F4F8',
    '--resume-right-bg': data.theme?.backgroundColor || '#FFFFFF',
    '--resume-right-text': '#222222',
    '--resume-header-text': data.theme?.headerColor || '#001F3F',
    '--resume-accent-line': data.theme?.accentColor || '#004080',
    '--accent-gold': data.theme?.accentColor || '#FFD700',
  };
  
  const licenseErrors = errors.licenses || {};

  return (
    <div className={`resume-container template-${template} ${!showSpellcheck ? 'spellcheck-hidden' : ''}`} id="resume-to-print" style={themeStyles}>
      <div className="resume-left-column">
        <div className="editable-field-group">
          <EditableField
            name="name"
            value={data.contactInfo.name}
            onChange={onContactChange}
            dictionary={dictionary}
            showPopover={showPopover}
            className={`editable-h1 ${errors.contactInfo.name ? 'has-error' : ''}`}
            aria-label="Candidate Name"
            aria-invalid={!!errors.contactInfo.name}
            aria-describedby="name-error"
          />
          {errors.contactInfo.name && <p id="name-error" className="error-text">{errors.contactInfo.name}</p>}
        </div>
        
        <p className="title">{data.contactInfo.title}</p>

        <div className="contact-info resume-section">
            <div className={`contact-item editable-field-group ${errors.contactInfo.email ? 'has-error' : ''}`}>
                <span className="material-icons">email</span>
                <input type="email" name="email" value={data.contactInfo.email} onChange={onContactChange} aria-label="Email" aria-invalid={!!errors.contactInfo.email} aria-describedby="email-error" />
                {errors.contactInfo.email && <p id="email-error" className="error-text">{errors.contactInfo.email}</p>}
            </div>
            <div className={`contact-item editable-field-group ${errors.contactInfo.phone ? 'has-error' : ''}`}>
                <span className="material-icons">call</span>
                <input type="tel" name="phone" value={data.contactInfo.phone} onChange={onContactChange} aria-label="Phone" aria-invalid={!!errors.contactInfo.phone} aria-describedby="phone-error" />
                {errors.contactInfo.phone && <p id="phone-error" className="error-text">{errors.contactInfo.phone}</p>}
            </div>
            <div className={`contact-item editable-field-group ${errors.contactInfo.linkedin ? 'has-error' : ''}`}>
                <span className="material-icons">link</span>
                <input type="url" name="linkedin" value={data.contactInfo.linkedin} onChange={onContactChange} aria-label="LinkedIn URL" aria-invalid={!!errors.contactInfo.linkedin} aria-describedby="linkedin-error" />
                {errors.contactInfo.linkedin && <p id="linkedin-error" className="error-text">{errors.contactInfo.linkedin}</p>}
            </div>
            <div className={`contact-item editable-field-group ${errors.contactInfo.location ? 'has-error' : ''}`}>
                <span className="material-icons">location_on</span>
                <EditableField
                  name="location"
                  value={data.contactInfo.location}
                  onChange={onContactChange}
                  dictionary={dictionary}
                  showPopover={showPopover}
                  className={errors.contactInfo.location ? 'has-error' : ''}
                  aria-label="Location"
                  aria-invalid={!!errors.contactInfo.location}
                  aria-describedby="location-error"
                />
                {errors.contactInfo.location && <p id="location-error" className="error-text">{errors.contactInfo.location}</p>}
            </div>
        </div>

        {data.coreCompetencies && <div className="resume-section">
          <h2>Core Competencies</h2>
          {errors.coreCompetencies && <p className="error-text section-error">{errors.coreCompetencies}</p>}
          <ul>
            {data.coreCompetencies.map((c, index) => (
              <li key={index} className="editable-list-item">
                <EditableField
                  name={`competency-${index}`}
                  value={c}
                  onChange={(e) => onCompetencyChange(index, e.target.value)}
                  dictionary={dictionary}
                  showPopover={showPopover}
                  className={errors.competencyItems?.[index] ? 'has-error' : ''}
                  aria-label={`Competency ${index + 1}`}
                  aria-invalid={!!errors.competencyItems?.[index]}
                  aria-describedby={`competency-error-${index}`}
                />
                <button onClick={() => onRemoveCompetency(index)} className="remove-item-button" aria-label={`Remove competency ${index + 1}`}>
                  <span className="material-icons">remove_circle_outline</span>
                </button>
                {errors.competencyItems?.[index] && <p id={`competency-error-${index}`} className="error-text item-error">{errors.competencyItems[index]}</p>}
              </li>
            ))}
          </ul>
          <button onClick={onAddCompetency} className="add-item-button">
            <span className="material-icons">add_circle_outline</span>
            Add Competency
          </button>
        </div>}
        
        {data.keyMetrics?.length > 0 && <div className="resume-section">
          <h2>Key Metrics</h2>
          <ul>{data.keyMetrics.map(m => <li key={m}>{m}</li>)}</ul>
        </div>}

        {data.education?.length > 0 && <div className="resume-section">
          <h2>Education</h2>
          {data.education.map(edu => <div key={edu.degree}>
            <strong>{edu.degree}</strong>
            <p>{edu.schoolAndLocation}</p>
          </div>)}
        </div>}
        
        {data.licenses ? (
          <div className="resume-section editable-section">
            <div className="editable-field-group">
                <EditableField
                    name="title"
                    value={data.licenses.title}
                    onChange={onLicenseChange}
                    dictionary={dictionary}
                    showPopover={showPopover}
                    className={`editable-h2 ${licenseErrors.title ? 'has-error' : ''}`}
                    aria-label="Licenses section title"
                    aria-invalid={!!licenseErrors.title}
                    aria-describedby="licenses-title-error"
                />
                {licenseErrors.title && <p id="licenses-title-error" className="error-text">{licenseErrors.title}</p>}
            </div>
            <div className="editable-field-group">
                <EditableField
                    name="values"
                    value={data.licenses.values.join(', ')}
                    onChange={onLicenseChange}
                    dictionary={dictionary}
                    showPopover={showPopover}
                    placeholder="e.g. 24, 7, 63"
                    className={`licenses-values ${licenseErrors.values ? 'has-error' : ''}`}
                    aria-label="License values, comma separated"
                    aria-invalid={!!licenseErrors.values}
                    aria-describedby="licenses-values-error"
                />
                {licenseErrors.values && <p id="licenses-values-error" className="error-text">{licenseErrors.values}</p>}
            </div>
             <div className="editable-field-group">
                <EditableField
                    name="status"
                    value={data.licenses.status}
                    onChange={onLicenseChange}
                    dictionary={dictionary}
                    showPopover={showPopover}
                    className={`license-status ${licenseErrors.status ? 'has-error' : ''}`}
                    aria-label="Licenses status"
                    aria-invalid={!!licenseErrors.status}
                    aria-describedby="licenses-status-error"
                />
                {licenseErrors.status && <p id="licenses-status-error" className="error-text">{licenseErrors.status}</p>}
            </div>
            <button onClick={onRemoveLicenses} className="remove-section-button" aria-label="Remove licenses section">
                <span className="material-icons">delete</span>
                Remove Section
            </button>
          </div>
        ) : (
          <div className="resume-section">
             <button onClick={onAddLicenses} className="add-item-button add-section-button">
                <span className="material-icons">add_circle</span>
                Add Licenses Section
            </button>
          </div>
        )}
      </div>

      <div className="resume-right-column">
        {data.executiveSummary && <div className="resume-section executive-summary">
          <h2>Executive Summary</h2>
          <div className="editable-field-group">
            <EditableTextArea
              name="executiveSummary"
              value={data.executiveSummary}
              onChange={onExecutiveSummaryChange}
              dictionary={dictionary}
              showPopover={showPopover}
              className={errors.executiveSummary ? 'has-error' : ''}
              aria-label="Executive Summary"
              aria-invalid={!!errors.executiveSummary}
              aria-describedby="executive-summary-error"
            />
            {errors.executiveSummary && <p id="executive-summary-error" className="error-text section-error">{errors.executiveSummary}</p>}
          </div>
        </div>}
        
        {data.professionalExperience?.length > 0 && <div className="resume-section">
            <h2>Professional Experience</h2>
            {data.professionalExperience.map((exp, expIndex) => {
                const expErrors = errors.professionalExperience?.[expIndex] || {};
                return (
                    <div key={expIndex} className="exp-item editable-exp-item">
                        <div className="editable-field-group">
                            <div className="editable-h3-group">
                                <span className="material-icons">business_center</span>
                                <EditableField
                                    name="role"
                                    value={exp.role}
                                    onChange={(e) => onProfessionalExperienceChange(expIndex, 'role', e.target.value)}
                                    dictionary={dictionary}
                                    showPopover={showPopover}
                                    className={`editable-h3 ${expErrors.role ? 'has-error' : ''}`}
                                    placeholder="Role / Title"
                                    aria-label={`Role for professional experience ${expIndex + 1}`}
                                    aria-invalid={!!expErrors.role}
                                    aria-describedby={`professional-role-error-${expIndex}`}
                                />
                            </div>
                            {expErrors.role && <p id={`professional-role-error-${expIndex}`} className="error-text role-error">{expErrors.role}</p>}
                        </div>
                        <div className="editable-field-group">
                            <EditableField
                                name="companyInfo"
                                value={exp.companyInfo}
                                onChange={(e) => onProfessionalExperienceChange(expIndex, 'companyInfo', e.target.value)}
                                dictionary={dictionary}
                                showPopover={showPopover}
                                className={`company-info ${expErrors.companyInfo ? 'has-error' : ''}`}
                                placeholder="Company | Location | Dates"
                                aria-label={`Company info for professional experience ${expIndex + 1}`}
                                aria-invalid={!!expErrors.companyInfo}
                                aria-describedby={`professional-company-error-${expIndex}`}
                            />
                            {expErrors.companyInfo && <p id={`professional-company-error-${expIndex}`} className="error-text company-info-error">{expErrors.companyInfo}</p>}
                        </div>
                        <ul>
                            {exp.points.map((p, pointIndex) => (
                                <li key={pointIndex} className="editable-list-item">
                                    <EditableTextArea
                                        name={`point-${expIndex}-${pointIndex}`}
                                        value={p}
                                        onChange={(value) => onProfessionalExperiencePointChange(expIndex, pointIndex, value)}
                                        dictionary={dictionary}
                                        showPopover={showPopover}
                                        className={expErrors.points?.[pointIndex] ? 'has-error' : ''}
                                        aria-label={`Point ${pointIndex + 1} for experience ${expIndex + 1}`}
                                        aria-invalid={!!expErrors.points?.[pointIndex]}
                                        aria-describedby={`professional-point-error-${expIndex}-${pointIndex}`}
                                        placeholder="Accomplishment or responsibility"
                                    />
                                    <button onClick={() => onRemoveProfessionalExperiencePoint(expIndex, pointIndex)} className="remove-item-button" aria-label={`Remove point ${pointIndex + 1}`}>
                                        <span className="material-icons">remove_circle_outline</span>
                                    </button>
                                    {expErrors.points?.[pointIndex] && <p id={`professional-point-error-${expIndex}-${pointIndex}`} className="error-text item-error">{expErrors.points[pointIndex]}</p>}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => onAddProfessionalExperiencePoint(expIndex)} className="add-item-button">
                            <span className="material-icons">add_circle_outline</span>
                            Add Point
                        </button>
                        <button onClick={() => onRemoveProfessionalExperience(expIndex)} className="remove-exp-button" aria-label={`Remove professional experience ${expIndex + 1}`}>
                            <span className="material-icons">delete</span>
                            Remove Experience
                        </button>
                    </div>
                )
            })}
            <button onClick={onAddProfessionalExperience} className="add-item-button add-exp-button">
                <span className="material-icons">add_circle</span>
                Add Professional Experience
            </button>
        </div>}

        {data.foundationalExperience && <div className="resume-section">
          <h2>Foundational Leadership Experience</h2>
          {data.foundationalExperience.map((exp, expIndex) => {
            const expErrors = errors.foundationalExperience?.[expIndex] || {};
            return (
              <div key={expIndex} className="exp-item editable-exp-item">
                <div className="editable-field-group">
                    <div className="editable-h3-group">
                        <span className="material-icons">foundation</span>
                        <EditableField
                            name="role"
                            value={exp.role}
                            onChange={(e) => onFoundationalExperienceChange(expIndex, 'role', e.target.value)}
                            dictionary={dictionary}
                            showPopover={showPopover}
                            className={`editable-h3 ${expErrors.role ? 'has-error' : ''}`}
                            placeholder="Role / Title"
                            aria-label={`Role for foundational experience ${expIndex + 1}`}
                            aria-invalid={!!expErrors.role}
                            aria-describedby={`foundational-role-error-${expIndex}`}
                        />
                    </div>
                    {expErrors.role && <p id={`foundational-role-error-${expIndex}`} className="error-text role-error">{expErrors.role}</p>}
                </div>
                <div className="editable-field-group">
                     <EditableField
                        name="companyInfo"
                        value={exp.companyInfo}
                        onChange={(e) => onFoundationalExperienceChange(expIndex, 'companyInfo', e.target.value)}
                        dictionary={dictionary}
                        showPopover={showPopover}
                        className={`company-info ${expErrors.companyInfo ? 'has-error' : ''}`}
                        placeholder="Company | Location | Dates"
                        aria-label={`Company info for foundational experience ${expIndex + 1}`}
                        aria-invalid={!!expErrors.companyInfo}
                        aria-describedby={`foundational-company-error-${expIndex}`}
                    />
                    {expErrors.companyInfo && <p id={`foundational-company-error-${expIndex}`} className="error-text company-info-error">{expErrors.companyInfo}</p>}
                </div>
                <ul>
                    {exp.points.map((p, pointIndex) => (
                      <li key={pointIndex} className="editable-list-item">
                        <EditableTextArea
                          name={`point-${expIndex}-${pointIndex}`}
                          value={p}
                          onChange={(value) => onFoundationalExperiencePointChange(expIndex, pointIndex, value)}
                          dictionary={dictionary}
                          showPopover={showPopover}
                          className={expErrors.points?.[pointIndex] ? 'has-error' : ''}
                          aria-label={`Point ${pointIndex + 1} for experience ${expIndex + 1}`}
                          aria-invalid={!!expErrors.points?.[pointIndex]}
                          aria-describedby={`foundational-point-error-${expIndex}-${pointIndex}`}
                          placeholder="Accomplishment or responsibility"
                        />
                        <button onClick={() => onRemoveFoundationalExperiencePoint(expIndex, pointIndex)} className="remove-item-button" aria-label={`Remove point ${pointIndex + 1}`}>
                          <span className="material-icons">remove_circle_outline</span>
                        </button>
                        {expErrors.points?.[pointIndex] && <p id={`foundational-point-error-${expIndex}-${pointIndex}`} className="error-text item-error">{expErrors.points[pointIndex]}</p>}
                      </li>
                    ))}
                </ul>
                <button onClick={() => onAddFoundationalExperiencePoint(expIndex)} className="add-item-button">
                  <span className="material-icons">add_circle_outline</span>
                  Add Point
                </button>
                <button onClick={() => onRemoveFoundationalExperience(expIndex)} className="remove-exp-button" aria-label={`Remove foundational experience ${expIndex + 1}`}>
                  <span className="material-icons">delete</span>
                  Remove Experience
                </button>
              </div>
            )
          })}
          <button onClick={onAddFoundationalExperience} className="add-item-button add-exp-button">
            <span className="material-icons">add_circle</span>
            Add Foundational Experience
          </button>
        </div>}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);