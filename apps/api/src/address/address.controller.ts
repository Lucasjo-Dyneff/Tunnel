import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';
import { AddressService } from './address.service.js';

const searchSchema = z.object({
  q: z
    .string()
    .trim()
    .min(3, 'Saisissez au moins 3 caractères')
    .max(200, 'Recherche trop longue'),
  // 50 = maximum accepté par la Base Adresse Nationale
  limit: z.coerce.number().int().min(1).max(50).default(5),
});

@Controller('addresses')
export class AddressController {
  constructor(private readonly addresses: AddressService) {}

  /** GET /addresses?q=8 bd du port&limit=5 */
  @Get()
  search(@Query() query: Record<string, string>) {
    const parsed = searchSchema.safeParse(query);
    if (!parsed.success) {
      throw new BadRequestException(z.flattenError(parsed.error).fieldErrors);
    }
    return this.addresses.search(parsed.data.q, parsed.data.limit);
  }
}
