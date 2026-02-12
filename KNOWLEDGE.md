# 🧠 Design Scout Knowledge Base
## The Complete UI/UX Intelligence Document
> Everything you need to make AI-powered design analysis actually smart.
> This document feeds the prompt library in Design Scout.

---

# PART 1: THE CANON — Essential Books with Summaries

These are the books that shaped how the world thinks about UI/UX. Each summary distills the core insight that matters for automated design analysis.

---

## Tier 1: The Foundational Four (Read These First)

### 1. "The Design of Everyday Things" — Don Norman (1988, revised 2013)
**Core Insight:** Good design is invisible. Bad design screams.

Norman introduced the concepts that now underpin all UX thinking: *affordances* (what an object suggests you can do with it), *signifiers* (visual cues that communicate where to act), *mapping* (the relationship between controls and outcomes), and *feedback* (confirmation that something happened). His key argument is that when people struggle with a product, it's never the user's fault — it's a design failure. The "Gulf of Execution" (gap between what users want to do and how to do it) and the "Gulf of Evaluation" (gap between what happened and what users understand happened) are the two distances every designer must close.

**For Design Scout prompts:** When analyzing a site, check: Are interactive elements visually distinct from static ones? Do buttons look clickable? Do forms provide feedback? Is the relationship between navigation labels and page content obvious?

### 2. "Don't Make Me Think" — Steve Krug (2000, 3rd edition 2014)
**Core Insight:** A website should be self-evident. If users have to think about how to use it, you've already failed.

Krug's central law: every question mark that pops into a user's head when using your site adds cognitive load and reduces the chance they'll do what you want. His "trunk test" asks: if you were dropped onto any page blindfolded, could you answer: What site is this? What page am I on? What are the major sections? What are my options at this level? Where am I in the scheme of things? How can I search? He's also famous for arguing that people don't read web pages — they *scan* them, looking for words and phrases that match what they're after.

**For Design Scout prompts:** Score how quickly a visitor can answer: "What is this?" and "What should I do?" within the first 5 seconds of viewing a screenshot. Check if the page passes the "squint test" — can you tell what's important when the page is blurred?

### 3. "Laws of UX" — Jon Yablonski (2020, 2nd edition 2024)
**Core Insight:** 21 psychological laws govern how people interact with interfaces. Design with them, not against them.

The key laws, distilled:
- **Jakob's Law:** Users spend most time on *other* sites. They expect yours to work the same way. Don't reinvent navigation.
- **Fitts's Law:** The time to reach a target depends on distance and size. Make important buttons big and close to the user's cursor/thumb.
- **Hick's Law:** More choices = longer decisions. Reduce options to speed conversion.
- **Miller's Law:** People can hold ~7 items in working memory. Chunk information into groups of 5-9.
- **Aesthetic-Usability Effect:** People perceive beautiful designs as more usable, even if they're not. First impressions are disproportionately visual.
- **Von Restorff Effect:** The item that's visually different is the one people remember. Use contrast to make CTAs stand out.
- **Peak-End Rule:** People judge an experience based on how they felt at its most intense point and at the end.
- **Doherty Threshold:** Productivity soars when computer and user interact at pace (<400ms). Speed matters.
- **Postel's Law:** Be liberal in what you accept, conservative in what you send. Flexible inputs, consistent outputs.
- **Tesler's Law:** Every system has inherent complexity that cannot be removed — only moved. Decide who bears the complexity: the user or the system.

**For Design Scout prompts:** Check each law against the screenshots. Does the nav follow common conventions (Jakob)? Are CTAs large enough (Fitts)? Are there too many choices above the fold (Hick)? Is information chunked (Miller)? Does the most important element visually pop (Von Restorff)?

### 4. "Refactoring UI" — Adam Wathan & Steve Schoger (2018)
**Core Insight:** You don't need to be a designer to make things look good. You need a system.

This book is a cheat code for developers. The core principles: start with too much whitespace and remove it (not the reverse). Limit your color choices to a system of shades. Establish a type scale and stick to it. Use font weight/size/color for hierarchy, not just bold. Overlap elements to create depth. Use fewer borders, more shadows and spacing. Design in grayscale first to force hierarchy through spacing and size, not color. Every pixel should be intentional.

**For Design Scout prompts:** When extracting design tokens, check: Is there a visible spacing system? Is typography used to create hierarchy (not just font size but weight, color, line-height)? Are shadows used instead of borders? Is there a clear color system with limited palette?

---

## Tier 2: Deep Craft Books

### 5. "About Face: The Essentials of Interaction Design" — Alan Cooper (4th ed, 2014)
The "UX Bible." Cooper introduced goal-directed design: design for what users want to *accomplish*, not what they say they want. He pioneered the concept of personas as design tools. The book covers interaction patterns for everything from forms to dashboards to mobile interfaces.

**Key takeaway for prompts:** Analyze whether a site is designed around user goals or around the company's organizational structure. If the navigation mirrors the company's departments, that's a red flag.

### 6. "Designing Interfaces" — Jenifer Tidwell, Charles Brewer, Aynne Valencia (3rd ed, 2020)
A comprehensive pattern library covering every type of interface element: navigation, page layout, lists, actions, forms, info graphics, social features, and mobile patterns. Each pattern includes when to use it, why it works, and examples.

**Key takeaway for prompts:** Use this as a vocabulary for naming patterns found in screenshots. Instead of "there's a section with cards," say "masonry grid with hover-reveal detail cards following the card deck pattern."

### 7. "Hooked: How to Build Habit-Forming Products" — Nir Eyal (2014)
The Hook Model: Trigger → Action → Variable Reward → Investment. External triggers (emails, notifications) start the cycle; internal triggers (emotions like boredom, loneliness) sustain it. The action must be simple (Fogg Behavior Model: motivation + ability + trigger). Variable rewards keep people coming back (social rewards, resources, self-achievement). Investment means the user puts something in (data, content, followers) that makes the product more valuable over time.

**Key takeaway for prompts:** For in-app UX analysis, check: What's the trigger mechanism? How many steps to the core action? Is there a reward loop? What does the user invest?

### 8. "100 Things Every Designer Needs to Know About People" — Susan Weinschenk (2011, 2nd ed 2020)
A behavioral psychologist's cheat sheet. Key insights: People don't actually want more choices (they think they do). People scan in F-patterns on text-heavy pages. Peripheral vision is used more than central vision for getting the "gist" of a page. People are driven more by loss aversion than by gain. Blue and red draw the most attention. People process information better in story form.

**Key takeaway for prompts:** Check for F-pattern or Z-pattern alignment. Does important content fall where eyes naturally land? Are key messages framed as "what you'll lose without this" rather than "what you'll gain"?

### 9. "Atomic Design" — Brad Frost (2016)
Design systems methodology: Atoms (smallest elements: buttons, inputs, labels) → Molecules (groups: search form = input + button + label) → Organisms (complex groups: header = logo + nav + search) → Templates (page-level wireframes) → Pages (specific instances). This hierarchy lets teams build consistent, scalable UI.

**Key takeaway for prompts:** When analyzing consistency, check: Are buttons the same everywhere? Do headings follow a consistent scale? Is the design system tight, or does every section look like it was designed by a different person?

### 10. "Designing with the Mind in Mind" — Jeff Johnson (2010, 3rd ed 2021)
Bridges cognitive psychology and UI design. Covers: how perception is biased (we see what we expect), why reading is unnatural and interfaces should minimize it, how attention is limited and selective, how memory is imperfect and recognition beats recall, how learning is easier when building on existing mental models. The practical upshot: design for how brains actually work, not how we wish they did.

**Key takeaway for prompts:** Does the site use recognition over recall? (Show options, don't ask users to remember them.) Are interactive elements where users expect them to be?

### 11. "Microinteractions" — Dan Saffer (2013)
The tiny design moments that make or break an experience: toggle switches, scroll behavior, pull-to-refresh, loading states, form validation, hover effects. Four parts of a microinteraction: Trigger (what initiates it), Rules (what happens), Feedback (how the user knows something happened), Loops & Modes (what happens over time). The best microinteractions feel invisible but are deeply satisfying.

**Key takeaway for prompts:** When analyzing engagement quality, look for evidence of micro-interactions: hover states, loading indicators, transition animations, form feedback, button press states.

### 12. "Practical UI" — Adham Dannaway (2024)
A modern, visual book focused on the practical "how" of making things look professional. Covers color selection with specific hex values, typography pairing rules, spacing systems (8-point grid), shadow techniques, and component design. Extremely actionable — more of a recipe book than theory.

**Key takeaway for prompts:** Use as a benchmark for extracted design tokens. Does the site follow an 8-point spacing grid? Are shadows soft and colored (modern) or hard and black (dated)?

### 13. "The Elements of User Experience" — Jesse James Garrett (2002, 2nd ed 2011)
The five planes of UX: Strategy (user needs + business goals) → Scope (features + content) → Structure (interaction design + information architecture) → Skeleton (interface design + navigation + information design) → Surface (visual design). Each layer builds on the one below. You can't fix a strategy problem with visual design.

**Key takeaway for prompts:** Analyze whether the visual surface (what screenshots show) seems aligned with an underlying strategy. Does the content structure make sense? Or is it pretty but aimless?

### 14. "Information Architecture" — Rosenfeld, Morville, Arango (4th ed, 2015)
How to organize information so people can find it. Core concepts: organization schemes (alphabetical, chronological, topical, task-based), labeling systems (how you name things determines whether people find them), navigation systems (global, local, contextual, supplemental), and search systems. The "too-simple" test: if a user's first attempt at finding something fails, they usually leave.

**Key takeaway for prompts:** Analyze navigation labels: Are they user-centered or company-centered? Are there too many top-level items? Is the hierarchy clear?

### 15. "Microcopy: The Complete Guide" — Kinneret Yifrah (2017)
Every word on your interface is a design choice. Button labels, error messages, empty states, confirmation dialogs, placeholder text, tooltips — all of it shapes the experience. The book covers voice and tone, writing for forms, handling errors gracefully, onboarding copy, and accessibility through language.

**Key takeaway for prompts:** When analyzing CTAs, evaluate the copy: "Submit" is worse than "Get Started." "Error" is worse than "Hmm, that email doesn't look right." Copy IS design.

---

## Tier 3: Specialized & Modern

| Book | Author | Key Contribution |
|------|--------|-----------------|
| Web Form Design | Luke Wroblewski (2008) | Definitive guide to form UX — inline validation, input types, label placement |
| Simple and Usable | Giles Colborne (2011) | Four strategies for simplicity: Remove, Organize, Hide, Displace |
| The Art of Color | Johannes Itten (1961) | Bauhaus color theory — still the foundation of digital color palettes |
| Lean UX | Jeff Gothelf & Josh Seiden (2013, 3rd ed 2021) | How to integrate UX into agile teams with rapid experimentation |
| Design Is a Job | Mike Monteiro (2012) | The business side: pricing, clients, contracts, presenting work |
| UX Team of One | Leah Buley (2013, revised 2024) | Practical toolkit for solo UX practitioners |
| Interviewing Users | Steve Portigal (2013) | How to conduct user research that reveals genuine needs |
| Sprint | Jake Knapp (2016) | Google Ventures' 5-day design sprint methodology |
| Articulating Design Decisions | Tom Greever (2015, 2nd ed 2020) | How to present and defend design choices to stakeholders |
| Universal Principles of UX | Irene Pereyra (2023) | 100 timeless strategies organized as a reference |
| How to Design Better UI Components 3.0 | Adrian Kuleszo (2024) | Modern component-level best practices with visual examples |
| 100 UI/UX Tips & Tricks | Victor (2024, 2nd ed) | Illustrated, one-tip-per-page format. Quick reference |

---

# PART 2: THE PRINCIPLES — What Good UI/UX Actually Does

## Nielsen's 10 Usability Heuristics (The Gold Standard)

These were published in 1994 by Jakob Nielsen and are still the most widely-used evaluation framework in the industry. Updated in 2020.

1. **Visibility of System Status** — Always show users what's happening. Loading states, progress bars, confirmation messages. If an action takes >1 second, show feedback.

2. **Match Between System and Real World** — Use language and concepts users already know. "Shopping cart" not "purchase accumulator." Icons should match mental models.

3. **User Control and Freedom** — Provide undo, redo, back, cancel. Users make mistakes. Let them recover easily without punishment.

4. **Consistency and Standards** — Follow platform conventions. If every other site puts the logo top-left and makes it clickable to go home, yours should too.

5. **Error Prevention** — Better than good error messages is preventing errors in the first place. Disable submit until form is valid. Use date pickers instead of text fields for dates.

6. **Recognition Rather Than Recall** — Show options, don't ask users to remember them. Visible navigation > hidden hamburger menus. Recently viewed items > manual search.

7. **Flexibility and Efficiency of Use** — Serve both novice and expert users. Keyboard shortcuts for power users. Defaults that work for beginners.

8. **Aesthetic and Minimalist Design** — Every element should serve a purpose. Visual noise competes with signal. Less (that matters) is more.

9. **Help Users Recognize, Diagnose, and Recover from Errors** — Error messages should: identify the problem in plain language, suggest a solution, and not blame the user.

10. **Help and Documentation** — Even though the system should be usable without docs, provide searchable, task-oriented help when needed.

---

## IDEO's Human-Centered Design Principles

IDEO's methodology has three phases — Inspiration, Ideation, Implementation — underpinned by these principles:

- **Empathy First:** Observe real users in real contexts. Don't design from assumptions.
- **Beginner's Mind:** Approach every problem as if you've never seen it before. Assumptions kill innovation.
- **Bias Toward Action:** Build and test rough prototypes quickly rather than debating ideas in abstract.
- **Radical Collaboration:** Diverse teams (designers, engineers, psychologists, users) produce better solutions.
- **Iterate Relentlessly:** The first answer is never the best. Test, learn, refine.
- **Optimism:** Believe that a better solution exists and you can find it.
- **Systems Thinking:** Consider how your solution interacts with broader economic, cultural, and ecological systems.

**How this applies to Design Scout:** When generating briefs, the tool should encourage empathy-driven design: Who is the actual user? What are they feeling when they arrive? What's their context? A healthcare enrollment page should calm anxiety, not impress designers on Dribbble.

---

## Gestalt Principles of Visual Perception

These laws from psychology explain how humans perceive visual grouping:

- **Proximity:** Elements close together are perceived as related. Use spacing to create groups.
- **Similarity:** Elements that look alike are perceived as part of the same group. Consistent button styles = consistent actions.
- **Closure:** People fill in gaps to perceive complete shapes. You can suggest form with minimal elements.
- **Continuity:** Eyes follow smooth paths. Alignment and flow guide attention.
- **Figure-Ground:** People instinctively separate foreground from background. Use contrast to make important elements pop.
- **Common Region:** Elements within a shared boundary are perceived as grouped. Cards and containers create visual grouping.
- **Focal Point:** The element that breaks the pattern draws attention. Make your CTA visually distinct.

---

## The Conversion Psychology Stack (For Landing Pages)

These psychological principles specifically drive landing page conversion:

1. **The Halo Effect** — If a page looks professional, visitors assume the product is professional. First impressions are formed in 50ms.
2. **Social Proof / Bandwagon Effect** — "Join 10,000+ customers" works because humans follow the crowd. Testimonials, logos, user counts.
3. **Loss Aversion** — People are 2x more motivated to avoid loss than to gain something. "Don't miss out" > "Sign up to gain."
4. **Anchoring** — The first number people see sets their reference point. Show the "full price" before the discount.
5. **Paradox of Choice** — Too many options leads to decision paralysis. One CTA per section.
6. **Endowed Progress Effect** — People are more likely to complete a task if they feel they've already started. Show progress bars, pre-fill forms.
7. **Scarcity** — Limited availability increases perceived value. "Only 3 spots left" — but only if authentic.
8. **Reciprocity** — Give value first (free guide, tool, insight), and visitors feel compelled to give back (their email, their attention).
9. **The Serial Position Effect** — People remember the first and last items in a sequence. Put your strongest benefit first, your CTA last.
10. **Cognitive Fluency** — Easy to process = perceived as more trustworthy. Simple words, clean layouts, familiar patterns.

---

# PART 3: TWO DIFFERENT WORLDS — Landing Pages vs. In-App UX

## Landing Page Design (Acquisition)

**Goal:** Convert a stranger into a lead or customer in one visit.
**Mindset:** Marketing. Persuasion. Clarity. Trust-building.

### The Anatomy of a High-Converting Landing Page (2025-2026)

1. **Hero Section** (above the fold)
   - Headline: 8 words max, states the core value proposition
   - Subheadline: 1-2 sentences, explains "how"
   - Primary CTA: High-contrast, large, action verb ("Start Free Trial")
   - Hero visual: Product screenshot, demo video, or contextual imagery
   - Trust strip: "Trusted by 500+ companies" + logo row

2. **Social Proof**
   - Customer logos (grayscale, consistent sizing)
   - Testimonials with real names, photos, titles
   - Key metrics ("40% faster," "2M users")

3. **Problem/Solution**
   - Agitate the pain point
   - Position your product as the natural solution
   - Keep it conversational, not corporate

4. **Features/Benefits**
   - Lead with benefits (what users gain), follow with features (how)
   - 3-4 features max
   - Visual demonstrations (screenshots, icons, short videos)

5. **How It Works**
   - 3-step process (simplicity is key)
   - Numbered steps with icons or illustrations

6. **Pricing** (if applicable)
   - 3 tiers, middle one highlighted
   - Monthly/annual toggle with savings shown
   - Feature comparison matrix

7. **FAQ / Objection Handling**
   - Address the top 5 reasons someone wouldn't buy
   - Accordion format for scannability

8. **Final CTA**
   - Repeat the primary call to action
   - Add urgency or a guarantee
   - Make it impossible to miss

### Landing Page Design Principles (What's Different from In-App)
- **Single purpose:** One page, one action. Remove all distractions.
- **No main navigation** (for paid traffic): Minimize escape routes.
- **Narrative sequencing:** Each scroll reveals a new layer of the story.
- **Trust signals everywhere:** Badges, testimonials, logos, guarantees.
- **Speed is critical:** Every 1 second of load time drops conversions 7%.
- **Mobile-first:** 60%+ traffic is mobile. Design for thumbs, not cursors.

---

## In-App UX (Retention)

**Goal:** Help existing users accomplish tasks efficiently and enjoyably.
**Mindset:** Utility. Habit-formation. Reduction of friction.

### What Makes Great In-App UX

1. **Onboarding**
   - Progressive disclosure (don't show everything at once)
   - Guided tours with contextual tooltips
   - Quick wins in the first session
   - Personalization questions up front

2. **Navigation & Information Architecture**
   - Consistent global navigation
   - Breadcrumbs for deep hierarchies
   - Search that actually works
   - Contextual actions near related content

3. **Task Completion**
   - Minimize steps to accomplish goals
   - Show progress and state at all times
   - Inline validation and error handling
   - Autosave and undo

4. **Data Display**
   - Tables, cards, or lists based on data type
   - Filtering and sorting that remembers preferences
   - Empty states that guide action
   - Loading skeletons instead of spinners

5. **Engagement & Retention**
   - Notifications and triggers (but not too many)
   - Achievement and progress indicators
   - Personalized dashboards
   - Feature discovery without interruption

### In-App Design Principles (What's Different from Landing Pages)
- **Efficiency over persuasion:** Users already bought in. Help them work.
- **Consistency is king:** Every interaction should feel predictable.
- **Power user paths:** Keyboard shortcuts, bulk actions, saved views.
- **Error recovery:** Users will make mistakes. Make recovery painless.
- **Performance budget:** Every millisecond of delay adds frustration.
- **Accessibility is non-negotiable:** WCAG 2.2 AA minimum.

---

# PART 4: DESIGN TRENDS — What's Current (2025-2026)

## Visual Trends

### Bento Grids
Inspired by Japanese lunch boxes. Modular card layouts with varying sizes that create visual hierarchy. Dominant pattern at Apple, Microsoft, Google, Samsung. Responsive by nature — cards stack on mobile. Best implemented with CSS Grid or Tailwind.

### Glassmorphism (Evolved)
Frosted-glass transparency effects with backdrop blur. More subtle than early iterations — paired with thin semi-transparent borders for definition. Works best for overlays, modals, and navigation. Now combined with dynamic background blurs that shift on scroll.

### Kinetic Typography
Text as visual design element. Headlines that stretch, animate, and respond to cursor movement. Variable fonts enable weight/width transitions. Reduces dependency on heavy images.

### Warm Minimalism
Moving away from cold, sterile whites toward warm neutrals, soft shadows, and organic shapes. Colors that feel human, not clinical. Pantone 2026: "Cloud Dancer" (warm off-white). Subtle gradients replace flat colors.

### Micro-Delights
Tiny non-functional animations that spark joy: confetti on task completion, button pulse on hover, icon morphing on state change. The difference between "professional" and "memorable."

### Soft Brutalism
A reaction to over-polished design. Raw typography, visible grid lines, exposed structure — but softened with rounded corners and warm colors. Communicates authenticity and anti-corporate vibes.

### Dark Mode as Standard
No longer optional. OLED screens use 15-40% less energy with dark interfaces. Users expect a toggle. Design for both from the start.

## Structural Trends

### Scroll Storytelling
Long pages where each scroll reveals a new chapter. Cinematic transitions, parallax with realistic physics, progressive content loading. The page is the narrative.

### AI-Personalized Interfaces
Dynamic content based on user behavior, location, referral source. Headlines that change based on the visitor's industry. Layouts that adapt to screen size AND usage patterns.

### Sustainable / Green UX
Performance budgets for images, scripts, and assets. Efficient caching, lazy loading, dark mode as energy saving. Carbon-aware design is moving from "nice to have" to measured expectation (W3C Web Sustainability Guidelines).

### Accessibility as Law
European Accessibility Act effective June 2025. WCAG 2.2 AA is the minimum standard. Designing for accessibility isn't optional — it's legal compliance. Focus areas: contrast ratios, keyboard navigation, screen reader compatibility, motion sensitivity preferences.

## What's Dying
- Static hero images with stock photography
- Overly complex navigation menus
- Autoplay video with sound
- Heavy page-blocking animations
- Cookie consent popups that cover the page (regulation is pushing toward better solutions)
- Carousels (people only see the first slide)
- Neumorphism (looked cool, had terrible accessibility)

---

# PART 5: RESOURCES — Videos, Channels, Tools, Communities

## Best YouTube Channels for UI/UX

| Channel | Focus | Best For |
|---------|-------|----------|
| **Figma** (official) | Tool tutorials, Config talks | Staying current with industry |
| **Flux Academy** (Ran Segall) | Web design + business | Designers who freelance |
| **DesignCourse** (Gary Simon) | UI/UX tutorials, Figma | Comprehensive crash courses |
| **Mizko** | Figma deep dives, career | Figma mastery + career advice |
| **The Futur** (Chris Do) | Design + business strategy | Business of design |
| **Charli Marie** | Product design, portfolio | Design process and reviews |
| **Caler Edwards** | Figma tricks, bite-sized | Quick tips and techniques |
| **DesignSense** (AJ) | Product design, mentoring | Career transitions into UX |
| **BYOL** (Daniel Scott) | Structured courses | Beginners, step-by-step |
| **Satori Graphics** | Design theory + tools | Experienced designers sharpening skills |
| **NNGroup** | Research-backed UX insights | Evidence-based design decisions |

## Must-Watch Talks & Videos

- **Don Norman — "The Design of Everyday Things" (Google Talk)** — The master explains his philosophy in 45 minutes
- **Steve Krug — "Don't Make Me Think" (Google Talk)** — Usability testing demo that changed how people think about testing
- **Mike Monteiro — "F*** You, Pay Me" (Creative Mornings)** — The business reality of design work
- **Figma Config Talks** (annual) — State of the art in design tooling and methodology
- **Jared Spool — "Beyond the UX Tipping Point"** — Why UX maturity matters at the organizational level

## Design Inspiration & Reference Sites

| Site | What It's For |
|------|--------------|
| **Dribbble** | Visual inspiration (but be careful — pretty ≠ usable) |
| **Behance** | Case studies and process documentation |
| **Awwwards** | Award-winning web design (skews toward experimental) |
| **Land-book** | Landing page inspiration specifically |
| **SaaS Landing Page** | SaaS-specific landing page examples |
| **Mobbin** | Mobile design patterns from real apps |
| **UI Patterns** | Component-level design patterns |
| **Page Flows** | User flow recordings from real products |
| **Refero Design** | Real website screenshots organized by section |
| **Godly** | Curated web design inspiration |
| **Dark Design Patterns (deceptive.design)** | What NOT to do — manipulative UX patterns |

## Online Learning Platforms

| Platform | Strength |
|----------|----------|
| **Interaction Design Foundation (IxDF)** | Comprehensive, academic rigor, affordable ($15/mo) |
| **NN/g (Nielsen Norman Group)** | Research-backed, gold standard certifications |
| **IDEO U** | Design thinking methodology, human-centered design |
| **Coursera** (Google UX Design Certificate) | Structured, career-oriented |
| **Designlab** | Mentorship-based, portfolio building |
| **Shift Nudge** | UI-specific visual design skills |

## Key Websites for Ongoing Learning

- **nngroup.com/articles** — Evidence-based UX research articles
- **lawsofux.com** — Visual reference for all 21 UX laws
- **designkit.org** — IDEO's free human-centered design toolkit
- **humanebydesign.com** — Ethical design principles
- **a11yproject.com** — Accessibility checklist and resources
- **checklist.design** — Checklists for every design component
- **designsystems.com** — Design system examples and methodology
- **growth.design** — UX case studies as comic strips (brilliant format)
- **builtformars.com** — Deep UX case studies of real products

---

# PART 6: HOW THIS FEEDS DESIGN SCOUT

## Upgrading the Prompt Library

The prompts in `src/prompts/index.ts` should encode the principles above. Here's how:

### Analysis Prompt Improvements

The current analysis prompt scores 10 dimensions. Based on this research, here's what to add or refine:

**Add to scoring rubric:**
- **Cognitive Load** (Hick's Law + Miller's Law) — How many decisions does the page force in the first 5 seconds?
- **Trust Signals** (Conversion Psychology) — Count and quality of trust elements: testimonials, logos, badges, guarantees
- **Copy Quality** (Microcopy) — CTA labels, headline clarity, error message quality
- **Gestalt Compliance** — Are visual groupings clear? Does proximity create logical relationships?

**Refine existing dimensions:**
- **Visual Hierarchy** → Reference Von Restorff Effect and Figure-Ground principle specifically
- **CTA Clarity** → Reference Fitts's Law (size + distance) and contrast ratios
- **Navigation** → Reference Jakob's Law (does it follow conventions?) and Information Architecture principles
- **Engagement** → Reference Hook Model stages and micro-interaction quality

### Category-Specific Prompt Improvements

**SaaS Landing:**
- Does the hero pass Steve Krug's "trunk test"?
- Is there a clear Hook Model trigger → action → reward loop?
- Does pricing follow the anchoring principle (showing value before price)?

**Healthcare:**
- Does the design reduce anxiety? (warm colors, real people, empathetic language)
- Is compliance messaging present but not overwhelming?
- Does the layout follow WCAG 2.2 AA accessibility standards?
- Are forms simplified per Luke Wroblewski's principles?

**E-commerce:**
- Does the product display leverage the aesthetic-usability effect?
- Is there social proof near decision points?
- Are scarcity signals authentic or manipulative?
- Does the purchase flow minimize form fields?

### Brief Generation Improvements

When generating design briefs, the system should:

1. **Reference specific principles** in recommendations (not just "use good color" but "apply the 60-30-10 color rule: 60% dominant neutral, 30% secondary brand color, 10% accent for CTAs")

2. **Include anti-patterns** — what specifically NOT to do for this category

3. **Generate prompts that encode these principles** — when a build prompt says "create a hero section," it should include the psychological reasoning (e.g., "The headline should address a specific pain point because loss aversion is 2x more motivating than gain. Use no more than 8 words because of the serial position effect.")

4. **Distinguish between landing page and in-app recommendations** — the brief should know which world it's operating in

---

# APPENDIX: Quick Reference Cards

## The 5-Second Test Checklist
When analyzing any page screenshot, can you answer in 5 seconds:
- [ ] What does this company/product do?
- [ ] Who is it for?
- [ ] What should I do next (primary CTA)?
- [ ] Why should I trust them?
- [ ] What makes them different?

## The Design Token Extraction Checklist
- [ ] Primary colors (hex values)
- [ ] Accent/CTA color
- [ ] Neutral/background colors
- [ ] Font families (heading + body)
- [ ] Font scale (sizes used)
- [ ] Spacing base unit (4px or 8px grid?)
- [ ] Border radius values
- [ ] Shadow style (soft colored vs hard black)
- [ ] Button style (filled, outlined, ghost)
- [ ] Icon style (outlined, filled, illustrated)

## The Conversion Audit Checklist (Landing Pages)
- [ ] Value proposition clear above the fold?
- [ ] Single primary CTA per section?
- [ ] Social proof present and authentic?
- [ ] Form fields minimized?
- [ ] Page loads in <3 seconds?
- [ ] Mobile experience tested?
- [ ] No competing navigation (for paid traffic)?
- [ ] Copy is benefit-driven, not feature-driven?
- [ ] Trust signals near CTAs?
- [ ] Urgency is authentic, not manipulative?

## The Usability Audit Checklist (In-App)
- [ ] Nielsen's 10 heuristics satisfied?
- [ ] Navigation consistent and predictable?
- [ ] Error states handled gracefully?
- [ ] Loading states present?
- [ ] Empty states guide users?
- [ ] Keyboard navigation works?
- [ ] Color contrast meets WCAG AA (4.5:1)?
- [ ] Touch targets ≥44px on mobile?
- [ ] Undo available for destructive actions?
- [ ] Search is accessible and functional?

---

*Last updated: February 2026*
*Compiled for Design Scout v0.1.0*
*Sources: Nielsen Norman Group, IDEO, Interaction Design Foundation, lawsofux.com, and 50+ design books and industry publications*
