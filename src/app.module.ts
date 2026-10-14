import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './common/seed.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './common/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/campus-rate',
      }),
    }),
    // (H1): Limitation du nombre de requêtes par minute ---
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 60, 
      },
    ]),
    PlacesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService,
    // Activation globale du Rate Limiting ---
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Activation globale de l'intercepteur de logging ---
  {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}