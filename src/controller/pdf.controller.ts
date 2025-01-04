import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Throttle } from '@nestjs/throttler';
import { OpenaiService } from '../services/openai.service';
import { PDFService } from '../services/pdf.service'
import { ApiBody, ApiConsumes, ApiHeader } from '@nestjs/swagger';


@Controller('api')
export class PdfController {
  constructor(private readonly openaiService: OpenaiService,
    private readonly pdfService: PDFService
  ) {}
  @Throttle({ default: { limit: 0, ttl: 1 } })
  @Post('readpdf')
  @ApiHeader({
    name: 'x-api-key',
    description: 'API Key',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async readPdf(@Req() req: FastifyRequest) {
    const extractedText = await this.pdfService.handleFile(req);
    const openAIResponse = await this.openaiService.queryOpenAI(extractedText);
    //console.log(openAIResponse);
    return openAIResponse.replace(/```json\n?|```/g, '');

  }

}