#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key) {
        let value = valueParts.join('=').trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key.trim()] = value;
      }
    }
  });
}

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('\n🔍 Vérification de la base de données...\n');

    // Get total count
    const totalCount = await prisma.candidate.count();
    console.log(`📊 Total candidates: ${totalCount}`);

    // Get latest 5 candidates
    const recentCandidates = await prisma.candidate.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        created_at: true,
      },
    });

    if (recentCandidates.length === 0) {
      console.log('\n❌ Aucun candidat trouvé dans la base de données');
      await prisma.$disconnect();
      return;
    }

    console.log('\n📝 5 derniers candidats:\n');
    recentCandidates.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.first_name} ${candidate.last_name}`);
      console.log(`   Email: ${candidate.email}`);
      console.log(`   ID: ${candidate.id}`);
      console.log(`   Créé: ${new Date(candidate.created_at).toLocaleString('fr-FR')}`);
      console.log('');
    });

    // Get full details of most recent candidate
    const latestCandidate = recentCandidates[0];
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Détails complets du dernier candidat:\n');

    const fullCandidate = await prisma.candidate.findUnique({
      where: { id: latestCandidate.id },
      include: {
        applications: true,
        documents: true,
      },
    });

    if (fullCandidate) {
      console.log(`✅ Nom complet: ${fullCandidate.first_name} ${fullCandidate.last_name}`);
      console.log(`✅ Email: ${fullCandidate.email}`);
      console.log(`✅ Téléphone: ${fullCandidate.phone || 'N/A'}`);
      console.log(`✅ Localisation: ${fullCandidate.location || 'N/A'}`);
      console.log(`✅ Titre actuel: ${fullCandidate.current_title || 'N/A'}`);
      console.log(`✅ Années d'expérience: ${fullCandidate.years_experience || 'N/A'}`);
      console.log(`✅ Niveau d'éducation: ${fullCandidate.education_level || 'N/A'}`);

      if (fullCandidate.skills && fullCandidate.skills.length > 0) {
        console.log(`✅ Compétences: ${fullCandidate.skills.join(', ')}`);
      }

      if (fullCandidate.languages && fullCandidate.languages.length > 0) {
        console.log(`✅ Langues: ${fullCandidate.languages.join(', ')}`);
      }

      if (fullCandidate.desired_positions && fullCandidate.desired_positions.length > 0) {
        console.log(`✅ Postes souhaités: ${fullCandidate.desired_positions.join(', ')}`);
      }

      if (fullCandidate.desired_sectors && fullCandidate.desired_sectors.length > 0) {
        console.log(`✅ Secteurs souhaités: ${fullCandidate.desired_sectors.join(', ')}`);
      }

      if (fullCandidate.desired_locations && fullCandidate.desired_locations.length > 0) {
        console.log(`✅ Localisations souhaitées: ${fullCandidate.desired_locations.join(', ')}`);
      }

      console.log(`✅ Salaire minimum: ${fullCandidate.min_salary || 'N/A'}`);

      if (fullCandidate.contract_types && fullCandidate.contract_types.length > 0) {
        console.log(`✅ Types de contrats: ${fullCandidate.contract_types.join(', ')}`);
      }

      console.log(`✅ LinkedIn: ${fullCandidate.linkedin_url || 'N/A'}`);
      console.log(`✅ Portfolio: ${fullCandidate.portfolio_url || 'N/A'}`);
      console.log(`✅ CV: ${fullCandidate.base_cv_url || 'N/A'}`);
      console.log(`✅ Actif: ${fullCandidate.active ? 'Oui' : 'Non'}`);

      if (fullCandidate.applications && fullCandidate.applications.length > 0) {
        console.log(`✅ Candidatures: ${fullCandidate.applications.length}`);
      }

      if (fullCandidate.documents && fullCandidate.documents.length > 0) {
        console.log(`✅ Documents: ${fullCandidate.documents.length}`);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Vérification terminée avec succès!\n');

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error.message);
    if (error.code === 'P1000') {
      console.error('\n⚠️  Impossible de se connecter à la base de données.');
      console.error('   Assurez-vous que le tunnel SSH est actif:');
      console.error('   bash /home/paul/Bureau/candidate-profile-system/scripts/ssh-tunnel.sh');
    }
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabase();
