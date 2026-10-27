import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InitiateUpiPaymentInput,
  InitiateUpiPaymentResult,
  ConfirmUpiPaymentResult,
} from './payments.types';

// This is a SANDBOXED / SIMULATED UPI payment flow — no real PSP, no real
// money movement. This matches the project's own SRS scoping (Section 8.4):
// real NPCI/UPI PSP integration requires licensing outside an academic
// project's scope, so this module simulates the initiate -> confirm
// lifecycle a real integration would have, without an external dependency.

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async initiateUpiPayment(
    userId: string,
    input: InitiateUpiPaymentInput,
  ): Promise<InitiateUpiPaymentResult> {
    const card = await this.prisma.card.findFirst({
      where: { cardId: input.cardId, userId },
    });
    if (!card) {
      throw new NotFoundException('Card not found in your vault');
    }
    if (input.amount <= 0) {
      throw new BadRequestException('amount must be a positive number');
    }
    if (!card.upiId) {
      throw new BadRequestException('This card has no UPI ID configured');
    }

    const txn = await this.prisma.transaction.create({
      data: {
        cardId: card.cardId,
        amount: input.amount,
        category: input.category,
        paymentRail: 'UPI',
        txnTime: new Date(),
        status: 'PENDING',
        payeeUpiId: input.payeeUpiId,
      },
    });

    // A real UPI deep link follows this URI scheme (pa=payee address,
    // am=amount, tn=note, cu=currency). Here it's constructed for demo
    // purposes only — no real UPI app will settle this transaction.
    const upiIntentUrl =
      `upi://pay?pa=${encodeURIComponent(input.payeeUpiId ?? 'merchant@sandbox')}` +
      `&pn=SmartWallet&am=${input.amount}&cu=INR&tn=${encodeURIComponent(input.category)}`;

    return {
      txnId: txn.txnId,
      status: 'PENDING',
      upiIntentUrl,
      message: 'Payment initiated (sandboxed). Call confirm to simulate completion.',
    };
  }

  /**
   * Simulates the PSP callback a real UPI integration would receive
   * asynchronously. In this sandboxed version, the frontend calls this
   * directly after a short delay to simulate "payment completed."
   */
  async confirmUpiPayment(
    userId: string,
    txnId: string,
    outcome: 'SUCCESS' | 'FAILED' = 'SUCCESS',
  ): Promise<ConfirmUpiPaymentResult> {
    const txn = await this.prisma.transaction.findFirst({
      where: { txnId, card: { userId } }, // scoped to the requesting user's own cards
    });
    if (!txn) {
      throw new NotFoundException('Transaction not found');
    }
    if (txn.status !== 'PENDING') {
      throw new BadRequestException(`Transaction is already ${txn.status}, cannot confirm again`);
    }

    const updated = await this.prisma.transaction.update({
      where: { txnId },
      data: { status: outcome },
    });

    return {
      txnId: updated.txnId,
      status: updated.status as 'SUCCESS' | 'FAILED',
      message:
        outcome === 'SUCCESS'
          ? 'Payment confirmed (sandboxed). Reward points will reflect on next card summary fetch.'
          : 'Payment marked as failed (sandboxed).',
    };
  }
}
