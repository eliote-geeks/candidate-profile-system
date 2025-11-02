#!/usr/bin/env node

// Quick test script to verify PostgreSQL connection via SSH tunnel
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🧪 Testing PostgreSQL connection via SSH tunnel...\n');

    // Test raw query
    const result = await prisma.$queryRaw`SELECT NOW() as time`;
    console.log('✅ Connection successful!');
    console.log('   Current time:', result[0].time);

    // Count candidates and jobs
    const candidatesCount = await prisma.candidate.count();
    const jobsCount = await prisma.jobOffer.count();
    const applicationsCount = await prisma.application.count();

    console.log('\n📊 Database state:');
    console.log(`   Candidates: ${candidatesCount}`);
    console.log(`   Job Offers: ${jobsCount}`);
    console.log(`   Applications: ${applicationsCount}`);

    console.log('\n✨ All tests passed!');
  } catch (error) {
    console.error('❌ Connection failed:');
    console.error(`   ${error.message}`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
