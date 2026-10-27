/*
  Warnings:

  - You are about to drop the column `razorpay_order_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `razorpay_payment_id` on the `transactions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "transactions_razorpay_order_id_key";

-- DropIndex
DROP INDEX "transactions_razorpay_payment_id_key";

-- AlterTable
ALTER TABLE "cards" ALTER COLUMN "upi_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "razorpay_order_id",
DROP COLUMN "razorpay_payment_id";
