// src/ai/ai.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('process')
  async process(@Body() body: any) {
    const { text } = body;

    if (!text) {
      return { message: 'Text is required' };
    }

    const result = await this.aiService.processText(text);

    return {
      input: text,
      output: result,
    };
  }
}