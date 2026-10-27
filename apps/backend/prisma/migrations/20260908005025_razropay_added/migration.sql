/*
  Warnings:

  - A unique constraint covering the columns `[razorpay_order_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[razorpay_payment_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "razorpay_order_id" TEXT,
ADD COLUMN     "razorpay_payment_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_razorpay_order_id_key" ON "transactions"("razorpay_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_razorpay_payment_id_key" ON "transactions"("razorpay_payment_id");
