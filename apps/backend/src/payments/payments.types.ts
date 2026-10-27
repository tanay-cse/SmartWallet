export interface InitiateUpiPaymentInput {
  cardId: string;
  amount: number;
  category: string;
  payeeUpiId?: string;
}

export interface InitiateUpiPaymentResult {
  txnId: string;
  status: 'PENDING';
  /** Simulated UPI deep link — not a real payment app intent, for demo purposes. */
  upiIntentUrl: string;
  message: string;
}

export interface ConfirmUpiPaymentResult {
  txnId: string;
  status: 'SUCCESS' | 'FAILED';
  message: string;
}
