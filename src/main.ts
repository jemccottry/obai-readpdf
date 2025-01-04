import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
import { FastifyRequest, FastifyReply } from 'fastify'; // Import Fastify types
import { Logger } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { ThrottlerExceptionFilter } from './filters/throttler-exception.filter';  // Import the custom filter
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = 4000
console.log(`Launching NestJS app on port ${port}, URL: http://0.0.0.0:${port}`)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.register(fastifyMultipart);

  const configService = app.get(ConfigService);
  app.useGlobalFilters(new ThrottlerExceptionFilter());
  fastifyInstance.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const { method, url, ip } = request;
    const { statusCode } = reply;
    //console.log(request.headers['x-api-key']);
    //console.log(configService.apiKey)
    const apiKey = request.headers['x-api-key']

    if ((!apiKey || apiKey !== configService.apiKey) && (method == 'POST')) {
      //console.log("Unauthorized access: Invalid or missing API key");
    return reply.status(401).send({ message: 'Unauthorized access: Invalid or missing API key' });
    }
    done();
  });

  fastifyInstance.addHook('onResponse', (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const { method, url, ip } = request;
    const { statusCode } = reply;
    const log = `${new Date().toISOString()}\t${ip}\t${method}\t${url}\t${statusCode}`;
    Logger.log(log);

    done();
  });


  const config = new DocumentBuilder()
  .setTitle('PDFReader')
  .setDescription('OBAI claim hail claim document reader')
  .setVersion('1.0')
  .build()

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document)

  await app.listen(4000);
}
bootstrap();