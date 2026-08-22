# SmartWallet — Software Requirements Specification (SRS)

## 1. Purpose and Scope

SmartWallet is a mobile-first application that unifies five areas of personal finance into a single, AI-assisted platform: a card rewards vault, an AI card-recommendation assistant, unified UPI/NFC payments, a forex and portfolio trading platform, and a budget tracker with savings recommendations.

For this academic evaluation, regulated financial rails — UPI/NFC payment execution, card-network tokenization, and brokerage/mutual-fund trading — are implemented against sandboxed mock APIs, standing in for the NPCI-certified PSP, card-network tokenization service, and SEBI/AMFI-registered broking partner required for a production deployment.

## 2. Functional Requirements

| ID | Requirement |
|---|---|
| FR-1 | The system shall allow users to add, edit, and delete card details in an encrypted vault. |
| FR-2 | The system shall automatically fetch/attach reward and benefit rules for each stored card. |
| FR-3 | The system shall recommend the best card for a selected or detected spend category. |
| FR-4 | The system shall allow payment initiation via UPI and NFC from a selected card. |
| FR-5 | The system shall allow users to view, buy, and sell equities, mutual funds, SIPs, and gold. |
| FR-6 | The system shall allow users to set a monthly budget with category-wise limits. |
| FR-7 | The system shall send daily notifications summarizing spend against budget. |
| FR-8 | The system shall generate month-end savings/investment recommendations. |
| FR-9 | The system shall maintain a consolidated, searchable transaction history. |

## 3. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | All card data tokenized/encrypted at rest (AES-256) and in transit (TLS 1.2+); no raw PAN/CVV stored. |
| Compliance | PCI-DSS alignment for card data; RBI guidelines for payment aggregation and tokenization; SEBI/AMFI rules for investment features. |
| Availability | Core payment and vault services target 99.9% uptime. |
| Performance | Card recommendation and payment initiation shall respond within 2 seconds under normal load. |
| Usability | Core flows (add card, pay, invest, set budget) completable within 3 taps from the home screen. |
| Scalability | Backend shall support horizontal scaling to accommodate growth in users and transaction volume. |
| Auditability | Every financial action (payment, trade, budget change) shall be logged immutably for audit and dispute resolution. |

## 4. Assumptions and Constraints

- Real-world financial rails (UPI PSP, card-network tokenization, SEBI-registered broker/MF platform APIs) are outside the licensing scope of a student project and are represented by sandboxed mock services. See the project report's Feasibility Study (Section 8.4) for the compliance reasoning.
- "Full-fledged forex trading" is scoped to domestic equities, mutual funds, SIPs, and gold; retail speculative currency trading is restricted under RBI's FEMA/Liberalised Remittance Scheme and is out of scope.
- The entity model backing these requirements is defined in `er-diagram.md`; every FR above maps to at least one entity or relationship there (see the FR coverage table at the end of that document).

## 5. Traceability Note

FR-6 ("category-wise limits") specifically requires the data model to support multiple budget categories per month — this is why the ER diagram splits `Budget` into `Budget` + `BudgetEntry` rather than using a single budget record with one total limit.
