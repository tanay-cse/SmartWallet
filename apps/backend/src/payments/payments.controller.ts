import { Controller } from '@nestjs/common';
import { PaymentsService } from './payments.service';

/** Handles /payments routes — UPI/NFC payment initiation */
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  // Routes will be added in the payments implementation task
}
