/*
  Warnings:

  - A unique constraint covering the columns `[upi_id]` on the table `cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `upi_id` to the `cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "budget_entries" DROP CONSTRAINT "budget_entries_budget_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_entry_id_fkey";

-- AlterTable
ALTER TABLE "budget_entries" ALTER COLUMN "budget_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cards" ADD COLUMN     "upi_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payee_upi_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "entry_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "kyc_status" SET DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX "cards_upi_id_key" ON "cards"("upi_id");

-- AddForeignKey
ALTER TABLE "budget_entries" ADD CONSTRAINT "budget_entries_budget_id_fkey" FOREIGN KEY ("budget_id") REFERENCES "budgets"("budget_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "budget_entries"("entry_id") ON DELETE SET NULL ON UPDATE CASCADE;
