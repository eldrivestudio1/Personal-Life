# Personal Life Operating System (PLOS)

## README --- Product Specification, Technical Blueprint, and Codex Build Guide

> **Purpose of this document:** This README is the single source of
> truth for designing, implementing, testing, and deploying the
> application. The coding agent must follow it as a specification, not
> treat it as a loose suggestion.

------------------------------------------------------------------------

## 1. Product Overview

**Working name:** Personal Life OS\
**Product type:** Mobile-first Progressive Web App (PWA) for personal
tasks, daily planning, spending awareness, and reflection.\
**Deployment:** Vercel\
**Primary persistence:** Browser `localStorage`\
**Offline support:** Service worker + cached application shell +
local-first data operations\
**Primary language:** Indonesian for the first release, with
architecture that can support localization later.

### 1.1 Product vision

Build a calm, reliable personal system that helps users manage
**priorities, time, energy, tasks, and money** without turning daily
life into a performance contest. The app should make it easier to start,
resume, and reflect---not shame users for unfinished tasks.

### 1.2 Product positioning

This is more than a conventional to-do list, but the first version must
remain deliberately simple. It combines: - A daily focus and nested
tasks. - A flexible schedule and gentle rescheduling. - A simple expense
log and budget tracking. - Weekly reflection and lightweight trends. -
Local-first storage, offline access, and user-controlled data
export/import.

### 1.3 Product principles

1.  **Reduce friction, preserve agency:** make actions easy while
    leaving final decisions to the user.
2.  **Consistency over perfection:** missed tasks are information, not a
    moral failure.
3.  **Useful before intelligent:** deliver a dependable basic workflow
    before adding adaptive algorithms.
4.  **Local-first and private by default:** keep personal data on the
    device unless the user explicitly exports it.
5.  **Progressive disclosure:** show the essentials first; reveal detail
    when requested.
6.  **Accessible and responsive:** work with keyboard, touch, screen
    readers, zoom, and small screens.
7.  **Honest automation:** explain what will move, never silently
    discard data, and make automated changes reversible where practical.

------------------------------------------------------------------------

## 2. Goals and Non-Goals

### 2.1 Goals for the first usable release (MVP)

-   Users can create, edit, complete, postpone, and delete tasks.
-   Tasks can contain subtasks, with clear parent/child relationships.
-   Users can select one primary focus for the day and see up to three
    suggested next actions.
-   Incomplete tasks can be reviewed and rescheduled without
    guilt-inducing language.
-   Users can record expenses and manage simple daily/monthly budget
    limits.
-   Users can review a basic weekly summary.
-   The app works after its first successful load when the device is
    offline, provided its assets have been cached.
-   The app can be installed on supported devices as a PWA / added to
    the home screen.
-   Data survives refreshes and browser restarts on the same browser
    profile, unless browser data is cleared.
-   Users can export and import their data in a documented JSON format.
-   The interface is mobile-first, responsive, and usable on current
    major browsers.

### 2.2 Non-goals for the MVP

Do **not** build these until the core app is stable and user-tested: -
Cloud sync, user accounts, collaboration, or cross-device
synchronization. - Bank account integration or automatic transaction
imports. - AI-generated life advice or a remote AI dependency. - Complex
machine learning, mood prediction, or claims about detecting energy
levels. - Social feeds, leaderboards, public profiles, or competitive
streaks. - Complex project management, Gantt charts, or enterprise
workflows. - Notifications that require a server or depend on an
internet connection. - Any feature that requires an external API for the
app's core functionality.

------------------------------------------------------------------------

## 3. Target Experience

### 3.1 Primary user journey

1.  The user opens the app, online or offline after the app shell has
    been cached.
2.  The home screen shows today's date, a calm status summary, the main
    focus (if chosen), and a short list of actionable tasks.
3.  The user can add a task in a few seconds without completing a large
    form.
4.  The user optionally breaks a task into small, concrete steps.
5.  The user starts or completes a step and receives restrained, clear
    feedback.
6.  If a task is not completed, the user can keep it, reschedule it,
    break it down, or archive it.
7.  The user records expenses and sees remaining budget with a clear
    explanation of the calculation.
8.  At the end of a week, the app presents a short reflection based on
    actual stored data.
9.  The user can export a backup whenever they want.

### 3.2 Home screen hierarchy

The home screen should prioritize: 1. **Today's focus:** one main
priority, with an obvious way to change it. 2. **Next actions:** show no
more than three suggested tasks by default. 3. **Quick capture:** add a
task or expense without navigating through several screens. 4. **Budget
snapshot:** a compact summary, not a dominant warning panel. 5.
**Secondary content:** upcoming tasks, full task list, analytics,
settings, and data tools behind navigation or collapsible sections.

The home screen must not be an empty dashboard that requires
configuration before it becomes useful. Provide a helpful first-run
state with one clear next step and example-free data (do not create fake
user transactions or tasks).

------------------------------------------------------------------------

## 4. Information Architecture and Screens

Use a small, predictable navigation model. On mobile, use a bottom
navigation bar with safe-area padding. On wider screens, a sidebar or
compact top navigation is acceptable, provided the information
architecture remains consistent.

### 4.1 Required screens

#### A. Today / Home

-   Current local date.
-   Main focus card.
-   Up to three next actions.
-   Quick-add task and quick-add expense actions.
-   Compact budget snapshot if a budget is configured.
-   Gentle summary of completed items.
-   Clear empty states.

#### B. Tasks

-   Task list with filters: Today, Upcoming, Unscheduled, Completed,
    Archived.
-   Search by task title.
-   Add, edit, complete, postpone, archive, and delete actions.
-   Task detail view with description, due date, priority, estimated
    duration, actual duration (optional), and subtasks.
-   Nested task display must remain readable on narrow screens.
-   Avoid an endless backlog on the home screen; use filters and
    grouping.

#### C. Task editor / quick capture

Minimum fields: - Title (required). - Optional notes. - Optional
date/time or due date. - Optional priority: Low, Normal, High. -
Optional estimate in minutes. - Optional parent task. - Optional repeat
rule only if implemented safely and tested.

Keep quick capture short. Advanced fields can be hidden under "More
options".

#### D. Money / Expenses

-   Add expense: amount, date, category, optional note.
-   Edit and delete transactions.
-   Budget configuration with a clearly defined period (daily or
    monthly).
-   Show spending to date, remaining budget, and percentage used.
-   Categories are user-editable if practical; otherwise provide a small
    default set.
-   Currency must be configurable. Default currency may be `IDR`, but
    never silently convert currencies.
-   Use integer minor units where practical, or integer rupiah for IDR.
    Avoid floating-point arithmetic for financial totals.
-   Do not treat underspending as new money. Show it as unspent budget
    unless the user explicitly chooses to reallocate it.

#### E. Reflection / Insights

-   Weekly totals: tasks completed, tasks postponed, expenses recorded,
    and budget usage if configured.
-   Estimates vs. actual duration only when sufficient data exists.
-   Keep summaries descriptive and non-judgmental.
-   Clearly label data ranges and how each metric is calculated.
-   Do not imply that correlation proves causation or make
    medical/psychological claims.

#### F. Settings & Data

-   Theme: system / light / dark, if implemented consistently.
-   Currency and budget preferences.
-   Export data to JSON.
-   Import JSON with validation and a confirmation step.
-   Reset all data with a strong confirmation and clear warning.
-   App version and offline/install guidance.
-   Privacy explanation: data is stored in this browser on this device.

### 4.2 Navigation rule

Every required screen must be reachable with no more than two taps from
the main navigation on mobile. Avoid modal-on-modal flows. Use dialogs
only for focused decisions and confirmations.

------------------------------------------------------------------------

## 5. Behavior and Product Rules

### 5.1 Task data and completion

-   A task has a stable unique ID.
-   Completing a parent task must not silently delete its subtasks.
-   Decide and implement a consistent parent completion rule:
    -   Recommended MVP rule: parent can be completed only after its
        subtasks are complete, or the UI asks whether to complete the
        parent and its remaining subtasks.
-   A completed task remains available in Completed history until the
    user deletes it.
-   Deleting a task with children must ask for confirmation and explain
    whether children will also be deleted or detached.
-   Do not silently drop task notes, dates, or children during edits.
-   All date display and date calculations must use the device's local
    timezone, with careful handling of date-only values to avoid
    off-by-one errors.

### 5.2 Daily focus

-   Allow one primary focus per day.
-   The user can change or clear the focus at any time.
-   The focus can point to an existing task; avoid duplicating task
    records.
-   If the focus is completed or archived, clear or update the focus
    reference safely.
-   Show no more than three suggested next actions by default. The user
    can open the full list.

### 5.3 Gentle rescheduling

Never automatically push every unfinished task forward indefinitely.

Recommended MVP behavior: 1. At a new day/session, identify overdue or
unfinished scheduled tasks. 2. Present a small review card: "Ada
beberapa tugas yang bisa kamu atur ulang." 3. Offer explicit choices:
**Jadwalkan ulang**, **Tetap di tanggal ini**, **Jadikan tanpa jadwal**,
**Pecah menjadi langkah kecil**, or **Arsipkan**. 4. An optional "move
selected tasks to today" action may be provided, but must show the
number of affected tasks and require confirmation. 5. Do not change task
dates without a visible user action in the MVP. 6. Avoid red danger
states for ordinary unfinished tasks. Use neutral language and color;
reserve strong warning styles for destructive actions or genuine data
problems.

### 5.4 Habit-friendly feedback

-   Use brief, meaningful feedback when a task is completed.
-   Animation is optional and must respect `prefers-reduced-motion`.
-   Do not use manipulative variable rewards, random rewards designed to
    encourage compulsive checking, or guilt-based streaks.
-   If streaks are ever added, make them optional and do not treat a
    missed day as failure.
-   Never claim that a UI animation causes a specific dopamine response.

### 5.5 Budget calculation

Define formulas explicitly and test them.

For a configured budget period: - `spent = sum(expenses.amount)` for
transactions inside the period and selected currency. -
`remaining = budgetLimit - spent`. -
`usedPercent = budgetLimit > 0 ? (spent / budgetLimit) * 100 : null`.

Rules: - If `remaining < 0`, show the amount over budget neutrally. - If
no budget is configured, show spending without implying that the user is
over budget. - Exclude deleted transactions. - Filter by the
transaction's local calendar date. - Never silently move money between
budget periods or savings goals. - If transfers or savings goals are
later introduced, model them separately from expenses to avoid
double-counting.

------------------------------------------------------------------------

## 6. UX and Visual Design System

### 6.1 Visual direction

Use a calm, clear, low-friction visual language: - Neutral background
and surfaces. - One primary accent color, such as teal. - Amber as a
secondary informational state. - Red only for destructive actions or
genuine errors, not routine incomplete tasks. - Strong text contrast and
readable typography. - Clear spacing and restrained borders/shadows. -
Avoid unnecessary gradients, visual clutter, oversized dashboards, and
excessive animation.

### 6.2 Responsive layout

Implement mobile-first CSS. Suggested breakpoints (adjust if content
requires it): - Base: 320px and up. - Small tablet: 600px and up. -
Desktop: 900px and up. - Wide desktop: 1200px and up.

Requirements: - No horizontal page overflow at 320px viewport width. -
Tap targets should generally be at least 44 × 44 CSS pixels. - Forms
must work with virtual keyboards. - Respect
`env(safe-area-inset-bottom)` for bottom navigation and installable
mobile layouts. - Use fluid containers and readable max-widths on
desktop. - Do not simply stretch the mobile layout across a wide
screen. - Ensure dialogs and dropdowns fit small screens and remain
keyboard accessible.

### 6.3 Accessibility

Target WCAG 2.2 AA where feasible: - Semantic HTML landmarks and heading
order. - Visible keyboard focus. - Proper labels and accessible
validation messages. - Sufficient contrast; never rely on color alone. -
Keyboard support for all core actions. - Screen-reader labels for
icon-only buttons. - Focus management for dialogs. - Respect
`prefers-reduced-motion`. - Support browser zoom and text resizing. -
Use buttons for actions and links for navigation. - Announce important
status changes accessibly without excessive live-region chatter.

### 6.4 Animation principles

Use motion to clarify state changes, not to distract or pressure users.

- Use short transitions for button press/hover, focus, card expansion, dialogs, and task completion.
- Optional chart reveal animations are acceptable, but values must remain understandable without motion.
- Respect `prefers-reduced-motion: reduce` by disabling nonessential transitions and scroll-triggered effects.
- Keep most transitions around 120–240 ms. Never delay interaction until an animation ends.
- Avoid flashing, continuous decorative motion, guilt-inducing red pulses, and compulsive reward loops.
- Keep motion rules in `css/animations.css`; use CSS first and vanilla JavaScript only when needed. Clean up observers/listeners.

### 6.5 Charts and data visualization

Build charts without a charting framework or external CDN. Prefer native SVG for responsive, accessible charts; Canvas is allowed only where a clear performance benefit exists.

MVP charts:
- Weekly task activity: completed tasks per day.
- Spending by category for a selected period.
- Budget usage: spending versus budget limit.
- Estimate versus actual duration only when enough valid data exists.

Chart requirements:
- Use actual stored records only; never seed fake user activity.
- Handle empty, zero, and incomplete data gracefully.
- Include titles, date ranges, units, legends, and a textual summary; never rely on color alone.
- Add SVG `<title>` and `<desc>` where appropriate and provide text/table summaries for important values.
- Do not mix currencies in one chart.
- Charts must resize and remain legible on mobile and work offline.
- Animation is optional and must respect reduced-motion settings.

### 6.6 CSS and styling strategy

Use plain CSS only:
- Define design tokens with CSS custom properties in `css/tokens.css`.
- Split styles by responsibility across local CSS files.
- Use mobile-first media queries, Grid, Flexbox, and fluid sizing such as `clamp()` with suitable fallbacks.
- Use local SVG icons and system fonts. No remote fonts, images, stylesheets, scripts, or icon CDNs for core UI.
- Toggle semantic CSS classes from JavaScript instead of assembling large style strings.
- Cache all core CSS in the service worker.

Do not use Tailwind, Bootstrap, CSS-in-JS, or any styling framework. The core UI must look consistent online and offline.

## 7. Technical Architecture

### 7.1 Recommended stack

- **Core:** semantic HTML5, CSS3, and vanilla JavaScript (ES modules), with no UI framework.
- **Hosting:** Vercel static site deployment.
- **Styling:** plain local CSS and CSS custom properties.
- **Persistence:** a versioned repository module over `localStorage`.
- **Offline/PWA:** `manifest.webmanifest` and a vanilla JavaScript service worker.
- **Charts:** native SVG by default, optionally Canvas, rendered by vanilla JavaScript.
- **Animation:** CSS transitions/keyframes, with minimal JavaScript for stateful effects.
- **Testing:** optional lightweight tests plus manual browser QA; test tooling is not a runtime dependency.

Do not introduce React, Next.js, Vue, Angular, Svelte, jQuery, Bootstrap, Tailwind, charting libraries, or other application frameworks. Do not add a bundler unless a concrete, documented requirement justifies it. The deployed app should work as static files over HTTPS.

### 7.2 Architecture boundaries

Keep files small and organized by responsibility. Suggested structure:

```text
/
├── index.html
├── tasks.html                    # optional separate page
├── money.html                    # optional separate page
├── insights.html                 # optional separate page
├── settings.html                 # optional separate page
├── manifest.webmanifest
├── sw.js
├── offline.html                  # optional fallback
├── assets/icons/                 # local app icons
├── css/
│   ├── tokens.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   └── charts.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── storage.js
│   ├── schema.js
│   ├── tasks.js
│   ├── focus.js
│   ├── money.js
│   ├── insights.js
│   ├── charts.js
│   ├── dates.js
│   ├── currency.js
│   ├── validation.js
│   └── export-import.js
├── tests/                        # optional automated tests
├── README.md
└── vercel.json                   # optional, only if needed
```

Use a multi-page static site or a simple client-side view system, but ensure every required screen is reachable and direct routes work offline. Avoid introducing a framework just to manage navigation.

### 7.3 Vanilla JavaScript module conventions

- Use semantic HTML for structure, CSS for presentation, and JavaScript for behavior.
- Prefer `<script type="module" src="./js/app.js"></script>` and relative imports between modules.
- Avoid inline event handlers such as `onclick="..."`; attach listeners with `addEventListener`.
- Avoid global mutable state. Keep application state in a dedicated module with explicit read/update functions.
- Use event delegation for repeated task and expense lists where appropriate.
- Render user-provided text with `textContent` or safe DOM APIs; never concatenate user input into `innerHTML`.
- Keep domain logic independent from DOM rendering so it can be tested separately.
- Use ordinary links for navigation where practical. If using a single-page view, preserve usable URLs/history and support direct route loading.
- Core functionality must not depend on a bundler, transpiler, or framework runtime.

### 7.4 Data flow

Use a simple local-first flow:

`User action → input validation → domain function → storage repository → in-memory state update → DOM render → UI feedback`

Requirements: - Components must not read/write arbitrary `localStorage`
keys directly. - All persisted data must pass through a single versioned
repository layer. - Keep pure business logic separate so it can be
tested without rendering the DOM. - Show a clear error if storage is
unavailable or full. Never claim data was saved if persistence failed. -
The UI should update only after a successful write, or use an explicitly
designed optimistic update with rollback on failure. - Listen for the
browser `storage` event to refresh state if the same origin is open in
another tab. Do not assume this event fires in the tab that performed
the write. - Prevent accidental lost updates across tabs as far as
practical; document that `localStorage` is not a transactional
multi-user database.

------------------------------------------------------------------------

## 8. Data Model and Local Storage

### 8.1 Important limitation

`localStorage` is **browser- and origin-specific**, has limited
capacity, and can be cleared by the user or browser. It does not sync
between devices, and it is not a backup. Incognito/private modes and
storage policies can behave differently. The app must communicate this
clearly.

For structured, larger, or more robust offline data, IndexedDB is
usually the better long-term storage choice. However, because this
project explicitly specifies `localStorage`, the MVP should use it
behind a repository interface so the implementation can migrate to
IndexedDB later without rewriting the UI. Do not claim that data is
permanently safe.

### 8.2 Storage key and schema version

Use a single namespaced key, for example:

`personal-life-os:data`

Persist an envelope with: - `schemaVersion`: integer. - `updatedAt`: ISO
timestamp. - `tasks`: task array. - `dailyFocus`: date-to-task-ID
mapping or equivalent typed structure. - `expenses`: expense array. -
`budgets`: budget configuration. - `settings`: user preferences.

Do not scatter each feature across unrelated keys unless a documented
migration strategy justifies it.

### 8.3 Suggested TypeScript domain types

The agent should implement equivalent strict types; it may refine names
but must preserve the concepts:

``` ts
type TaskStatus = "open" | "completed" | "archived";
type TaskPriority = "low" | "normal" | "high";

interface Task {
  id: string;
  title: string;
  notes?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  dueDate?: string;        // local date-only value: YYYY-MM-DD
  scheduledAt?: string;    // ISO timestamp if a time is required
  parentId?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  completedAt?: string;
}

interface Expense {
  id: string;
  amountMinor: number;     // integer minor units; document currency convention
  currency: string;        // e.g. IDR
  categoryId: string;
  note?: string;
  occurredOn: string;      // local date-only value: YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

interface Budget {
  id: string;
  currency: string;
  period: "daily" | "monthly";
  limitMinor: number;
  categoryId?: string;     // absent means overall budget
  createdAt: string;
  updatedAt: string;
}

interface AppSettings {
  currency: string;
  theme: "system" | "light" | "dark";
  onboardingCompleted: boolean;
}

interface AppData {
  schemaVersion: number;
  updatedAt: string;
  tasks: Task[];
  dailyFocus: Record<string, string | null>; // YYYY-MM-DD -> task ID
  expenses: Expense[];
  budgets: Budget[];
  settings: AppSettings;
}
```

If currency minor units are used, define the exponent for each supported
currency. For IDR, integer rupiah is appropriate; do not assume every
currency has two decimal places. Use a currency formatting utility based
on `Intl.NumberFormat` while keeping arithmetic in integers.

### 8.4 IDs, validation, and safe writes

-   Generate IDs with `crypto.randomUUID()` where supported; provide a
    safe, tested fallback if required by the supported browser baseline.
-   Validate imported JSON and persisted data at runtime.
-   On invalid or unknown schema versions, do not silently overwrite the
    data. Show a recovery/export path where possible.
-   Use a migration function for every schema change.
-   Catch `JSON.parse`, `JSON.stringify`, quota, and storage-access
    errors.
-   Avoid storing derived totals that can be recalculated; this reduces
    inconsistency.
-   Never store secrets or authentication credentials in `localStorage`.
-   Keep the repository API typed, for example: `loadData`, `saveData`,
    `updateData`, `exportData`, `importData`, and `clearData`.
-   Make writes resilient to malformed existing data and preserve a
    recoverable copy before migrations where feasible.

### 8.5 Import and export

Export: - Download a JSON file containing schema version, export
timestamp, and all app data. - Provide a clear filename such as
`personal-life-os-backup-YYYY-MM-DD.json`. - Do not include hidden
browser metadata or unrelated data.

Import: 1. Accept only a documented JSON format. 2. Validate the full
structure and value ranges. 3. Show a summary of what will be replaced
or merged. 4. Require explicit confirmation. 5. Create a backup of
current data before replacement where possible. 6. Write atomically as
far as `localStorage` allows: prepare and validate the complete
serialized envelope before replacing the current value. 7. Report
success or failure accurately.

The MVP may support **replace all data** rather than merge, provided the
UI says so plainly. Never merge records based only on title; use stable
IDs and a documented conflict policy if merge is later implemented.

------------------------------------------------------------------------

## 9. Offline and Installable PWA Requirements

### 9.1 What offline support means

The app must continue to work offline **after it has been opened
successfully online at least once and its required assets have been
cached**. A first-ever visit with no network cannot download the app
shell, so do not promise otherwise.

Offline mode must support core local operations: - Open cached app
routes and assets. - Read saved tasks, focus, budgets, and expenses. -
Create, edit, complete, reschedule, and delete local tasks. - Record and
edit expenses. - View local insights based on persisted data. - Export
data when browser APIs permit.

No core feature may require a network request after the app shell is
installed/cached. Avoid remote fonts, remote scripts, CDN styling, and
required external APIs.

### 9.2 Service worker caching

Implement a service worker in plain JavaScript with a deliberate, tested strategy:
- Precache the app shell, required CSS/JS modules, manifest, icons, and offline fallback.
- Cache versioned static assets cache-first; their filenames should change when content changes where practical.
- For navigation requests, use a tested network-first strategy with a cached app-shell/offline fallback. If using multiple HTML pages, precache each required page.
- Core features must not depend on network requests or remote APIs.
- Cache only same-origin application assets needed for offline rendering.
- Handle install, activation, cache versioning, and updates without unexpectedly discarding unsaved user input.
- Do not force a page reload while the user is editing. Offer an update notice when appropriate.
- Test direct navigation to each required route while offline, not only navigation from the home screen.
- If service-worker registration fails, the online app should still work and explain that offline support may be unavailable.

### 9.3 Installability and home-screen support

Include: - A valid `manifest.webmanifest`. - `name`, `short_name`,
`start_url`, `scope`, `display: "standalone"`, `theme_color`, and
`background_color`. - Properly sized app icons, including 192×192 and
512×512 PNGs; include maskable icons where possible. - HTTPS deployment
(Vercel provides HTTPS for deployed sites). - A service worker served
from the correct same-origin scope. - Mobile viewport metadata and
safe-area handling.

Browser behavior varies: - Chromium-based browsers on Android typically
support install prompts when criteria are met. - iOS Safari supports
"Add to Home Screen" through the Share menu, with behavior and PWA
capabilities that vary by iOS version. - Desktop installation support
varies by browser. - Do not promise that every browser will show an
automatic install prompt. Provide a contextual help panel with
platform-appropriate instructions where feasible. - The app must still
be fully usable in a normal browser tab if installation is unavailable.

### 9.4 Offline visual stability

-   All CSS must be local static files and included in the service-worker cache.
-   Do not use Tailwind, external stylesheets, remote JavaScript, or remote icon libraries.
-   Prefer system font stacks and locally bundled icons.
-   Avoid required external image assets.
-   Test offline with cache cleared and then after one successful online
    load; distinguish those two conditions in QA.

------------------------------------------------------------------------

## 10. Cross-Browser Compatibility

Target the latest stable and recent previous versions of: - Chrome and
Edge on desktop and Android. - Firefox on desktop and Android where
supported. - Safari on macOS and iOS.

Implementation rules: - Use standards-based HTML, CSS, and JavaScript. -
Define a supported browser baseline and use standards-based JavaScript syntax supported by the target browsers. - Avoid experimental APIs for core functionality. -
Feature-detect optional capabilities such as install prompts, file
sharing, and certain storage APIs. - Provide a fallback for unsupported
APIs. - Test touch and keyboard interactions. - Do not depend on hover
for essential functionality. - Use CSS features with broad support or
provide fallbacks. - Test date inputs and timezone behavior on Safari as
well as Chromium. - Use `Intl.NumberFormat` for currency formatting. -
Keep PWA installation as an enhancement; basic functionality must remain
accessible if installation APIs are unavailable.

"Compatible with all browsers" cannot be guaranteed literally. The
practical target is current major browsers and their recent versions,
with graceful fallback for unsupported features.

------------------------------------------------------------------------

## 11. Security, Privacy, and Data Integrity

-   The MVP should not send task or financial data to a server.
-   Vercel hosts static/application assets, but personal records remain
    in browser storage unless future features explicitly change this.
-   Do not add analytics that transmit personal task titles, notes, or
    transaction details.
-   Avoid logging sensitive user-entered content to the console.
-   Escape/render user content safely; never interpret task notes as
    HTML.
-   Validate amounts, dates, IDs, and imported data.
-   Confirm destructive operations.
-   Clearly explain that clearing browser site data may delete app data.
-   Encourage regular exports and make backup access easy.
-   Do not claim `localStorage` is encrypted or protected against other
    scripts running on the same origin.
-   Use a restrictive Content Security Policy where compatible with the
    deployment framework and build.
-   Keep dependencies minimal and update them deliberately.

------------------------------------------------------------------------

## 12. Performance and Reliability

-   Keep the initial interface lightweight.
-   Avoid unnecessary animation, large charting libraries, and remote
    resources.
-   Lazy-load secondary screens or heavier visualizations when
    appropriate.
-   Keep derived calculations simple and memoize only when useful.
-   Handle loading, empty, success, and error states explicitly.
-   Avoid layout shifts; reserve space for icons and interactive
    regions.
-   Do not block the UI with synchronous work beyond normal small local
    data operations.
-   If local data grows beyond a practical `localStorage` size, show a
    helpful message and plan a tested migration to IndexedDB rather than
    silently losing data.
-   Keep production console free of avoidable errors and warnings.

------------------------------------------------------------------------

## 13. Testing and Definition of Done

The agent must not declare the project complete merely because it
compiles.

### 13.1 Unit tests

Test at least: - Task creation, editing, completion, archive, delete,
and parent/child rules. - Focus selection and cleanup when a task is
deleted or archived. - Date-only comparisons and local timezone
boundaries. - Daily and monthly budget calculations. - Currency integer
arithmetic and formatting. - Import validation, invalid JSON, schema
migration, and export round-trip. - Storage unavailable/quota error
behavior. - Rescheduling review logic. - Insights calculation for empty
data and normal data.

### 13.2 End-to-end tests

Cover at minimum: 1. First launch with empty storage. 2. Create and
complete a task. 3. Create a task with subtasks. 4. Set and change the
daily focus. 5. Leave a task unfinished and review rescheduling choices.
6. Add, edit, and delete an expense. 7. Configure a budget and verify
remaining balance. 8. Refresh and verify persisted data. 9. Export and
re-import a backup. 10. Attempt an invalid import and confirm existing
data remains intact. 11. Use core features offline after caching. 12.
Load a route directly while offline. 13. Test responsive layouts at
320px, 390px, tablet, and desktop widths. 14. Test keyboard-only
operation and visible focus. 15. Verify service-worker updates do not
discard user data.

### 13.3 Manual browser QA

At minimum, test current Chrome, Firefox, and Safari where access is
available. Test Android Chrome and iOS Safari on real devices or
credible device testing environments. Record unsupported
platform-specific install behavior as a limitation rather than faking
support.

### 13.4 Definition of done

A feature is done only when: - It follows this README. - It works with
realistic data and empty states. - It validates input and handles
failures. - It persists correctly and does not silently lose data. - It
works at mobile and desktop widths. - It is keyboard accessible. - It
has appropriate automated tests. - It does not require internet after
the app shell and assets have been cached, unless the feature is
explicitly documented as online-only. - The production build passes
lint, type-check, tests, and build commands. - Documentation accurately
describes what has and has not been implemented.

------------------------------------------------------------------------

## 14. Deployment on Vercel

1. Keep the app as static files: HTML, local CSS, local JavaScript modules, manifest, icons, and service worker.
2. Commit the project to Git and import the repository into Vercel.
3. Configure Vercel to serve the project root as a static site. No framework preset or build command is required unless optional tooling is added.
4. Add `vercel.json` only for genuinely needed headers or redirects. Avoid rewrites that break service-worker scope or offline routes.
5. Verify the deployed site uses HTTPS.
6. Register the service worker from the correct same-origin path and scope.
7. Test online first, then reload with DevTools set to Offline.
8. Test installation on supported devices.
9. Verify no runtime API, serverless function, secret, or remote dependency is needed for core features.
10. Document the deployment URL and release procedure.

**Important:** Vercel is the hosting platform, not the local database. A browser `localStorage` app does not need a database service for this MVP.

## 15. Implementation Plan for Codex

Build in small, verifiable stages. Do not generate the entire app in one unreviewed pass.

### Stage 0 — Inspect and plan
- Inspect the repository before changing files.
- Identify existing files and deployment settings.
- If empty, initialize the static HTML/CSS/JavaScript structure described above.
- Present a concise plan and list assumptions.
- Do not overwrite existing user work without need.

### Stage 1 — Foundation
- Create semantic HTML, CSS tokens, responsive shell, navigation, and accessible base styles.
- Add animation tokens and reduced-motion rules.
- Implement data shapes with JSDoc, validation, date/currency utilities, and storage repository.
- Add tests for storage and core business logic where test tooling is available.

### Stage 2 — Tasks and daily focus
- Implement task CRUD, subtasks, focus selection, filters, empty states, and gentle rescheduling review.
- Add tests before expanding features.

### Stage 3 — Money
- Implement expense CRUD, budget configuration, integer-based calculations, and currency formatting.
- Add calculation and persistence tests.

### Stage 4 — Reflection and data tools
- Implement weekly summaries, native SVG charts, export/import, schema validation, and reset confirmation.
- Ensure insights are derived from real stored records and formulas are documented.

### Stage 5 — PWA and offline
- Add manifest, icons, service worker, caching rules, offline status, and installation guidance.
- Test a production deployment offline; a development server is not sufficient proof.

### Stage 6 — Hardening
- Run available lint/check/test commands and verify the deployed static site.
- Check responsive layouts, accessibility, cross-browser behavior, charts, reduced-motion behavior, and console output.
- Fix failures instead of hiding them. Update this README if a documented requirement must change, and explain why.

At the end of each stage, report files changed, features completed, commands actually run and results, known limitations, and the next stage.

## 16. Copy-Paste Master Prompt for Codex

Use this prompt after placing this README at the repository root.

> You are a senior front-end engineer, vanilla JavaScript architect, accessibility specialist, and PWA engineer. Build this project according to the root `README.md`, which is the source of truth for product behavior, UX, architecture, storage, offline operation, privacy, testing, and acceptance criteria.
>
> **First inspect the repository.** Do not assume it is empty and do not overwrite existing work. Summarize the current structure and propose a staged plan. Then implement incrementally, starting with foundation and storage/business logic before building every screen.
>
> **Non-negotiable requirements:**
> 1. Use only semantic HTML5, plain CSS3, and vanilla JavaScript ES modules. No React, Next.js, Vue, Angular, Svelte, jQuery, Tailwind, Bootstrap, or other application/UI framework.
> 2. Deploy as a static site on Vercel; do not add a build step unless a specific, documented need justifies it.
> 3. Mobile-first, responsive UI from 320px through desktop.
> 4. PWA install support with a valid manifest, local icons, and a vanilla JavaScript service worker.
> 5. Core functionality works offline after the app shell and required assets have been cached.
> 6. No CDN styles, remote fonts, remote scripts, external chart libraries, or required external APIs for core features. All CSS, JavaScript, icons, animations, and charts must be local.
> 7. Use a versioned local persistence repository. UI modules must not access arbitrary `localStorage` keys directly. Validate persisted/imported data and handle storage errors honestly.
> 8. Implement tasks, subtasks, daily focus, review-based gentle rescheduling, expenses, budgets, weekly reflection, native SVG/Canvas charts, and JSON export/import as specified.
> 9. Keep domain logic separate from DOM rendering. Use small JavaScript modules, JSDoc, semantic HTML, keyboard accessibility, visible focus, and non-judgmental language.
> 10. Add purposeful, lightweight CSS animations; respect `prefers-reduced-motion`, and never block interaction for an animation.
> 11. Do not add cloud sync, accounts, AI APIs, tracking that transmits personal data, or other unrequested infrastructure.
> 12. Do not claim universal browser compatibility. Target current major browsers and provide graceful fallbacks for optional APIs.
> 13. Never silently delete or migrate data. Use schema versions, validation, explicit destructive-action confirmations, and tests for critical behavior.
>
> **Execution rules:**
> - Work in stages: inspect/plan, foundation, tasks/focus, money, insights/charts/data tools, PWA/offline, and hardening.
> - Before each major stage, briefly state the intended changes. After each stage, run relevant checks and report exact results.
> - Test domain logic, budget arithmetic, date boundaries, import/export, storage failures, and key user journeys.
> - Test offline behavior against the production build/deployment, including direct navigation while offline.
> - If a requirement is ambiguous, choose the simplest safe behavior consistent with the README and document the assumption. Ask only when a decision could cause data loss or materially change scope.
> - Do not leave fake buttons, dead navigation, placeholder screens presented as complete, or TODOs in core flows.
> - Never claim a test passed unless it was actually run. If browser/device testing is unavailable, say so and provide a manual checklist.
>
> **Completion criteria:** the static app works, core flows are implemented and tested, data persists across refreshes, core functionality works offline after caching, animations respect reduced-motion, charts are responsive and accessible, and this README accurately describes what was verified. Begin by inspecting the repository and proposing Stage 0.

## 17. Additional Short Prompts for Follow-Up Work

Use one prompt at a time rather than asking Codex to rebuild everything.

### A. Audit the implementation against the specification

> Audit the current repository against every relevant requirement in
> `README.md`. Do not rewrite the app immediately. Produce a prioritized
> gap list with file references and evidence. Then fix the
> highest-priority gaps one at a time, adding or updating tests and
> rerunning checks after each meaningful change. Never report unverified
> success.

### B. Verify offline/PWA behavior

> Audit PWA installability and offline behavior for the vanilla HTML/CSS/JavaScript static app against `README.md`.
> Inspect the manifest, icon sizes, service-worker scope, caching
> strategy, navigation fallback, update behavior, and external asset
> dependencies. Test the production build offline where the environment
> permits. Fix problems and report what was actually verified versus
> what still needs device testing.

### C. Review data integrity and privacy

> Review all persistence, import/export, date, task hierarchy, and
> budget logic against `README.md`. Look for silent data loss, invalid
> imports overwriting valid data, floating-point currency errors,
> timezone bugs, broken parent-child relationships, unsafe rendering,
> and inaccurate save-success messages. Add regression tests and fix the
> issues without expanding product scope.

### D. UX and accessibility pass

> Review the app mobile-first at 320px, 390px, tablet, and desktop
> widths. Check information hierarchy, quick capture, empty states,
> touch target size, keyboard navigation, focus management, contrast,
> reduced motion, screen-reader labels, and non-judgmental language.
> Make targeted changes and report which checks were automated and which
> were manual.

------------------------------------------------------------------------

## 18. Final Product Checklist

Before calling the first release ready, verify:

-   [ ] The home screen explains the next useful action without
    overwhelming the user.
-   [ ] Task creation and expense entry are quick and reliable.
-   [ ] Tasks and subtasks preserve their relationships.
-   [ ] The user controls rescheduling; unfinished work is not endlessly
    duplicated.
-   [ ] Budget formulas are explicit, tested, and use safe integer
    arithmetic.
-   [ ] Weekly summaries are accurate and non-judgmental.
-   [ ] Data survives refresh and can be exported.
-   [ ] Invalid imports cannot destroy valid data.
-   [ ] Storage limitations and backup responsibilities are disclosed.
-   [ ] Core assets are locally bundled and the interface remains styled
    offline.
-   [ ] PWA installation works where supported and has fallback
    instructions.
-   [ ] Core screens work offline after initial caching.
-   [ ] Direct offline navigation and service-worker updates have been
    tested.
-   [ ] No core button, route, or form is a placeholder.
-   [ ] Available lint/check/test commands pass, and the deployed static site loads correctly.
-   [ ] Unsupported or untested browser behavior is documented honestly.

------------------------------------------------------------------------

## 19. Product North Star

The app succeeds when users can answer three questions with less effort:

1.  **What matters most right now?**
2.  **What is the next realistic action I can take?**
3.  **Am I managing my time and money in a way that supports the life I
    want?**

It should not require users to optimize every hour or account for every
detail. The goal is a dependable, calm system that supports better
decisions while preserving autonomy, privacy, and room for ordinary
human life.

## Status Implementasi (11 Oktober 2026)

Antarmuka saat ini disederhanakan menjadi tiga bagian: Tugas, Keuangan, dan Data & pengaturan. Formulir tambah/edit tampil langsung di halaman agar alur simpan mudah dipahami. Aplikasi tetap memakai HTML/CSS/JavaScript tanpa framework dan mempertahankan format penyimpanan versi 1 agar data lokal yang sudah ada tetap kompatibel.

Fitur aktif: CRUD tugas dan subtugas, status selesai/aktif, fokus hari ini, arsip dan pulihkan tugas, CRUD pengeluaran dan anggaran, ringkasan pengeluaran, pilihan mata uang, ekspor/impor JSON, serta reset dengan konfirmasi. Semua perubahan ditulis ke localStorage melalui validasi yang sama; pesan keberhasilan hanya ditampilkan setelah tulis berhasil.

Pemeriksaan sintaks modul JavaScript dan service worker serta node --test lulus; 12 tes lulus. Uji UI langsung di browser, alur end-to-end, perangkat, pemasangan PWA, offline setelah deployment, dan deploy Vercel belum dilakukan pada sesi ini. Aplikasi adalah MVP lokal sederhana, bukan rilis produksi.
