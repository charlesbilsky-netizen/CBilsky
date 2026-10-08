# SalesMind: The RM Operating System — pre-production package

Internal training film. Status: **plan for approval. Nothing generated, nothing rendered, nothing spent.**

Ground rules applied while writing this:

- SalesMind was never opened. No login, no browser session, no screen capture.
- The two source files were read as documentation only. They contain internal URLs and the names of real colleagues, and neither appears anywhere in this package or the film.
- Every record in the film comes from `data/synthetic-data.json`, which passes `scripts/privacy-lint.mjs`.

Contents:

1. Verified feature inventory
2. Synthetic data specification
3. Synthetic screen plan
4. fal cinematic shot plan
5. Privacy threat model
6. Source conflict log
7. Production architecture
8. Estimated fal cost (revised for the studio layer)
9. Studio production layer
10. Decisions I need from you

---

## 1 · Verified feature inventory

Sources: **G** = `NOTEBOOKLM-01-SOURCE-salesmind-complete-guide` (platform v0.6.1, captured 8 Oct 2026, Guidebook pages stamped 6 Oct 2026). **S** = `salesmind.skill` references (`system-reference.md`, `guidebook-notes.md`, `explainer-brief.md`).

Status:
- **C** = confirmed, stated in the sources with the on-screen label.
- **U** = unclear, the sources disagree or describe it loosely.
- **N** = not confirmed, requested in the brief but absent from the sources. It will not be shown as a product control.

### 1.1 Navigation and global controls

| Item | Exact label | Status | Source |
|---|---|---|---|
| Sidebar groups | Workspace · Book · Results · Support | C | G §2, Changelog |
| Workspace pages | Dashboard · Task management · Internal requests | C | G §2 |
| Book pages | Pipeline · Clients · Activity | C | G §2 |
| Results pages | Performance · Bonus | C | G §2 |
| Support pages | Guidebook · Sales materials · Changelog | C | G §2 |
| Global search | Search, placeholder "Search pages, clients…" | C | G §2 |
| Theme control | Change theme | C | G §2 |
| Account menu | Account menu, top right, shows signed-in identity | C | G §1–2 |
| Sidebar collapse | Collapse, at the sidebar foot | C | G §2 |
| Floating coach | Ask the coach, bottom right | C | G §2. A write surface. Shown as a label only |
| Login screen | — | **N** | Sources describe no login screen. Film uses a clearly simulated "Training sign-in" card, not an imitation |
| Version | RM Workspace v0.6.1, "The new RM Workspace" | C | G §13 |

### 1.2 Dashboard

| Item | Exact label | Status | Source |
|---|---|---|---|
| Top band | Greeting with name, role, country flag, region rank | C | G §3. Film shows the synthetic RM and Demo region, with no flag and no rank |
| Milestone panel | Active milestone: total liquid NAV, % of target, remaining, active month, check-by date, missed-milestone warning | C | G §3 |
| Net new money | Net new money: year to date against goal, with trend line | C | G §3 |
| Tiles | My clients · Total NAV · Open deal value | C | G §3 |
| Open deal value | Clicking opens the Pipeline | C | G §3 |
| List tabs | Going quiet · New opportunities · Open deals · Open requests | C | G §3 |
| Going quiet columns | Client · Stage · Last contact · In status | C | G §3 |
| New opportunities columns | Client · Lead · First contact · Assigned | C | G §3 |
| Open deals columns | Client · Stage · Expected deposit · Next stage action · Last contact · Alerts | C | G §3 |
| Open requests columns | Client · Request · Summary · Status · Open for · Assignee | C | G §3 |
| Panel controls | client search · Sorted by (default Last contacted) · All going quiet → | C | G §3 |
| Recent activity | Last 7 days / Last 30 days · View all | C | G §3 |
| Open deals order | critical alerts → overdue next actions → no next action → past the stage's time limit → blocked → other alerts | C | G §3, Guidebook |

### 1.3 Task management

| Item | Exact label | Status | Source |
|---|---|---|---|
| Tabs | Inbox · Today · Planning, each with a count | C | G §4 |
| Inbox | undated tasks plus starred Gmail; reading pane on the right | C | G §4 |
| Triage | Today / Week / Month / Later chips; keys T W M L | C | G §4, §17.2 |
| Capture | Add new task, with a destination selector; key C | C | G §4, §17.2 |
| Capture tokens | `@` client · `!today` `!week` `!later` · `3pm` · `!high` | C | G §17.2 |
| Plan the day | button at the foot of Today and Inbox; Recap then Plan; Start my day! | C | G §17.3 |
| Today | date, hours planned, free time left; My order; All clients filter | C | G §4 |
| Task row | age, optional clock time, duration | C | G §4 |
| Calendar beside tasks | 00–23 column, all-day items on top, Google events alongside | C | G §4. Simulated in the film |
| Planning | Board / List · Sort: Smart · Show done | C | G §4 |
| Planning columns | Inbox · Today · Coming week · Coming month · Later · Blocked · Done | C | G §4 |
| Undo / Redo | Ctrl/⌘ + Z · Ctrl/⌘ + ⇧ + Z or Ctrl + Y; arrows beside the calendar | C | G §17.8 |
| Priority spines | Normal slate · Medium amber · High rose · Overdue red (not settable) | C | G §17.7 |
| Date vs Due | Date = when you plan it; Due = when it must be done | C | G §17.8 |
| Day roll | 4am local; yesterday's done work moves to Done | C | G §17.8 |
| Week horizon wording | "Week" chip vs "Coming week" column vs `!week` token | U | See conflict 7 |

### 1.4 Pipeline

| Item | Exact label | Status | Source |
|---|---|---|---|
| Tabs | New Business · Client Growth · Sales plan | C | G §6 |
| Toolbar | Search client · Filters · Closed window · Views · Sort · Board / Table · Columns (Table) · Create deal (Client Growth) | C | G §6 |
| Focus filters | Overdue · Due this week · No contact 30d+ · With amount | C | G §6 |
| Status filter | Any status · Contact · Inactive · KYC Passed · Registrants · Rejected | C | G §6 |
| Alert filter | Any alert · Has alert · plus each named alert | C | G §6 |
| Next stage action filter | Any · Suggested · Accepted · Overdue · None | C | G §6 |
| Blocked filter | Any blocked · Any blocker · Blocked by the RM's note · Blocked by an open request | C | G §6 |
| Origin filter | Any origin · Sales Plan | C | G §6 |
| Type filter (Client Growth) | Any type · Brokerage · White label | C | G §6 |
| Closed window | Any closed · Closed: last 30 days · Closed: last 90 days (default) · Closed: last 12 months | C | G §6 |
| Sort | My order · Expected deposit · Next action due · Longest since contact · Newest first | C | G §6 |
| Views | saved filter sets; empty state "No saved views yet…" | C | G §6 |
| Card | client, days in stage (bold when late), days since contact or "No contact yet", expected deposit or "No amount", application status, most serious alert, Blocked marker | C | G §6, Guidebook |
| Card menu ⋯ | Put on hold · Close deal · Add task · Open in CRM | C | G §6 |
| Several open deals | amber "with several open deals" button | C | G §6 |
| Table columns | 16 columns, 12 shown by default (Client … Card opened) | C | G §6 |
| Violet suggestion | Next stage action cell violet while Suggested; hover for Accept or Edit | C | G §6 |
| First contact SLA cell | Met · Late · Overdue · the due date ("Late for good" on New Business) | U | See conflict 3 |

### 1.5 Stages

| Journey | Stages | Status |
|---|---|---|
| New Business | New Opportunity → Contact Established → Qualified → Solution Presented → Onboarding → Funding Pending → Funded → Won, with Lost and On Hold | C |
| Client Growth | Discovery → Validation → Negotiation → Approval → In Progress → Funded → Won, then Lost and On Hold | C |
| Never by hand | New Business Funded and every Won. Onboarding and Funding Pending until the application gets there | C |
| You move | Contact Established, Qualified, Solution Presented, every Client Growth stage up to Funded, On Hold, Lost | C |
| Time limits (New Business) | CE 2 d · Q 5 d · SP 5 d · Onboarding 7 d · FP 3 d; then Days in stage turns bold | C |
| Suggested actions | Per-stage table (New Business and Client Growth) | C |

### 1.6 Alerts

| Alert | Level | Status |
|---|---|---|
| SLA breach | Critical | C |
| Stopped responding to onboarding | Critical | C |
| Funding not arriving | Critical | C |
| Qualification missing | Critical | C |
| Lead untouched | Warning | C |
| Action overdue | Warning | C |
| Overdue task | Warning | C |
| Rescheduled repeatedly | Warning | C |
| Check contact details | Warning | C |
| Back from Lost | Warning, does not clear | C |
| Suspected duplicate | Info | C |

### 1.7 Deal page and next action

| Item | Exact label | Status |
|---|---|---|
| Left column | Stage bar (click to move) · Put on hold · Close deal · Opportunity overview · Account lifecycle · Qualification | C |
| Right column | About this deal · Next stage action · Blocker · Latest notes | C |
| Tabs | Deal · Activity · Tasks & notes · Requests | C |
| Suggestion | violet, marked Suggested; click words or date to change; Accept | C |
| After accepting | Mark complete · Plan · Cancel action · change words or date | C |
| Complete dialog | Outcome · How did you reach them? · Note · Next action · Complete · Complete & move to … · Keep in … | C |
| Move dialog | Something missing · Outcome · Suggested next action · Add to my tasks · Move anyway / Move to … | C |
| Put on hold reasons | No Budget · No Current Need · Bad Timing · Budget Pending · Decision Pending · Needs More Time · Other | C (S) |
| Close deal | Loss reason + Notes (required) | C |
| Add task | from beside the next action, or Tasks & notes | C |
| Add note | notes exist (Note field, Tasks & notes, Latest notes) but no "Add note" button is documented | **U** |
| Add activity | no such control documented; activity is recorded from email, calls and meetings | **N** |
| Expected deposit | Add expected deposit · Add deposit (amount + date, several rows) | C |

### 1.8 Client Growth

| Item | Status |
|---|---|
| Create deal (top right of the Client Growth tab); type 3+ letters of name or email | C |
| Type: Brokerage or White label; optional expected deposit with date, chance of closing, description | C |
| Funded client → deal at Discovery with a suggested action | C |
| Not funded → not here; New Business card opens from the CRM | C |
| Already has an open deal → no second deal; edit the expected deposit instead | C |
| From the client: "No open deal" + Create deal on the Deal tab | C |

### 1.9 Clients and ownership

| Item | Exact label | Status |
|---|---|---|
| Tabs | All · Clients · Contacts | C |
| Quick filters | High value · High risk · Not funded | C |
| Density | Compact / Detailed | C |
| Buttons | Check ownership · Create contact · Filters · Columns · Views · fullscreen | C |
| Paging | 20 rows; First / Previous / Next / Last; totals row | C |
| Columns | 21 columns, 13 shown by default | C |
| Check ownership | search by full name, exact email or phone, or company domain; comma-separate; Bulk tab with CSV; 100 searches a day; filter by verdict; export CSV | C |
| Verdicts | Available · Claimed (Request reassignment) · Restricted · Needs narrowing · Not found (Add contact to CRM) | C |

### 1.10 Activity

| Item | Exact label | Status |
|---|---|---|
| Controls | Activity type · client-or-subject search · From / To · Red flags only · Newest first · Columns · fullscreen | C |
| Activity types | All activity · Emails · Calls · Meetings · Deposits · Withdrawals · Registered · KYC started · KYC passed · Funded · First trade · Requests | C |
| Columns | Date · Client · Type · Details · Flags | C |
| Topic tags | e.g. Onboarding · Documents · Meeting Scheduling · Post-meeting Email · Securities Transfer, with +N badge | C |
| Item detail | Details (Direction, From, To, Client, Date, Outcome) and Message | C |
| Raise an issue | category → meeting type → comment → Submit issue; reviewed in 1–3 business days | C (label conflict, see 2) |
| Issue categories | only "Points" is named, and it may be retired | **U** |

### 1.11 Performance and Bonus

| Item | Status |
|---|---|
| Performance tabs: NAV milestones · Pipeline · Funding · Standing · Conversion · Communication | C |
| Analytics period: This month · Last month · This quarter · Last quarter · Year to date · All time | C |
| NAV milestones: month 3 own liquid NAV, then total liquid NAV at months 6, 12, 24, 36; Active Milestone; Last Cleared Milestone | C |
| Bonus page: Total payout · Immediate · Deferred bucket · Roll-forward; Bonus calculator | C. Navigation and labels only, no values, because the source flags the Activity Points line as unresolved |

### 1.12 Sales Plan

| Item | Exact label | Status |
|---|---|---|
| Where | a tab inside Pipeline, no URL of its own, loads late | C |
| Panels | Strategy · Plan summary (Total Entries, Est. Total AUM, Total NAV Target) · Sales Plan Progress · Entries Requiring Attention · Sales Plan Entries · Forecasted NAV · Plan vs reality · month N · Plan history | C |
| Controls | Add entry · Create Contact · Link CRM · Not Available | C |
| Procedure | add contact (+) → Create Contact → Save | U, see conflict 5 |
| Rule | every entry needs a valid CRM link or a specific written reason; "N/A" not acceptable | C |
| New-joiner deadline | finalise within the first 10 days; mandatory compliance step | C |
| Linking | a linked entry puts a deal on the board; Filters → Origin → Sales Plan | C |

### 1.13 Calendar, requests, support pages

| Item | Status |
|---|---|
| Connect Google: Connect → pick work account → Continue → Select all → Continue | C. Shown as a simulated screen only |
| Blocks write to a separate "SalesMind Tasks" calendar; meetings go to the main calendar | C |
| Deleting a time-blocked task deletes the Google event | C |
| Internal requests tabs: Jira · Onboarding · KYC · Intercom; tiles: Open requests · Resolved this month · Raised by me; Raise a request | C |
| Guidebook: 20 pages in Getting started · 1 The pipeline board · 2 Working a deal · 3 Client Growth, new deals and housekeeping · Task management · Reference | C |
| Sales materials: eleven cards, each with Open link | C. Titles shown, no links |
| Changelog: v0.6.1 — The new RM Workspace | C |

### 1.14 Rules the film teaches

| Rule | Status |
|---|---|
| First contact: inbound 24 h, weekends excluded (Fri 15:00 → Mon 15:00); outbound one calendar month; referral as the CRM marks it, else 24 h | C |
| Cadence: Day 0 call + email · Day 1 call · Day 3 call + email · Day 7 call (last step outbound) · Day 12 break-up email (inbound); then "decide whether to close as Lost" | C |
| One deal, one next action; completing or cancelling demands the next one | C |
| Alerts clear by themselves, except Back from Lost | C |
| Morning: Filters → Alert → Has alert, save under Views, critical first, accept today's suggestions | C |
| After every touch: Mark complete, set the next action, update About this deal or the blocker | C |
| Weekly: Going quiet, Funding Pending, On Hold; close what is really lost | C |

---

## 2 · Synthetic data specification

The full dataset is `data/synthetic-data.json`. Every value is fictional and deterministic.

**Rules enforced by `scripts/privacy-lint.mjs`:**

| Field | Rule |
|---|---|
| Emails | `example.com` or a subdomain of it |
| Phones | `+1 202 555 01xx` (US fictional range) or `+44 20 7946 0xxx` (UK drama range) only |
| CRM IDs | `CRM-DEMO-###` |
| Application IDs | `APP-DEMO-###` |
| Ticket keys | `TRAIN-###` |
| Money | EUR, multiples of 250,000 only (250,000 · 500,000 · 1,000,000 and their sums) |
| Dates | "Training week, Day 1 (Mon) to Day 5 (Fri)". No year, no real date |
| URLs | none, ever |
| Internal domains, workspace paths | none, ever |
| Blocklist | real names and identifiers found in the sources, held outside the repository |

**Identity:** Alex Morgan · Relationship Manager · Synthetic RM Workspace · Training dataset · Demo region. No rank, no flag.

**People and firms:**

| Person | Firm (DEMO tag on screen) | CRM ID | Deal | Teaching purpose |
|---|---|---|---|---|
| Elena Kovacs | Northstar Capital Training | CRM-DEMO-001 | New Business · Contact Established · EUR 500,000 · origin Sales Plan | Chapter 8 training deal |
| Daniel Reed | Meridian Family Office Demo | CRM-DEMO-002 | Client Growth · Discovery · Brokerage · EUR 1,000,000 | Chapter 9 |
| Sofia Nowak | Atlas Quant Partners | CRM-DEMO-003 | New Business · Onboarding · Inactive · EUR 250,000 | Stopped responding to onboarding, Going quiet |
| Martin Keller | Greenfield Institutional Lab | CRM-DEMO-004 | New Business · New Opportunity · inbound, assigned Fri 15:00, due Mon 15:00 | First contact due |
| Priya Shah | Horizon Asset Practice | CRM-DEMO-005 | New Business · Funding Pending · KYC Passed · EUR 250,000 | Funding not arriving |
| Tomasz Zielinski | Redwood Trading Education | CRM-DEMO-006 | New Business · Qualified · EUR 500,000 | Action overdue |
| Claire Dubois | individual | CRM-DEMO-007 | New Business · New Opportunity · outbound, 33 days | Lead untouched |

**Dashboard (synthetic):** Active milestone EUR 500,000 of EUR 1,000,000 (50%), remaining EUR 500,000, "Training milestone", check by Day 5. Net new money EUR 250,000 against EUR 1,000,000. My clients 7. Total NAV EUR 1,000,000. Open deal value EUR 2,500,000 across 7 deals.

**Tasks:** Call Northstar Capital Training · Send Meridian Family Office Demo follow up · Review Atlas Quant Partners onboarding checklist · Prepare Redwood Trading Education demo agenda · Check Horizon Asset Practice funding status · Update Sales Plan comments · Waiting on synthetic document review (Blocked) · Synthetic welcome email sent (Done).

**Calendar (Day 1):** 09:00 Synthetic meeting with Northstar Capital Training · 13:00 Synthetic follow up block · 15:00 Synthetic onboarding review · 16:30 Synthetic internal request review.

**Activity:** synthetic introduction email, 4-minute call, online meeting, deposit EUR 250,000, withdrawal EUR 250,000, registration, KYC passed, with the documented topic tags.

**Ownership checks:** `greenfield-lab.example.com` → Available · `contact@northstar-capital.example.com` → Claimed · `atlas-quant.example.com` → Restricted · `Daniel` → Needs narrowing · `new.prospect@example.com` → Not found.

**Sales Plan:** Alex Morgan training contact (Not Available, with a specific reason) · Northstar Capital Training (linked CRM-DEMO-001) · Greenfield Institutional Lab (linked CRM-DEMO-004).

**Requests:** TRAIN-101 to TRAIN-104, one per tab, fictional summaries.

**Performance:** abstract bars and rings with no figures, or the dashboard's round training values. **Bonus:** labels only, values shown as "—".

**Label:** every product-like screen carries a fixed, high-contrast badge, top right:

> TRAINING ENVIRONMENT · SYNTHETIC DATA · NOT A LIVE ACCOUNT

It is drawn on the composition's top layer, above every transition, so no fade or wipe can hide it.

---

## 3 · Synthetic screen plan

All screens are React components rendered by Remotion straight from `synthetic-data.json`. There is no browser, no live app and no screen recording. The badge sits on every screen.

| # | Screen | Chapter | Shows |
|---|---|---|---|
| S01 | Training sign-in card | 3 | "Training sign-in · Simulated" with Alex Morgan; no real login imitation |
| S02 | App shell | 3 | Sidebar with four groups and eleven pages, Search, Change theme, Account menu, Collapse |
| S03 | Dashboard, top | 4 | Active milestone, Net new money, My clients, Total NAV, Open deal value |
| S04 | Dashboard, list panel | 4 | Four tabs, client search, Sorted by Last contacted, Open deals in urgency order |
| S05 | Dashboard, Recent activity | 4 | Last 7 days / Last 30 days toggle, View all |
| S06 | Urgency ladder | 4 | Motion graphic of the six-step Open deals order |
| S07 | Tasks, Inbox | 5 | Add new task, reading pane, T/W/M/L chips, Plan the day |
| S08 | Tasks, capture | 5 | Typing `Call Northstar Capital Training @Elena !high 10am` |
| S09 | Tasks, Today | 5 | list with age, clock time, duration; synthetic calendar column; All clients; undo/redo |
| S10 | Plan the day | 5 | Recap, donut (Tasks · Meetings · Solo Events), Start my day! |
| S11 | Tasks, Planning board and list | 5 | Seven columns, Sort: Smart, Show done |
| S12 | Pipeline, New Business board | 6–7 | Toolbar, ten stage columns, synthetic cards |
| S13 | Filters panel | 6 | Focus, Status, Alert, Next stage action, Blocked, Origin |
| S14 | Alerts reference | 6 | Motion graphic of the eleven alerts by level |
| S15 | Closed window, Views, Sort menus | 6 | Exact option lists |
| S16 | Pipeline, Table | 7 | Columns chooser, violet suggestion, First contact SLA cell |
| S17 | Client Growth board | 7, 9 | Seven stages, Create deal |
| S18 | Who moves each stage | 7 | Motion graphic: moves itself / you move it / never by hand |
| S19 | Deal page, Northstar | 8 | Stage bar, overview, lifecycle, qualification, About this deal, Suggested next action |
| S20 | Accept and edit the suggestion | 8 | violet → accepted, due date |
| S21 | Mark complete dialog | 8 | Outcome, Note, Next action, Complete & move to Qualified |
| S22 | Move dialog | 8 | Something missing, Add to my tasks, Move anyway |
| S23 | Put on hold and Close deal dialogs | 8 | Reasons, follow-up date, Loss reason, Notes |
| S24 | Create deal, Meridian | 9 | Search client, Type, Discovery, duplicate refusal |
| S25 | Clients page | 10 | Tabs, quick filters, Compact/Detailed, Filters, Columns, Views, fullscreen |
| S26 | Check ownership | 10 | Five synthetic queries and verdicts, Bulk tab |
| S27 | Activity page | 11 | Filters, rows, topic tags |
| S28 | Activity item and Raise an issue | 11 | Detail modal, issue form with a synthetic comment |
| S29 | Performance | 12 | Six tabs, period filter, abstract charts |
| S30 | Sales plan tab | 13 | Panels, three entries, Not Available reason, Link CRM, Origin filter |
| S31 | Simulated Google permission | 14 | "SIMULATED TRAINING SCREEN · NO LIVE CONNECTION" |
| S32 | Today with synthetic calendar | 14 | Four synthetic entries, task block vs meeting |
| S33 | Guidebook index | 15 | Section list from the source |
| S34 | Sales materials | 15 | Eleven card titles, no links |
| S35 | Changelog | 15 | v0.6.1 entry |
| S36 | Internal requests | 15 | Four tabs, three tiles, TRAIN-101 to 104 |
| S37 | End-of-day checklist | 16 | Thirteen items ticking off |
| S38 | First contact clock | 6 or 8 | Fri 15:00 → Mon 15:00 timeline and the Day 0/1/3/7/12 cadence |
| S39 | End card | 16 | "Your book is under control when the next action is clear." |

---

## 4 · fal cinematic shot plan

fal is used only for abstract inserts. There's no text, no UI, no people and no logos. Each insert runs 5 s, with motion graphics or a title laid over it in the edit. Every prompt ends with the same exclusion line:

> no text, no letters, no numbers, no logos, no user interface, no screens, no people, no faces, no watermark

| # | Chapter | Prompt core |
|---|---|---|
| F01 | 1 Cold open | Near-black void, deep green gradient, a thin-line glowing green icosahedron, six points of light pulse one after another, slow push in |
| F02 | 2 What SalesMind is | Fine green light paths from many directions converge into one calm luminous hub, slow orbit |
| F03 | 3 Navigation | Layered translucent dark-glass panes slide past each other, a green light sweep crosses them |
| F04 | 4 Dashboard | Abstract control surface: concentric rings and soft triage lights in red, amber and grey on dark green |
| F05 | 5 Tasks | Blank glowing cards settle into a lattice timeline, one card lifts and locks into place |
| F06 | 6 Pipeline | A river of green particles flows through a series of luminous gates |
| F07 | 7 Board and table | Blank tiles rearrange from columns into rows and back, precise, architectural |
| F08 | 8 Working a deal | A single bright node advances along a path, one point of light always waiting ahead |
| F09 | 9 Client Growth | Branches of green light grow outward from a calm, solid core |
| F10 | 10 Ownership | Light beams scan a crystalline map, a few facets lock with a soft glow |
| F11 | 11 Activity | Pulses of light are written onto thin horizontal lines like a ledger |
| F12 | 12 Performance | Green glass columns rise from a dark plane at different heights, no axes |
| F13 | 13 Sales Plan | Blueprint lines draw themselves into a clean structure |
| F14 | 14 Calendar | Daylight moves slowly across a grid of blank tiles, dawn to dusk |
| F15 | 15 Support | Interlocking rings of light turn, a spark of friction resolves into smooth motion |
| F16 | 16 Close | A calm horizon; the icosahedron dissolves into light |

**Model selection.** The fal MCP server, with recommend_model, schema and pricing tools, is not connected to this session. I'll use fal's queue API through the environment proxy, which already authenticates. Pricing comes from fal's model pages, checked today:

| Model | Price (audio off) | Use |
|---|---|---|
| Kling O3 Pro text-to-video | $0.112 / s | Candidate for all 16 inserts |
| Kling O3 Standard text-to-video | $0.084 / s | Cheaper candidate if a test shows equal quality |
| Kling 3 Pro text-to-video | $0.112 / s | Alternative |

I'll run two test inserts, F01 and F06, on O3 Pro and O3 Standard. I'll QC them for stray text and pick the model before generating the rest.

**Narration.** fal's text-to-speech runs from the narration script, which is written entirely for the film and contains no client data. ElevenLabs Multilingual v2 or MiniMax Speech-02 HD, both $0.10 per 1,000 characters (checked today), with a calm, mature English voice.

---

## 5 · Privacy threat model

| # | Threat | Control |
|---|---|---|
| T1 | Live account opened or captured | No browser tool is used at all. Every screen is code rendering synthetic JSON |
| T2 | Real data leaks from the source files (internal URLs, workspace path, real colleague names, a real phone number, a Drive file ID) | Sources are read only. Nothing is copied as data. The lint blocklists these terms and fails on any URL, internal domain or workspace path |
| T3 | A synthetic name or firm collides with a real person or company | Every firm carries a DEMO tag on screen, and every email sits on example.com. Two collisions are flagged in section 9 |
| T4 | A synthetic phone number is a real, diallable number | Only the reserved US 555-01xx and UK 7946 0xxx ranges are allowed. The Polish example in the brief is excluded, see section 9 |
| T5 | fal generates readable text, a logo or a face | Prompts exclude them. Every insert is checked frame by frame, plus OCR on sampled frames. Any text fails the insert and it is regenerated |
| T6 | Client data sent to fal | Only abstract prompts and the narration script go to fal. No images and no reference uploads |
| T7 | Data in logs, manifests, filenames or subtitles | The manifest records model, request ID, prompt, cost and QC only. The lint runs on the SRT, script, manifest and data before export |
| T8 | Source files committed to the repository | The two source files and the blocklist stay outside the repository. Only synthetic material is committed |
| T9 | The training badge is hidden by a transition | The badge is rendered on the top layer, outside every transition. The QA pass samples frames at each cut |
| T10 | Figures read as real performance, bonus or NAV | Round training values only. Bonus shows labels with "—". A "Synthetic" caption sits beside every figure |
| T11 | Internal branding or an internal URL reaches an external audience | Internal-only film. No URL anywhere. Brand colours only, no logo file |
| T12 | The exposed fal key | Not used and not stored. You rotate it |

---

## 6 · Source conflict log

| # | Conflict | Resolution in the film |
|---|---|---|
| 1 | Activity's issue button is "Raise an issue" live; the playbook calls it "Report issue" | Use **Raise an issue**, the live label |
| 2 | The issue form offers a "Points" category and Bonus shows "Activity Points", but the Activity page uses Flags. The sources mark this unresolved | Category shown as a field with no named value. No points mentioned |
| 3 | First contact SLA cell: Part II lists "Met, Late, Overdue or the due date"; the Guidebook says "Late for good" on New Business | Cell shows **Late**. Narration says it is late for good and never clears |
| 4 | System reference counts "ten named alerts"; the Alert filter lists eleven names (Action overdue and Overdue task separately) | Show the eleven filter names. Narrate Action overdue and Overdue task as one row, as the Guidebook does |
| 5 | Sales Plan: the procedure says "add contact (+) → Create Contact → Save" and "mark Unavailable with a valid Reason"; the live tab shows Add entry, Create Contact, Link CRM, Not Available and an N/A Reason column | Use the **live labels** (Add entry, Not Available). Narrate the procedure's steps in plain words |
| 6 | Closed window labels: "Closed: last 90 days" (Part II) vs "last 90 days" (reference) | Use **Closed: last 90 days** |
| 7 | Three names for the same horizons: Week chip and T/W/M/L keys, Coming week / Coming month columns, `!week` / `!later` tokens | Show each where it lives. Narrate that they are the same horizons |
| 8 | Explainer media say Days in stage "turns bold red"; the reference says bold | **Bold**, no red |
| 9 | The daily playbook skips step 4 | Not cited. The film uses the Guidebook routine |
| 10 | The skill's explainer brief allows a closing card with the internal URL for internal audiences; your brief bans live URLs | **No URL**. Your brief wins |
| 11 | The skill's brief suggests demo names like "Acme Corp, Clara Dubois style"; your brief fixes the namespace | **Your namespace** |
| 12 | Brief asks for "Add activity" and "Add note" on the deal | Not documented as controls. Shown as narration plus Tasks & notes and the Note field in Mark complete |
| 13 | Brief asks for "Registrations" and "KYC" as activity types | Live types are **Registered, KYC started, KYC passed** |
| 14 | Brief asks for a login screen | Not documented. A simulated training sign-in card, labelled as such |
| 15 | Dashboard shows a region rank and country flag | Omitted |
| 16 | Explainer brief recommends about 5 minutes; your brief asks for 12 to 18 | **12 to 18 minutes**, with a 90-second cut and a 30-second trailer |

---

## 7 · Production architecture

```
salesmind-explainer/
  data/synthetic-data.json      every record on screen (single source)
  scripts/privacy-lint.mjs      privacy gate, runs before every render
  scripts/fal.py                fal queue client: submit, poll, fetch, manifest
  script/narration.md           full narration, by chapter
  src/                          Remotion project
    ui/                         mock SalesMind components (sidebar, tables, cards, dialogs)
    screens/                    S01 to S39, fed only by synthetic-data.json
    chapters/                   16 chapter compositions
    TrainingBadge.tsx           top-layer label, never inside a transition
    Film.tsx · Trailer.tsx · Onboarding90.tsx · Thumbnail.tsx · EndCard.tsx
  public/fal/                   downloaded inserts (gitignored)
  public/voice/                 narration audio per chapter (gitignored)
  manifest/fal-manifest.json    model, request ID, prompt, seconds, cost, QC result
  out/                          renders, SRT, reports (gitignored)
```

- **Render.** Remotion renders 1920×1080 at 30 fps. Chapter lengths follow the narration audio, so picture and voice can't drift.
- **Subtitles.** The SRT is built from the narration script and the measured length of each audio segment.
- **Cuts.** The 30-second trailer and the 90-second onboarding cut are separate compositions reusing the same screens and inserts.
- **Thumbnail and end card.** Rendered as stills from code.
- **QA.** Before export the lint runs over data, script, SRT and manifest. Frames sampled every 2 s are checked for the badge. OCR runs on every fal insert. I review a contact sheet per chapter.
- **Delivery.** A 15-minute 1080p film is roughly 100 to 200 MB, and the chat upload limit is about 25 MB. I'll send it as one file per chapter, each under the limit, plus the trailer and the 90-second cut. The full master stays in `out/`.

---

## 8 · Estimated fal cost (revised for the studio layer)

At fal's listed prices, checked 8 Oct. These are estimates until your fal dashboard shows the real charges.

| Item | Quantity | Price | Estimate |
|---|---|---|---|
| Insert tests | 2 shots on O3 Pro + 2 on O3 Standard, 5 s each | $0.112 / $0.084 per s | $0.98 |
| Inserts | 20 × 5 s on O3 Pro (16 chapter shots + 4 parallax and macro plates) | $0.112 per s | $11.20 |
| Insert redos (allow 40%) | about 8 × 5 s | $0.112 per s | $4.48 |
| Voice casting | 3 voices × a 40-second excerpt | $0.10 per 1,000 characters | $0.15 |
| Narration | about 2,000 words for a 12–13 minute cut, about 12,000 characters, plus 50% for redos | $0.10 per 1,000 | $1.80 |
| Music tests | one 60 s cue on ElevenLabs Music, one on Stable Audio 2.5 | $0.60 per min / $0.20 per track | $0.80 |
| Music score | 5 cues totalling about 13 min (ElevenLabs Music; about $1 on Stable Audio 2.5) | $0.60 per min | $7.80 |
| Sound effects | about 25 short UI and transition sounds, about 2 s each, plus redos | $0.002 per s | $0.20 |
| **Total** | | | **about $27** |

Using Stable Audio for the score, or O3 Standard for the inserts if the test holds up, brings it to about $20. I'd set a cap of **$30**.

---

## 9 · Studio production layer

This layer covers craft only. Every privacy, synthetic-data, label and anti-capture rule above still applies and wins any conflict.

### 9.1 Design system

| Token | Value | Use |
|---|---|---|
| Ground | `#010E07` near-black, deep green gradient to `#004D24` | All abstract frames and the space around screens |
| Brand green | `#007F39`, highlight `#26BF6B` used sparingly | One emphasised word or element per frame |
| Charcoal panel | `#222A2C` | Screen chrome, cards |
| Off-white | `#F2F4F1` | Body text on dark, light UI surfaces |
| Critical accent | soft gold `#D9B26A` | Critical-alert emphasis in motion graphics only |
| Suggested | violet | Kept on screens, because the source says suggestions show violet |
| Task spines | slate · amber · rose · red | Kept as the source documents them |
| Type | Inter (open licence), four sizes: 64 / 40 / 24 / 16 px at 1080p; tabular figures in tables | Every screen and title |
| Radius, spacing, shadow | 12 px cards, 8 px controls; 8-point spacing grid; one soft shadow level | Every synthetic screen |

The brand hex values come from the source guide's measurement of the July 2026 deck. No logo file is used.

**Training label.**
- A fixed pill, top right, inside the 16:9 title-safe area: "TRAINING ENVIRONMENT · SYNTHETIC DATA · NOT A LIVE ACCOUNT" in Inter Semibold, off-white on charcoal with a hairline green border.
- Same size, place and contrast in every shot. It's part of the frame design, not a sticker.
- It sits on the top layer, so no transition can cover it.

### 9.2 Screen presentation

- Screens are never full-bleed. Each sits on the green ground at about 82% scale, with soft perspective, a gentle 1–2% drift, shallow depth of field on the ground and a faint volumetric glow behind.
- Reveals are staggered:
  - cards and rows: 40 ms apart
  - filters and chips: 60 ms apart
  - easing: cubic in-out
  - micro-interactions: 180–240 ms
- Hover, press and toggle states are animated on every control that's clicked.
- Call-outs use a thin animated leader line, a numbered marker and a soft highlight on the target. No default tooltips.
- Holds: every key screen state stays on screen 1.5–2.5 s before the next change.

### 9.3 Chapter titles and transitions

- Each chapter opens on a 3–4 s title card: chapter number in green, title in Inter Display, a single thin rule drawing across. Under it, the matching fal plate with parallax.
- No stock wipes. Transitions are:
  - a light sweep across the ground
  - a slow cross-dissolve between plates
  - a push from a screen into the next title
- Every chapter ends on a resolution beat: an alert clears, a next action is accepted, the day is planned or a checklist line ticks.

### 9.4 Peak moments

These four get extra visual and sonic weight. Each gets a slower hold, a push-in on the screen, a dedicated sound cue and a one-line principle on screen.

1. **Prioritisation.** The Open deals order: critical alerts → overdue next actions → no next action → past the stage's time limit → blocked → other alerts.
2. **Accepting the next action.** Violet Suggested becomes your task.
3. **Check ownership.** Five verdicts, with Restricted landing as "Do not approach".
4. **End of day.** The checklist completes, and "Your book is under control when the next action is clear."

### 9.5 fal inserts, elevated brief

The prompts in section 4 gain this direction:
- scale and quiet power
- controlled light and refined geometry
- a sense of order being restored
- slow push-ins, lateral tracks or gentle orbits
- shallow depth of field and soft volumetric light
- desaturated green in shadows, luminous in highlights

Four extra plates:
- a macro of a single abstract signal card
- a parallax field of data paths for title backgrounds
- a slow orbit of the icosahedron for the open and close
- a "settled order" plate for resolution beats

Any shot that reads as stock footage, tech-background cliché or noise fails QC alongside the text check.

### 9.6 Sound

**Score:**
- Five original cues generated on fal: cold open, workspace, pipeline, discipline, close.
- Sparse modern electronic with soft acoustic texture (felt piano, muted strings), instrumental only.
- Each cue is generated to its chapter's length so nothing loops audibly. Cues crossfade under titles.

**UI sounds:** about 25, generated on fal:
- soft click
- toggle
- chip select
- card drop
- confirmation
- low tick for checklist lines
- restrained two-note cue for alerts
- soft riser and air whoosh, for chapter titles only

**Bed:** a quiet ambient bed runs under all narration.

**Mix:**
- Voice-forward. Music ducks 8–10 dB under speech, with a gentle EQ dip around 2–4 kHz under the voice.
- Final loudness −16 LUFS integrated, −1 dBTP, for laptop and intranet playback. A −23 LUFS (EBU R128) version is available if it will be shown through a broadcast chain.

### 9.7 Narration

- **Voice:** calm, measured, slightly low register, a senior operator talking to peers. I'll cast three ElevenLabs voices on the same 40-second excerpt and send you the three files to pick from.
- **Writing:** short declarative sentences, no filler, no questions to the viewer, written-in pauses (a full stop is a beat; a new paragraph is a breath).
- **Reassurance line:** "The screen you are seeing is a synthetic training environment. No live client data is used."
  - Said in full at six points: the first screen (chapter 3), the training deal (8), ownership (10), Sales Plan (13), the calendar (14) and the close (16).
  - Everywhere else, the always-visible label carries it.
  - Said on every screen, it would come round about once a minute and start to sound apologetic. Decision 7 covers this.
- **Runtime:** aiming for the tighter end, about 12–13 minutes, with longer holds instead of more content.

### 9.8 Production order (unchanged gates)

1. Decisions in section 10.
2. Build the design system and synthetic screens.
3. Run the privacy lint.
4. Voice casting, two insert tests and two music tests. About $2.
5. You pick the voice, the insert model and the music engine.
6. Full narration, inserts, score and sound effects.
7. Rough cut, then the privacy QA gate, then the final mix and export.
8. Subtitles, trailer, 90-second cut, thumbnail, end card and the reports.

---

## 10 · Decisions I need from you

1. **Budget.** Approve a fal cap of $30. Estimate about $27, about $20 with the cheaper engines.
2. **Polish phone format.** `+48 22 555 0101` is not a reserved fictional range, and it could be a real Warsaw number. I use only the US 555-01xx and UK 7946 0xxx ranges. Keep it out?
3. **Alex Morgan.** It's also the name of a well-known US footballer. Keep it as the on-screen RM, or swap?
4. **Atlas Quant Partners and Horizon Asset Practice.** These may match real firms. They always carry the DEMO tag and an example.com domain. Keep them?
5. **Delivery.** One file per chapter plus the two cuts, because of the chat size limit. OK?
6. **Alert accent.** Soft gold marks critical alerts in the motion graphics only. Product screens keep the colours the source documents (violet suggestions, task priority spines). OK?
7. **Reassurance line.** Say it in full at the six points in 9.7, with the label always on screen? Or on every synthetic screen, as the brief literally says?
