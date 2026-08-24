-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "kyc_status" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "cards" (
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("card_id")
);

-- CreateTable
CREATE TABLE "reward_programs" (
    "program_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,
    "cap_amt" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "reward_programs_pkey" PRIMARY KEY ("program_id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "budget_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "total_limit" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("budget_id")
);

-- CreateTable
CREATE TABLE "budget_entries" (
    "entry_id" TEXT NOT NULL,
    "budget_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "limit_amt" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "budget_entries_pkey" PRIMARY KEY ("entry_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "txn_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "entry_id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "payment_rail" TEXT NOT NULL,
    "txn_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("txn_id")
);

-- CreateTable
CREATE TABLE "portfolio_holdings" (
    "holding_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "asset_type" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "avg_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "portfolio_holdings_pkey" PRIMARY KEY ("holding_id")
);

-- CreateTable
CREATE TABLE "trade_orders" (
    "order_id" TEXT NOT NULL,
    "holding_id" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "qty" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "trade_orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notif_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notif_id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "rec_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("rec_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "budgets_user_id_month_key" ON "budgets"("user_id", "month");

-- CreateIndex
CREATE UNIQUE INDEX "budget_entries_budget_id_category_key" ON "budget_entries"("budget_id", "category");

-- CreateIndex
CREATE INDEX "transactions_card_id_idx" ON "transactions"("card_id");

-- CreateIndex
CREATE INDEX "transactions_category_idx" ON "transactions"("category");

-- CreateIndex
CREATE INDEX "transactions_txn_time_idx" ON "transactions"("txn_time");

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_programs" ADD CONSTRAINT "reward_programs_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("card_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budget_entries" ADD CONSTRAINT "budget_entries_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("budget_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("card_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "budget_entries"("entry_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_holdings" ADD CONSTRAINT "portfolio_holdings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trade_orders" ADD CONSTRAINT "trade_orders_holding_id_fkey" FOREIGN KEY ("holding_id") REFERENCES "portfolio_holdings"("holding_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "cards"("card_id") ON DELETE CASCADE ON UPDATE CASCADE;
