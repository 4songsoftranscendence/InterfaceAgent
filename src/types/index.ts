// ============================================
// DESIGN SCOUT — Type Definitions (v2)
// ============================================
// Expanded with deep UX research-informed scoring dimensions

export interface ScoutConfig {
  urls: string[];
  category?: string;
  briefGoal?: string;
  depth?: "quick" | "standard" | "deep";
  outputDir?: string;
}

export interface CrawlResult {
  url: string;
  pageTitle: string;
  metaDescription?: string;
  screenshots: Screenshot[];
  fonts: string[];
  colors: string[];
  techStack?: string[];
  crawledAt: string;
}

export interface Screenshot {
  filepath: string;
  base64: string;
  viewport: string;
  section: string;
}

// ============================================
// Analysis Output (Enhanced with Psychology)
// ============================================

export interface UIAnalysis {
  url: string;
  overallScore: number;

  // Core Visual Scores (1-10 each)
  scores: {
    visualHierarchy: number;
    colorUsage: number;
    typography: number;
    spacing: number;
    ctaClarity: number;
    navigation: number;
    mobileReadiness: number;
    consistency: number;
    accessibility: number;
    engagement: number;
  };

  // Psychology & UX Principle Scores (1-10 each)
  principleScores: {
    cognitiveLoad: number;
    trustSignals: number;
    affordanceClarity: number;
    feedbackCompleteness: number;
    conventionAdherence: number;
    gestaltCompliance: number;
    copyQuality: number;
    conversionPsychology: number;
  };

  // Qualitative Analysis
  strengths: string[];
  weaknesses: string[];
  patterns: DesignPattern[];
  antiPatterns: AntiPattern[];

  // Extracted Design Tokens
  designTokens: {
    primaryColors: string[];
    accentColors: string[];
    neutralColors: string[];
    fontFamilies: string[];
    headingStyle: string;
    bodyStyle: string;
    buttonStyle: string;
    spacingSystem: string;
    borderRadius: string;
    shadowStyle: string;
  };

  // Principle-Based Observations
  principleNotes: {
    normanDoors: string[];
    hicksViolations: string[];
    fittsIssues: string[];
    trunkTest: string[];
    vonRestorff: string;
    serialPosition: string;
    peakEnd: string;
    hookModel: string;
  };

  rawAnalysis: string;
}

export interface DesignPattern {
  name: string;
  description: string;
  location: string;
  effectiveness: "high" | "medium" | "low";
  principle?: string;
}

export interface AntiPattern {
  name: string;
  description: string;
  severity: "critical" | "moderate" | "minor";
  category: "dark-pattern" | "ux-violation" | "accessibility";
  recommendation: string;
}

// ============================================
// Design Brief (Enhanced)
// ============================================

export interface DesignBrief {
  id: string;
  createdAt: string;
  category: string;
  goal: string;

  executiveSummary: string;
  targetAudience: string;

  recommendedApproach: {
    layout: string;
    colorStrategy: string;
    typographyStrategy: string;
    ctaStrategy: string;
    contentStructure: string;
    interactionPatterns: string;
  };

  psychologyStrategy: {
    hookModel: string;
    trustBuilding: string;
    frictionReduction: string;
    conversionTactics: string;
    emotionalDesign: string;
  };

  designSystem: {
    suggestedPalette: string[];
    suggestedFonts: string[];
    spacingNotes: string;
    componentList: string[];
  };

  buildPrompts: {
    heroSection: string;
    navigation: string;
    socialProof: string;
    features: string;
    pricing: string;
    testimonials: string;
    howItWorks: string;
    faq: string;
    cta: string;
    footer: string;
    overall: string;
  };

  analyzedSites: {
    url: string;
    score: number;
    keyTakeaway: string;
  }[];
}

export interface LibraryEntry {
  id: string;
  category: string;
  url: string;
  analysis: UIAnalysis;
  brief?: DesignBrief;
  tags: string[];
  createdAt: string;
}
