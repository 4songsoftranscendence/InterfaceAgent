# Design Scout Deep Knowledge Base
## Distilled UX/UI Intelligence for World-Class Website Analysis

> This document distills hundreds of pages of UX research, design books, psychological principles, and practical case studies into actionable intelligence. Every concept includes concrete examples of what it looks like *in the wild* on real websites, so Design Scout prompts can reference specific, testable criteria rather than abstract theory.

---

# PART 1: THE FOUNDATIONAL FOUR — Deep Practical Analysis

## 1. Don Norman — "The Design of Everyday Things"

### Core Framework: The Action Cycle

Norman's central insight is that every human interaction with a designed object follows a predictable cycle. When users struggle, it's a **design failure**, not a user failure. The cycle has two gulfs:

**Gulf of Execution** — "How do I do this?"
- User forms a goal → plans action → specifies action → executes action
- When a user stares at a webpage wondering "where do I click to sign up?" — that's a Gulf of Execution problem

**Gulf of Evaluation** — "Did it work?"
- User perceives result → interprets result → compares to goal
- When a user clicks "Submit" and nothing visibly happens — that's a Gulf of Evaluation problem

### The 6 Design Principles (Mapped to Web/UI)

**1. Affordances** — What actions are *possible*
- Physical world: A door handle affords pulling. A flat plate affords pushing.
- Web equivalent: A raised, colored button affords clicking. A text field with a cursor affords typing. A card with a slight shadow affords clicking/tapping.
- **Design Scout test**: "Does every interactive element *look* interactive? Do non-interactive elements accidentally look clickable?"
- **Anti-pattern**: Flat text that's actually a link but has no underline, no color change, no hover state. Users can't tell it's clickable.
- **Practical example**: A pricing card that looks like a static display vs. one with a subtle hover lift and cursor change — the second one *affords* interaction.

**2. Signifiers** — Signals that *communicate* where to act
- Norman introduced this term because people kept misusing "affordances." Signifiers are the *perceivable* cues.
- Web equivalent: Blue underlined text = "this is a link." A magnifying glass icon next to a text field = "this is search." A downward arrow on a dropdown = "click to expand."
- **Design Scout test**: "Can a first-time visitor identify all interactive elements within 3 seconds?"
- **Anti-pattern**: Ghost buttons (transparent with thin borders) on busy backgrounds — the signifier is too weak to perceive.
- **Practical example**: The shopping cart icon in the top-right corner of e-commerce sites. It's universal because the signifier has become a convention. A site that puts it bottom-left breaks this.

**3. Mapping** — Relationship between controls and their effects
- Physical world: Stove knobs arranged in the same layout as burners = good mapping. Four knobs in a row for a 2×2 burner layout = terrible mapping.
- Web equivalent: A slider that moves left-to-right to increase a value. A "back" arrow pointing left. Navigation items ordered to match the page flow.
- **Design Scout test**: "Do controls spatially or logically correspond to what they affect?"
- **Anti-pattern**: A settings page where toggles are listed alphabetically rather than grouped by function. The mapping between toggle and effect is broken.
- **Practical example**: Stripe's pricing slider — move it right, the number goes up, the price below updates instantly. Perfect mapping.

**4. Feedback** — Confirmation that an action had effect
- Physical world: A button that clicks when pressed. A light switch that makes an audible snap.
- Web equivalent: A button that changes color on click. A loading spinner after form submission. A success toast notification. Inline validation on form fields.
- **Design Scout test**: "Does every user action produce visible, immediate feedback?"
- **Anti-pattern**: Clicking "Send" on a contact form and the page just... sits there. No spinner, no message, no state change. Users click again and again.
- **Practical example**: Stripe's payment form — each field validates in real-time with green checkmarks, the button says "Pay $49.99" (not just "Submit"), and after payment shows a clear success animation.

**5. Constraints** — Limiting possible actions to prevent errors
- Physical world: A SIM card tray that only fits one way. A USB-C port you can't insert upside down.
- Web equivalent: Graying out unavailable options. Disabling the "Next" button until required fields are filled. Date pickers that prevent selecting past dates for future bookings.
- **Design Scout test**: "Does the interface prevent errors before they happen, or just report them after?"
- **Anti-pattern**: A date field that accepts free-text input, then shows a red error "Invalid date format" — instead of using a date picker that makes wrong input impossible.

**6. Conceptual Models** — The user's mental picture of how the system works
- Physical world: A thermostat — most people think turning it to 90° heats the room faster (wrong, it just changes the target temperature). Bad conceptual model = frustration.
- Web equivalent: A "folder" metaphor in file management apps. A "cart" metaphor in e-commerce. A "feed" metaphor in social media. These leverage existing mental models.
- **Design Scout test**: "Does the site use metaphors and patterns that match how users already think about this type of task?"
- **Practical example**: Trello uses a "board with cards" metaphor that maps perfectly to physical kanban boards. Users immediately understand: cards move left-to-right through columns. The conceptual model is intuitive.

### The "Norman Door" Test for Websites
Norman's most famous example: doors with handles that should be pushed, or flat plates that should be pulled. The design contradicts the action.

**Web equivalent "Norman Doors":**
- A "Learn More" button that opens a PDF download instead of expanding content
- A hamburger menu icon that opens a modal instead of a slide-out menu
- A logo in the header that *doesn't* link to the homepage
- Card elements that look clickable but only the tiny "Read more" text is actually linked
- A "X" close button that minimizes a widget instead of closing it

---

## 2. Steve Krug — "Don't Make Me Think"

### The Core Laws

**Krug's First Law: Don't make me think.**
Every question mark a user has adds cognitive load. Self-evident > self-explanatory > requires instructions.

**What "thinking" looks like on a website:**
- "Is this clickable?"
- "Where am I?"
- "Where should I start?"
- "Why did they call it that?"
- "Is that the search box?"
- "Where's the _____?"

Each of these micro-hesitations is a failure. The best websites answer all of them before they're asked.

### Three Facts About Real Users

**Fact 1: Users don't read pages — they scan.**
- They look for words that match their task, ignoring everything else
- They follow F-patterns and Z-patterns (eye-tracking studies confirm this)
- **Design Scout implication**: Headers, bold text, and link text are the ONLY things most users will actually read. If the story doesn't make sense reading only those elements, the page fails.

**Fact 2: Users don't make optimal choices — they satisfice.**
- They click the first reasonable option, not the best one
- They don't weigh alternatives methodically
- **Design Scout implication**: The most important CTA must be the *first reasonable option* a scanner encounters. If a secondary link looks plausible, users will click it instead of the primary CTA.

**Fact 3: Users don't figure things out — they muddle through.**
- They rarely read instructions or tooltips
- They develop workarounds rather than learning the "right" way
- **Design Scout implication**: If the interface requires reading a tooltip or instruction text to be used correctly, it's already failed. (This is the "Paradox of the Active User" from the Laws of UX.)

### The Trunk Test

**The scenario:** Imagine being blindfolded, driven around, and dropped on a random page of a website. When the blindfold comes off, you should be able to answer:

1. **What site is this?** (Site identity/logo)
2. **What page am I on?** (Page title/heading)
3. **What are the major sections?** (Navigation)
4. **What are my options at this level?** (Local navigation)
5. **Where am I in the scheme of things?** (Breadcrumbs, active nav states)
6. **How can I search?** (Search box)

**Design Scout application**: This becomes a literal checklist. For every page analyzed, score each of these 6 items as present/clear or missing/ambiguous.

### The Squint Test
Hold the page at arm's length (or squint). You should still be able to:
- Identify the primary headline
- Find the main CTA
- Distinguish navigation from content
- See the visual hierarchy (what's most important)

If everything blurs into sameness, the visual hierarchy has failed.

### Krug's Rules for Navigation
- **Persistent navigation** should appear on every page (except checkout flows and landing pages)
- Navigation should include: Site ID, sections, utilities (search, sign in, cart), "you are here" indicator
- **Every page needs a name** — and the name should match what the user clicked to get there
- Breadcrumbs should be present on sites deeper than 2 levels

### The "Get Rid of Half the Words" Rule
Look at every page and remove half the words. Then remove half of what's left. What remains is what the page actually needs. This fights "happy talk" (vague introductory text) and "instructions that nobody reads."

**Happy talk examples to flag:**
- "Welcome to our website! We're glad you're here."
- "Navigate through our comprehensive suite of solutions."
- "Explore our world-class platform designed to..."
These waste the user's scanning time and delay them from reaching useful content.

---

## 3. Jon Yablonski — "Laws of UX" (21 Laws, Deep Dive)

### Category 1: Heuristics (Mental Shortcuts)

**Jakob's Law** — Users spend most time on OTHER sites, so they expect yours to work the same way.
- *Why it matters*: Users bring mental models from every other website they've ever used. E-commerce sites should have cart in top-right, logo linking to home, search prominent in header — because Amazon, Target, and Walmart trained billions of users to expect this.
- *Practical test*: "Does this site follow conventions of its category? Does the nav work like users expect from competitor sites?"
- *Real example*: A SaaS dashboard that puts settings behind a profile avatar in the top-right works because every major platform (Google, GitHub, Notion) established this pattern. A site that hides settings in a bottom toolbar violates Jakob's Law.
- *Healthcare CRM example for NymbleAI*: If healthcare enrollment staff are used to Salesforce-style list views with filter bars, NymbleAI should mirror that layout even if a different layout might be "better" — because the familiar one requires zero learning.

**Fitts's Law** — Time to reach a target = function of distance and size.
- *The math*: Large targets close to the user's cursor are fastest to click. Small targets far away are slowest.
- *Practical rules*:
  - Primary CTA buttons should be at least 44×44px (Apple's guideline) or 48×48dp (Google Material)
  - Put primary actions near where the user's cursor/thumb already is
  - Edge and corner targets are effectively infinite-size (cursor stops at screen edge) — this is why macOS puts the menu bar at the top edge
  - Mobile: the "thumb zone" (bottom-center of screen) is where primary actions should live
- *Design Scout test*: "Is the primary CTA large enough and positioned where the user's attention already is?"
- *Anti-pattern*: A tiny "Subscribe" link in 12px font buried in the footer vs. a prominent 16px button with 16px padding in the hero section.

**Hick's Law** — More choices = more time to decide.
- *The formula*: Decision time increases logarithmically with the number of options.
- *Practical application*:
  - Pricing pages: 3 tiers is optimal. 5+ creates paralysis.
  - Navigation: 5-7 top-level items max. More = cognitive overload.
  - Forms: Show only the fields needed right now. Progressive disclosure.
  - Onboarding: One question per screen, not a mega-form.
- *Real example*: Netflix's "Top 10" list reduces the paradox of choice from 15,000+ titles to 10. Highlighted "recommended" options on pricing pages guide the decision.
- *Design Scout test*: "How many choices is the user presented with at each decision point? Can any be removed or deferred?"
- *Anti-pattern*: A homepage with 12 equally-weighted CTAs. Or a nav menu with 15 top-level items and no hierarchy.

**Miller's Law** — Average person holds 7 (±2) items in working memory.
- *Practical application*:
  - Chunk information: phone numbers as XXX-XXX-XXXX, not XXXXXXXXXX
  - Navigation groups: keep categories to ~7 items
  - Form sections: break long forms into grouped steps of 5-7 fields
  - Dashboard cards: don't show 15 metrics simultaneously — group them
- *Design Scout test*: "Are information groups kept to ~7 items or fewer? Is content chunked into digestible units?"
- *Real example*: Credit card number fields that auto-chunk into groups of 4 digits. Step indicators that show 4-5 steps max.

**Parkinson's Law** — Work expands to fill the time available.
- *UX application*: If you tell users a survey takes 15 minutes, they'll take all 15 minutes even if it only requires 3.
- *Practical rules*: Set shorter expectations. Show progress indicators that move quickly. Design tasks to feel faster than expected.
- *Design Scout test*: "Do progress indicators and time estimates create urgency or complacency?"

### Category 2: Gestalt Principles (Perceptual Grouping)

**Proximity** — Elements close together are perceived as related.
- *This is the #1 most violated principle in web design.*
- *Practical test*: Is the space *between* groups larger than the space *within* groups?
- *Real example*: A form where the label is equidistant between the field above and the field below — the user can't tell which field the label belongs to. The label should be visibly closer to its field.
- *Card layouts*: The gap between cards should be larger than the internal padding of cards. Otherwise the cards visually merge into a wall of content.
- *Navigation*: Menu items in the same section should be tightly grouped, with clear visual separation between sections.

**Similarity** — Elements that look alike are perceived as having the same function.
- *Practical test*: Do all clickable elements share a visual treatment (color, shape, style)? Do all non-interactive elements look different from interactive ones?
- *Real example*: If primary buttons are blue with rounded corners, ALL primary buttons across the site should be blue with rounded corners. If some are green and some are blue, users can't form a consistent mental model.
- *Anti-pattern*: Using the same blue color for both links and static highlighted text. Users try to click the highlights.

**Closure** — The brain fills in missing visual information to complete shapes.
- *Application*: Progress bars that are partially filled suggest completion. Partially visible cards at the edge of a carousel suggest "swipe for more." The NBC peacock logo, the WWF panda — all use closure.
- *Design Scout test*: "Does the page use visual cues that suggest there's more content to discover (broken edges, partial elements)?"
- *Anti-pattern*: A page that looks "complete" above the fold but actually has critical content below. The illusion of completeness prevents scrolling.

**Continuity** — The eye follows lines, paths, and curves naturally.
- *Application*: Leading lines in hero images that point toward the CTA. Curved section dividers that guide the eye downward. Horizontal sliders that create left-to-right flow.
- *Design Scout test*: "Do visual elements create a natural reading path toward the conversion point?"

**Figure-Ground** — The brain separates foreground from background automatically.
- *Application*: Modal overlays with dimmed backgrounds. Toast notifications that "float" above the interface. Cards with shadows that lift off the page.
- *Design Scout test*: "Is there a clear visual distinction between primary content and background? Do modals/overlays clearly separate from the underlying page?"
- *Anti-pattern*: A modal dialog that appears without dimming the background — users can't tell what's interactive vs. what's behind.

**Common Region** — Elements inside a visible boundary are perceived as a group.
- *This is the principle behind card-based design, which dominates modern interfaces.*
- *Application*: Product cards, pricing tables, dashboard widgets, sidebar panels, form fieldsets — all use borders, backgrounds, or shadows to create regions.
- *Design Scout test*: "Are related elements contained within clear visual boundaries?"

### Category 3: Cognitive Biases

**Von Restorff Effect (Isolation Effect)** — The one thing that's different from everything else is the most memorable.
- *Practical application*: The "most popular" pricing tier should be visually distinct — different color, larger, with a badge. One CTA that's a different color from all other buttons. A testimonial card with a photo when all others are text-only.
- *Design Scout test*: "Is the most important element on the page visually distinct from everything around it?"
- *Real example*: On a pricing page with 3 tiers, the middle "recommended" plan is often elevated, has a colored border or background, and includes a "Most Popular" badge. This isolation makes it the default mental choice.

**Serial Position Effect** — People remember the first and last items in a sequence best.
- *Practical application*:
  - Put the most important navigation items first and last
  - In a feature list, lead with the strongest feature and end with the second strongest
  - In testimonial carousels, lead with the most impressive one
  - Homepage sections: strongest value prop first, strongest CTA last
- *Design Scout test*: "Are the most important elements positioned at the beginning and end of sequences?"

**Peak-End Rule** — People judge an experience by its most intense moment and its ending, not by the average.
- *Practical application*:
  - **The peak**: The "aha moment" — when the user first experiences the product's core value. For Spotify, it's hearing their first personalized playlist. For Slack, it's sending their first message and getting an instant reply.
  - **The end**: The last interaction matters enormously. A checkout confirmation page with a celebratory animation creates a positive ending. A dry "your order has been placed" is forgettable.
  - **For landing pages**: The hero section (peak) and the final CTA section (end) are the two most important sections on the page.
- *Design Scout test*: "Is there a clear 'peak moment' on this page? Does the page end strongly?"
- *Real example*: Mailchimp's famous "high five" animation after sending a campaign. It's the peak *and* the end moment, and it's become iconic.

**Aesthetic-Usability Effect** — Beautiful designs are perceived as more usable, even when they're not.
- *This is profound*: Users are more forgiving of usability issues in attractive interfaces. They'll try harder, tolerate more friction, and report higher satisfaction.
- *Practical application*: Visual polish isn't superficial — it directly affects perceived usability. A well-designed interface with minor UX issues will be rated higher than an ugly interface with perfect UX.
- *Design Scout test*: "Does the visual quality meet the professional expectations of the target audience? First impressions form in 50ms."
- *Caveat*: This can mask real usability problems. Beautiful doesn't mean usable — but beautiful + usable is the goal.

### Category 4: Design Principles

**Doherty Threshold** — System response must be <400ms to maintain user flow state.
- *The science*: Below 400ms, the brain stays in "action mode." Above 400ms, it switches to "waiting mode" — flow is broken, frustration begins.
- *Practical rules*:
  - Page transitions should happen in <300ms (Google Material Design standard: 200-300ms)
  - If something takes longer, provide instant visual feedback (loading spinner, skeleton screen, progress bar) within 400ms
  - Skeleton screens > spinners > no feedback (skeleton screens give perceived structure immediately)
  - Intentional delays can INCREASE perceived value: Stripe adds a brief processing animation even when the charge is instant, because "too fast" feels untrustworthy for payments
- *Design Scout test*: "How fast do interactions feel? Is there immediate feedback for every user action?"
- *Real example*: Amazon's 1-click ordering eliminates the entire checkout flow — but still shows a brief "placing your order" animation before confirming. This satisfies the Doherty Threshold while preserving trust.

**Postel's Law (Robustness Principle)** — Be liberal in what you accept, conservative in what you output.
- *UX application*: Accept phone numbers as (555) 123-4567 or 5551234567 or 555.123.4567 — don't force a specific format. Accept "New York" or "new york" or "NY." Parse flexibly, display consistently.
- *Design Scout test*: "Do forms and inputs accept multiple reasonable formats? Or do they force users into rigid patterns?"

**Tesler's Law (Conservation of Complexity)** — Every system has irreducible complexity. The question is: does the user bear it, or does the design?
- *Practical application*: Smart defaults absorb complexity. Auto-fill reduces form burden. "We detected your location" instead of "Please enter your city, state, and zip code."
- *Design Scout test*: "How much complexity is pushed onto the user vs. absorbed by the system?"
- *Real example*: Calendly absorbs the complexity of timezone conversion. The user just picks a time — Calendly handles the rest. A booking form that asks "Please convert to EST" violates Tesler's Law.

---

## 4. Wathan & Schoger — "Refactoring UI"

### The Developer's Design System

Refactoring UI is unique because it treats design as a *system of constraints*, not artistic expression. Every technique is mechanical and repeatable.

### Visual Hierarchy: The Three Levers

Most developers only use **font size** to create hierarchy. That's like having a volume knob but no equalizer. Refactoring UI teaches three independent levers:

**1. Font Size** — The blunt instrument
- Use a constrained type scale (e.g., 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72px)
- Don't nitpick between 14px and 15px — pick from the scale
- Headings don't always need to be huge. A 20px bold heading with 14px normal body creates sufficient hierarchy.

**2. Font Weight** — The subtle tool
- Light/thin weights for de-emphasized text
- Normal (400) for body text
- Medium (500) for slightly emphasized text
- Semibold (600) for labels and subheadings
- Bold (700) for strong emphasis
- **Critical insight**: Using weight + color creates more nuanced hierarchy than size alone

**3. Color/Contrast** — The hierarchy workhorse
- Dark text (gray-900) for primary content
- Medium text (gray-600) for secondary content
- Light text (gray-400) for tertiary/supporting content
- **Never use pure black (#000) on pure white (#FFF)** — it's too harsh. Use near-black (gray-900, #111827) for a softer feel.
- **On colored backgrounds, never use gray** — pick a color with the same hue as the background but adjust saturation and lightness

### The Spacing System

**Start with too much whitespace, then remove until satisfied.** Developers instinctively make things too compact. Generous spacing = premium feel.

**Build a spacing scale based on a base unit:**
```
4px — 8px — 12px — 16px — 24px — 32px — 48px — 64px — 96px — 128px
```

**Key rules:**
- Space *between* groups > space *within* groups (this is Gestalt proximity)
- Elements that are related should be close together; unrelated elements should have more space
- Don't be afraid of large gaps between sections — 96px or 128px between major page sections is not unusual
- At small sizes, every pixel matters (4px vs 8px is a 100% difference). At large sizes, precision matters less (64px vs 72px looks the same).

### Shadows, Not Borders

**Borders make interfaces feel heavy and cluttered.** Refactoring UI's single biggest tactical tip:

Instead of borders between elements, use:
1. **Box shadows** — subtle, elevated, modern
2. **Background color differences** — e.g., light gray background on alternating rows
3. **Extra spacing** — sometimes space alone is enough separation

**Shadow system:**
- `shadow-sm`: buttons, form inputs (slight lift)
- `shadow-md`: cards, dropdowns (moderate elevation)
- `shadow-lg`: modals, popovers (high elevation)
- `shadow-xl`: large floating elements
- **Two-part shadows** (a tight dark shadow + a large soft shadow) look most realistic
- **Colored shadows** (using the element's color, not black) feel more alive

### Design in Grayscale First

**The most counterintuitive tip**: Design without color. Build the entire layout in grayscale, relying only on spacing, contrast, and typography to create hierarchy. If it works in grayscale, it will work with color.

Color should be the *last* layer, not the first. When you add color to a design that already has strong hierarchy, the color enhances rather than carries the structure.

### Button Hierarchy

Not every button should look the same. Establish a clear pecking order:

1. **Primary** — Solid background, high contrast. The ONE action you want users to take.
2. **Secondary** — Outline or lower-contrast background. Important but not primary.
3. **Tertiary** — Styled like a link. Discoverable but unobtrusive.

**Critical insight**: Destructive actions (Delete, Cancel) should NOT always be red/prominent. If "Delete" is a secondary action on the page, style it as secondary. Only make it red/bold when it's the *primary* action in a confirmation dialog.

### Color Palette Construction

**Start with one primary color**, then build a full palette:
1. Pick a base color (your brand's primary blue, for example)
2. Generate 9 shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
3. Add a neutral gray palette (9 shades)
4. Add 1-2 accent colors if needed (success green, warning yellow, error red)
5. **Don't use more than 3 hues** unless you have a designer

**Rule of thumb for color usage:**
- Grays: 80% of the interface (backgrounds, borders, body text)
- Primary: 15% (buttons, links, active states, key accents)
- Accent: 5% (alerts, badges, decorative elements)

---

# PART 2: THE CONVERSION PSYCHOLOGY STACK

## Understanding Persuasion vs. Manipulation

The line between persuasion and manipulation: **persuasion helps users make decisions that serve their genuine interests.** Manipulation tricks users into decisions that serve the business at the user's expense.

**Ethical persuasion**: Highlighting genuine benefits, reducing friction, providing social proof from real customers
**Manipulation (dark patterns)**: Fake scarcity timers, confirm-shaming ("No thanks, I don't like saving money"), hidden pre-checked boxes, roach motel subscription cancellations

Design Scout should identify dark patterns and flag them as negative signals.

## The 10 Conversion Principles (With Practical Application)

### 1. The 50ms Judgment (Halo Effect)
Users form an aesthetic judgment of a website within 50 milliseconds — before reading a single word. This judgment affects everything that follows:
- Professional-looking site → "this product must be professional"
- Dated-looking site → "this company is probably behind the times"
- Beautiful interface → users try harder, forgive more, convert more

**Design Scout test**: "Does the above-the-fold area communicate quality, professionalism, and trustworthiness within the first visual impression?"

**What creates a positive 50ms impression:**
- Clean typography with generous spacing
- Professional imagery (not stock photo clichés)
- Consistent color palette
- Clear visual hierarchy
- Absence of clutter

**What destroys it:**
- Crowded layouts
- Clashing colors
- Low-resolution images
- Inconsistent typography
- Visible UI bugs (overflow, misalignment)

### 2. Social Proof / Bandwagon Effect
Humans are social animals. We look to others' behavior to guide our own decisions, especially under uncertainty.

**Levels of social proof (weakest to strongest):**
1. **Numbers**: "Join 10,000+ customers" (weakest — anyone can claim this)
2. **Logos**: "Trusted by Google, Stripe, Airbnb" (stronger — recognizable brands)
3. **Testimonials**: Named quotes with photos and titles (stronger still)
4. **Case studies**: Detailed stories with specific results (very strong)
5. **Real-time activity**: "Sarah from Denver just signed up" (creates urgency + proof)
6. **User-generated content**: Reviews, ratings, community posts (strongest — can't be faked easily)

**Design Scout test**: "What types of social proof are present? Are they specific or vague? Are testimonials attributed with real names, photos, and titles?"

**Case study — WikiJob**: Added customer testimonials → 34% conversion increase. The testimonials were *specific and detailed*, not generic "Great product!" praise.

### 3. Loss Aversion
People are ~2x more motivated to avoid loss than to achieve equivalent gain.

**Application on landing pages:**
- "Don't miss out" > "Sign up today"
- "Stop losing leads" > "Get more leads"
- "Your free trial expires in 3 days" > "Extend your trial"
- Trial countdown timers (ethical when accurate)

**Design Scout test**: "Does the copy frame the value proposition in terms of what users *lose* by not acting?"

### 4. Anchoring
The first number a user sees sets the reference point for all subsequent numbers.

**Pricing page application:**
- Show the most expensive plan first (anchors "expensive" as the reference) → the mid-tier feels like a deal
- Show original price crossed out with sale price → the discount feels larger
- "Starting at $29/mo" anchors cheap before revealing "Most popular: $99/mo"

**Design Scout test**: "What number does the user see first on the pricing page? Does the anchor make the target option feel like a good deal?"

### 5. Paradox of Choice
Too many options → decision paralysis → no decision at all.

**Practical thresholds:**
- Pricing tiers: 3 is ideal, 4 is okay, 5+ causes paralysis
- Nav items: 5-7 top-level
- Feature comparisons: highlight differences, don't list everything
- CTA options per section: 1 primary, max 1 secondary

**Design Scout test**: "At each decision point, how many options does the user face? Can any be removed or deferred?"

**Case study — Expedia**: Removed ONE field from their booking form → $12 million additional annual profit. Every additional form field is a micro-decision that can cause abandonment.

### 6. Endowed Progress Effect
When people feel they've already started a process, they're more motivated to complete it.

**Application:**
- Show a progress bar that starts at 20% instead of 0%
- "Step 2 of 4" implies they've already completed Step 1
- Pre-filling form fields with known information
- Checkmarks on completed onboarding steps

**Design Scout test**: "Do multi-step flows show progress? Does the progress indicator make users feel they've already begun?"

### 7. Scarcity & Urgency
Limited availability increases perceived value. But only when authentic.

**Ethical scarcity**: "3 spots left in this cohort" (real), "Sale ends Sunday" (real deadline)
**Dark pattern scarcity**: Fake countdown timers that reset, "Only 2 left!" when inventory is unlimited

**Design Scout test**: "Are urgency/scarcity signals present? Do they appear authentic or manufactured?"

### 8. Reciprocity
Give value first → users feel compelled to give back.

**Application:**
- Free tools, calculators, or templates before asking for email
- Free tier with genuine value before asking for upgrade
- Educational content that solves real problems
- "Here's your personalized report" before "Sign up to save it"

**Design Scout test**: "Does the page offer genuine value before asking for anything in return?"

### 9. Cognitive Fluency
The easier something is to process, the more trustworthy and true it seems.

**Application:**
- Simple, clean layouts feel more professional
- Easy-to-read fonts (not decorative scripts for body text)
- Clear, short headlines that communicate in <5 words
- Predictable page structures that follow conventions
- High contrast text (WCAG AA minimum: 4.5:1 ratio)

**Design Scout test**: "How easily can a user process the key message? Is any element unnecessarily complex?"

### 10. The Goal-Gradient Effect
People accelerate behavior as they approach a goal.

**Application:**
- Loyalty programs that give early progress (2 of 10 stamps already filled)
- Onboarding checklists where completing items feels achievable
- "You're 80% done!" notifications during signup
- Freemium limits that show usage approaching the cap

---

# PART 3: THE HOOK MODEL — Deep Dive for Product Analysis

## Nir Eyal's 4-Phase Loop

The Hook Model explains why some products become habits while others are forgotten. It's a cycle: Trigger → Action → Variable Reward → Investment.

### Phase 1: Trigger
**External triggers** tell users what to do next:
- Email notifications ("You have a new message")
- Push notifications
- Paid ads
- Social media mentions
- Word of mouth

**Internal triggers** are emotions or situations that prompt use without any external cue:
- Boredom → open Instagram
- Loneliness → open Facebook
- Uncertainty → open Google
- FOMO → check Twitter/X
- Anxiety about work → open Slack

**The goal**: Products start with external triggers and graduate to internal triggers. When a user *automatically* reaches for your product in response to a feeling, you've achieved habit formation.

**Design Scout test for triggers**: "What emotional or situational triggers would bring a user back to this product? Does the interface reinforce those triggers?"

### Phase 2: Action (The Simplest Behavior)
The action must be the absolute *minimum* behavior to get to the reward.

**Fogg Behavior Model**: Behavior happens when Motivation + Ability + Trigger converge.
- If motivation is low, make the action extremely easy
- If the action is hard, you need very high motivation
- Most companies over-invest in motivation and under-invest in making the action easier

**Examples of minimum actions:**
- Google: Type a query and press Enter
- Instagram: Open the app and scroll
- Pinterest: Tap the search icon and type one word
- Tinder: Swipe right or left

**Design Scout test**: "What is the minimum action required to experience the product's value? How many clicks/taps from landing page to core value?"

### Phase 3: Variable Reward
**This is the dopamine engine.** The uncertainty of what you'll find is what makes it addictive.

Eyal identifies three types:
1. **Rewards of the Tribe** (social validation): Likes, comments, followers, recognition, social belonging
2. **Rewards of the Hunt** (information/resources): New content to discover, deals to find, answers to questions
3. **Rewards of the Self** (personal achievement): Completing a task, maintaining a streak, leveling up, mastery

**The key is VARIABILITY.** A refrigerator light that turns on every time is linear — not habit-forming. A social feed that shows *different* content every time creates anticipation.

**Design Scout test**: "What reward does the user receive? Is it variable (unpredictable) or fixed?"

### Phase 4: Investment
Users put something in that makes the product more valuable over time:
- Data (preferences, history, contacts)
- Content (posts, uploads, playlists)
- Reputation (reviews, followers, karma)
- Skill (learned shortcuts, customizations)
- Social capital (connections, conversations)

**The more invested, the harder to leave.** This is what creates switching costs without dark patterns.

**Design Scout test**: "What investments does the user make? How does the product become more valuable with continued use?"

### The Ethics Check: Eyal's Manipulation Matrix
- **Facilitator** (you'd use it yourself + it improves lives): Best case. Build this.
- **Peddler** (you wouldn't use it + it might improve lives): Risky. Proceed with caution.
- **Entertainer** (you'd use it + it doesn't materially improve lives): Harmless fun, but fad-prone.
- **Dealer** (you wouldn't use it + it doesn't improve lives): This is exploitation. Don't build this.

---

# PART 4: GESTALT PRINCIPLES — The Visual Grammar

## Why Gestalt Matters for Design Scout

Gestalt principles are the *grammar* of visual perception. Just as grammatical errors make text hard to read even if the vocabulary is correct, Gestalt violations make interfaces confusing even if every individual element is well-designed.

### Principle 1: Proximity (The #1 Violated Principle)

**The rule**: Space between elements communicates relationship. Close = related. Far = unrelated.

**The most common violation in web design**: Form labels equidistant between two fields. The label should be *twice as close* to its own field as to the field above.

**Practical spacing formula for forms:**
```
Good:
Label          (4px gap)
Input Field    
               (24px gap)
Label          (4px gap)
Input Field

Bad:
Label          (12px gap)
Input Field    (12px gap)
Label          (12px gap)
Input Field
```

**Card layout formula:**
- Internal card padding: 16-24px
- Gap between cards: 24-32px (must be visibly MORE than internal padding)

**Section spacing:**
- Between major page sections: 64-128px
- Between subsections: 32-48px
- Between elements within a section: 16-24px

### Principle 2: Similarity (Visual Consistency = Functional Consistency)

**The rule**: Elements that look the same should work the same.

**Common violations:**
- Blue text that's sometimes a link and sometimes a highlight
- Cards that are sometimes clickable and sometimes decorative
- Icons that sometimes navigate and sometimes toggle
- Buttons that share the same style but do completely different things (one submits, one opens a modal, one navigates)

**Design Scout test**: "Is there a consistent visual language? Do similar-looking elements behave similarly throughout the site?"

### Principle 3: Continuity (Guiding the Eye)

**The rule**: The eye follows lines, curves, and paths.

**Application to landing pages:**
- A diagonal hero image that points toward the CTA → eye follows the line to the button
- Section dividers that curve or angle → create visual flow between sections
- An illustration of a person looking toward the headline → the user's eye follows the gaze direction
- Step-by-step sections with connecting lines or arrows → continuity guides the user through the process

**Design Scout test**: "Do visual elements create a clear path from headline → value prop → CTA? Or does the eye wander without direction?"

### Principle 4: Figure-Ground (Foreground vs. Background)

**The rule**: The brain automatically separates foreground elements from background.

**Critical applications:**
- **Modals**: Must have a dimmed overlay to separate from the page content
- **Dropdown menus**: Shadow creates elevation, separating from the page
- **Toast notifications**: Float above content with clear visual separation
- **Pricing cards**: The "recommended" plan should visually pop forward (shadow, elevation, border)
- **Dark mode**: Reversed figure-ground relationships need careful handling

**Design Scout test**: "Is there a clear visual hierarchy of depth? Do primary elements feel like they're 'in front' of secondary elements?"

### Principle 5: Common Region (Cards, Cards, Cards)

**The rule**: Elements inside a visible boundary are perceived as a group.

This is why **card-based design dominates the modern web**. Cards create instant grouping through borders, backgrounds, or shadows.

**Design Scout test**: "Are related elements grouped within clear visual containers? Or do elements float freely without grouping cues?"

### Principle 6: Focal Point (What Grabs Attention First)

**The rule**: Elements that are visually distinct from their surroundings attract attention first.

**Ways to create focal points:**
- Size (larger = more attention)
- Color (brighter/contrasting = more attention)
- Motion (animated = most attention, use sparingly)
- Isolation (surrounded by whitespace = more attention)
- Typography (bolder/different font = more attention)

**The hierarchy of attention:**
1. Motion (animations, videos)
2. Large imagery
3. Large/bold headlines
4. High-contrast elements (colored buttons)
5. Standard body text
6. Fine print, metadata

**Design Scout test**: "What element grabs attention first? Is it the *right* element — the one the page should prioritize?"

---

# PART 5: NIELSEN'S 10 HEURISTICS — Practical Checklist

## Heuristic 1: Visibility of System Status
**Always keep users informed about what's happening.**

| What to check | Good | Bad |
|---|---|---|
| Loading states | Skeleton screens, progress bars | Blank screen, frozen UI |
| Form submission | Success/error messages | No feedback after clicking Submit |
| Navigation state | Active menu item highlighted | No indication of current page |
| Upload progress | Progress bar with percentage | "Uploading..." with no progress |
| Search results | "Showing 1-10 of 243 results" | Results appear with no context |

## Heuristic 2: Match Between System & Real World
**Use language and concepts users already know.**

| What to check | Good | Bad |
|---|---|---|
| Terminology | "Shopping Cart" | "Order Queue" |
| Error messages | "This email is already registered" | "Error 409: Duplicate entity" |
| Navigation labels | "Pricing" | "Commercial Offerings" |
| Button text | "Start Free Trial" | "Initiate Provisioning" |

## Heuristic 3: User Control & Freedom
**Always provide an escape hatch.**

- Undo/redo support in editors
- "Back" button that works predictably
- Easy cancelation of in-progress operations
- Clear "close" buttons on modals and overlays
- Multi-step forms with ability to go back

## Heuristic 4: Consistency & Standards
**Follow platform conventions.**

- Primary CTA in the same position on every page
- Same color = same meaning throughout
- Consistent icon usage (don't use a gear for settings on one page and a wrench on another)
- Standard form patterns (labels above or to the left, not mixed)

## Heuristic 5: Error Prevention
**Better to prevent errors than to recover from them.**

- Confirmation dialogs for destructive actions
- Form validation *before* submission
- Disabled states for invalid actions
- Smart defaults that reduce input errors
- Type-ahead/autocomplete for known values

## Heuristic 6: Recognition Rather Than Recall
**Show options rather than requiring users to remember.**

- Search suggestions and autocomplete
- Recently viewed items
- Breadcrumb navigation
- Visible tool palettes instead of keyboard shortcuts
- Dropdown menus instead of free-text input for known values

## Heuristic 7: Flexibility & Efficiency
**Serve both novice and expert users.**

- Keyboard shortcuts for power users
- Customizable dashboards
- Saved preferences/filters
- Quick actions alongside detailed workflows
- Progressive disclosure (simple by default, complex when needed)

## Heuristic 8: Aesthetic & Minimalist Design
**Every element should serve a purpose.**

- Remove decorative elements that don't add meaning
- Eliminate redundant information
- Use whitespace to create breathing room
- Reduce visual noise (unnecessary borders, gradients, textures)
- Follow the "newspaper test" — if a journalist wouldn't include it, cut it

## Heuristic 9: Help Users Recover From Errors
**Error messages should be plain language, indicate the problem, and suggest a solution.**

| Bad error | Good error |
|---|---|
| "Error 500" | "Something went wrong on our end. Please try again in a few minutes." |
| "Invalid input" | "Please enter a valid email address (e.g., name@example.com)" |
| "Operation failed" | "We couldn't save your changes because your session expired. Please log in again — your work has been saved as a draft." |

## Heuristic 10: Help & Documentation
**The best interfaces don't need help docs. But when they do:**

- Searchable
- Task-oriented (not just feature documentation)
- Contextual (appears near the relevant UI element)
- Concise (step-by-step, not walls of text)
- Available but not intrusive (tooltip icons, collapsible sections)

---

# PART 6: ANTI-PATTERNS & DARK PATTERNS — What Design Scout Should Flag

## Dark Patterns (Deceptive Design)

These should be identified as *negative signals* in any analysis:

**1. Confirm-shaming** — Guilt-tripping the opt-out option
- "No thanks, I don't like saving money"
- "I'd rather pay full price"
- Design Scout flag: Any dismiss/decline option that uses emotionally manipulative language

**2. Roach Motel** — Easy to sign up, nearly impossible to cancel
- Multi-page cancellation flows with "Are you sure?" at every step
- Phone-only cancellation for online services
- Design Scout flag: If the cancellation path requires significantly more effort than signup

**3. Forced Continuity** — Free trial that auto-converts to paid without clear warning
- No reminder before billing starts
- Credit card required for "free" trial
- Design Scout flag: Trial sign-up that requires payment info without clear messaging about when charging begins

**4. Misdirection** — Drawing attention away from unfavorable options
- The "Decline" button is a tiny gray link while "Accept" is a massive green button
- Important terms hidden in collapsed sections
- Design Scout flag: Asymmetric button styling that makes the business-preferred option dramatically more visible

**5. Sneak into Basket** — Adding items the user didn't request
- Pre-checked add-on boxes during checkout
- "Recommended" insurance auto-added to cart
- Design Scout flag: Any pre-selected options that add cost

**6. Trick Questions** — Confusing wording that leads to unintended actions
- Double negatives in checkbox labels
- "Uncheck this box if you don't want to not receive emails"
- Design Scout flag: Any form element where the expected action is unclear

**7. Privacy Zuckering** — Tricking users into sharing more data than intended
- Complex privacy settings designed to confuse
- Data sharing enabled by default with opt-out buried in settings
- Design Scout flag: Privacy/data settings that are clearly designed to discourage careful review

## UI Anti-Patterns (Not Malicious, Just Bad Design)

**1. Mystery Meat Navigation** — Icons or labels that don't clearly indicate destination
- Abstract icons without text labels
- Hover-only labels on navigation

**2. False Bottom** — Page appears complete when there's more content below
- No visual cues suggesting more content (no partial elements, no scroll indicators)

**3. Hamburger Menu Overuse** — Hiding primary navigation behind a hamburger on desktop
- Desktop sites with plenty of screen real estate but all navigation hidden

**4. Infinite Scroll Without Landmarks** — Users can't find their place or reach the footer
- No "Back to top" button
- Footer content inaccessible because new content loads endlessly

**5. Modal Abuse** — Using modals for content that should be a page
- Newsletter popups on first visit (before user has seen any content)
- Multi-step flows inside modals instead of dedicated pages

---

# PART 7: MODERN DESIGN TRENDS (2025-2026) — What "Current" Looks Like

## What's Standard Now

**Bento Grids**: Modular cards of varying sizes arranged in grid layouts. Apple, Google, and Microsoft have standardized this pattern. It's the default for feature showcases and dashboards.

**Warm Minimalism**: The cold, stark white minimalism of 2018-2022 has evolved. Current trend: warm off-whites, cream backgrounds, soft organic shapes, rounded corners, subtle textures. Pantone 2026 "Cloud Dancer" reflects this shift.

**Dark Mode as Default Option**: OLED screens save 15-40% energy in dark mode. Users increasingly expect a dark mode toggle. WCAG contrast requirements apply in both modes.

**Glassmorphism (Evolved)**: Frosted glass effects with `backdrop-filter: blur()`. Used subtly for cards and modals, not everywhere. More refined than 2020's implementation — paired with soft shadows and subtle borders.

**Scroll Storytelling**: Content that reveals and animates as the user scrolls. Parallax effects with realistic physics. Section transitions that feel cinematic. GSAP and Framer Motion are the dominant animation libraries.

## What's Dying

- Static stock photo heroes (replaced by product screenshots, custom illustration, or video)
- Complex dropdown mega-menus (replaced by simpler, fewer top-level items)
- Autoplay video (users find it intrusive; accessibility concern)
- Heavy animation without purpose (performance and accessibility issues)
- Carousels/sliders for critical content (users rarely interact past the first slide)
- Neumorphism (the inner/outer shadow trend from 2020 — too subtle for accessibility)
- Page-blocking cookie consent popups (regulated and increasingly sophisticated)

## Accessibility as Legal Requirement

The **European Accessibility Act** went into effect June 28, 2025, with full compliance required by 2030. WCAG 2.2 AA is the minimum legal standard in the EU. This affects any digital product serving EU customers.

**Key WCAG 2.2 requirements:**
- Minimum contrast ratio 4.5:1 for normal text, 3:1 for large text
- All interactive elements keyboard-accessible
- Focus indicators visible and clear
- Touch targets minimum 24×24px (WCAG 2.2), Apple recommends 44×44pt, Google recommends 48×48dp
- No content that requires specific sensory ability (color alone can't convey meaning)
- Screen reader compatibility

---

# PART 8: RESOURCES RANKED BY PRACTICAL VALUE FOR DESIGN SCOUT

## Websites (Use for ongoing reference)
1. **lawsofux.com** — Jon Yablonski's interactive law reference. Perfect for quick principle lookups.
2. **nngroup.com/articles** — Nielsen Norman Group. Gold standard for evidence-based UX research. Their article archive is the most authoritative UX resource online.
3. **growth.design/case-studies** — 60+ interactive case studies showing psychology principles applied to real products (Amazon, Spotify, Uber, etc.). Each one is a practical masterclass.
4. **builtformars.com** — 80+ UX case studies with practical analysis of real products. Subscription-based but uniquely actionable.
5. **refero.design** — Curated library of real website screenshots organized by section type (hero, pricing, features, etc.)
6. **land-book.com** — Landing page gallery with filtering by style and industry
7. **mobbin.com** — Mobile and web design pattern library with screenshots
8. **checklist.design** — Pre-flight checklists for every design deliverable type
9. **a11yproject.com** — Practical accessibility checklist and resources
10. **deceptive.design** (formerly darkpatterns.org) — Hall of shame for dark patterns. Essential anti-pattern reference.

## YouTube Channels (For learning visual design judgment)
1. **Flux Academy (Ran Segall)** — Most practical web design tutorials. Good for understanding layout decisions.
2. **DesignCourse (Gary Simon)** — Technical design + development. Explains the "why" behind visual choices.
3. **Figma (Official)** — Config talks are design masterclasses. Watch the annual conference talks.
4. **The Futur (Chris Do)** — Business of design + typography deep dives.
5. **NNGroup** — Jakob Nielsen and team. Academic but rigorous evidence-based UX.

## Must-Watch (One-Time Deep Learning)
- Don Norman's Google Talk on "Design of Everyday Things" — 1 hour that changes how you see everything
- Steve Krug's Google Talk on "Don't Make Me Think" — The most practical usability talk ever recorded
- Mike Monteiro "F*** You, Pay Me" — Not about UX specifically but about design value

---

# PART 9: HOW THIS FEEDS DESIGN SCOUT'S PROMPT LIBRARY

## New Scoring Dimensions to Add

### 1. Cognitive Load Score
Based on: Hick's Law, Miller's Law, cognitive fluency
- How many decisions per screen?
- Is information chunked into groups of ≤7?
- Are options clearly prioritized or equally weighted?
- How many steps to complete the primary task?

### 2. Trust Signal Score
Based on: Social proof, aesthetic-usability effect, cognitive fluency
- Types of social proof present (logos, testimonials, numbers, reviews)
- Specificity of proof (named + photographed testimonials > anonymous quotes)
- Visual polish level (50ms impression test)
- Security indicators (SSL, trust badges, privacy policy visibility)

### 3. Copy Quality Score
Based on: Krug's scanning rules, happy talk detection, microcopy quality
- Headlines communicate value in ≤8 words?
- CTAs use specific action verbs (not generic "Submit" or "Click Here")?
- Is there happy talk that could be removed?
- Are error messages helpful and specific?
- Do empty states provide guidance?

### 4. Gestalt Compliance Score
Based on: All 6+ Gestalt principles
- Proximity: Related elements closer than unrelated elements?
- Similarity: Consistent visual treatment for same-function elements?
- Figure-ground: Clear depth hierarchy?
- Closure: Visual cues suggesting more content to discover?
- Common region: Related elements contained in visual groups?

### 5. Norman Compliance Score
Based on: 6 principles from Design of Everyday Things
- Affordances: Do interactive elements look interactive?
- Signifiers: Are there clear cues for all possible actions?
- Mapping: Do controls relate logically to their effects?
- Feedback: Does every action produce visible response?
- Constraints: Are errors prevented before they happen?
- Conceptual model: Does the interface match users' mental models?

## Refinements to Existing Dimensions

### Visual Hierarchy (Enhanced)
Now references: Refactoring UI's 3 levers (size, weight, color), Von Restorff effect for isolation, serial position effect for placement
- "Does the page use the Refactoring UI hierarchy system (size + weight + color), or does it rely on size alone?"
- "Is the most important element visually isolated (Von Restorff)?"
- "Are the strongest elements at the start and end of sequences (Serial Position)?"

### CTA Clarity (Enhanced)
Now references: Fitts's Law (size + distance), Hick's Law (choice reduction), cognitive fluency
- "Is the primary CTA ≥44px height with high-contrast styling?"
- "Is there only ONE primary CTA per viewport?"
- "Does the CTA copy specify what happens next? ('Start free trial' > 'Get started' > 'Submit')"

### Navigation (Enhanced)
Now references: Jakob's Law (convention following), Krug's Trunk Test, Miller's Law (≤7 items)
- "Does the navigation follow conventions of the site's category?"
- "Can a user pass the Trunk Test on any page?"
- "Are top-level nav items ≤7?"

### Engagement/Retention (New for In-App)
Now references: Hook Model phases, peak-end rule, Doherty Threshold
- "What's the Hook loop? Trigger → Action → Variable Reward → Investment?"
- "Is there a clear 'peak moment' in the user flow?"
- "Do interactions respond within 400ms?"

## Category-Specific Prompt Enhancements

### SaaS Landing Pages
- Apply Trunk Test + all 10 conversion psychology principles
- Check for: Hero clarity, social proof specificity, pricing page anchoring, CTA hierarchy, objection handling (FAQ), mobile responsiveness

### Healthcare (NymbleAI's Domain)
- Extra weight on: Trust signals, accessibility compliance, anxiety reduction (warm tones, clear language), HIPAA compliance indicators, simple forms with progressive disclosure
- Reduced emphasis on: Aggressive urgency/scarcity tactics (inappropriate for healthcare), dark mode (clinical contexts prefer light), playful micro-interactions (inappropriate tone)

### E-commerce
- Extra weight on: Product imagery quality, social proof (reviews), Fitts's Law for "Add to Cart", form optimization, checkout friction reduction
- Check for: Fake scarcity, hidden costs (dark patterns), clear return policy visibility

---

# APPENDIX: Quick Reference Checklists

## The 5-Second Test
Show the page for 5 seconds, then answer:
1. What is this site about?
2. What's the primary action I can take?
3. What company/brand is this?
4. Who is this for?
5. Why should I care?

## The Squint Test
Blur your vision and check:
1. Can I identify the headline?
2. Can I find the CTA?
3. Can I distinguish navigation from content?
4. Is there a clear visual hierarchy?
5. Does one element "pop" (Von Restorff)?

## The Trunk Test (Krug)
Land on any page and identify:
1. Site identity (logo/name)
2. Page name
3. Major sections (nav)
4. Local options
5. "You are here" indicator
6. Search

## Landing Page Conversion Audit
1. ☐ Hero communicates value in <5 seconds
2. ☐ Single, clear primary CTA above the fold
3. ☐ Social proof present and specific
4. ☐ Benefits, not just features
5. ☐ Objections addressed (FAQ or comparison)
6. ☐ Trust signals visible (logos, testimonials, security)
7. ☐ Mobile-responsive with thumb-zone CTAs
8. ☐ Page loads in <3 seconds
9. ☐ No dark patterns
10. ☐ Clear next step at every scroll depth

## In-App Usability Audit
1. ☐ Onboarding gets to value in <3 steps
2. ☐ Navigation follows Jakob's Law conventions
3. ☐ All actions provide feedback within 400ms
4. ☐ Error messages are specific and helpful
5. ☐ Undo available for destructive actions
6. ☐ Keyboard shortcuts for power users
7. ☐ Empty states provide guidance
8. ☐ Progressive disclosure for complex features
9. ☐ Consistent visual language throughout
10. ☐ Accessibility: keyboard nav, contrast ratios, screen reader support

## Design Token Extraction Checklist
1. Primary font family + fallback
2. Font size scale (all sizes used)
3. Font weight scale
4. Color palette (primary, secondary, neutrals, semantic)
5. Spacing scale (padding and margin values)
6. Border radius values
7. Shadow definitions
8. Breakpoints (responsive)
9. Animation/transition durations
10. Z-index layers
