import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JsonPersistenceModule } from './common/json-persistence/json-persistence.module';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JsonPersistenceModule,
    PlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}