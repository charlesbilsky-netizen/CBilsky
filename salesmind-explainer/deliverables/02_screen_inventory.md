# Screen inventory

Every product-like screen in the film is a synthetic recreation built in code (Remotion/React) from the documented labels in the source guide. None was captured from a live account, and none was sent to fal. Every one carries the training label on the film's top layer.

| # | Screen | Component | Chapter(s) | Records shown (all synthetic) |
|---|---|---|---|---|
| S01 | Training sign-in (simulated) | `Nav.tsx · SignIn` | 3 | Alex Morgan, Synthetic RM Workspace |
| S02 | Menu tour (four groups, top bar, collapse) | `Nav.tsx · NavTour` over a dimmed Dashboard | 3 | none |
| S03 | Dashboard: milestone, net new money, three tiles | `Dashboard.tsx` | 4, 16 | EUR 500,000 of 1,000,000; EUR 250,000 NNM; 7 clients |
| S04 | Dashboard list: Going quiet, New opportunities, Open deals, Open requests | `Dashboard.tsx` (tab 0–3) | 4 | deals d1–d7, TRAIN-101/102 |
| S05 | Dashboard recent activity, 7 / 30 days | `Dashboard.tsx` | 4 | synthetic activities |
| S06 | Urgency ladder (graphic) | `MG.tsx · Ladder` | 4 | none |
| S07 | Task inbox + reading pane + capture | `Tasks.tsx · TasksInbox` | 5 | Atlas Quant Partners tasks, starred email |
| S08 | Today + synthetic calendar | `Tasks.tsx · TasksToday` | 5, 14 | 3 tasks, 4 calendar entries |
| S09 | Plan the day: recap, ring | `Tasks.tsx · PlanTheDay` | 5 | 4.3 h of 8 h |
| S10 | Planning board | `Tasks.tsx · Planning` | 5 | 8 synthetic tasks |
| S11 | Pipeline board (New Business) | `Pipeline.tsx · PipelineBoard` | 6, 7 | d1, d3–d7 |
| S12 | Closed window, Sort, Views menus | `Pipeline.tsx · PipelineMenus` | 6 | none |
| S13 | Filters panel | `Pipeline.tsx · FiltersPanel` | 6, 13 | documented filter options |
| S14 | Alert map (graphic) | `MG.tsx · AlertsMap` | 6 | the 10 documented alerts |
| S15 | First-contact clock (graphic) | `MG.tsx · SlaClock` | 6 | none |
| S16 | No-answer cadence (graphic) | `MG.tsx · Cadence` | 6 | none |
| S17 | Who moves each stage (graphic) | `MG.tsx · StageFlow` | 7, 9 | none |
| S18 | Deal card (focused) | `Pipeline.tsx · DealCard` | 7 | Redwood Trading Education |
| S19 | Pipeline table | `Pipeline.tsx · PipelineTable` | 7 | d1, d3–d7, totals |
| S20 | Deal page: suggested / editing / accepted | `DealPage.tsx · DealPage` | 8 | Northstar Capital Training, CRM-DEMO-001 |
| S21 | Complete stage action | `DealPage.tsx · CompleteDialog` | 8 | synthetic outcome |
| S22 | Move dialog (something missing) | `DealPage.tsx · MoveDialog` | 8 | Instruments · Products |
| S23 | Put on hold / Close deal | `DealPage.tsx · HoldCloseDialogs` | 8 | documented hold reasons |
| S24 | Client Growth board | `Pipeline.tsx · ClientGrowthBoard` | 9 | Meridian Family Office Demo |
| S25 | Create deal | `DealPage.tsx · CreateDeal` | 9 | Meridian, daniel.reed@meridian-fo.example.com |
| S26 | Clients | `Book.tsx · Clients` | 10 | p1–p7, CRM-DEMO-001…007, +44 20 7946 01xx / +1 202 555 01xx |
| S27 | Check ownership, five verdicts | `Book.tsx · Ownership` | 10 | prospects outside the training book, all *.example.com |
| S28 | Activity log + types | `Book.tsx · Activity` | 11 | 7 synthetic events |
| S29 | Activity item + Raise an issue | `Book.tsx · ActivityItem` | 11 | synthetic email, synthetic comment |
| S30 | Performance, NAV milestones | `Rest.tsx · Performance` | 12 | EUR 500,000 of 1,000,000 |
| S31 | Sales plan tab | `Rest.tsx · SalesPlan` | 13 | 3 entries, one specific N/A reason |
| S32 | First ten days (graphic) | `MG.tsx · TenDays` | 13 | none |
| S33 | Connect Google (simulated permissions) | `Rest.tsx · GooglePermission` | 14 | none; second label "SIMULATED TRAINING SCREEN · NO LIVE CONNECTION" |
| S34 | Guidebook index | `Rest.tsx · Guidebook` | 15 | documented page titles |
| S35 | Sales materials | `Rest.tsx · Materials` | 15 | documented titles, "Open link →" only, no URLs |
| S36 | Changelog v0.6.1 | `Rest.tsx · Changelog` | 15 | documented release title |
| S37 | Internal requests (Jira, Onboarding, KYC, Intercom) | `Rest.tsx · Requests` | 15 | TRAIN-101…104 |
| S38 | End-of-day checklist (graphic) | `MG.tsx · Checklist` | 16 | the 12 documented checks |
| S39 | End card | `Film.tsx · EndCard` | end | no URLs |

Synthetic identifiers in use: CRM-DEMO-###, TRAIN-###, emails on example.com only, phones in the fictional ranges +44 20 7946 0xxx and +1 202 555 01xx, money in multiples of EUR 250,000. Source: `data/synthetic-data.json`, checked by `scripts/privacy-lint.mjs`.
