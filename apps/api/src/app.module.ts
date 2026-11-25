import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.js';
import { AddressModule } from './address/address.module.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      // .env local à l'app (optionnel) puis .env racine du monorepo.
      // Les variables d'environnement réelles restent prioritaires.
      envFilePath: ['.env', '../../.env'],
      validate: validateEnv,
    }),
    // Plafond de requêtes par adresse IP appelante (réponse 429 au-delà).
    // L'API Nest n'est appelée que par le serveur Next : ce plafond agit donc
    // comme une limite globale. Il garde les appels aux API externes sous
    // leurs quotas (la Base Adresse Nationale bloque une IP au-delà de
    // 50 requêtes/s), même si la limite par visiteur de Next était contournée.
    // La limite par visiteur se trouve dans le front (src/lib/rate-limit.ts).
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'global', ttl: 1000, limit: 40 }],
    }),
    PrismaModule,
    AddressModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
