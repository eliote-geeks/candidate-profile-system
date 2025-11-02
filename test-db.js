require('dotenv').config({ path: '/home/paul/Bureau/candidate-profile-system/.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function test() {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    console.log('Testing database connection...');
    const result = await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection OK:', result);
    
    console.log('\nTesting candidate table...');
    const candidates = await prisma.candidate.findMany({ take: 1 });
    console.log('✅ Candidate table OK. Total:', candidates.length);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Database error:', err.message);
    process.exit(1);
  }
}

test();
