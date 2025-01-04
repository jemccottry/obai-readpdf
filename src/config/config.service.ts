import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {

  get openAIKey(): string {
    return process.env.OPENAI_API_KEY || '';
  }

  get apiKey(): string {
    return process.env.API_KEY || '' ;
  }
}