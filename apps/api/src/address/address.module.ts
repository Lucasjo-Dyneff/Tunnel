import { Module } from '@nestjs/common';
import { ExternalApiModule } from '../external-api/index.js';
import { AddressController } from './address.controller.js';
import { ADDRESS_FR, AddressService } from './address.service.js';

@Module({
  imports: [ExternalApiModule.register(ADDRESS_FR)],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
