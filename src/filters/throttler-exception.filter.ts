import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { FastifyReply, FastifyRequest } from 'fastify';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const request = host.switchToHttp().getRequest<FastifyRequest>();

    // You can customize the message here
    const message = 'You have exceeded the rate limit. Please try again later.';

    response.status(429).send({
      statusCode: 429,
      message: message,
      error: 'Too Many Requests',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}