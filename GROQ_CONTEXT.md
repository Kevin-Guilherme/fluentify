# 🤖 GROQ AI - CONTEXTO COMPLETO

**Projeto:** Plataforma de Ensino de Idiomas com IA  
**Última atualização:** 11/02/2026  
**Responsável:** Kevin Souza

> 📌 **IMPORTANTE:** Este arquivo contém TODAS as configurações, prompts e estratégias para alimentar o Groq AI durante o desenvolvimento. Use como referência única para implementação.

---

## 📑 Índice

1. [Arquitetura Groq](#1-arquitetura-groq)
2. [System Prompts - Conversação](#2-system-prompts---conversação)
3. [System Prompts - Feedback](#3-system-prompts---feedback)
4. [RAG Implementation](#4-rag-implementation)
5. [Níveis de Proficiência](#5-níveis-de-proficiência)
6. [Tópicos de Conversação](#6-tópicos-de-conversação)
7. [Audio Processing (STT)](#7-audio-processing-stt)
8. [Scoring System (XP)](#8-scoring-system-xp)
9. [Error Handling](#9-error-handling)
10. [Otimizações](#10-otimizações)
11. [Estrutura de Código](#11-estrutura-de-código)
12. [Seeds & Exemplos](#12-seeds--exemplos)
13. [Testing Strategy](#13-testing-strategy)

---

## 1. Arquitetura Groq

### 1.1 Stack Completa

```typescript
const groqConfig = {
  // Modelos
  stt: 'whisper-large-v3',              // Speech-to-Text
  llm: 'llama-3.3-70b-versatile',       // Conversação + Análise
  embeddings: 'text-embedding-3-small',  // RAG (Opcional)
  
  // Endpoints
  baseUrl: 'https://api.groq.com/openai/v1',
  endpoints: {
    transcriptions: '/audio/transcriptions',
    chatCompletions: '/chat/completions',
    embeddings: '/embeddings',
  },
  
  // Rate Limits (FREE tier)
  limits: {
    requestsPerMinute: 30,
    requestsPerDay: 14400,
    tokensPerMinute: 600000,
    tokensPerDay: 7000000,
  },
  
  // Headers padrão
  headers: {
    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
    'Content-Type': 'application/json',
  }
};
```

### 1.2 Fluxo de Dados

```
User fala (áudio) 
  → Frontend grava (MediaRecorder API)
  → Upload pra backend (NestJS)
  → Groq Whisper transcreve (STT)
  → Salva transcrição no DB
  → Groq Llama gera resposta (LLM + RAG)
  → Retorna resposta pro frontend
  → (Opcional) TTS pra falar resposta
  → User ouve e responde novamente
  → Groq Llama analisa resposta (Feedback)
  → Frontend mostra feedback detalhado
```

---

## 2. System Prompts - Conversação

### 2.1 Prompt Base (Template)

```typescript
// modules/groq/prompts/conversation.prompt.ts

export function buildConversationPrompt(
  userLevel: 'beginner' | 'intermediate' | 'advanced',
  topic: string,
  userName?: string
): string {
  
  const levelInstructions = {
    beginner: `
## LEVEL: BEGINNER (A1-A2)

### Vocabulary Rules:
- Use ONLY high-frequency words (top 500-1000 most common)
- Avoid idioms, phrasal verbs, and slang
- Define any word that might be unfamiliar
- Repeat key vocabulary naturally

### Grammar Rules:
- Present simple tense primarily
- Simple past tense occasionally
- Avoid complex structures (no conditionals, passive voice, etc)
- Use subject + verb + object structure

### Sentence Structure:
- Keep sentences SHORT (5-10 words maximum)
- One idea per sentence
- Use "and" to connect ideas (not "however", "although", etc)

### Question Style:
- Ask YES/NO questions primarily
- Use "Do you...?", "Can you...?", "Is it...?"
- Avoid "Why", "How", or open-ended questions

### Examples:
✅ "Do you like coffee? Coffee is a hot drink."
✅ "What time do you wake up? I wake up at 7am."
❌ "Could you elaborate on your morning routine?"
❌ "What would you say is your favorite beverage?"
`,

    intermediate: `
## LEVEL: INTERMEDIATE (B1-B2)

### Vocabulary Rules:
- Use common + some specific vocabulary (2000-4000 words)
- Introduce occasional idioms with context
- Use synonyms to expand vocabulary
- Include topic-specific terms

### Grammar Rules:
- All verb tenses (present, past, future, present perfect)
- Conditionals (if/when clauses)
- Passive voice occasionally
- Modal verbs (should, could, might, must)

### Sentence Structure:
- Mix simple and compound sentences (10-20 words)
- Use connecting words (because, although, however, while)
- Vary sentence beginnings

### Question Style:
- Mix YES/NO and OPEN-ENDED questions
- Ask "Why" and "How" questions
- Encourage explanations: "Can you explain...?", "What do you think about...?"

### Examples:
✅ "What did you do last weekend? Did you try anything new?"
✅ "If you could visit any country, where would you go and why?"
❌ "I'd appreciate it if you could elucidate your perspective."
`,

    advanced: `
## LEVEL: ADVANCED (C1-C2)

### Vocabulary Rules:
- Use sophisticated vocabulary (5000+ words)
- Include idioms, phrasal verbs, and colloquialisms
- Use nuanced expressions and academic language
- Challenge with less common words

### Grammar Rules:
- ALL grammar structures freely
- Complex conditionals (third conditional, mixed conditionals)
- Subjunctive mood
- Reported speech and embedded questions

### Sentence Structure:
- Complex sentences (20+ words)
- Subordinate clauses
- Varied punctuation (semicolons, em dashes, etc)
- Academic/professional register

### Question Style:
- Thought-provoking questions
- Hypothetical scenarios
- Abstract concepts
- Challenge assumptions

### Examples:
✅ "How might emerging technologies reshape the landscape of education?"
✅ "Were you to redesign society from scratch, what principles would you prioritize?"
✅ "What's your take on the trade-off between convenience and privacy?"
`,
  };

  const basePrompt = `You are an experienced English teacher having a natural conversation with a ${userLevel} student${userName ? ` named ${userName}` : ''}.

**TOPIC:** ${topic}

${levelInstructions[userLevel]}

## CONVERSATION STYLE:

### Adaptation:
- If student struggles → SIMPLIFY language immediately
- If student excels → GRADUALLY increase difficulty
- Match student's energy and engagement level

### Error Correction:
- DON'T interrupt the flow of conversation
- If error is critical → gently correct: "Yes! Or you could say... [correction]"
- If error is minor → ignore it and continue
- Save detailed corrections for the feedback phase

### Engagement:
- Keep conversation NATURAL and CONVERSATIONAL
- Show genuine interest in student's responses
- Use follow-up questions to dig deeper
- Relate topics to student's life when possible

### Response Length:
- Keep responses CONCISE (under 50 words)
- ONE main idea per response
- ONE question maximum per response
- Avoid lecturing or giving long explanations

### Tone:
- Be ENCOURAGING and POSITIVE
- Celebrate small wins ("Great vocabulary!", "Nice use of past tense!")
- Be patient with mistakes
- Make student feel COMFORTABLE speaking

## CRITICAL RULES:

❌ DON'T:
- Give grammar lessons mid-conversation
- Use vocabulary above student's level
- Ask multiple questions at once
- Write long paragraphs
- Correct every single mistake
- Sound robotic or scripted

✅ DO:
- Have a genuine conversation
- Listen and respond naturally
- Adjust to student's level in real-time
- Keep it fun and engaging
- Focus on communication, not perfection

Remember: You're a conversation partner first, teacher second.`;

  return basePrompt;
}
```

### 2.2 Implementação NestJS

```typescript
// modules/groq/services/groq-llm.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { buildConversationPrompt } from '../prompts/conversation.prompt';
import { BusinessException } from '@/shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '@/shared/enums/mappeds-returns.enum';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

@Injectable()
export class GroqLlmService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Gera resposta da IA em uma conversação
   */
  async generateResponse(
    conversationHistory: Message[],
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    topic: string,
    userName?: string,
  ): Promise<string> {
    try {
      // Construir system prompt baseado no nível
      const systemPrompt = buildConversationPrompt(userLevel, topic, userName);

      // Preparar mensagens
      const messages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ];

      // Chamar Groq API
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,      // Criatividade moderada
        max_tokens: 150,       // Respostas curtas (50 palavras ~= 75 tokens)
        top_p: 1,
        frequency_penalty: 0.2, // Evitar repetição
        presence_penalty: 0.1,  // Incentivar novos tópicos
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_EMPTY_RESPONSE,
          'Groq returned empty response'
        );
      }

      return content.trim();
      
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_LLM_ERROR,
        `Groq LLM failed: ${error.message}`
      );
    }
  }

  /**
   * Gera resposta com streaming (melhor UX)
   */
  async generateResponseStream(
    conversationHistory: Message[],
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    topic: string,
    onChunk: (chunk: string) => void,
    userName?: string,
  ): Promise<string> {
    try {
      const systemPrompt = buildConversationPrompt(userLevel, topic, userName);
      
      const messages: Message[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
      ];

      const stream = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 150,
        stream: true, // Habilitar streaming
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          onChunk(content); // Callback pra enviar chunk pro frontend
        }
      }

      return fullResponse.trim();
      
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_LLM_ERROR,
        `Groq streaming failed: ${error.message}`
      );
    }
  }
}
```

---

## 3. System Prompts - Feedback

### 3.1 Prompt de Análise

```typescript
// modules/groq/prompts/feedback.prompt.ts

export function buildFeedbackPrompt(
  userTranscription: string,
  conversationContext: string,
  userLevel: 'beginner' | 'intermediate' | 'advanced',
): string {
  
  return `You are a professional English teacher analyzing a student's spoken English.

## CONTEXT:
- **Student Level:** ${userLevel.toUpperCase()}
- **Conversation Context:** ${conversationContext}
- **Student's Response:** "${userTranscription}"

## YOUR TASK:

Analyze the student's response and provide detailed feedback in JSON format.

### 1. GRAMMAR ERRORS
Identify 3-5 most important grammar mistakes (if any).
For each error:
- Show the EXACT incorrect phrase
- Provide the CORRECT version
- Explain WHY in simple terms

**Important:**
- Focus on PATTERNS, not isolated mistakes
- Ignore minor errors that don't affect communication
- Be ENCOURAGING (highlight what they did right first)

### 2. VOCABULARY ASSESSMENT

**Score (0-100):** Rate vocabulary richness and appropriateness for their level.

**Highlights:** Identify 2-3 impressive words/phrases they used correctly.

**Suggestions:** Suggest 2-3 alternative words to expand vocabulary.

**Scoring guide:**
- Beginner: 70+ if using 500+ word vocabulary correctly
- Intermediate: 70+ if using varied vocabulary with some advanced terms
- Advanced: 70+ if using sophisticated, nuanced vocabulary

### 3. FLUENCY SCORE (0-100)

Rate natural flow based on:
- Sentence connectivity (use of "because", "however", "although", etc)
- Sentence variety (not repeating same structure)
- Natural rhythm (not too choppy or run-on)

**Scoring guide:**
- 90-100: Native-like fluency
- 70-89: Good flow with minor issues
- 50-69: Understandable but choppy
- Below 50: Struggles to connect ideas

### 4. PRONUNCIATION ISSUES

Based on the transcription, identify likely pronunciation problems:
- Mispronounced words (if transcription looks weird)
- Missing sounds (th → t, r → w, etc)
- Word stress issues

Provide ACTIONABLE tips to improve.

### 5. OVERALL SCORE (0-100)

Weighted average:
- Grammar: 30%
- Vocabulary: 25%
- Fluency: 25%
- Pronunciation: 20%

### 6. SUGGESTIONS (3-5 items)

Provide SPECIFIC, ACTIONABLE suggestions:
✅ "Try using 'because' to connect your ideas instead of just saying 'and'"
✅ "Practice the 'th' sound: place your tongue between your teeth"
❌ "Improve your grammar" (too vague)
❌ "Study more vocabulary" (too vague)

### 7. STRENGTHS (2-3 items)

Highlight what the student did WELL:
- Good vocabulary choices
- Correct grammar usage
- Natural expressions
- Confidence in speaking

### 8. FOCUS AREAS (2-3 items)

What should they practice MOST:
- Specific grammar points
- Pronunciation sounds
- Vocabulary categories

## OUTPUT FORMAT (STRICT JSON):

\`\`\`json
{
  "grammarErrors": [
    {
      "error": "I go to school yesterday",
      "correction": "I went to school yesterday",
      "explanation": "Use past tense 'went' for actions that happened in the past"
    }
  ],
  "vocabularyScore": 75,
  "vocabularyHighlights": [
    {
      "word": "sophisticated",
      "context": "You used 'sophisticated' correctly!",
      "alternative": "You could also say 'refined' or 'polished'"
    }
  ],
  "fluencyScore": 82,
  "fluencyNotes": "Good use of connecting words like 'however' and 'additionally'",
  "pronunciationIssues": [
    {
      "word": "thought",
      "issue": "Transcribed as 'tot' - likely missing 'th' sound",
      "tip": "Place tongue between teeth for 'th', then pull back quickly"
    }
  ],
  "overallScore": 78,
  "suggestions": [
    "Try using past perfect tense: 'I had already eaten when she arrived'",
    "Practice linking sounds: 'can I' sounds like 'canai' in natural speech",
    "Use more time expressions: 'afterwards', 'meanwhile', 'eventually'"
  ],
  "strengths": [
    "Natural conversation flow - you sound confident!",
    "Good variety in sentence structure",
    "Excellent pronunciation of difficult words like 'environment'"
  ],
  "focusAreas": [
    "Past tense verb forms (especially irregular verbs)",
    "Article usage (a/an/the)",
    "Th-sound pronunciation"
  ]
}
\`\`\`

## CRITICAL RULES:

1. **Be ENCOURAGING** - Always highlight strengths BEFORE weaknesses
2. **Be SPECIFIC** - Vague advice like "study more" is useless
3. **Adjust expectations** - A beginner making mistakes is NORMAL
4. **Keep it ACTIONABLE** - Every suggestion should be something they can DO
5. **Output ONLY valid JSON** - No markdown, no explanations outside JSON
6. **Be HONEST but KIND** - Don't inflate scores, but frame feedback positively

Remember: Your goal is to MOTIVATE the student to keep practicing, not discourage them.`;
}
```

### 3.2 Implementação NestJS

```typescript
// modules/groq/services/groq-feedback.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { buildFeedbackPrompt } from '../prompts/feedback.prompt';
import { BusinessException } from '@/shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '@/shared/enums/mappeds-returns.enum';

export interface FeedbackDto {
  grammarErrors: Array<{
    error: string;
    correction: string;
    explanation: string;
  }>;
  vocabularyScore: number;
  vocabularyHighlights: Array<{
    word: string;
    context: string;
    alternative: string;
  }>;
  fluencyScore: number;
  fluencyNotes: string;
  pronunciationIssues: Array<{
    word: string;
    issue: string;
    tip: string;
  }>;
  overallScore: number;
  suggestions: string[];
  strengths: string[];
  focusAreas: string[];
}

@Injectable()
export class GroqFeedbackService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Analisa a resposta falada do usuário
   */
  async analyzeSpeaking(
    userTranscription: string,
    conversationContext: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<FeedbackDto> {
    try {
      const prompt = buildFeedbackPrompt(
        userTranscription,
        conversationContext,
        userLevel
      );

      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a professional English teacher specializing in spoken English analysis.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3, // Baixa temperatura = mais consistente
        max_tokens: 2000,
        response_format: { type: 'json_object' }, // Força retorno JSON
      });

      const content = response.choices[0]?.message?.content;

      if (!content) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_EMPTY_RESPONSE,
          'Groq returned empty feedback'
        );
      }

      // Parse e validação
      const feedback = JSON.parse(content) as FeedbackDto;
      this.validateFeedback(feedback);

      return feedback;
      
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      
      // Se erro de JSON parse
      if (error instanceof SyntaxError) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_INVALID_JSON,
          'Groq returned invalid JSON format'
        );
      }

      throw new BusinessException(
        MappedsReturnsEnum.GROQ_FEEDBACK_ERROR,
        `Groq feedback analysis failed: ${error.message}`
      );
    }
  }

  /**
   * Valida estrutura do feedback
   */
  private validateFeedback(feedback: FeedbackDto): void {
    const required = [
      'grammarErrors',
      'vocabularyScore',
      'fluencyScore',
      'overallScore',
      'suggestions',
      'strengths',
      'focusAreas',
    ];

    for (const field of required) {
      if (!(field in feedback)) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_INVALID_JSON,
          `Missing required field: ${field}`
        );
      }
    }

    // Validar scores (0-100)
    const scores = ['vocabularyScore', 'fluencyScore', 'overallScore'];
    for (const score of scores) {
      const value = feedback[score];
      if (typeof value !== 'number' || value < 0 || value > 100) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_INVALID_JSON,
          `Invalid score for ${score}: must be 0-100`
        );
      }
    }
  }
}
```

---

## 4. RAG Implementation

### 4.1 Setup Upstash Vector

```typescript
// modules/rag/services/rag.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import { Index } from '@upstash/vector';
import Groq from 'groq-sdk';
import { BusinessException } from '@/shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '@/shared/enums/mappeds-returns.enum';

export interface SimilarExample {
  id: string;
  text: string;
  score: number;
  level: string;
  topic: string;
}

@Injectable()
export class RagService implements OnModuleInit {
  private index: Index;
  private groq: Groq;

  constructor() {
    this.index = new Index({
      url: process.env.UPSTASH_VECTOR_URL,
      token: process.env.UPSTASH_VECTOR_TOKEN,
    });

    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async onModuleInit() {
    // Seed inicial de exemplos (executar só uma vez)
    const shouldSeed = process.env.RAG_SEED === 'true';
    if (shouldSeed) {
      await this.seedExamples();
    }
  }

  /**
   * Adiciona exemplo ao vector database
   */
  async addExample(
    id: string,
    text: string,
    metadata: {
      level: 'beginner' | 'intermediate' | 'advanced';
      topic: string;
      score: number;
    }
  ): Promise<void> {
    try {
      // Gerar embedding
      const embedding = await this.generateEmbedding(text);

      // Adicionar ao Upstash
      await this.index.upsert({
        id,
        vector: embedding,
        metadata: {
          text,
          ...metadata,
        },
      });
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.RAG_ADD_ERROR,
        `Failed to add example to RAG: ${error.message}`
      );
    }
  }

  /**
   * Busca exemplos similares
   */
  async findSimilarExamples(
    query: string,
    userLevel: string,
    topK = 3
  ): Promise<SimilarExample[]> {
    try {
      // Gerar embedding da query
      const embedding = await this.generateEmbedding(query);

      // Buscar similares
      const results = await this.index.query({
        vector: embedding,
        topK,
        filter: `level = "${userLevel}"`, // Filtrar por nível
        includeMetadata: true,
      });

      return results.map(r => ({
        id: r.id,
        text: r.metadata.text as string,
        score: r.score,
        level: r.metadata.level as string,
        topic: r.metadata.topic as string,
      }));
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.RAG_QUERY_ERROR,
        `Failed to query RAG: ${error.message}`
      );
    }
  }

  /**
   * Gera embedding usando Groq
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Embedding API failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.RAG_EMBEDDING_ERROR,
        `Failed to generate embedding: ${error.message}`
      );
    }
  }

  /**
   * Seed inicial com 50 exemplos
   */
  private async seedExamples(): Promise<void> {
    console.log('🌱 Seeding RAG database...');

    const examples = [
      // Ver seção 12 para lista completa
    ];

    for (const example of examples) {
      await this.addExample(example.id, example.text, example.metadata);
    }

    console.log(`✅ Seeded ${examples.length} examples`);
  }
}
```

### 4.2 Integração RAG + LLM

```typescript
// modules/groq/services/groq-llm.service.ts (ATUALIZADO)

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { RagService } from '@/modules/rag/services/rag.service';
import { buildConversationPrompt } from '../prompts/conversation.prompt';

@Injectable()
export class GroqLlmService {
  private groq: Groq;

  constructor(private ragService: RagService) {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Gera resposta COM contexto do RAG
   */
  async generateResponseWithRAG(
    conversationHistory: Message[],
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    topic: string,
    userName?: string,
  ): Promise<string> {
    try {
      // 1. Pegar última mensagem do user
      const lastUserMessage = conversationHistory[conversationHistory.length - 1];

      // 2. Buscar 3 exemplos similares no RAG
      const similarExamples = await this.ragService.findSimilarExamples(
        lastUserMessage.content,
        userLevel,
        3
      );

      // 3. Construir system prompt COM exemplos
      const basePrompt = buildConversationPrompt(userLevel, topic, userName);
      const systemPromptWithRAG = this.enhancePromptWithExamples(
        basePrompt,
        similarExamples
      );

      // 4. Preparar mensagens
      const messages: Message[] = [
        { role: 'system', content: systemPromptWithRAG },
        ...conversationHistory,
      ];

      // 5. Gerar resposta
      const response = await this.groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      const content = response.choices[0]?.message?.content;
      return content?.trim() || '';
      
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_LLM_ERROR,
        `Groq LLM with RAG failed: ${error.message}`
      );
    }
  }

  /**
   * Adiciona exemplos do RAG ao system prompt
   */
  private enhancePromptWithExamples(
    basePrompt: string,
    examples: SimilarExample[]
  ): string {
    if (examples.length === 0) return basePrompt;

    const examplesText = examples
      .map((ex, i) => `\n**Example ${i + 1}:**\n${ex.text}\n`)
      .join('\n');

    return `${basePrompt}

## LEARN FROM SIMILAR CONVERSATIONS:

Here are ${examples.length} similar conversation(s) from past lessons at this level. Use these to guide your teaching style and response complexity:
${examplesText}

These examples show you how to:
- Adjust language complexity
- Structure natural questions
- Provide appropriate feedback
- Keep the conversation engaging

Now respond to the student using a similar approach.`;
  }
}
```

---

## 5. Níveis de Proficiência

```typescript
// shared/constants/proficiency-levels.constant.ts

export const PROFICIENCY_LEVELS = {
  beginner: {
    cefr: 'A1-A2',
    description: 'Can understand and use familiar everyday expressions',
    vocab: {
      range: '500-1000 words',
      types: ['High-frequency words', 'Basic nouns/verbs', 'Common adjectives'],
    },
    grammar: {
      tenses: ['Present simple', 'Present continuous', 'Simple past'],
      structures: ['Subject + Verb + Object', 'Yes/No questions', 'Basic negatives'],
    },
    topics: [
      'Daily routine',
      'Food and drinks',
      'Family and friends',
      'Hobbies',
      'Weather',
      'Numbers and time',
    ],
    sentenceLength: '5-10 words',
    expectations: {
      speaking: 'Simple phrases, many errors are acceptable',
      listening: 'Can understand slow, clear speech',
      reading: 'Can understand basic texts with familiar words',
    },
    xpRange: { min: 0, max: 500 },
  },

  intermediate: {
    cefr: 'B1-B2',
    description: 'Can understand main points and produce connected text',
    vocab: {
      range: '2000-4000 words',
      types: ['Common vocabulary', 'Topic-specific terms', 'Some idioms'],
    },
    grammar: {
      tenses: [
        'All basic tenses',
        'Present perfect',
        'Past continuous',
        'Future (will/going to)',
      ],
      structures: [
        'Conditionals (first, second)',
        'Passive voice',
        'Modal verbs',
        'Relative clauses',
      ],
    },
    topics: [
      'Work and career',
      'Travel experiences',
      'Technology',
      'Health and fitness',
      'Entertainment',
      'Shopping',
    ],
    sentenceLength: '10-20 words',
    expectations: {
      speaking: 'Can maintain conversation with occasional errors',
      listening: 'Can understand standard speech on familiar topics',
      reading: 'Can understand texts on concrete/abstract topics',
    },
    xpRange: { min: 500, max: 3500 },
  },

  advanced: {
    cefr: 'C1-C2',
    description: 'Can express fluently and spontaneously with precision',
    vocab: {
      range: '5000+ words',
      types: [
        'Sophisticated vocabulary',
        'Idiomatic expressions',
        'Academic/professional terms',
        'Nuanced expressions',
      ],
    },
    grammar: {
      tenses: ['All tenses including complex forms'],
      structures: [
        'All conditionals (including mixed)',
        'Subjunctive mood',
        'Reported speech',
        'Complex embedded questions',
        'Inversion',
      ],
    },
    topics: [
      'Abstract ideas',
      'Politics and society',
      'Philosophy',
      'Business strategy',
      'Arts and culture',
      'Scientific concepts',
    ],
    sentenceLength: '20+ words',
    expectations: {
      speaking: 'Fluent, accurate, natural speech with minimal errors',
      listening: 'Can understand any spoken language with ease',
      reading: 'Can understand complex literary/technical texts',
    },
    xpRange: { min: 3500, max: Infinity },
  },
} as const;

export type ProficiencyLevel = keyof typeof PROFICIENCY_LEVELS;

/**
 * Determina nível baseado em XP
 */
export function getLevelByXP(xp: number): ProficiencyLevel {
  if (xp < 500) return 'beginner';
  if (xp < 3500) return 'intermediate';
  return 'advanced';
}

/**
 * Calcula progresso dentro do nível atual (0-100%)
 */
export function getLevelProgress(xp: number): number {
  const level = getLevelByXP(xp);
  const { min, max } = PROFICIENCY_LEVELS[level].xpRange;
  
  if (max === Infinity) return 100;
  
  return Math.round(((xp - min) / (max - min)) * 100);
}
```

---

## 6. Tópicos de Conversação

```typescript
// shared/constants/conversation-topics.constant.ts

export const CONVERSATION_TOPICS = {
  beginner: [
    {
      id: 'daily-routine',
      name: 'Daily Routine',
      icon: '🌅',
      description: 'Talk about your typical day',
      keywords: ['morning', 'breakfast', 'work', 'evening', 'sleep'],
      starterQuestions: [
        'What time do you wake up?',
        'What do you eat for breakfast?',
        'How do you go to work?',
      ],
    },
    {
      id: 'food-drinks',
      name: 'Food & Drinks',
      icon: '🍕',
      description: 'Discuss your favorite meals and recipes',
      keywords: ['food', 'restaurant', 'cook', 'delicious', 'hungry'],
      starterQuestions: [
        'What is your favorite food?',
        'Do you like to cook?',
        'What did you eat yesterday?',
      ],
    },
    {
      id: 'family-friends',
      name: 'Family & Friends',
      icon: '👨‍👩‍👧',
      description: 'Talk about people in your life',
      keywords: ['family', 'mother', 'father', 'friend', 'sister', 'brother'],
      starterQuestions: [
        'How many people are in your family?',
        'Do you have brothers or sisters?',
        'Who is your best friend?',
      ],
    },
    {
      id: 'hobbies',
      name: 'Hobbies',
      icon: '🎸',
      description: 'Discuss what you like to do in free time',
      keywords: ['hobby', 'music', 'sport', 'reading', 'games'],
      starterQuestions: [
        'What do you like to do in your free time?',
        'Do you play any sports?',
        'What kind of music do you like?',
      ],
    },
  ],

  intermediate: [
    {
      id: 'travel-experiences',
      name: 'Travel Experiences',
      icon: '✈️',
      description: 'Share stories about places you have visited',
      keywords: ['travel', 'vacation', 'country', 'culture', 'adventure'],
      starterQuestions: [
        'What is the most interesting place you have visited?',
        'Where would you like to travel next?',
        'Do you prefer beach or mountain vacations?',
      ],
    },
    {
      id: 'work-career',
      name: 'Work & Career',
      icon: '💼',
      description: 'Discuss your professional life and goals',
      keywords: ['job', 'career', 'company', 'colleague', 'meeting'],
      starterQuestions: [
        'What do you do for a living?',
        'What do you like most about your job?',
        'Where do you see yourself in 5 years?',
      ],
    },
    {
      id: 'technology',
      name: 'Technology',
      icon: '💻',
      description: 'Talk about gadgets, apps, and tech trends',
      keywords: ['phone', 'computer', 'app', 'internet', 'software'],
      starterQuestions: [
        'What apps do you use every day?',
        'How has technology changed your life?',
        'What new technology are you interested in?',
      ],
    },
    {
      id: 'health-fitness',
      name: 'Health & Fitness',
      icon: '🏃',
      description: 'Discuss staying healthy and active',
      keywords: ['exercise', 'healthy', 'diet', 'gym', 'wellness'],
      starterQuestions: [
        'How do you stay healthy?',
        'Do you follow any diet or exercise routine?',
        'What is your biggest health challenge?',
      ],
    },
  ],

  advanced: [
    {
      id: 'business-strategy',
      name: 'Business Strategy',
      icon: '📊',
      description: 'Analyze corporate challenges and solutions',
      keywords: ['revenue', 'market', 'competition', 'growth', 'innovation'],
      starterQuestions: [
        'What are the biggest challenges facing businesses today?',
        'How should companies adapt to digital transformation?',
        'What role does corporate culture play in success?',
      ],
    },
    {
      id: 'current-events',
      name: 'Current Events',
      icon: '🗳️',
      description: 'Discuss news, politics, and social issues',
      keywords: ['politics', 'government', 'society', 'policy', 'election'],
      starterQuestions: [
        'What current events are you following closely?',
        'How do you think society should address inequality?',
        'What is your perspective on climate policy?',
      ],
    },
    {
      id: 'philosophy-ethics',
      name: 'Philosophy & Ethics',
      icon: '🧠',
      description: 'Explore abstract concepts and moral questions',
      keywords: ['ethics', 'morality', 'consciousness', 'meaning', 'existence'],
      starterQuestions: [
        'What gives life meaning?',
        'How do you define success and happiness?',
        'What ethical dilemmas concern you most?',
      ],
    },
    {
      id: 'arts-culture',
      name: 'Arts & Culture',
      icon: '🎭',
      description: 'Discuss music, films, literature, and art',
      keywords: ['art', 'film', 'literature', 'music', 'culture', 'creativity'],
      starterQuestions: [
        'How has art influenced your worldview?',
        'What cultural movements interest you?',
        'How does culture shape identity?',
      ],
    },
  ],
} as const;

export type TopicCategory = keyof typeof CONVERSATION_TOPICS;

/**
 * Busca tópico por ID
 */
export function getTopicById(id: string): ConversationTopic | undefined {
  for (const level of Object.values(CONVERSATION_TOPICS)) {
    const topic = level.find(t => t.id === id);
    if (topic) return topic;
  }
  return undefined;
}

/**
 * Lista tópicos disponíveis para um nível
 */
export function getTopicsByLevel(level: ProficiencyLevel) {
  return CONVERSATION_TOPICS[level];
}

interface ConversationTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  keywords: string[];
  starterQuestions: string[];
}
```

---

## 7. Audio Processing (STT)

### 7.1 Transcrição com Whisper

```typescript
// modules/groq/services/groq-stt.service.ts

import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { createReadStream } from 'fs';
import { BusinessException } from '@/shared/exceptions/business.exception';
import { MappedsReturnsEnum } from '@/shared/enums/mappeds-returns.enum';

@Injectable()
export class GroqSttService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Transcreve áudio usando Whisper Large V3
   */
  async transcribeAudio(audioPath: string): Promise<string> {
    try {
      const transcription = await this.groq.audio.transcriptions.create({
        file: createReadStream(audioPath),
        model: 'whisper-large-v3',
        language: 'en', // Sempre inglês
        response_format: 'json',
        temperature: 0.0, // Mais preciso
      });

      if (!transcription.text) {
        throw new BusinessException(
          MappedsReturnsEnum.GROQ_EMPTY_TRANSCRIPTION,
          'Whisper returned empty transcription'
        );
      }

      return transcription.text.trim();
      
    } catch (error) {
      if (error instanceof BusinessException) throw error;
      
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_STT_ERROR,
        `Groq STT failed: ${error.message}`
      );
    }
  }

  /**
   * Transcreve com timestamps (útil pra análise de pausas)
   */
  async transcribeWithTimestamps(audioPath: string) {
    try {
      const transcription = await this.groq.audio.transcriptions.create({
        file: createReadStream(audioPath),
        model: 'whisper-large-v3',
        language: 'en',
        response_format: 'verbose_json',
        temperature: 0.0,
        timestamp_granularities: ['word'],
      });

      return {
        text: transcription.text,
        duration: transcription.duration,
        words: transcription.words, // Array com timestamps por palavra
      };
      
    } catch (error) {
      throw new BusinessException(
        MappedsReturnsEnum.GROQ_STT_ERROR,
        `Groq STT with timestamps failed: ${error.message}`
      );
    }
  }
}
```

### 7.2 Otimização de Áudio

```typescript
// shared/utils/audio-compression.util.ts

import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import { unlink } from 'fs/promises';

export class AudioCompression {
  /**
   * Comprime áudio antes de enviar pro Groq
   * Reduz tamanho em ~94% (2MB → 120KB pra 1min)
   */
  static async compress(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec('libopus')          // Melhor compressão
        .audioBitrate('16k')            // Suficiente pra voz
        .audioFrequency(16000)          // Whisper aceita 16kHz
        .audioChannels(1)               // Mono
        .toFormat('webm')               // Container leve
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .save(outputPath);
    });
  }

  /**
   * Calcula duração do áudio
   */
  static async getDuration(audioPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(audioPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 0);
      });
    });
  }

  /**
   * Valida formato e duração
   */
  static async validate(audioPath: string): Promise<{
    valid: boolean;
    duration: number;
    format: string;
    error?: string;
  }> {
    try {
      const duration = await this.getDuration(audioPath);
      
      // Máximo 5 minutos
      if (duration > 300) {
        return {
          valid: false,
          duration,
          format: 'unknown',
          error: 'Audio too long (max 5 minutes)',
        };
      }

      // Mínimo 1 segundo
      if (duration < 1) {
        return {
          valid: false,
          duration,
          format: 'unknown',
          error: 'Audio too short (min 1 second)',
        };
      }

      return { valid: true, duration, format: 'valid' };
      
    } catch (error) {
      return {
        valid: false,
        duration: 0,
        format: 'unknown',
        error: error.message,
      };
    }
  }
}
```

---

## 8. Scoring System (XP)

```typescript
// modules/gamification/services/xp-calculator.service.ts

import { Injectable } from '@nestjs/common';
import { FeedbackDto } from '@/modules/groq/services/groq-feedback.service';

@Injectable()
export class XpCalculatorService {
  /**
   * Calcula XP baseado no feedback e duração
   */
  calculateXP(
    feedback: FeedbackDto,
    duration: number, // segundos
    userStreak: number,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
  ): number {
    // Base XP: média dos scores
    const baseXP = (
      feedback.overallScore +
      feedback.vocabularyScore +
      feedback.fluencyScore
    ) / 3;

    // Bonus por duração (max 2min = 20% bonus)
    const maxDuration = 120; // 2 minutos
    const durationBonus = Math.min((duration / maxDuration) * 0.2, 0.2);

    // Bonus por streak (max 30 dias = 30% bonus)
    const streakBonus = Math.min(userStreak * 0.01, 0.3);

    // Multiplicador por nível
    const levelMultiplier = {
      beginner: 1.0,
      intermediate: 1.2,
      advanced: 1.5,
    };

    // XP final
    const xp = baseXP * (1 + durationBonus + streakBonus) * levelMultiplier[userLevel];

    return Math.round(xp);
  }

  /**
   * Determina level baseado em XP total
   */
  getLevel(totalXP: number): {
    level: number;
    title: string;
    currentXP: number;
    nextLevelXP: number;
    progress: number;
  } {
    const levels = [
      { level: 1, min: 0, max: 100, title: 'Beginner I' },
      { level: 2, min: 100, max: 250, title: 'Beginner II' },
      { level: 3, min: 250, max: 500, title: 'Beginner III' },
      { level: 4, min: 500, max: 1000, title: 'Intermediate I' },
      { level: 5, min: 1000, max: 2000, title: 'Intermediate II' },
      { level: 6, min: 2000, max: 3500, title: 'Intermediate III' },
      { level: 7, min: 3500, max: 5500, title: 'Advanced I' },
      { level: 8, min: 5500, max: 8000, title: 'Advanced II' },
      { level: 9, min: 8000, max: 12000, title: 'Advanced III' },
      { level: 10, min: 12000, max: Infinity, title: 'Fluent' },
    ];

    const currentLevel = levels.find(l => totalXP >= l.min && totalXP < l.max) || levels[levels.length - 1];

    const progress = currentLevel.max === Infinity
      ? 100
      : Math.round(((totalXP - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100);

    return {
      level: currentLevel.level,
      title: currentLevel.title,
      currentXP: totalXP,
      nextLevelXP: currentLevel.max === Infinity ? totalXP : currentLevel.max,
      progress,
    };
  }

  /**
   * Calcula e atualiza streak
   */
  calculateStreak(lastActivityDate: Date | null, currentDate: Date = new Date()): {
    streak: number;
    isActive: boolean;
    lostStreak: boolean;
  } {
    if (!lastActivityDate) {
      return { streak: 1, isActive: true, lostStreak: false };
    }

    const hoursSinceLastActivity = (currentDate.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60);

    // Se < 24h = ainda dentro do dia
    if (hoursSinceLastActivity < 24) {
      return { streak: 1, isActive: true, lostStreak: false }; // Mesma sessão
    }

    // Se < 48h = mantém streak
    if (hoursSinceLastActivity < 48) {
      return { streak: 1, isActive: true, lostStreak: false }; // Novo dia, streak continua
    }

    // Se > 48h = perdeu streak
    return { streak: 1, isActive: true, lostStreak: true }; // Resetou
  }
}
```

---

## 9. Error Handling

```typescript
// shared/enums/mappeds-returns.enum.ts

export enum MappedsReturnsEnum {
  // Groq STT Errors
  GROQ_STT_ERROR = 'GROQ_STT_ERROR',
  GROQ_EMPTY_TRANSCRIPTION = 'GROQ_EMPTY_TRANSCRIPTION',
  
  // Groq LLM Errors
  GROQ_LLM_ERROR = 'GROQ_LLM_ERROR',
  GROQ_EMPTY_RESPONSE = 'GROQ_EMPTY_RESPONSE',
  GROQ_RATE_LIMIT = 'GROQ_RATE_LIMIT',
  GROQ_AUTH_ERROR = 'GROQ_AUTH_ERROR',
  
  // Groq Feedback Errors
  GROQ_FEEDBACK_ERROR = 'GROQ_FEEDBACK_ERROR',
  GROQ_INVALID_JSON = 'GROQ_INVALID_JSON',
  
  // RAG Errors
  RAG_ADD_ERROR = 'RAG_ADD_ERROR',
  RAG_QUERY_ERROR = 'RAG_QUERY_ERROR',
  RAG_EMBEDDING_ERROR = 'RAG_EMBEDDING_ERROR',
  
  // Audio Errors
  AUDIO_COMPRESSION_ERROR = 'AUDIO_COMPRESSION_ERROR',
  AUDIO_INVALID_FORMAT = 'AUDIO_INVALID_FORMAT',
  AUDIO_TOO_LONG = 'AUDIO_TOO_LONG',
  AUDIO_TOO_SHORT = 'AUDIO_TOO_SHORT',
}

// shared/filters/groq-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { MappedsReturnsEnum } from '../enums/mappeds-returns.enum';

@Catch(BusinessException)
export class GroqExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorMap = {
      // Rate Limit
      [MappedsReturnsEnum.GROQ_RATE_LIMIT]: {
        status: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Too many requests. Please wait 1 minute.',
        retryAfter: 60,
      },
      
      // Auth
      [MappedsReturnsEnum.GROQ_AUTH_ERROR]: {
        status: HttpStatus.UNAUTHORIZED,
        message: 'Groq authentication failed',
      },
      
      // STT
      [MappedsReturnsEnum.GROQ_STT_ERROR]: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Failed to transcribe audio',
      },
      
      // LLM
      [MappedsReturnsEnum.GROQ_LLM_ERROR]: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to generate AI response',
      },
      
      // Feedback
      [MappedsReturnsEnum.GROQ_FEEDBACK_ERROR]: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to analyze response',
      },
      
      [MappedsReturnsEnum.GROQ_INVALID_JSON]: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'AI returned invalid format',
      },
      
      // RAG
      [MappedsReturnsEnum.RAG_QUERY_ERROR]: {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to search similar examples',
      },
      
      // Audio
      [MappedsReturnsEnum.AUDIO_TOO_LONG]: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Audio too long (max 5 minutes)',
      },
      
      [MappedsReturnsEnum.AUDIO_TOO_SHORT]: {
        status: HttpStatus.BAD_REQUEST,
        message: 'Audio too short (min 1 second)',
      },
    };

    const error = errorMap[exception.getCode()] || {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: exception.message,
    };

    response.status(error.status).json({
      statusCode: error.status,
      code: exception.getCode(),
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 10. Otimizações

### 10.1 Caching (Redis)

```typescript
// modules/groq/services/groq-llm.service.ts (COM CACHE)

import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class GroqLlmService {
  private groq: Groq;
  private redis: Redis;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    this.redis = new Redis(process.env.REDIS_URL);
  }

  /**
   * Gera resposta COM cache
   */
  async generateResponseCached(
    conversationHistory: Message[],
    userLevel: string,
    topic: string,
  ): Promise<string> {
    // Gerar cache key baseado em hash da conversa
    const cacheKey = this.generateCacheKey(conversationHistory, userLevel, topic);
    
    // Tentar buscar do cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      console.log('🎯 Cache HIT');
      return cached;
    }

    console.log('❌ Cache MISS - chamando Groq');
    
    // Chamar Groq
    const response = await this.generateResponse(conversationHistory, userLevel, topic);
    
    // Salvar no cache (TTL: 1 hora)
    await this.redis.setex(cacheKey, 3600, response);
    
    return response;
  }

  /**
   * Gera chave de cache consistente
   */
  private generateCacheKey(
    conversationHistory: Message[],
    userLevel: string,
    topic: string,
  ): string {
    const hash = crypto.createHash('md5')
      .update(JSON.stringify({ conversationHistory, userLevel, topic }))
      .digest('hex');
    
    return `groq:llm:${hash}`;
  }
}
```

### 10.2 Batch Processing

```typescript
// modules/groq/services/groq-batch.service.ts

import { Injectable } from '@nestjs/common';
import { GroqSttService } from './groq-stt.service';
import { GroqFeedbackService } from './groq-feedback.service';

@Injectable()
export class GroqBatchService {
  constructor(
    private sttService: GroqSttService,
    private feedbackService: GroqFeedbackService,
  ) {}

  /**
   * Processar múltiplas requisições em paralelo
   */
  async processConversationBatch(
    audioPath: string,
    previousTranscription: string,
    conversationContext: string,
    userLevel: string,
  ): Promise<{
    transcription: string;
    feedback: FeedbackDto;
  }> {
    // Executar em paralelo
    const [transcription, feedback] = await Promise.all([
      this.sttService.transcribeAudio(audioPath),
      this.feedbackService.analyzeSpeaking(
        previousTranscription,
        conversationContext,
        userLevel
      ),
    ]);

    return { transcription, feedback };
  }
}
```

### 10.3 Streaming (WebSocket)

```typescript
// modules/groq/gateways/groq-stream.gateway.ts

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GroqLlmService } from '../services/groq-llm.service';

@WebSocketGateway({ cors: true, namespace: '/groq-stream' })
export class GroqStreamGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private groqLlmService: GroqLlmService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('generate-response')
  async handleGenerateResponse(
    client: Socket,
    payload: {
      conversationHistory: Message[];
      userLevel: string;
      topic: string;
    },
  ): Promise<void> {
    try {
      await this.groqLlmService.generateResponseStream(
        payload.conversationHistory,
        payload.userLevel as any,
        payload.topic,
        (chunk) => {
          // Enviar cada chunk pro cliente
          client.emit('response-chunk', { chunk });
        }
      );

      // Sinalizar fim
      client.emit('response-complete');
      
    } catch (error) {
      client.emit('response-error', { error: error.message });
    }
  }
}
```

---

## 11. Estrutura de Código

```bash
src/
├── modules/
│   ├── groq/
│   │   ├── dto/
│   │   │   ├── transcription.dto.ts
│   │   │   ├── conversation.dto.ts
│   │   │   └── feedback.dto.ts
│   │   ├── prompts/
│   │   │   ├── conversation.prompt.ts   # System prompts conversação
│   │   │   └── feedback.prompt.ts       # System prompts feedback
│   │   ├── services/
│   │   │   ├── groq-stt.service.ts      # Speech-to-Text
│   │   │   ├── groq-llm.service.ts      # Conversação (LLM)
│   │   │   ├── groq-feedback.service.ts # Análise de feedback
│   │   │   └── groq-batch.service.ts    # Batch processing
│   │   ├── gateways/
│   │   │   └── groq-stream.gateway.ts   # WebSocket streaming
│   │   ├── groq.module.ts
│   │   └── groq.controller.ts
│   │
│   ├── rag/
│   │   ├── services/
│   │   │   └── rag.service.ts           # Upstash Vector + Embeddings
│   │   ├── seeds/
│   │   │   └── conversation-examples.seed.ts  # Seeds iniciais
│   │   └── rag.module.ts
│   │
│   ├── gamification/
│   │   ├── services/
│   │   │   ├── xp-calculator.service.ts
│   │   │   └── streak.service.ts
│   │   └── gamification.module.ts
│   │
│   └── conversations/
│       ├── entities/
│       │   ├── conversation.entity.ts
│       │   └── message.entity.ts
│       ├── services/
│       │   └── conversation.service.ts
│       ├── conversations.module.ts
│       └── conversations.controller.ts
│
├── shared/
│   ├── constants/
│   │   ├── proficiency-levels.constant.ts
│   │   └── conversation-topics.constant.ts
│   ├── enums/
│   │   └── mappeds-returns.enum.ts
│   ├── exceptions/
│   │   └── business.exception.ts
│   ├── filters/
│   │   └── groq-exception.filter.ts
│   └── utils/
│       └── audio-compression.util.ts
│
└── main.ts
```

---

## 12. Seeds & Exemplos

### 12.1 RAG Seeds (50 exemplos)

```typescript
// modules/rag/seeds/conversation-examples.seed.ts

export const CONVERSATION_EXAMPLES = [
  // ========== BEGINNER - Daily Life ==========
  {
    id: 'beg-daily-001',
    text: `User: I wake up at 7am. I eat breakfast. I go to work at 8am.
Teacher: That's a good routine! What do you eat for breakfast?`,
    metadata: { level: 'beginner', topic: 'Daily Life', score: 75 },
  },
  
  {
    id: 'beg-daily-002',
    text: `User: In the evening, I watch TV. I like to watch movies.
Teacher: Nice! What kind of movies do you like?`,
    metadata: { level: 'beginner', topic: 'Daily Life', score: 72 },
  },

  {
    id: 'beg-daily-003',
    text: `User: I go to sleep at 10pm. I sleep for 8 hours.
Teacher: That's healthy! Do you sleep well?`,
    metadata: { level: 'beginner', topic: 'Daily Life', score: 78 },
  },

  // ========== BEGINNER - Food ==========
  {
    id: 'beg-food-001',
    text: `User: I like pizza. Pizza is my favorite food.
Teacher: Pizza is delicious! Do you like cheese on your pizza?`,
    metadata: { level: 'beginner', topic: 'Food & Drinks', score: 70 },
  },

  {
    id: 'beg-food-002',
    text: `User: I don't like vegetables. I like meat and rice.
Teacher: Many people like meat! But vegetables are good for you. Do you eat any vegetables?`,
    metadata: { level: 'beginner', topic: 'Food & Drinks', score: 73 },
  },

  // ========== INTERMEDIATE - Travel ==========
  {
    id: 'int-travel-001',
    text: `User: Last summer I visited Paris. It was amazing. I saw the Eiffel Tower and ate delicious croissants.
Teacher: That sounds wonderful! What was the most memorable part of your trip?`,
    metadata: { level: 'intermediate', topic: 'Travel Experiences', score: 82 },
  },

  {
    id: 'int-travel-002',
    text: `User: I've always wanted to travel to Japan. The culture seems fascinating, and I'd love to try authentic sushi.
Teacher: Japan is incredible! Have you started planning when you might go?`,
    metadata: { level: 'intermediate', topic: 'Travel Experiences', score: 85 },
  },

  {
    id: 'int-travel-003',
    text: `User: When I traveled to Italy, I got lost in Venice. However, it turned out to be a great experience because I discovered hidden cafes.
Teacher: What a great attitude! Sometimes the best experiences happen when things don't go as planned. Did you learn any Italian while you were there?`,
    metadata: { level: 'intermediate', topic: 'Travel Experiences', score: 88 },
  },

  // ========== INTERMEDIATE - Work ==========
  {
    id: 'int-work-001',
    text: `User: I work as a software developer. My job can be challenging, but I enjoy solving complex problems.
Teacher: That sounds rewarding! What kind of projects are you working on currently?`,
    metadata: { level: 'intermediate', topic: 'Work & Career', score: 83 },
  },

  {
    id: 'int-work-002',
    text: `User: I've been thinking about changing careers. Although I studied engineering, I'm more interested in marketing now.
Teacher: That's a big decision! What aspects of marketing appeal to you?`,
    metadata: { level: 'intermediate', topic: 'Work & Career', score: 86 },
  },

  // ========== ADVANCED - Business ==========
  {
    id: 'adv-business-001',
    text: `User: Our quarterly revenue exceeded expectations by 15%. However, operational costs have increased due to inflation and supply chain disruptions.
Teacher: Interesting analysis. How do you plan to mitigate those rising costs while maintaining profitability?`,
    metadata: { level: 'advanced', topic: 'Business Strategy', score: 91 },
  },

  {
    id: 'adv-business-002',
    text: `User: The competitive landscape has shifted dramatically. We need to pivot our strategy toward digital transformation, or we risk becoming obsolete.
Teacher: That's a crucial observation. What specific digital initiatives are you considering?`,
    metadata: { level: 'advanced', topic: 'Business Strategy', score: 93 },
  },

  {
    id: 'adv-business-003',
    text: `User: I believe corporate culture is the linchpin of sustainable success. Without alignment between values and operations, even the most sophisticated strategies will falter.
Teacher: That's a profound insight. Can you elaborate on how you've seen this play out in your experience?`,
    metadata: { level: 'advanced', topic: 'Business Strategy', score: 95 },
  },

  // ========== ADVANCED - Philosophy ==========
  {
    id: 'adv-philosophy-001',
    text: `User: I've been contemplating the nature of consciousness. Is it merely an emergent property of complex neural networks, or something more fundamental?
Teacher: That's one of philosophy's deepest questions. What led you to ponder this?`,
    metadata: { level: 'advanced', topic: 'Philosophy & Ethics', score: 92 },
  },

  {
    id: 'adv-philosophy-002',
    text: `User: The ethical implications of AI are staggering. We're essentially creating systems that could surpass human intelligence, yet we lack a comprehensive moral framework.
Teacher: You've touched on a critical issue. How do you think we should approach developing such a framework?`,
    metadata: { level: 'advanced', topic: 'Philosophy & Ethics', score: 94 },
  },

  // ... (adicionar mais 35 exemplos cobrindo todos os níveis e tópicos)
];
```

---

## 13. Testing Strategy

```typescript
// modules/groq/services/__tests__/groq-llm.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { GroqLlmService } from '../groq-llm.service';
import { RagService } from '@/modules/rag/services/rag.service';

describe('GroqLlmService', () => {
  let service: GroqLlmService;
  let ragService: RagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroqLlmService,
        {
          provide: RagService,
          useValue: {
            findSimilarExamples: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GroqLlmService>(GroqLlmService);
    ragService = module.get<RagService>(RagService);
  });

  describe('generateResponse', () => {
    it('should generate response for beginner level', async () => {
      const conversationHistory = [
        { role: 'user', content: 'I like coffee' },
      ];

      const response = await service.generateResponse(
        conversationHistory,
        'beginner',
        'Food & Drinks'
      );

      expect(response).toBeDefined();
      expect(response.length).toBeGreaterThan(0);
      expect(response.length).toBeLessThan(200); // Respostas curtas
    });

    it('should handle empty conversation history', async () => {
      const response = await service.generateResponse(
        [],
        'intermediate',
        'Travel'
      );

      expect(response).toBeDefined();
    });

    it('should throw error on Groq API failure', async () => {
      // Mock Groq API failure
      jest.spyOn(service['groq'].chat.completions, 'create')
        .mockRejectedValue(new Error('API Error'));

      await expect(
        service.generateResponse([], 'beginner', 'Daily Life')
      ).rejects.toThrow();
    });
  });

  describe('generateResponseWithRAG', () => {
    it('should enhance prompt with RAG examples', async () => {
      const mockExamples = [
        {
          id: 'test-1',
          text: 'Example conversation',
          score: 0.9,
          level: 'beginner',
          topic: 'Food',
        },
      ];

      jest.spyOn(ragService, 'findSimilarExamples')
        .mockResolvedValue(mockExamples);

      const response = await service.generateResponseWithRAG(
        [{ role: 'user', content: 'I like pizza' }],
        'beginner',
        'Food & Drinks'
      );

      expect(ragService.findSimilarExamples).toHaveBeenCalled();
      expect(response).toBeDefined();
    });
  });
});

// modules/groq/services/__tests__/groq-feedback.service.spec.ts

describe('GroqFeedbackService', () => {
  let service: GroqFeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroqFeedbackService],
    }).compile();

    service = module.get<GroqFeedbackService>(GroqFeedbackService);
  });

  describe('analyzeSpeaking', () => {
    it('should return valid feedback structure', async () => {
      const transcription = 'I go to school yesterday';
      const context = 'Discussing daily routine';
      const level = 'beginner';

      const feedback = await service.analyzeSpeaking(
        transcription,
        context,
        level
      );

      expect(feedback).toHaveProperty('grammarErrors');
      expect(feedback).toHaveProperty('vocabularyScore');
      expect(feedback).toHaveProperty('fluencyScore');
      expect(feedback).toHaveProperty('overallScore');
      expect(feedback).toHaveProperty('suggestions');
      expect(feedback).toHaveProperty('strengths');

      expect(feedback.vocabularyScore).toBeGreaterThanOrEqual(0);
      expect(feedback.vocabularyScore).toBeLessThanOrEqual(100);
    });

    it('should identify grammar errors', async () => {
      const transcription = 'I go to school yesterday and I seeing my friend';
      
      const feedback = await service.analyzeSpeaking(
        transcription,
        'Past activities',
        'beginner'
      );

      expect(feedback.grammarErrors.length).toBeGreaterThan(0);
      expect(feedback.grammarErrors[0]).toHaveProperty('error');
      expect(feedback.grammarErrors[0]).toHaveProperty('correction');
      expect(feedback.grammarErrors[0]).toHaveProperty('explanation');
    });
  });
});
```

---

## 📝 Checklist de Implementação

```bash
## Setup Inicial
☐ Criar conta Groq (https://console.groq.com)
☐ Gerar API key
☐ Adicionar GROQ_API_KEY no .env
☐ Instalar groq-sdk: npm install groq-sdk

## Módulo Groq STT
☐ Criar GroqSttService
☐ Implementar transcribeAudio()
☐ Implementar transcribeWithTimestamps()
☐ Adicionar compressão de áudio (ffmpeg)
☐ Testar com áudio de exemplo

## Módulo Groq LLM
☐ Criar GroqLlmService
☐ Criar prompts conversação (beginner/intermediate/advanced)
☐ Implementar generateResponse()
☐ Implementar generateResponseStream()
☐ Adicionar cache Redis
☐ Testar com diferentes níveis

## Módulo Groq Feedback
☐ Criar GroqFeedbackService
☐ Criar prompt de análise
☐ Implementar analyzeSpeaking()
☐ Validar JSON retornado
☐ Testar com exemplos reais

## Módulo RAG
☐ Criar conta Upstash Vector
☐ Criar RagService
☐ Implementar addExample()
☐ Implementar findSimilarExamples()
☐ Seed inicial (50 exemplos)
☐ Integrar RAG com LLM

## Gamificação
☐ Criar XpCalculatorService
☐ Implementar cálculo de XP
☐ Implementar sistema de levels
☐ Implementar streak system
☐ Testar progressão

## Error Handling
☐ Criar enums de erro
☐ Criar GroqExceptionFilter
☐ Adicionar logs de erro
☐ Testar rate limits
☐ Testar falhas de API

## Otimizações
☐ Implementar cache Redis
☐ Implementar batch processing
☐ Implementar WebSocket streaming
☐ Comprimir áudios antes de upload
☐ Monitorar uso de tokens

## Testes
☐ Unit tests GroqSttService
☐ Unit tests GroqLlmService
☐ Unit tests GroqFeedbackService
☐ Unit tests RagService
☐ Integration tests completos
☐ Load tests (rate limits)

## Documentação
☐ README.md do módulo Groq
☐ Exemplos de uso da API
☐ Troubleshooting guide
☐ Performance benchmarks
```

---

## 🎯 Próximos Passos

1. **Começar pelo STT** - É o mais simples e dá feedback rápido
2. **Depois LLM básico** - Conversação sem RAG primeiro
3. **Adicionar Feedback** - Análise de respostas
4. **Implementar RAG** - Melhorar qualidade das respostas
5. **Gamificação** - XP, levels, streaks
6. **Otimizações** - Cache, streaming, batch

---

## 📚 Referências

- [Groq API Docs](https://console.groq.com/docs)
- [Whisper Large V3](https://huggingface.co/openai/whisper-large-v3)
- [Llama 3.3 70B](https://www.llama.com/docs/model-cards-and-prompt-formats/llama3_3)
- [Upstash Vector](https://upstash.com/docs/vector/overall/getstarted)
- [CEFR Levels](https://www.coe.int/en/web/common-european-framework-reference-languages)

---

**🔥 LEMBRE-SE:**
- Groq é **GRÁTIS** até 14.400 requests/dia
- Whisper Large V3 é **ultra preciso** (95%+ accuracy)
- Llama 3.3 70B é **rápido** (~2s pra resposta)
- RAG **melhora drasticamente** a qualidade
- Cache **reduz custos** e aumenta velocidade

**Bora implementar! 🚀**