import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { InitiateUpiPaymentInput } from './payments.types';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('upi/initiate')
  async initiate(
    @Request() req: { user: { userId: string } },
    @Body() body: InitiateUpiPaymentInput,
  ) {
    return this.paymentsService.initiateUpiPayment(req.user.userId, body);
  }

  /**
   * In a real integration this would be a webhook called by the PSP.
   * Here, since there's no external gateway, the frontend calls this
   * directly to simulate the PSP confirming the payment — clearly a
   * sandboxed stand-in, not a security-sensitive endpoint.
   */
  @Post('upi/confirm')
  async confirm(
    @Request() req: { user: { userId: string } },
    @Body() body: { txnId: string; outcome?: 'SUCCESS' | 'FAILED' },
  ) {
    return this.paymentsService.confirmUpiPayment(req.user.userId, body.txnId, body.outcome);
  }
}
