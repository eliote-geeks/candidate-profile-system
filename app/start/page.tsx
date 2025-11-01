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
              <span className="text-blue-300 text-sm font-semibold">Bêta ouverte · Novembre 2025</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-5xl font-bold mb-6 leading-tight text-left"
            >
              Trouve un job plus vite avec un assistant IA pensé pour le Cameroun
            </motion.h1>

            {/* Subheading - More Concrete */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-slate-300 mb-8 leading-relaxed text-left"
            >
              RecruitAI surveille les offres locales, t’aide à remplir ton profil en 3 minutes, personnalise ton CV et suit tes candidatures sur un tableau de bord simple.
            </motion.p>

            {/* Key Metrics - Concrete Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-3 mb-8"
            >
              {[
                { metric: '6', label: 'candidats accompagnés dans la bêta' },
                { metric: '90', label: 'offres camerounaises suivies en direct' },
                { metric: '≈3 min', label: 'pour compléter le chat de démarrage' },
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
                  Rejoindre la bêta gratuite
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
                </Link>

                <Link
                  href="/login"
                  className="px-8 py-4 bg-slate-800/50 border-2 border-slate-600 rounded-lg text-white font-semibold text-lg hover:border-cyan-500 hover:bg-slate-800 transition inline-flex items-center justify-center gap-2 group"
                >
                  Se connecter à son espace
                </Link>
              </div>

              {/* Social Proof */}
              <p className="text-slate-400 text-sm">
                ✓ Aucun paiement demandé • ✓ Support WhatsApp • ✓ Accès sur invitation
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
                  title: 'Onboarding guidé',
                  desc: 'Un chat te pose les bonnes questions (expérience, objectifs, salaire). Tes réponses alimentent ton profil automatiquement.',
                  time: '≈3 min',
                  icon: '📝',
                  color: 'blue',
                },
                {
                  step: 2,
                  title: 'Matching automatique',
                  desc: 'RecruitAI surveille les nouvelles offres, personnalise ton CV et prépare les messages d’envoi pour chaque poste.',
                  time: 'En continu',
                  icon: '🤖',
                  color: 'cyan',
                },
                {
                  step: 3,
                  title: 'Tableau de bord simple',
                  desc: 'Tu vois les candidatures envoyées, les réponses reçues et les relances à faire, le tout dans ton espace sécurisé.',
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
                title: 'Un chat facile à utiliser',
                desc: 'Tu réponds comme dans une discussion WhatsApp et ton profil se remplit tout seul.',
              },
              {
                icon: '🤝',
                title: 'Les bonnes offres, sans le stress',
                desc: 'RecruitAI surveille les offres camerounaises et ne te montre que celles qui collent à ton parcours.',
              },
              {
                icon: '🧠',
                title: 'CV et messages personnalisés',
                desc: 'Chaque CV et chaque mail est adapté à l’offre pour maximiser les retours.',
              },
              {
                icon: '🔔',
                title: 'Relances automatiques',
                desc: 'Le service t’indique quand relancer une entreprise et garde l’historique des réponses.',
              },
              {
                icon: '🔐',
                title: 'Tes données restent chez toi',
                desc: 'Le projet tourne sur un serveur privé : personne ne revend ton historique.',
              },
              {
                icon: '📊',
                title: 'Un suivi clair',
                desc: 'Un tableau de bord lisible t’aide à voir ce qui marche et le temps que tu gagnes.',
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
              { value: '6', label: 'Candidats accompagnés pendant la bêta' },
              { value: '90', label: 'Offres locales analysées en Nov 2025' },
              { value: '3', label: 'Campagnes d’envoi déjà réalisées' },
              { value: '100%', label: 'Données hébergées sur serveur privé' },
              { value: '<5 min', label: 'Temps pour générer un CV personnalisé' },
              { value: '24/7', label: 'Surveillance des nouvelles offres' },
              { value: '0 F CFA', label: 'Coût durant la bêta' },
              { value: 'WhatsApp', label: 'Canal support + partage des retours' },
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
              Rejoins les 12,500+ candidats
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
            12,500 candidats ont déjà automatisé leur recherche d'emploi et reçoivent des offres qualifiées chaque jour. C'est gratuit pendant 3 mois. Pas de carte bancaire nécessaire.
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
              Commencer gratuit maintenant
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
                q: 'Est-ce vraiment gratuit?',
                a: 'Oui. Accès complet gratuit pendant 3 mois. Après, tu paies seulement si tu veux continuer.',
              },
              {
                q: 'Combien de temps avant de voir des résultats?',
                a: 'Les premières candidatures partent en 24h. Les réponses commencent à arriver dans les 3-5 jours.',
              },
              {
                q: 'C\'est sûr? Vais-je recevoir que des arnaque?',
                a: 'Non. Notre IA détecte les offres douteuses et filtre automatiquement les arnaqueurs connus.',
              },
              {
                q: 'Comment ça marche avec LinkedIn?',
                a: 'Ton profil reste privé. RecruitAI scrape les offres publiques et envoie des candidatures vérifiées.',
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
          <p className="text-slate-300 mb-8">Crée un compte et envoie 50+ candidatures en 24h. Gratuit. Sans risque.</p>
          <Link
            href="/onboarding"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2 group"
          >
            Commencer maintenant
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </section>
    </main>
  );
}
