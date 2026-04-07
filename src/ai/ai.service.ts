// src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  // Generic text processor
  async processText(userInput: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'Summarize the medical case and extract key diagnosis only and bring out appropriate medication.',
        },
        {
          role: 'user',
          content: userInput,
        },
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    return completion.choices[0]?.message?.content?.trim() || '';
  }

  // Extract drugs and symptoms as JSON
  async extractDrugsAndSymptoms(userInput: { text: string }): Promise<{ drugs: string[]; symptoms: string[] }> {
    const inputText = userInput.text?.trim();

    if (!inputText) {
      throw new Error('User input is empty');
    }

    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
      role: 'user',
      content: `
    You are a medical text extraction assistant.

    Extract all drug names and symptoms mentioned in the text.

    Rules:
    - Drugs include medications (e.g., Paracetamol, Ibuprofen, Amoxicillin).
    - Symptoms include physical or mental conditions (e.g., headache, fever, nausea).
    - Ignore anything that is not a drug or symptom.
    - Do not infer or guess — only extract what is explicitly mentioned.
    - Handle misspellings if obvious (e.g., "paracetmol" → "paracetamol").
    - Do not include duplicates.
    - Return lowercase values.

    Respond ONLY with valid JSON in this exact format:
    {
      "drugs": ["drug1", "drug2"],
      "symptoms": ["symptom1", "symptom2"]
    }

    Text: "${inputText}"
    `
    },
      ],
      temperature: 0.0,
      max_tokens: 200,
    });

    const raw = completion.choices[0]?.message?.content?.trim();

    if (!raw) {
      throw new Error('AI returned no content');
    }

    // Safe JSON parsing (remove newlines and extra spaces)
    let aiJson: { drugs: string[]; symptoms: string[] };
    try {
      const cleaned = raw.replace(/[\n\r]+/g, '');
      aiJson = JSON.parse(cleaned);
    } catch (err) {
      throw new Error(`AI returned invalid JSON: ${raw}`);
    }

    // Ensure the returned structure
    aiJson.drugs = aiJson.drugs || [];
    aiJson.symptoms = aiJson.symptoms || [];

    return aiJson;
  }
}