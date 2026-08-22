# SmartWallet — Entity-Relationship Diagram (Revised)

This revises the original 4-entity diagram (User, Card, Budget, Transaction) to cover all nine functional requirements (FR-1 through FR-9) in the SRS. See below for what changed and why.

## Changes from the original diagram

1. **Added `RewardProgram`** — required for FR-2 (automatic reward/benefit ingestion per card). Without it, `Card` had no way to store category multipliers, caps, or bonus windows.
2. **Added `PortfolioHolding` and `TradeOrder`** — required for FR-5 (view, buy, sell equities/MF/SIP/gold). The original diagram had no investment-related entities at all.
3. **Added `Notification`** — required for FR-7 (daily spend notifications) and FR-8 (month-end recommendations delivered as notifications).
4. **Added `Recommendation`** — stores the AI assistant's output and reasoning for FR-3, matching the Auditability NFR ("every financial action shall be logged immutably") and the `Recommendation` entity already named in the architecture doc's high-level data entities.
5. **Split `Budget` into `Budget` + `BudgetEntry`** — the original single `Budget` entity had one `limit_amt` for the whole month, which cannot represent FR-6's "category-wise limits." `BudgetEntry` now holds one row per category per budget.
6. **Re-routed the tracking relationship** — `Transaction` now links to `BudgetEntry` (not `Budget` directly), so it's clear which category-limit each transaction counts against.
7. **Added `payment_rail` and `txn_time` to `Transaction`** — required for FR-4 (UPI/NFC initiation) and for audit logging.

## Mermaid source

```mermaid
erDiagram
  USER ||--o{ CARD : owns
  USER ||--o{ BUDGET : sets
  USER ||--o{ PORTFOLIOHOLDING : holds
  USER ||--o{ NOTIFICATION : receives
  USER ||--o{ RECOMMENDATION : receives
  CARD ||--o{ REWARDPROGRAM : has
  CARD ||--o{ TRANSACTION : paid_via
  CARD ||--o{ RECOMMENDATION : suggests
  BUDGET ||--o{ BUDGETENTRY : allocates
  BUDGETENTRY ||--o{ TRANSACTION : tracks
  PORTFOLIOHOLDING ||--o{ TRADEORDER : has

  USER {
    uuid user_id PK
    string name
    string email
    string kyc_status
  }
  CARD {
    uuid card_id PK
    uuid user_id FK
    string token_id
    string network
    string nickname
  }
  REWARDPROGRAM {
    uuid program_id PK
    uuid card_id FK
    string category
    float multiplier
    float cap_amt
  }
  TRANSACTION {
    uuid txn_id PK
    uuid card_id FK
    uuid entry_id FK
    float amount
    string category
    string payment_rail
    datetime txn_time
  }
  BUDGET {
    uuid budget_id PK
    uuid user_id FK
    string month
    float total_limit
  }
  BUDGETENTRY {
    uuid entry_id PK
    uuid budget_id FK
    string category
    float limit_amt
  }
  PORTFOLIOHOLDING {
    uuid holding_id PK
    uuid user_id FK
    string asset_type
    float qty
    float avg_price
  }
  TRADEORDER {
    uuid order_id PK
    uuid holding_id FK
    string side
    float qty
    string status
  }
  NOTIFICATION {
    uuid notif_id PK
    uuid user_id FK
    string type
    string message
  }
  RECOMMENDATION {
    uuid rec_id PK
    uuid user_id FK
    uuid card_id FK
    string reasoning
  }
```

## FR coverage check

| Requirement | Entity/relationship that supports it |
|---|---|
| FR-1 (add/edit/delete cards) | `Card` |
| FR-2 (automatic reward ingestion) | `RewardProgram` (Card has\|\| REWARDPROGRAM) |
| FR-3 (best-card recommendation) | `Recommendation` (User/Card receives/suggests) |
| FR-4 (UPI/NFC payment) | `Transaction.payment_rail` |
| FR-5 (view/buy/sell investments) | `PortfolioHolding`, `TradeOrder` |
| FR-6 (category-wise budget) | `Budget` + `BudgetEntry` |
| FR-7 (daily notifications) | `Notification` |
| FR-8 (month-end recommendations) | `Notification` (type field distinguishes daily vs. month-end) |
| FR-9 (searchable transaction history) | `Transaction` (indexed by card_id, category, txn_time) |
