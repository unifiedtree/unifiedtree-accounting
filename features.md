# UnifiedTree Competitive Improvement Plan

Date: 2026-05-29

This plan turns the competitor comparison against TallyPrime, Zoho Books, Vyapar, and BUSY into product work for the current frontend mock. The app still has no backend, so each item is implemented as realistic client-side UX with Zustand/local data persistence where useful.

## 1. Compliance Workflow Depth

Goal: make GST, e-invoice, e-way bill, and filing feel like one connected workflow instead of separate pages.

Improvements:
- Add a compliance pipeline showing invoice posted, IRN generated, e-way bill generated, GSTR-1 staged, GSTR-3B reviewed, and filed.
- Show document-level statuses, risk flags, next action, owner, and due date.
- Add one-click simulated actions such as Generate IRN, Generate E-way Bill, Stage GSTR-1, Mark Reviewed, and File Return.
- Surface compliance pipeline progress on dashboard/tax screens.

Competitor pressure:
- TallyPrime and BUSY are strong in GST/e-invoice/e-way bill workflows.
- Zoho Books emphasizes GST-compliant cloud workflows.

## 2. Audit Confidence

Goal: make every important action feel traceable and accountant-safe.

Improvements:
- Add a centralized frontend audit trail in Zustand.
- Record permission edits, integration connect/disconnect/sync, compliance actions, and import actions.
- Show before/after style metadata where available.
- Add an Audit Activity panel in settings using persisted audit events.

Competitor pressure:
- TallyPrime’s edit log and accounting trust model are major buyer-confidence signals.

## 3. Faster Onboarding

Goal: let a new company reach first useful accounting action quickly.

Improvements:
- Add setup progress cards for company profile, GSTIN, bank, invoice template, import, and first invoice.
- Highlight next best setup action from dashboard/settings.
- Keep the workflow non-blocking for demo use.

Competitor pressure:
- Vyapar wins with easy first-use billing.
- Zoho wins with clean guided cloud setup.

## 4. Workflow-Aware Integrations

Goal: make integration cards visibly affect accounting workflows.

Improvements:
- Payment gateway connection enables invoice payment link hints.
- Banking connection enables bank feed/reconciliation hints.
- E-commerce connection enables imported order hints.
- Sync actions update last sync and write audit events.

Competitor pressure:
- Zoho’s ecosystem and Tally’s connected banking/GST features make integrations feel useful, not decorative.

## 5. Mobile Quick Billing

Goal: improve the small-business/mobile operator experience.

Improvements:
- Add a compact quick-action panel for invoice, receipt, expense, and bill creation.
- Keep controls touch-friendly and visible in the main header/FAB flow.
- Preserve the existing desktop modal behavior while adding a denser mobile-friendly path.

Competitor pressure:
- Vyapar is strong on mobile/PC quick billing and low-friction use.

## 6. Actionable AI Assistance

Goal: shift AI from passive insight labels to workflow-driving guidance.

Improvements:
- Add AI insights that point to compliance, reconciliation, imports, and integration actions.
- Give each insight a clear CTA and route.
- Keep insights in the top navbar before the role selector.

Competitor pressure:
- This is UnifiedTree’s differentiation wedge: guided finance operations rather than another ledger clone.

## 7. Migration From Tally/Excel

Goal: reduce switching anxiety.

Improvements:
- Add a Tally/Excel import wizard with source selection, file details, validation preview, mapped entities, issue list, and simulated import completion.
- Persist import jobs locally.
- Write audit events for validation and import completion.

Competitor pressure:
- Tally has strong incumbent lock-in. Migration confidence is essential for switching.

## Delivery Order

1. Add shared audit + compliance + migration state to the app store.
2. Build reusable compliance and import mock services/components.
3. Wire Settings > Audit Logs to live audit events.
4. Upgrade Tax/GST workflow screen with pipeline actions.
5. Upgrade Data Migration import screen with the wizard.
6. Add integration-driven hints on relevant pages.
7. Make AI insights route to real action surfaces.
8. Verify build and scoped lint.
