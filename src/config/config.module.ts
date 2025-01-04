import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [NestConfigModule.forRoot({
    isGlobal: true, // ensures that the config module is available globally
    envFilePath: '.env',
  })],
  providers: [ConfigService],
  exports: [ConfigService], // Ensure ConfigService is exported here
})
export class ConfigModule {}