import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PdfController } from './controller/pdf.controller';
import { PDFService } from './services/pdf.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { OpenaiService } from './services/openai.service';
import { APP_GUARD } from '@nestjs/core';


@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([{
      ttl: 10,
      limit: 1,
    }]),
  ],
  controllers: [PdfController],
  providers: [ OpenaiService, PDFService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
},],
})
export class AppModule {

}