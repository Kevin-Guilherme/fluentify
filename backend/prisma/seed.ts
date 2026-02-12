import { PrismaClient, UserLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const topics = [
    {
      slug: 'coffee-shop',
      title: 'Coffee Shop',
      description: 'Order drinks and snacks in a casual coffee shop setting',
      emoji: '☕',
      difficulty: UserLevel.BEGINNER,
      category: 'daily-life',
      systemPrompt: `You are a friendly barista at a cozy coffee shop. Help the customer order drinks and snacks. Use simple vocabulary and short sentences. Be patient and encouraging. Ask clarifying questions if needed (size, milk preference, etc).`,
      sortOrder: 1,
    },
    {
      slug: 'hotel-checkin',
      title: 'Hotel Check-in',
      description: 'Check into a hotel and ask about facilities',
      emoji: '🏨',
      difficulty: UserLevel.BEGINNER,
      category: 'travel',
      systemPrompt: `You are a helpful hotel receptionist. Assist the guest with check-in, explain hotel facilities, and answer questions about the room. Use clear, simple language. Be polite and professional.`,
      sortOrder: 2,
    },
    {
      slug: 'restaurant-order',
      title: 'Restaurant Order',
      description: 'Order food and drinks at a restaurant',
      emoji: '🍕',
      difficulty: UserLevel.BEGINNER,
      category: 'daily-life',
      systemPrompt: `You are a friendly waiter/waitress at a casual restaurant. Help the customer order food and drinks. Use simple vocabulary. Describe menu items if asked. Be patient with pronunciation mistakes.`,
      sortOrder: 3,
    },
    {
      slug: 'airport',
      title: 'Airport',
      description: 'Navigate airport procedures and ask for directions',
      emoji: '✈️',
      difficulty: UserLevel.INTERMEDIATE,
      category: 'travel',
      systemPrompt: `You are an airport staff member or fellow traveler. Help the student navigate airport procedures (check-in, security, boarding). Use travel-related vocabulary. Provide clear directions. Occasionally use idioms naturally.`,
      sortOrder: 4,
    },
    {
      slug: 'job-interview',
      title: 'Job Interview',
      description: 'Practice common job interview questions and answers',
      emoji: '💼',
      difficulty: UserLevel.INTERMEDIATE,
      category: 'professional',
      systemPrompt: `You are a friendly but professional job interviewer. Ask common interview questions about experience, skills, and goals. Use professional vocabulary. Provide natural follow-up questions. Be encouraging but maintain a formal tone.`,
      sortOrder: 5,
    },
    {
      slug: 'doctor-visit',
      title: 'Doctor Visit',
      description: 'Describe symptoms and understand medical advice',
      emoji: '🏥',
      difficulty: UserLevel.INTERMEDIATE,
      category: 'daily-life',
      systemPrompt: `You are a caring doctor. Ask about symptoms, medical history, and provide advice. Use medical vocabulary but explain complex terms. Be patient and empathetic. Give clear instructions about treatment.`,
      sortOrder: 6,
    },
    {
      slug: 'business-meeting',
      title: 'Business Meeting',
      description: 'Participate in a professional business discussion',
      emoji: '📊',
      difficulty: UserLevel.ADVANCED,
      category: 'professional',
      systemPrompt: `You are a business colleague in a meeting. Discuss projects, deadlines, and strategies. Use business idioms and phrasal verbs naturally. Challenge the student with follow-up questions. Maintain a professional but collaborative tone.`,
      sortOrder: 7,
    },
    {
      slug: 'university-lecture',
      title: 'University Lecture',
      description: 'Discuss academic topics and ask questions',
      emoji: '🎓',
      difficulty: UserLevel.ADVANCED,
      category: 'academic',
      systemPrompt: `You are a university professor. Discuss academic topics with depth and nuance. Use complex vocabulary and sentence structures. Encourage critical thinking with probing questions. Explain abstract concepts clearly.`,
      sortOrder: 8,
    },
    {
      slug: 'legal-consultation',
      title: 'Legal Consultation',
      description: 'Discuss legal matters in a professional setting',
      emoji: '⚖️',
      difficulty: UserLevel.ADVANCED,
      category: 'professional',
      systemPrompt: `You are a professional lawyer or legal advisor. Discuss legal matters with precision. Use formal legal terminology but explain when necessary. Ask detailed questions. Maintain a professional and serious tone.`,
      sortOrder: 9,
    },
    {
      slug: 'travel-planning',
      title: 'Travel Planning',
      description: 'Plan a trip and discuss travel arrangements',
      emoji: '🌍',
      difficulty: UserLevel.INTERMEDIATE,
      category: 'travel',
      systemPrompt: `You are a helpful travel agent or experienced traveler. Help plan a trip by discussing destinations, accommodations, and activities. Use travel-related vocabulary. Provide recommendations and ask about preferences.`,
      sortOrder: 10,
    },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
    console.log(`✅ Created topic: ${topic.title}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
