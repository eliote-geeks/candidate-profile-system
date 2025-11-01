'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Target, TrendingUp, Clock, ArrowRight, Users, Briefcase } from 'lucide-react';

// AI Visualization Component
function AIVisualization() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    delay: i * 0.1,
    duration: 6 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated background gradient */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(34, 211, 238, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0"
      />

      {/* Neural network nodes */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Animated connecting lines */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <line x1="150" y1="100" x2="400" y2="150" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
          <line x1="400" y1="150" x2="650" y2="100" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="2" />
          <line x1="150" y1="250" x2="400" y2="200" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2" />
          <line x1="400" y1="200" x2="650" y2="250" stroke="rgba(34, 211, 238, 0.3)" strokeWidth="2" />
          <line x1="150" y1="100" x2="150" y2="250" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="2" />
          <line x1="650" y1="100" x2="650" y2="250" stroke="rgba(100, 200, 255, 0.2)" strokeWidth="2" />
        </motion.g>

        {/* Pulsing nodes */}
        {[
          { cx: 150, cy: 100 },
          { cx: 150, cy: 250 },
          { cx: 400, cy: 150 },
          { cx: 400, cy: 200 },
          { cx: 650, cy: 100 },
          { cx: 650, cy: 250 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.cx}
            cy={node.cy}
            r={6}
            fill="rgba(34, 211, 238, 0.8)"
            animate={{
              r: [6, 10, 6],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>

      {/* Floating particles with flowing animation */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 blur-sm"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -300, 0],
            x: [0, Math.sin(particle.id) * 100, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Glowing orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: 200 + i * 100,
            height: 200 + i * 100,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 20}%`,
            background: i === 0
              ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
              : i === 1
              ? 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(6, 182, 212, 0.05) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Data flow lines - animated */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.6)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
          <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0)" />
          </linearGradient>
        </defs>

        {/* Horizontal flowing lines */}
        <motion.line
          x1="0"
          y1="120"
          x2="1000"
          y2="120"
          stroke="url(#flowGradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            strokeDasharray: [1000, 1000],
            strokeDashoffset: [1000, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.line
          x1="1000"
          y1="240"
          x2="0"
          y2="240"
          stroke="url(#flowGradient1)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            strokeDasharray: [1000, 1000],
            strokeDashoffset: [0, -1000],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Vertical flowing lines */}
        <motion.line
          x1="300"
          y1="0"
          x2="300"
          y2="400"
          stroke="url(#flowGradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            strokeDasharray: [400, 400],
            strokeDashoffset: [400, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.line
          x1="700"
          y1="400"
          x2="700"
          y2="0"
          stroke="url(#flowGradient2)"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            strokeDasharray: [400, 400],
            strokeDashoffset: [0, -400],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
}

export default function StartPage() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/start" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition">
            RecruitAI
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Comment ça marche
            </a>
            <a href="#why-it-works" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Pourquoi ça marche
            </a>
            <a href="#results" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Résultats
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-slate-300 hover:text-cyan-400 font-semibold text-sm transition border border-slate-600 hover:border-cyan-400 rounded-lg"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2"
            >
              S'inscrire
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Minimal, Action-Oriented */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* AI Visualization Background */}
        <AIVisualization />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-12">
          {/* Left Side - Text Content */}
          <div className="relative z-10">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-sm font-semibold">Bêta privée · Novembre 2025</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-5xl font-bold mb-6 leading-tight text-left"
            >
              Ton copilote IA pour la recherche d’emploi au Cameroun
            </motion.h1>

            {/* Subheading - More Concrete */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-300 mb-8 leading-relaxed text-left"
            >
              Chat onboarding, workflows n8n et génération de CV sur mesure : RecruitAI cartographie les offres locales, adapte tes candidatures et suit chaque réponse depuis un VPS souverain.
            </motion.p>

            {/* Key Metrics - Concrete Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                { metric: '6', label: 'profils accompagnés en pilote' },
                { metric: '90', label: 'offres locales qualifiées (Oct–Nov 2025)' },
                { metric: '≈3 min', label: 'pour compléter le chat onboarding' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3"
                >
                  <div className="text-2xl font-bold text-cyan-400 mb-1">{item.metric}</div>
                  <div className="text-slate-400 text-xs">{item.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col gap-3 text-left"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center justify-center gap-2 group"
                >
                  Demander un accès bêta
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-4 bg-slate-800/50 border-2 border-slate-600 rounded-lg text-white font-semibold text-lg hover:border-cyan-500 hover:bg-slate-800 transition inline-flex items-center justify-center gap-2 group"
                >
                  Se connecter (bêta)
                </Link>
              </div>

              {/* Social Proof */}
              <p className="text-slate-400 text-sm">
                ✓ Données hébergées sur ton propre VPS · ✓ Workflows auditables · ✓ Support Discord pilote
              </p>
            </motion.div>
          </div>

          {/* Right Side - AI Visualization (Desktop Only) */}
          <div className="hidden md:block relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-cyan-600/5 rounded-2xl"></div>
          </div>
        </div>
      </section>

      {/* How It Works - Workflow Animation */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">3 étapes, 3 minutes</h2>
            <p className="text-xl text-slate-300">Prêt à envoyer tes premières 50 candidatures?</p>
          </div>

          {/* Workflow Timeline */}
          <div className="relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent"></div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: 'Onboarding conversationnel',
                  desc: 'Le chat RecruitAI capture tes compétences, secteurs visés et préférences en langage naturel. Les données sont stockées dans Postgres (job_automation_db).',
                  time: '≈3 min',
                  icon: '📝',
                  color: 'blue',
                },
                {
                  step: 2,
                  title: 'Workflows n8n orchestrés',
                  desc: 'Les modules Intelligence → Qualification → Generation enrichissent ton profil, scrappent les offres locales et préparent CV & pitch via Gotenberg et Gemini.',
                  time: 'Continu',
                  icon: '🤖',
                  color: 'cyan',
                },
                {
                  step: 3,
                  title: 'Envoi & suivi automatisés',
                  desc: 'Les scénarios Application & Follow-up déclenchent les candidatures, loggent chaque réponse et sync les tokens de session côté Next.js pour ton tableau de bord.',
                  time: 'Auto',
                  icon: '✈️',
                  color: 'purple',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  className="relative"
                >
                  {/* Step Container */}
                  <div className="flex flex-col items-center">
                    {/* Animated Step Badge */}
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(6, 182, 212, 0.7)',
                          '0 0 0 20px rgba(6, 182, 212, 0)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold mb-6 relative z-10 ${
                        item.color === 'blue'
                          ? 'bg-gradient-to-br from-blue-600 to-blue-700'
                          : item.color === 'cyan'
                            ? 'bg-gradient-to-br from-cyan-600 to-cyan-700'
                            : 'bg-gradient-to-br from-purple-600 to-purple-700'
                      }`}
                    >
                      {item.icon}
                    </motion.div>

                    {/* Time Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.2 + 0.2 }}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-slate-700 text-cyan-400 mb-4"
                    >
                      {item.time}
                    </motion.div>

                    {/* Card Content */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.1 }}
                      className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 w-full hover:border-cyan-500/50 transition"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {item.step}
                        </div>
                        <h3 className="text-lg font-semibold flex-1">{item.title}</h3>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>

                      {/* Animated Progress Bar */}
                      <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 1.5, delay: i * 0.2 + 0.3 }}
                        className={`h-1 rounded-full mt-4 ${
                          item.color === 'blue'
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : item.color === 'cyan'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                              : 'bg-gradient-to-r from-purple-500 to-cyan-500'
                        }`}
                      ></motion.div>
                    </motion.div>
                  </div>

                  {/* Arrow Connector - Hidden on Mobile */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute top-20 -right-4 translate-x-1/2 translate-y-1/2">
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                        className="text-cyan-500 text-2xl"
                      >
                        →
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Mobile Vertical Connector */}
            <div className="md:hidden absolute left-8 top-24 bottom-0 w-1 bg-gradient-to-b from-blue-600 via-cyan-500 to-transparent"></div>
          </div>

          {/* CTA Under Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2 group"
            >
              Commencer maintenant
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why It Works Section - Value Drivers */}
      <section id="why-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Pourquoi ça marche vraiment</h2>
            <p className="text-xl text-slate-300">Les vraies raisons pour lesquelles RecruitAI change la donne</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: '💬',
                title: 'Onboarding façon copilote',
                desc: 'Une interface chat 2025 qui transforme tes réponses en données structurées (skills, secteurs, prétentions salariales) directement dans Postgres.',
              },
              {
                icon: '🔁',
                title: 'Automations modulaire n8n',
                desc: '6 modules (Intelligence → Analytics) enchaînent scrapers, analyseurs, générateurs de CV et webhooks. Chaque nœud est versionné et transparent.',
              },
              {
                icon: '🧠',
                title: 'Génération de contenu contextualisée',
                desc: 'Gotenberg + Gemini adaptent ton CV et tes messages pour chaque offre. Pas de texte générique, tout est relié aux données de ton profil.',
              },
              {
                icon: '📡',
                title: 'Surveillance des offres locales',
                desc: '90 offres camerounaises indexées depuis LinkedIn, Notion et sources privées. Les workflows filtrent le spam et taguent les priorités.',
              },
              {
                icon: '🔐',
                title: 'Souveraineté des données',
                desc: 'Traefik, Docker, Postgres : tout tourne sur ton VPS. Aucun SaaS tiers pour stocker ton historique de candidatures.',
              },
              {
                icon: '📈',
                title: 'Analytics temps réel',
                desc: 'Le dashboard Next.js consomme directement les sessions et applications enregistrées par n8n pour un suivi minute par minute.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/50 transition"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section with Concrete Metrics */}
      <section id="results" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Résultats mesurables</h2>
            <p className="text-xl text-slate-300">Chiffres réels de nos utilisateurs</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: '90', label: 'Offres qualifiées dans le pipeline (Nov 2025)' },
              { value: '6', label: 'Profils bêta actifs' },
              { value: '6 modules', label: 'Chaîne d’automatisation n8n (1→6)' },
              { value: '3', label: 'Campagnes d’application déjà déclenchées' },
              { value: '100%', label: 'Données hébergées sur ton VPS' },
              { value: '<5 min', label: 'Temps de mise à jour d’un CV personnalisé' },
              { value: '0 SaaS', label: 'Dépendance pour stocker ton historique' },
              { value: '24/7', label: 'Monitoring Traefik + alertes n8n' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="text-center p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-cyan-500/50 transition"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2 group"
            >
              Rejoindre la bêta privée
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA Section - Action Oriented */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10"></div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Combien de fois vais-tu encore cliquer sur des offres manuellement?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-slate-300 mb-10 leading-relaxed"
          >
            La cohorte pilote partage ses retours chaque semaine : optimisation des flux n8n, nouvelles sources d’offres, meilleures relances. Inscris-toi, on t’ouvre la porte dès qu’un créneau se libère.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center justify-center gap-2 group"
            >
              Rejoindre la liste d’attente
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-sm"
          >
            • Pas de carte bancaire • Pas d'engagement • Annulation à tout moment
          </motion.p>
        </div>
      </section>

      {/* FAQ Section - Quick Objections */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>

          <div className="space-y-6">
            {[
              {
                q: 'Qui peut rejoindre la bêta ?',
                a: 'Nous ouvrons progressivement l’accès aux candidats actifs sur le marché camerounais. Inscris-toi et nous t’enverrons un mail dès qu’un slot se libère.',
              },
              {
                q: 'Quel est le coût ?',
                a: 'La bêta est gratuite. Un plan payant sera proposé en 2026, avec hébergement toujours sur ton infrastructure ou la nôtre au choix.',
              },
              {
                q: 'Puis-je voir les workflows ?',
                a: 'Oui. Chaque scénario n8n (login, register, update-profile, job analyzer…) est versionné et documenté. Tu peux les importer ou les auditer avant de les lancer.',
              },
              {
                q: 'D’où viennent les offres ?',
                a: 'Nous agrégeons LinkedIn, job boards privés, communautés WhatsApp et leads manuels. Les sources sont taguées et filtrées pour éviter les annonces douteuses.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/50 transition"
              >
                <h3 className="text-lg font-semibold mb-2 text-cyan-400">{item.q}</h3>
                <p className="text-slate-300">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt?</h2>
          <p className="text-slate-300 mb-8">Crée ton profil, déclenche tes premiers workflows et suis leurs résultats depuis un tableau de bord temps réel.</p>
          <Link
            href="/onboarding"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2 group"
          >
            Lancer le chat onboarding
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>
    </main>
  );
}
