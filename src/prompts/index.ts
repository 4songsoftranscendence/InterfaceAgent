// ============================================
// DESIGN SCOUT — Prompt Library v3
// ============================================
// Optimized for structured JSON output with vision-capable LLMs:
// - Explicit instructions with context/motivation
// - Positive framing (what TO do, not what NOT to do)
// - Reduced markdown to match desired JSON output style
// - Few-shot examples for scoring calibration
// - Uncertainty permission to reduce hallucination
// - Quality modifiers requesting depth and specificity

export const SYSTEM_PROMPT = `You are analyzing websites through the lens of established UI/UX psychology and design principles. Your role is to evaluate screenshots the way a senior design researcher and behavioral psychologist would — identifying specific, testable patterns and connecting observations to named principles.

Your analysis framework draws from these sources, and you should reference them by name:
- Don Norman's 6 design principles (affordances, signifiers, mapping, feedback, constraints, conceptual models)
- Steve Krug's usability laws (the Trunk Test, scanning behavior, satisficing)
- Jon Yablonski's 21 Laws of UX (Hick's, Fitts's, Jakob's, Miller's, Von Restorff, Serial Position, Peak-End, Doherty Threshold, Aesthetic-Usability, Goal-Gradient, Tesler's, Postel's, plus all Gestalt principles)
- Refactoring UI tactics (hierarchy via size+weight+color, spacing systems, shadow hierarchy, button hierarchy)
- Nir Eyal's Hook Model (Trigger, Action, Variable Reward, Investment)
- Nielsen's 10 Usability Heuristics
- Conversion psychology (50ms Halo Effect, social proof hierarchy, loss aversion, anchoring, scarcity, reciprocity, cognitive fluency, goal-gradient, endowed progress)

When evaluating a screenshot, assess these things in this order:
1. What catches the eye in the first 50ms? Is that the RIGHT element to catch attention? (Aesthetic-Usability Effect, Von Restorff)
2. Where does the eye travel next? What's the visual flow? (Gestalt Continuity, F/Z-pattern, visual hierarchy via Refactoring UI's 3 levers)
3. How many decisions does the user face at any point? (Hick's Law — flag anything above 7 options)
4. Can you pass the Trunk Test? (Site identity, page name, sections, location indicator, search)
5. Do interactive elements look interactive? Do non-interactive elements accidentally look clickable? (Norman: affordances + signifiers)
6. Does every action appear to produce feedback? (Norman: feedback, Doherty: under 400ms)
7. Is spacing creating correct groupings? (Gestalt Proximity — space between groups must exceed space within groups)
8. Does copy speak in user language or company jargon? (Nielsen Heuristic 2, Krug's "remove half the words" rule)
9. Are there dark patterns present? (Confirm-shaming, forced continuity, misdirection, sneak-into-basket)

Be specific and opinionated. Reference principles by name. Instead of "good use of whitespace," say something like "the 48px gap between feature cards creates clear Gestalt proximity groups, but the 16px gap between the card title and the section heading above it makes the label feel orphaned from its content." Go beyond surface-level observations to identify the psychological mechanisms at work.

If you cannot confidently assess a dimension from the available screenshots, indicate low confidence rather than guessing. Accurate uncertainty is more valuable than fabricated precision.`;

export const ANALYZE_SCREENSHOT_PROMPT = `Analyze this website screenshot using the full depth of UI/UX psychology and design principles. Go beyond surface observations — identify the specific psychological mechanisms at work and connect every observation to a named principle.

PART A — CORE VISUAL SCORES
Score each dimension 1-10 with specific reasoning tied to named principles.

1. Visual Hierarchy: Evaluate whether hierarchy is achieved through Refactoring UI's 3 levers (size + weight + color working together) or size alone (weaker). Assess Von Restorff — is the most important element visually isolated and distinct? Assess Serial Position — are critical items placed at the start or end of sequences where they'll be remembered?

2. Color Usage: Evaluate whether the palette follows the 80/15/5 rule (neutrals/primary/accent). Assess whether color serves hierarchy and meaning rather than decoration. On colored backgrounds, check whether text uses the same hue at different saturation (good) or flat gray (poor). Check semantic color consistency (red for errors, green for success throughout).

3. Typography: Evaluate whether the type scale follows a constrained system with intentional size jumps. Assess whether headings are distinguished by weight+color+size together (strong) or size alone (weak). Check line-height (tighter for headings, generous for body), letter-spacing on uppercase text, and baseline alignment of mixed sizes.

4. Spacing and Layout: Evaluate whether a consistent spacing scale exists (4/8/16/24/32/48/64px). Apply Gestalt Proximity — space BETWEEN groups should be clearly larger than space WITHIN groups. Labels should sit closer to their fields than to adjacent fields above. Section gaps should be 64px or more. Cards should have more gap between them than internal padding.

5. CTA Clarity: Apply Fitts's Law — is the primary CTA at least 44px tall and positioned where attention already lands? Apply Hick's Law — is there ONE clear primary action per viewport? Evaluate button hierarchy — primary (solid, high-contrast), secondary (outline), tertiary (link-style). Assess CTA copy — specific action verb ("Start free trial") outperforms generic labels ("Submit").

6. Navigation: Apply Jakob's Law — does nav follow conventions for this site category? Apply Miller's Law — 7 or fewer top-level items. Run the Krug Trunk Test: can you identify site identity, page name, major sections, local options, "you are here" indicator, and search?

7. Mobile Readiness: Evaluate touch targets against standards (44x44pt Apple, 48x48dp Google Material). Assess thumb-zone placement for primary actions. Check content prioritization for narrow viewports.

8. Consistency: Apply Gestalt Similarity — do same-function elements share identical visual treatment? Same button style, same link color, same card pattern throughout. Evaluate design system discipline.

9. Accessibility: Evaluate against WCAG 2.2 AA — contrast 4.5:1 for text, 3:1 for large text. Check for visible focus indicators. Assess whether color is the sole conveyor of any meaning. Evaluate semantic heading structure.

10. Engagement: Apply Peak-End Rule — is there a clear "peak moment" and does the page end strongly? Apply Aesthetic-Usability Effect — does the visual quality create forgiveness and desire to explore?

PART B — PSYCHOLOGY AND PRINCIPLE SCORES
Score each dimension 1-10 with the same level of specificity.

11. Cognitive Load: Count decisions per decision point (Hick's Law). Evaluate information grouping against Miller's Law (7 plus or minus 2). Assess chunking, progressive disclosure, and whether information is dumped all at once or revealed strategically.

12. Trust Signals: Rate social proof quality on this hierarchy (weakest to strongest): vague numbers, company logos, named testimonials with photos and titles, detailed case studies with metrics. Evaluate the 50ms professional polish test. Check for security indicators.

13. Affordance Clarity: Apply Norman's principles — do all interactive elements look interactive (raised buttons, underlined links, pointer cursor changes implied)? Identify any Norman Doors (elements where signifiers contradict actual function). Check whether ghost buttons are distinguishable from decorative borders.

14. Feedback Completeness: Evaluate whether every action would produce visible, immediate response. Apply Doherty Threshold — would interactions feel responsive under 400ms? Check for loading states, specific error states, and success confirmations.

15. Convention Adherence: Apply Jakob's Law — logo top-left linking home, search in header, cart top-right for e-commerce, settings behind avatar for SaaS. Identify any conventions violated without good reason.

16. Gestalt Compliance: Evaluate each sub-principle: Proximity (grouping by space), Similarity (consistent styling equals consistent function), Figure-Ground (clear depth layers), Closure (partial elements suggesting more), Common Region (cards and containers for grouping), Continuity (eye flow guiding toward conversion).

17. Copy Quality: Apply Krug's "remove half the words" test. Identify any "happy talk" paragraphs (vague welcome messages that add no information). Evaluate headline scannability — can you grasp the meaning in under 5 words? Assess CTA specificity and whether error messages use plain language with solutions.

18. Conversion Psychology: Identify which ethical persuasion techniques are present — loss aversion framing, pricing anchoring, reciprocity (value before ask), endowed progress in flows, social proof. Flag any dark patterns: confirm-shaming, sneak-into-basket, misdirection, forced continuity.

PART C — PATTERNS, ANTI-PATTERNS, AND TOKENS

Extract design patterns with the UX principle each leverages. Identify anti-patterns with severity and specific recommendations. Extract design tokens including hex colors, fonts, spacing rhythm, border-radius, shadows, and neutral scale. Document principle-specific observations for: Norman Doors found, Hick's Law violations, Fitts's Law issues, Trunk Test gaps, Von Restorff target assessment, Serial Position placement, Peak-End quality, and Hook Model presence. List the top 3 strengths and top 3 weaknesses, each referencing a specific principle. Identify 2-3 steal-worthy elements worth adapting.

CALIBRATION EXAMPLES

Here is how scoring should be calibrated:

A score of 9-10 means: Exceptional execution that could be used as a teaching example. Stripe's payment form (real-time validation, specific button copy "Pay $49.99", success animation) scores 9 on Feedback Completeness.

A score of 7-8 means: Strong execution with minor gaps. A site with clear visual hierarchy and good CTA placement but slightly inconsistent button styles across sections.

A score of 5-6 means: Adequate but unremarkable. Functional but missing opportunities — generic "Submit" CTAs, no social proof, adequate but not strategic spacing.

A score of 3-4 means: Significant issues affecting usability. Multiple Hick's Law violations, Norman Doors present, poor contrast, no clear visual hierarchy.

A score of 1-2 means: Fundamental failures. No discernible hierarchy, inaccessible, dark patterns present, broken conventions.

OUTPUT FORMAT

Respond in valid JSON only. Begin your response with an opening brace. Include no preamble, no markdown fences, no explanation outside the JSON structure.

{
  "scores": {
    "visualHierarchy": 0, "colorUsage": 0, "typography": 0, "spacing": 0,
    "ctaClarity": 0, "navigation": 0, "mobileReadiness": 0,
    "consistency": 0, "accessibility": 0, "engagement": 0
  },
  "principleScores": {
    "cognitiveLoad": 0, "trustSignals": 0, "affordanceClarity": 0,
    "feedbackCompleteness": 0, "conventionAdherence": 0, "gestaltCompliance": 0,
    "copyQuality": 0, "conversionPsychology": 0
  },
  "overallScore": 0,
  "patterns": [{"name": "", "description": "", "location": "", "effectiveness": "high|medium|low", "principle": "which UX principle this leverages"}],
  "antiPatterns": [{"name": "", "description": "", "severity": "critical|moderate|minor", "category": "dark-pattern|ux-violation|accessibility", "recommendation": "specific fix"}],
  "designTokens": {
    "primaryColors": ["#hex"], "accentColors": ["#hex"], "neutralColors": ["#hex"],
    "fontFamilies": [], "headingStyle": "size/weight/color", "bodyStyle": "size/weight/color",
    "buttonStyle": "describe primary button styling", "spacingSystem": "describe rhythm",
    "borderRadius": "values observed", "shadowStyle": "describe shadow approach"
  },
  "principleNotes": {
    "normanDoors": ["list any signifier/function conflicts"],
    "hicksViolations": ["list any decision-overload points"],
    "fittsIssues": ["list any target-size or placement problems"],
    "trunkTest": ["list any missing Trunk Test elements"],
    "vonRestorff": "what is the single most visually distinct element, and is it the right one?",
    "serialPosition": "evaluate what is placed first and last in key sequences",
    "peakEnd": "describe the peak moment and how the page ends",
    "hookModel": "assess presence of trigger, action, variable reward, investment"
  },
  "strengths": ["top 3, each referencing a specific principle"],
  "weaknesses": ["top 3, each referencing a specific principle"],
  "stealWorthy": ["2-3 specific elements worth adapting, with principle"]
}`;

export const GENERATE_BRIEF_PROMPT = `Create a design brief that merges creative direction with behavioral psychology. This brief should be specific enough that a designer or developer could build from it directly — with exact colors, spacing values, and psychology-informed section sequencing.

Context:
- Category: {category}
- Goal: {goal}
- Sites analyzed: {siteCount}

Structure your brief around these sections. For each section, be as specific and actionable as possible. Include exact hex values, pixel measurements, font names, and specific copy guidance. Explain the psychological rationale behind each recommendation so the builder understands WHY each choice matters, because this produces better implementation decisions when they need to adapt.

SECTION 1: EXECUTIVE VISION
Write 2-3 sentences capturing the emotional and functional target. Name the dominant psychological principles that should guide the entire design. Example quality level: "This page should build trust through layered social proof and the Aesthetic-Usability Effect, while keeping cognitive load minimal per Hick's Law — no more than one decision per viewport section."

SECTION 2: PSYCHOLOGY STRATEGY
Cover each of these subsections with specific, actionable guidance:
- Hook Model: What external and internal triggers bring users? What is the minimum action to get started? What variable reward keeps them engaged? What investment (data, customization, content) makes the product stickier?
- Trust Building Sequence: How does trust build as the user scrolls? Map the specific progression (e.g., logo strip at fold, named testimonials mid-page, case study metrics before pricing, security badges near forms).
- Friction Reduction: Identify specific friction points to eliminate. Apply Tesler's Law — which complexity should the design absorb so the user does not have to? (e.g., timezone conversion, auto-fill, smart defaults)
- Conversion Tactics: Which ethical persuasion techniques to deploy — anchoring on pricing, loss aversion framing, reciprocity (value before ask), endowed progress in multi-step flows. Be specific about WHERE on the page each applies.
- Emotional Design: Define the emotional tone. Warm or clinical? Confident or humble? Energetic or calm? Specify how color temperature, imagery style, and copy tone create that emotion.

SECTION 3: DESIGN DIRECTION
Provide specific, implementable guidance for:
- Layout strategy tied to scanning patterns (F-pattern for text-heavy, Z-pattern for landing pages)
- Exact color palette with hex codes, following the 80/15/5 rule, with emotional rationale for each color
- Font pairing with the complete sizing hierarchy using Refactoring UI's 3-lever system (size + weight + color for each level of hierarchy)
- CTA strategy with button hierarchy (primary/secondary/tertiary), Fitts's Law sizing, and copy patterns
- Content structure — page sections in scroll order with the psychological purpose of each
- Interaction patterns — hover states, scroll animations, transitions, all respecting the Doherty Threshold (under 400ms)

SECTION 4: BUILD PROMPTS
Create detailed, copy-paste-ready prompts for each page section. Each prompt should include:
- Exact layout description with spacing values
- Color values to use (hex codes)
- Typography specs (font, size, weight, color for each text level)
- Content guidance describing what the headline should communicate (not exact words, so the builder can customize)
- Which psychology principle is being applied and why
- Interaction and animation notes with timing
- Accessibility requirements for that section
- Framework: "Use Tailwind CSS. React or HTML. Single file. Responsive."

Generate prompts for: hero, navigation, social proof, features, pricing, testimonials, how-it-works, FAQ, CTA section, footer, and one comprehensive mega-prompt for the entire page.

Respond in valid JSON only. Begin your response with an opening brace.

{
  "executiveSummary": "",
  "targetAudience": "",
  "recommendedApproach": {
    "layout": "", "colorStrategy": "", "typographyStrategy": "",
    "ctaStrategy": "", "contentStructure": "", "interactionPatterns": ""
  },
  "psychologyStrategy": {
    "hookModel": "", "trustBuilding": "", "frictionReduction": "",
    "conversionTactics": "", "emotionalDesign": ""
  },
  "designSystem": {
    "suggestedPalette": ["#hex with label"], "suggestedFonts": ["Primary: X", "Secondary: Y"],
    "spacingNotes": "", "componentList": ["list of components needed"]
  },
  "buildPrompts": {
    "heroSection": "", "navigation": "", "socialProof": "",
    "features": "", "pricing": "", "testimonials": "",
    "howItWorks": "", "faq": "", "cta": "", "footer": "", "overall": ""
  },
  "analyzedSites": [{"url": "", "score": 0, "keyTakeaway": ""}]
}`;

// ============================================
// Category-Specific Overlays
// ============================================
// Each overlay adds domain-specific evaluation criteria.
// Written with explicit instructions, positive framing, and context for WHY each check matters.

export const CATEGORY_OVERLAYS: Record<string, string> = {
  "saas-landing": `DOMAIN: SaaS Landing Page

Evaluate adherence to the standard SaaS conversion sequence:
Hero → Logo Strip → Features/Benefits → How It Works → Social Proof → Pricing → FAQ → Final CTA

Apply these SaaS-specific checks and incorporate findings into your scores and observations:

Value Prop Clarity: Assess whether you can articulate what this product does and who it serves within 5 seconds of viewing the hero. This is the single most important test for a SaaS landing page — if the hero fails the 5-second test, conversion will suffer regardless of everything else.

Pricing Psychology: Evaluate tier count (3 is optimal per Hick's Law). Check whether the recommended tier uses Von Restorff (visually distinct through elevation, color, or badge). Assess anchoring — is the most expensive option shown first or prominently to make the mid-tier feel like a deal? Check for monthly/annual toggle with explicit savings callout framed as loss avoidance ("Save $240/year").

Free Trial Friction: Evaluate whether the commitment level is clear. "Start Free Trial" that requires a credit card creates higher friction (lower conversion, higher-quality leads) — assess whether the page communicates this clearly.

Social Proof Hierarchy: Rate the progression through the social proof strength ladder — vague numbers, logo strips, named testimonials from recognizable roles, detailed case studies with metrics. The strongest SaaS social proof comes from testimonials by people whose title matches the target buyer.

Feature Presentation: Assess whether benefits lead over features. "Save 10 hours/week" outperforms "Automated workflow engine." Each feature section should have a supporting visual that builds the user's conceptual model (Norman).

Objection Handling: Evaluate whether a FAQ section addresses the top 3 SaaS objections: price justification, switching cost/effort, and security/compliance.

Hook Model: Assess what external trigger would bring users back. Identify whether the page describes a clear "aha moment." Evaluate whether variable reward (what users discover or achieve) is communicated.

Convention Adherence: Apply Jakob's Law — if the page shows a dashboard preview, evaluate whether it follows familiar patterns from Salesforce, HubSpot, Notion, or Slack that the target audience already understands.`,

  "healthcare": `DOMAIN: Healthcare Product

Healthcare design must prioritize trust, anxiety reduction, and accessibility above conversion optimization. Healthcare visitors are often anxious, making decisions for vulnerable loved ones, or navigating unfamiliar processes. Every design choice should reduce anxiety and build confidence.

Apply these healthcare-specific checks:

Anxiety Reduction: Evaluate whether the design uses warm tones (soft blues, greens, warm neutrals rather than clinical whites). Assess imagery — real, diverse people in caring contexts build trust; stock photo clichés with stethoscopes on white backgrounds undermine it. Evaluate whether language is empathetic and plain, explaining any medical terminology.

Trust Architecture: Assess the layering of trust signals — HIPAA/compliance badges should be visible without being overwhelming. Provider credentials should be displayed prominently. Patient and family testimonials with full attribution (name, relationship, photo) carry the most weight. Awards, certifications, and years of service reinforce authority.

Accessibility (this is critical for healthcare): Healthcare sites serve elderly and disabled populations. WCAG 2.2 AA is the minimum standard. Body font size should be 16px or larger. Evaluate contrast, form field sizing, label clarity, and whether tab navigation would work. Score this dimension more strictly than for other categories.

Form Design: Healthcare forms produce anxiety. Evaluate whether forms use progressive steps with indicators, whether required fields are minimal per step, and whether field labels use plain language ("Your name" rather than "Patient Identifier").

Contact Accessibility: A phone number should be prominent in the header — many healthcare decisions happen via phone. Evaluate whether multiple contact methods are available (phone, chat, form, email).

CTA Sensitivity: Healthcare CTAs should feel low-commitment and warm. "Schedule a Free Consultation" and "Speak with a Care Advisor" are appropriate. Urgency and scarcity tactics are inappropriate in healthcare contexts and should be flagged as anti-patterns if present.

Cognitive Load (critical for healthcare): Stressed, elderly, or cognitively impaired users need minimal choices per screen, large clear buttons, and no dense information blocks. Apply Hick's Law strictly.

Emotional Ending: Apply Peak-End Rule — the last touchpoint should reassure. "We'll be in touch within 24 hours" with a warm confirmation outperforms a cold "Form submitted."`,

  "ecommerce": `DOMAIN: E-Commerce

E-commerce design directly affects revenue. Every friction point has measurable financial impact (Expedia removed ONE form field and gained $12M annually). Evaluate with this commercial lens.

Apply these e-commerce-specific checks:

Product Imagery: Assess quality, angle variety, zoom capability, and whether both white-background clarity shots and lifestyle context shots are present.

Add-to-Cart Flow: Apply Fitts's Law — the button should be large, high-contrast, and within thumb reach on mobile. Evaluate whether it is sticky on scroll. Assess immediate feedback — does the cart icon animate, does the count update visibly?

Cart Persistence: Apply Tesler's Law — evaluate whether the cart survives page navigation and session changes. Users should never have to redo work.

Trust Signals: Evaluate security badge placement near payment forms, return policy visibility, shipping information clarity, and customer review authenticity (reviews with photos are strongest).

Urgency and Scarcity: If "Only 3 left!" or countdown timers are present, evaluate whether they appear authentic or manufactured. Flag fake scarcity as a dark pattern — this is one of the most common e-commerce anti-patterns.

Cross-Sell Ethics: "Customers also bought" should provide genuine recommendations. Pre-checked add-ons in cart are a sneak-into-basket dark pattern — flag them.

Checkout Friction: Count steps from cart to purchase. Evaluate guest checkout availability, form field count (fewer is better — each field costs conversion), and auto-fill support.

Search: Apply Fitts's Law — search should be prominent, large, and positioned in the header or centered. Evaluate autocomplete, typo tolerance, and filter/sort options.

Price Presentation: Assess clarity and prominence. Evaluate anchoring (original price crossed out, savings calculated for the user). Check for hidden fees that only appear at checkout — flag as dark pattern.`,

  "portfolio": `DOMAIN: Portfolio / Personal Brand

The portfolio site itself IS the primary work sample. If the portfolio is poorly designed, nothing else matters — the site must demonstrate the quality of work being sold.

Apply these portfolio-specific checks:

First Impression: Apply the 50ms test strictly. The site's own design quality is the proof of capability. Evaluate whether it demonstrates genuine design skill or relies on a template.

Case Study Depth: Assess whether projects have dedicated case studies with problem/process/outcome structure, or just screenshot galleries. Case study depth signals professionalism and strategic capability.

Project Navigation: Evaluate friction in browsing work. Gallery grid to detail page to back to grid should be smooth. Assess keyboard navigation support.

Personal Brand: Evaluate whether there is a consistent visual identity — unique typography, color palette, or layout that feels intentional rather than templated.

Contact/Hire CTA: Assess accessibility from every page. Should be fixed in nav or floating. Specific language ("Let's work together") outperforms generic ("Contact").

Performance: Portfolios are image-heavy. Evaluate implied loading strategy — are images likely optimized? Is lazy loading suggested by the layout?`,

  "startup": `DOMAIN: Startup Landing Page

Startups must communicate vision, credibility, and urgency simultaneously. The 5-second test is make-or-break.

Apply these startup-specific checks:

Problem/Solution Clarity: Evaluate whether you can understand WHAT problem they solve and HOW within one viewport. This is the single most important test.

"Why Now?" Narrative: Assess whether there is a compelling reason this product exists now — market timing, technology shift, regulatory change.

Traction Signals: Evaluate credibility indicators — user count, revenue milestones, growth metrics, press mentions, investor logos. Even early-stage signals matter ("500+ beta users", "Backed by Y Combinator").

Memorability: Apply Von Restorff — evaluate whether the site is distinctive and memorable against the thousands of similar startup pages, or whether it looks like another Stripe-clone template.

Waitlist/Early Access: If present, evaluate friction (email-only is ideal) and whether endowed progress is used ("You're number 247 on the waitlist").`,

  "agency": `DOMAIN: Agency Website

Agency sites must demonstrate capability through the site itself AND through showcased work. The credibility gap between claimed and demonstrated quality is the most important thing to evaluate.

Apply these agency-specific checks:

Site as Portfolio: Evaluate whether the agency's own website demonstrates the quality of work they claim to deliver. If they sell "world-class design" but use a generic template, flag this as a critical credibility gap.

Case Study Quality: Assess depth — surface-level galleries vs detailed problem/process/solution/results narratives. Real metrics ("Increased conversion 40%") outperform vague claims ("Improved the user experience").

Process Communication: Evaluate whether the methodology section feels proprietary and considered, or generic ("Discovery, Design, Development, Launch").

Social Proof: Assess client logo recognizability, industry relevance, and whether testimonials come from decision-makers (VP/CEO) rather than unnamed "clients."

Contact Flow: Apply Hick's Law and Tesler's Law — evaluate whether starting a conversation is easy or whether a 15-field RFP form creates unnecessary friction.`,
};

// ============================================
// Section Build Prompts
// ============================================
// Each prompt is written to be copy-pasted directly into an AI code tool.
// They are explicit, specific, and include context for WHY each choice matters.
// They include exact values, framework instructions, and accessibility requirements.

export const SECTION_PROMPTS: Record<string, string> = {

  "hero-saas": `Build a SaaS hero section optimized for conversion. Include as many relevant details and interactions as possible. Go beyond the basics to create a polished, production-ready implementation.

Layout: Split layout — content area on the left taking 60% width, product screenshot on the right taking 40%. Content area vertically centered. Maximum content width 1280px, centered with auto margins. Vertical padding 96px top, 64px bottom.

Headline: Maximum 8 words. Communicate the OUTCOME the product delivers, framed as a transformation or using loss aversion where appropriate ("Stop losing leads to slow follow-up" outperforms "Get more leads faster"). Use 48-60px font size, weight 700, color near-black (gray-900 or #111827). This is the element that should pass the Von Restorff test — it should be the most visually dominant thing in the viewport.

Subheadline: 1-2 sentences explaining the mechanism — HOW the product delivers the outcome. This builds the user's conceptual model (Norman's principle). Use 18-20px, weight 400, color gray-600 (#4B5563). Place 16px below the headline.

Primary CTA: Solid button with high-contrast background using the brand's primary color. White text, 16px weight 600. Minimum height 48px, minimum width 200px, border-radius 8px. Copy should be a specific action verb with reduced friction: "Start Free Trial — No Credit Card" or "Get Started Free." Place 32px below the subheadline. The button should be the second-most visually prominent element after the headline (Fitts's Law — large target where attention already is).

Secondary CTA: Text link directly below the primary button, 14px, gray-500, with an arrow or play icon: "Watch 2-min demo" or "See how it works." Place 12px below the primary CTA.

Social proof strip: Below the CTA area, 48px gap. Text "Trusted by 500+ teams" in 14px gray-400, then 5-6 company logos in grayscale, 28-32px height, evenly spaced. This applies the Bandwagon Effect immediately after the CTA to reduce post-click anxiety.

Background: Warm off-white (#FAFAF8 or #F9FAFB) with a subtle gradient or dot pattern. Pure white is too harsh for extended reading.

Animation: Content fades in on load with 200ms delay and 400ms duration — within the Doherty Threshold. Product screenshot has a subtle float or shadow-lift effect. Stagger the social proof logos appearing with 50ms delays between each.

Accessibility: All text passes WCAG 2.2 AA contrast (4.5:1 minimum). CTA button has a visible focus ring (2px offset, primary color). Product screenshot has descriptive alt text. The headline is an h1 element.

Use Tailwind CSS. React or HTML. Single file. Mobile-first responsive breakpoints — stack vertically on mobile with content above the image.`,

  "hero-healthcare": `Build a healthcare hero section optimized for anxiety reduction and trust building. Healthcare visitors are often anxious or making decisions for vulnerable loved ones — every element should reduce anxiety and build confidence rather than create urgency.

Layout: Full-width section with warm imagery. Content left-aligned or centered. Generous vertical padding: 128px top, 96px bottom. Maximum content width 720px for centered layout.

Headline: Warm, outcome-focused, using sentence case. Emphasize CARE and OUTCOMES rather than technology or features. "Compassionate care for the ones you love" outperforms "AI-powered healthcare platform." Use 40-52px, weight 600-700, warm dark color (#1A202C or #2D3748). Sentence case, never ALL CAPS (all caps feels aggressive in healthcare contexts).

Subheadline: Combine the value proposition with immediate social proof to build trust. "Join 2,000+ families who found the right care" or "Rated 4.9 out of 5 by families nationwide." Use 18-20px, weight 400, warm gray (#4A5568). Place 16px below headline.

Primary CTA: LOW-COMMITMENT language is essential. "Schedule a Free Consultation" or "Speak with a Care Advisor" are appropriate. Use a warm-toned button — soft teal (#2E8B8B), calming blue (#4A7FB5), or warm blue (#3B82B6). Minimum height 52px. Border-radius 8-12px. White text, 16px weight 600.

Phone number: Display prominently near the CTA — "Or call us: (555) 123-4567" in 16px with a phone icon. Many healthcare decisions happen via phone. Make it a clickable tel: link on mobile.

Imagery: Real people, warm lighting, diverse representation showing care interactions and families. Use a large background image or side image with a warm color overlay if needed for text contrast. The imagery should convey warmth and human connection.

Color palette: Warm palette throughout. Backgrounds in cream (#FFF9F0) or warm gray (#F5F3F0). Primary actions in soft teal or calming blue. Accent in warm coral (#E8927C) for highlights only. The Aesthetic-Usability Effect is critical — warmth equals trust in healthcare.

Trust badges: Below the hero, 48px gap. Small consistent icons for: HIPAA Compliant, years in service, certifications, and satisfaction rating. Gray-500 text, 14px.

Accessibility (critical for healthcare audiences): Body text minimum 18px. All contrast ratios 4.5:1 or higher (aim for AAA). Touch targets minimum 48px. Healthcare audiences include elderly users — design for reduced vision and motor control.

Animation: Gentle fade-in only. No aggressive or fast animations. Content appears over 600ms with ease-out timing. This matches the calm, reassuring tone.

Use Tailwind CSS. React or HTML. Single file. Mobile-first responsive — stack content above imagery on mobile. Phone number should be large and tappable.`,

  "hero-startup": `Build a startup hero section that communicates innovation and creates urgency. The design itself should feel distinctive — apply Von Restorff to make this memorable against the thousands of similar startup pages.

Layout: Centered content for maximum impact. Large headline dominates the viewport. Product visual or animation below. Vertical padding 96-128px. Maximum headline width 800px centered.

Headline: Bold, provocative, memorable. 5-7 words maximum. Should stop someone from scrolling. Frame the problem ("Email is broken") or the transformation ("Turn conversations into customers"). Use 56-72px, weight 800, high contrast. Consider using a distinctive display font rather than the same sans-serif every startup uses.

Subheadline: One sentence combining the concrete mechanism with social proof. "The AI CRM that books meetings while you sleep. Used by 500+ sales teams." Use 20-24px, weight 400, gray-600. Place 20px below headline.

CTA: "Get Early Access" or "Join the Waitlist" — scarcity language creates exclusivity. Consider adding a live count: "Join 2,847 teams on the waitlist" (combines Endowed Progress with Social Proof). Large button, 52px height minimum. Use a bold, distinctive color.

Visual distinctiveness: This is where Von Restorff matters most. Consider: a dark hero (dark mode heroes stand out in a sea of white pages), an unusual color combination, a distinctive typography choice, or asymmetric layout with overlapping elements. The visual treatment should feel fresh rather than templated.

Background: Consider dark (#0F172A or #1A1A2E) with a gradient accent, or a bold gradient. Move away from the standard white/light-gray that every startup uses.

Animation: Something memorable but performant — headline text revealing word-by-word, a counter animating upward, or a product demo auto-playing in a device frame. The complete animation should finish within 2 seconds and feel polished.

Use Tailwind CSS. React or HTML. Single file. Mobile-first responsive.`,

  "social-proof": `Build a social proof section with layered credibility. Social proof is more effective when it uses multiple forms simultaneously — use at least two layers from the strength hierarchy: numbers, logos, named testimonials with photos and titles, case studies with metrics, or real-time activity indicators.

Layout:
Section header: Write something specific rather than generic — "Trusted by teams who care about [domain outcome]" outperforms "What our customers say." Use 32-36px, weight 700, gray-900. Center-aligned. Optional subheadline in 18px gray-500.

Logo strip: 6-8 company logos in grayscale, consistent height (28-32px), horizontally centered with 48px spacing between logos. Subtle hover effect that shows the company name or reveals color. Place 48px below the section header.

Testimonial cards: 3 cards in a row on desktop (stack on mobile). Each card contains: circular headshot (64px diameter), full name in weight 600 gray-800, title + company in weight 400 gray-500, and a 2-3 sentence quote in weight 400 gray-700 with subtle italic styling. Cards use 24px internal padding, subtle shadow (shadow-sm), and border-radius 12px. Gap between cards: 32px (must exceed internal padding for correct Gestalt Proximity).

One testimonial should be from the most impressive company or title. Quotes should be SPECIFIC — "NymbleAI cut our enrollment time from 3 weeks to 4 days" vastly outperforms "Great product, highly recommend!"

Optional metric callout: A single large statistic below the testimonials — "40% faster onboarding" or "$2.3M saved across our customers." This should use Von Restorff (visually distinct from the testimonial cards through different background, larger font, or accent color).

Visual hierarchy: Apply Refactoring UI's weight+color approach. Company names in weight 600 gray-700. Titles in weight 400 gray-500. Quotes in weight 400 gray-800 at a slightly larger font size than the attribution.

Animation: Logo strip fades in on scroll entry. Testimonial cards stagger in with 100ms delay between each. Keep all animations under 400ms per element (Doherty Threshold).

Use Tailwind CSS. React or HTML. Single file. Responsive — single column on mobile.`,

  "pricing-standard": `Build a pricing section using anchoring psychology and clear visual hierarchy. This section has the highest direct impact on revenue of any section on the page.

Psychology applied:
- Anchoring: Display the most expensive tier first or prominently to set the reference price, making the recommended tier feel like a deal.
- Von Restorff: The recommended tier MUST be visually distinct — elevated, different border or background, a "Most Popular" badge.
- Hick's Law: 3 tiers is optimal. 2 feels limited, 4 or more creates decision paralysis.
- Loss Aversion: Frame savings as loss avoidance — "Save $240/year" rather than just "Annual pricing available."

Layout:
Toggle at top: Monthly/Annual switch. Annual selected by default (higher lifetime value). When annual is selected, display a savings callout: "Save 20% with annual billing" in the primary accent color. Place 48px above the cards.

3 cards side-by-side, 32px gap. Center card (recommended tier) is visually elevated: slight scale transform (1.03-1.05), deeper shadow (shadow-xl vs shadow-md for others), a colored top border or background tint, and a "Most Popular" or "Recommended" badge at the top.

Each card contains: plan name (18px weight 600), price displayed large (48px weight 700), billing period (14px gray-500), one-line plan description (14px gray-600), feature list with checkmarks (6-8 items max, 16px), and CTA button at the bottom.

CTA hierarchy: Recommended tier gets a solid primary-color button with white text. Other tiers get outline buttons (border only, primary color text). This leverages Fitts's Law — the eye goes to the highest-contrast element. All buttons minimum 44px height.

Feature list: Use checkmarks for included features, gray dashes for excluded. Bold the features unique to each tier. Add a "Compare all features" expandable section below the cards for users who need detail.

Below pricing: FAQ accordion with 4-6 questions addressing top purchase objections: "Can I switch plans?", "Is there a free trial?", "What happens when I cancel?", "Is my data secure?" Questions in weight 600 gray-900, answers in weight 400 gray-700. Accordion with chevron icons, smooth 200ms expand animation.

Money-back guarantee: If applicable, center it below the pricing cards with a small shield icon: "30-day money-back guarantee, no questions asked." This applies reciprocity — reducing risk is a form of giving value first.

Use Tailwind CSS. React or HTML. Single file. Responsive — stack cards vertically on mobile, recommended tier first.`,

  "features": `Build a features/benefits section that leads with outcomes rather than capabilities. Apply the Serial Position Effect — place the strongest benefit first and the second strongest last, because the middle items are least memorable.

Layout option (alternating rows): Full-width rows alternating image-left/text-right and text-left/image-right. Each row is a self-contained benefit block with 96px vertical spacing between rows. This zigzag pattern creates Gestalt Continuity that guides the eye down the page. 3-4 rows.

Each row contains: a headline of 5 words or fewer using an action verb ("Automate your follow-ups" outperforms "Automation Features"), a 2-sentence description explaining the benefit in user terms, and a product screenshot or illustration on the opposite side. Headlines in 28-32px weight 600 gray-900. Descriptions in 16-18px weight 400 gray-600.

Content approach: Benefits lead over features. "Save 10 hours per week" outperforms "Automated workflow engine." Users care about outcomes. Each headline should pass Krug's scanning test — if someone reads only the headlines, they should understand the full value proposition.

Visuals: Each feature needs a visual anchor — a product screenshot in context, a custom icon (48px, primary color), or a simple illustration. Provide a visual for every feature because it builds the user's conceptual model of how the product works (Norman's principle).

Spacing: 96px between feature rows. 48px internal padding in feature blocks. Headlines 8px from description. Image/content gap 48-64px. Clear Gestalt Proximity within each row.

Animation: Each row fades and slides in from its image side (left rows slide from left, right rows from right) on scroll entry. 400ms duration, ease-out. Stagger headline appearing 100ms before description.

Use Tailwind CSS. React or HTML. Single file. Responsive — stack image above content on mobile for all rows.`,

  "how-it-works": `Build a "How It Works" section that makes a complex product feel simple. This section applies Tesler's Law — it absorbs complexity from the user by presenting the experience as a clear, inevitable sequence.

Layout:
Section header: "How it works" in 32-36px weight 700 gray-900, centered. Subheadline: "Get started in minutes" or "Three steps to [outcome]" in 18px weight 400 gray-500. Place 48px above the steps.

3 steps in a horizontal row on desktop, vertical stack on mobile. Each step contains: a large number (48-60px, weight 700, primary color), a headline (20px weight 600 gray-900), and a 1-2 sentence description (16px weight 400 gray-600). Numbers should be the focal point of each step.

Connect the steps with a horizontal line or arrow between them on desktop (Gestalt Continuity — guides the eye through the sequence). On mobile, use a vertical line connecting the numbers.

Step content guidance:
- Step 1: The easiest action — "Create your free account" or "Connect your tools." Make it feel effortless. If the user may have already done this (e.g., they signed up already), that creates Endowed Progress.
- Step 2: The core action — "Set up your first workflow." Brief enough to avoid intimidation.
- Step 3: The reward/outcome — "Watch results roll in" or "See your first insights in hours." This is the variable reward from Eyal's Hook Model.

The numbered sequence creates Goal-Gradient Effect — once you see step 1, steps 2 and 3 feel like natural next moves, building psychological momentum toward conversion.

Optional: A CTA at the bottom of the sequence — "Ready to get started?" with a primary button. Place 48px below the steps.

Spacing: 64px between steps horizontally. 24px between number, headline, and description within each step.

Animation: Steps appear sequentially on scroll — step 1 first, then step 2 at 200ms delay, then step 3 at 400ms. Each fades in and slides up slightly. The connecting line draws itself between steps as they appear.

Use Tailwind CSS. React or HTML. Single file. Responsive.`,

  "testimonials": `Build a testimonials section with maximum credibility. The most effective testimonials are specific, attributed, and from people the target audience identifies with.

Layout option (featured + supporting): One large featured testimonial on the left (60% width) and 2 smaller testimonials stacked on the right (40% width). The featured testimonial gets a larger quote, larger photo, and the company logo displayed. This applies Von Restorff — the featured testimonial stands out.

Featured testimonial: Large quotation mark icon in primary color (decorative), quote text in 20px weight 400 gray-800, round headshot (96px), name in 16px weight 600, title + company in 14px gray-500, company logo (grayscale, 24px height) below.

Supporting testimonials: Cards with 20px padding, subtle shadow. Quote in 16px weight 400 gray-700, round headshot (48px), name in 14px weight 600, title + company in 12px gray-500.

Quote selection strategy — each testimonial should address a DIFFERENT value proposition or objection:
- Testimonial 1 (featured): The core outcome with specific metrics ("It saves us 12 hours per week on enrollment paperwork")
- Testimonial 2: The experience and support quality ("Onboarding was seamless — we were up and running in a day")
- Testimonial 3: The competitive comparison ("We switched from [competitor] and the difference was immediate")

Credibility hierarchy: Full name + Title + Company + Photo + optional LinkedIn link creates maximum credibility. Anonymous quotes create near-zero credibility. Include all available attribution.

Spacing: 32px gap between featured and supporting testimonials. 24px gap between supporting testimonial cards. Section padding 96px vertical.

Animation: Featured testimonial fades in first, supporting testimonials stagger in at 150ms delay each.

Use Tailwind CSS. React or HTML. Single file. Responsive — stack vertically on mobile.`,

  "faq": `Build a FAQ section that handles purchase objections and reduces pre-purchase anxiety. Each FAQ question should address a real concern that prevents conversion — this section is a sales tool presented as support.

Layout:
Section header: "Frequently asked questions" in 32-36px weight 700 gray-900. Optional subheadline: "Still have questions? Chat with us." with a link in primary color. Center-aligned. 48px below header, the questions begin.

Accordion format: Questions visible, answers collapsed. One open at a time to reduce cognitive load (Hick's Law). Two-column layout on desktop (questions split across columns), single column on mobile. 6-8 questions total.

Questions should use user language rather than company terminology. "Can I cancel anytime?" outperforms "What is the cancellation policy?" "How long does setup take?" outperforms "What is the implementation timeline?"

Question order (Serial Position Effect):
1. The number-one conversion blocker first (usually pricing or commitment related)
2. Product capability and setup questions in the middle
3. Trust/security question last (ends on a reassuring note, applying Peak-End Rule)

Answer framing: Apply loss aversion reduction. "You can cancel anytime — no contracts, no penalties, and your data is always exportable" addresses three fears in one answer. Be thorough and direct rather than hiding behind "Contact support."

Styling: Questions in 16px weight 600 gray-900. Answers in 16px weight 400 gray-700, with 16px padding below. Subtle separator line (gray-200) between items. Chevron icon on the right, rotating on expand. Smooth expand animation at 200ms (Doherty Threshold).

Use Tailwind CSS. React or HTML. Single file. Responsive.`,

  "cta-final": `Build a final CTA section — the closer at the bottom of the page. This section applies the Peak-End Rule: the ending of the page experience must be strong, confident, and emotionally resonant. A weak ending undermines everything above it.

Layout: Full-width band with a contrasting background — use a dark color (gray-900, #111827) if the page is light, or a primary-color tint. This creates strong Figure-Ground separation, making the final CTA feel like a distinct moment. Vertical padding 96-128px. All content centered. Maximum content width 600px.

Headline: Emotional and outcome-focused. 36-48px weight 700, white or high-contrast text. "Ready to transform your enrollment process?" or "Start delivering better care today." Address the desire rather than describing the product.

Subheadline: Optional, 18px weight 400, slightly lower contrast. A brief reinforcement of the value proposition or social proof: "Join 2,000+ teams already using [Product]."

CTA button: The largest button on the entire page. Full primary color, white text, 52-56px height, minimum 240px width, border-radius 8-12px. 18px weight 600. Specific copy: "Start Your Free Trial" or "Schedule a Demo Today."

Anxiety-reducing statements: Three small text items below the button, separated by dots or pipes: "No credit card required · Setup in 2 minutes · Cancel anytime." Use 14px gray-400 (on dark background). These directly address the three most common objections at the moment of decision.

This section has ONE purpose — conversion. Include no navigation links, no secondary CTAs, no footer-like elements, no distractions. Headline, button, reassurance. That is all.

Animation: Gentle background gradient shift or subtle pulse on the CTA button when it scrolls into view. Just enough to draw the eye without being jarring. 

Use Tailwind CSS. React or HTML. Single file. Responsive.`,

  "navigation": `Build a navigation bar that follows web conventions precisely. Navigation is where Jakob's Law matters most — users have deeply ingrained expectations. Innovation in navigation creates confusion rather than delight.

Layout:
Sticky header, 72-80px height on initial load, collapsing to 60-64px on scroll with a subtle shadow appearing (shadow-sm). Maximum content width 1280px centered. Horizontal padding 24-32px.

Left: Logo (maximum 32px height, linked to home page) + wordmark.
Center or left-of-center: 4-6 primary nav items. Each item has generous click targets — the full height of the nav bar is clickable, not just the text (Fitts's Law). Items in 15px weight 500 gray-700, with 32px horizontal spacing.
Right: "Login" text link in gray-600, then "Start Free Trial" primary button (solid background, white text, 40px height, border-radius 6px, weight 600).

Active state: Current page nav item has a clear visual indicator — either a 2px bottom border in primary color, primary-color text, or a subtle background tint. This is the "you are here" signal from Krug's Trunk Test.

Miller's Law: Maximum 7 top-level items including the CTA. Each label should be unambiguous and concise: "Pricing" rather than "Plans & Packages," "About" rather than "Our Story & Mission."

Dropdown menus (if needed): Maximum 2 levels deep. Show on hover with 200ms delay to prevent accidental triggers. Dropdown has a clear Common Region (white background, shadow-lg) and 8px border-radius.

Mobile: Hamburger icon (24px) on the right side. Opens a full-screen overlay with large tap targets (52px minimum height per item). Close button top-right. CTA button prominent at top of mobile menu list.

Hover states: Nav items transition to primary color on hover, 150ms transition. Dropdown appears with fade and slide, 200ms.

Accessibility: All nav items are focusable with visible focus rings. Mobile menu can be opened and closed with keyboard. Proper ARIA attributes on hamburger toggle and dropdown menus.

Use Tailwind CSS. React or HTML. Single file. Responsive.`,

  "footer": `Build a footer that serves as both navigation fallback and final trust reinforcement. Users who scroll to the footer are either looking for specific information or have not found what they need above — serve both cases.

Layout: Dark background (gray-900 or brand dark color, #111827) creating clear Figure-Ground separation from the page. Vertical padding 64px top, 48px bottom. Maximum content width 1280px centered.

Multi-column grid:
- Column 1 (wider): Logo (inverted for dark background) + 1-2 sentence company description in 14px gray-400, then social media icons (GitHub, LinkedIn, Twitter/X) in gray-500 with hover-to-white transition.
- Column 2: "Product" heading, then links: Features, Pricing, Integrations, API, Changelog.
- Column 3: "Company" heading, then links: About, Blog, Careers, Press Kit.
- Column 4: "Support" heading, then links: Help Center, Contact, Status Page, Documentation.

Column headings: 12px weight 600 uppercase, letter-spacing 0.05em, gray-500. Link items: 14px weight 400 gray-400, hover transition to white. Line-height 2.5 for comfortable click targets.

Bottom bar: Thin separator line (gray-800), then a bottom row with: copyright text on the left, and privacy/terms/accessibility links on the right. All in 13px gray-500.

Trust elements: Compliance badges (SOC 2, HIPAA, GDPR as applicable) displayed small and consistent, in gray-600. Physical address if applicable (builds trust for B2B).

Optional: Newsletter signup — simple inline form with email input + "Subscribe" button. "Get weekly insights" or similar value-framed label.

Desktop: 4-column grid. Tablet: 2x2 grid. Mobile: single column, stacked.

Use Tailwind CSS. React or HTML. Single file. Responsive.`,

  "overall-saas": `Build a complete SaaS landing page following the proven conversion sequence. Each section serves a specific psychological purpose — include all sections and implement each with full detail and polish. Go beyond basics to create a production-ready, fully-featured implementation.

PAGE STRUCTURE (scroll order with psychological purpose):

1. NAVIGATION — Jakob's Law compliance
Sticky header: Logo left, 5 nav items center (Product, Features, Pricing, Resources, About), "Login" text link + "Start Free Trial" primary button right. Collapses to 64px height on scroll with shadow. Mobile: hamburger menu.

2. HERO — 50ms impression + value proposition
Split layout. Left 60%: headline (8 words max, outcome-focused, 48-60px weight 700), subheadline (1-2 sentences explaining mechanism, 18-20px weight 400 gray-600), primary CTA button (48px+ height, specific verb like "Start Free Trial — No Credit Card"), secondary text link ("Watch 2-min demo"). Right 40%: product screenshot in browser/device frame with subtle shadow. Below hero content: "Trusted by 500+ teams" with 5-6 grayscale logos.

3. METRICS BAR — Bandwagon Effect with concrete numbers
4 statistics in a horizontal row with icons: "10,000+ users" | "500+ companies" | "99.9% uptime" | "4.8/5 on G2." Light background tint, 16px padding vertical.

4. FEATURES — Serial Position Effect (strongest first and last)
3-4 alternating left/right sections. Each: benefit headline (5 words, action verb), 2-sentence description in user terms, product screenshot or illustration. 96px gap between sections.

5. HOW IT WORKS — Tesler's Law (absorb complexity)
"Get started in 3 steps." Numbered steps with connecting line. Step 1: easiest action ("Sign up in 30 seconds"). Step 2: core action ("Set up your first workflow"). Step 3: the reward ("Watch results roll in").

6. TESTIMONIALS — Social proof at strongest form
1 featured testimonial (large quote, company logo, full attribution) + 2 supporting testimonials in cards. Each addresses a different value prop. Full attribution: name, title, company, photo.

7. PRICING — Anchoring + Von Restorff
3 tiers. Monthly/annual toggle (annual default, savings callout in accent color). Middle tier visually elevated with "Most Popular" badge, deeper shadow, slight scale. Feature comparison with checkmarks. Outline buttons on side tiers, solid primary on recommended.

8. FAQ — Objection handling
6-8 questions in accordion (one open at a time). Address: pricing, commitment level, security, setup time, support availability, differentiation. User language questions, thorough direct answers with loss-aversion framing.

9. FINAL CTA — Peak-End Rule (end strong)
Full-width dark or primary-tinted background. Emotional headline ("Ready to transform your workflow?"), one large CTA button (52px height), three anxiety-reducing micro-statements below ("No credit card · 2-min setup · Cancel anytime").

10. FOOTER — Trust reinforcement + navigation fallback
4-column dark footer: Logo + description + social icons, product links, company links, support links. Compliance badges. Copyright and legal links.

DESIGN SYSTEM:
Colors: 80% warm neutrals (#FAFAF8 backgrounds, #111827 text), 15% primary brand color (blues, teals — pick one), 5% accent for alerts and highlights. Define CSS custom properties for all colors.
Typography: One modern sans-serif font (Inter, Plus Jakarta Sans, or Geist). Scale: 14/16/18/20/24/30/36/48/60px. Headings: weight 700 near-black. Body: weight 400 gray-700. Tertiary text: weight 400 gray-500.
Spacing: Base unit 8px. Sections: 96-128px gap. Components: 24-48px internal padding. Elements: 8-16px gap. Use consistent multiples throughout.
Borders: Use shadows instead of borders for depth (Refactoring UI). Border-radius: 12px for cards, 8px for buttons, 6px for inputs.
Shadows: Two-part shadow system — tight dark shadow for crispness paired with larger soft shadow for atmosphere. sm for inputs, md for cards, lg for dropdowns, xl for modals and elevated elements.

Accessibility: WCAG 2.2 AA throughout. All text 4.5:1 contrast minimum. Visible focus rings on all interactive elements. Full keyboard navigation. Semantic HTML heading hierarchy (one h1, then h2s for sections). Touch targets 44px minimum. Reduced-motion media query respected.

Performance: Lazy load all images below the fold. Use a single variable font or system font stack. Implement skeleton loading states for dynamic content.

Use Tailwind CSS + React. Single file. Mobile-first responsive breakpoints (sm:640px, md:768px, lg:1024px, xl:1280px). Include smooth scroll behavior for nav links that anchor to sections.`,

  "overall-healthcare": `Build a complete healthcare landing page prioritizing trust, warmth, and accessibility. Healthcare visitors are often anxious or making decisions for loved ones — the entire experience should reduce anxiety and build confidence at every scroll position. Go beyond basics to create a polished, production-ready implementation.

PAGE STRUCTURE (anxiety-reduction sequence):

1. NAVIGATION — Trust-first design
Logo left, 4-5 nav items, phone number visible in header at all times ("Call us: (555) 123-4567" with phone icon), warm CTA button "Schedule Consultation" in soft teal or calming blue. Sticky header, 72px height.

2. HERO — Anxiety reduction + warmth
Full-width warm imagery showing real care interactions. Content left-aligned or centered over image with a warm overlay for text contrast. Headline emphasizing CARE and OUTCOMES (sentence case, 40-52px weight 700, warm dark #2D3748). Subheadline combining value with social proof ("Trusted by 2,000+ families"). Low-commitment CTA: "Schedule a Free Consultation" in soft teal. Phone number repeated below CTA. No urgency tactics.

3. TRUST BAR — Immediate credibility
Horizontal strip with warm background tint: "HIPAA Compliant" | "15+ Years Experience" | "4.9/5 Family Rating" | "Licensed in All 50 States" — each with a small icon. 14px weight 500.

4. SERVICES — Plain language, warm presentation
3-4 service cards or alternating sections. Each describes a service in FAMILY language (not clinical terminology). Warm icons or real photos. Headlines focus on outcomes: "Finding the right care for your loved one" rather than "Patient Placement Services."

5. HOW IT WORKS — Reduce process anxiety
"Getting started is simple" — 3 gentle steps using warm language. Step 1: "Tell us about your needs" (not "Submit intake form"). Step 2: "Meet your care team." Step 3: "Experience the difference." Warm illustrations or icons for each step.

6. TESTIMONIALS — Family stories
Focus on FAMILY testimonials (they are the decision makers). Full attribution including relationship: "Sarah M., Daughter of Resident." Emotional, specific quotes about care quality, peace of mind, and the experience of the process.

7. TEAM/CREDENTIALS — Authority with warmth
Team photos with warm expressions and real backgrounds. "Our Care Team" heading. Brief bios emphasizing both qualifications AND compassion. Certifications and credentials displayed.

8. FAQ — Address healthcare-specific anxieties
"Is my information protected?", "What insurance do you accept?", "Can I visit anytime?", "What happens in an emergency?", "How do I get started?" Warm, thorough, jargon-free answers.

9. CONTACT — Multiple channels, warm tone
"We're here for you" heading. Large phone number (clickable), email, simple contact form (4 fields maximum: name, email, phone, "How can we help?"), office address with embedded map. Warm closing: "We typically respond within 2 hours during business hours."

10. FOOTER — Compliance + accessibility
Compliance badges, accreditations, accessibility statement link. Phone number repeated. Warm closing line. Full sitemap links.

DESIGN SYSTEM:
Colors: Warm palette. Backgrounds: cream (#FFF9F0) or warm gray (#F5F3F0). Primary: soft teal (#2E8B8B) or calming blue (#4A7FB5). Accent: warm coral (#E8927C) for subtle highlights only. Text: warm dark (#2D3748 for headings, #4A5568 for body). Define CSS custom properties.
Typography: Humanist sans-serif (Source Sans Pro, Lato, or Nunito) — these feel warmer than geometric sans-serifs. Larger base size: 18px for body text. Headings: weight 600-700 in warm dark. Body: weight 400 in warm gray.
Spacing: Generous throughout. 128px between major sections. 48px component padding. Extra breathing room signals care and attention.
Imagery: Warm, authentic photography with real people, diverse representation, warm lighting. Absolutely no stock photo clichés.

Accessibility (CRITICAL):
- WCAG 2.2 AA minimum, aim for AAA on text contrast
- Minimum 18px body text throughout
- All interactive elements 48px minimum touch targets
- Color never the sole conveyor of information
- Full keyboard navigation with visible focus indicators
- Semantic HTML heading structure
- Reduced motion media query respected
- High contrast mode support

Use Tailwind CSS + React. Single file. Mobile-first responsive. Many healthcare visitors use mobile devices — prioritize the mobile experience.`,
};
