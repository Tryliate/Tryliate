import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-neural-placeholder'
});

export class NeuralAI {
  /**
   * Generates a 1536-dimensional embedding for the given text.
   * Falls back to a deterministic pseudo-embedding if API key is missing.
   */
  static async getEmbedding(text: string): Promise<number[]> {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('⚠️ OPENAI_API_KEY missing - Generating Neural Pseudo-Embedding');
      return this.generatePseudoEmbedding(text);
    }

    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });
      return response.data[0].embedding;
    } catch (err: any) {
      console.error('Embedding Generation Failed:', err.message);
      return this.generatePseudoEmbedding(text);
    }
  }

  private static generatePseudoEmbedding(text: string): number[] {
    const vector = new Array(1536).fill(0);
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      vector[i % 1536] = (vector[i % 1536] + charCode) / 255;
    }
    // Normalize slightly
    return vector.map(v => parseFloat(v.toFixed(6)));
  }
}
