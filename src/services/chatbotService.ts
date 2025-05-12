import { z } from 'zod';

// Define the chatbot response type
export type ChatbotResponse = {
  message: string;
  confidence: number;
};

// Create a class for our rule-based chatbot
export class ChatbotService {
  private patterns: Record<string, string[]> = {
    greetings: ['hello', 'hi', 'hey', 'greetings'],
    farewells: ['bye', 'goodbye', 'see you', 'later'],
    thanks: ['thank', 'thanks', 'appreciate', 'grateful'],
    help: ['help', 'assist', 'support', 'guide'],
  };

  private responses: Record<string, string[]> = {
    greetings: [
      'Hello! How can I assist you today?',
      'Hi there! What can I help you with?',
      'Hey! Ready to help you out!',
    ],
    farewells: [
      'Goodbye! Have a great day!',
      'See you later!',
      'Take care!',
    ],
    thanks: [
      'You're welcome!',
      'No problem at all!',
      'Happy to help!',
    ],
    help: [
      'I can help you with:',
      '1. Basic information',
      '2. Simple questions',
      '3. Predefined topics',
    ],
  };

  private defaultResponses: string[] = [
    'I see you want to know about...',
    'Let me help you with that...',
    'Here’s what I found...',
  ];

  // Process user input and return a response
  public processMessage(input: string): ChatbotResponse {
    const cleanedInput = input.toLowerCase().trim();

    // Check for pattern matches
    for (const [category, patterns] of Object.entries(this.patterns)) {
      if (patterns.some(pattern => cleanedInput.includes(pattern))) {
        const response = this.getRandomResponse(this.responses[category as keyof typeof this.responses]);
        return {
          message: response,
          confidence: 0.9,
        };
      }
    }

    // If no pattern matches, use a default response
    const defaultResponse = this.getRandomResponse(this.defaultResponses);
    return {
      message: defaultResponse,
      confidence: 0.5,
    };
  }

  // Helper function to get a random response
  private getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }
}
