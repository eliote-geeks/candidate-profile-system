'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, Target, TrendingUp, Clock, ArrowRight, Sparkles } from 'lucide-react';

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
            <a href="#comment-ca-marche" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Comment ça marche
            </a>
            <a href="#stats" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Stats
            </a>
            <a href="#contact" className="text-slate-300 hover:text-cyan-400 transition text-sm font-medium">
              Contact
            </a>
          </div>

          {/* CTA Button */}
          <Link
            href="/onboarding"
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center gap-2"
          >
            Commencer
            <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Animated Shapes */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-300 text-sm font-semibold">
                ✨ Commence maintenant
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Trouvez votre emploi <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">3x plus vite</span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              En 3 minutes, crée un profil candidat. RecruitAI automatise le reste: scrape les meilleures offres, génère tes CVs personnalisés et envoie tes candidatures.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Zap, text: '50+ candidatures/mois (vs 5 manuellement)' },
                { icon: TrendingUp, text: 'CVs personnalisés = +60% réponses' },
                { icon: Target, text: 'Scoring IA pour offres qualifiées' },
                { icon: Clock, text: 'Sauvegarde 20h/mois de recherche' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (i + 1) }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-cyan-400" size={20} />
                  </div>
                  <span className="text-slate-300">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/onboarding"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center justify-center gap-2 group"
              >
                Commencer maintenant
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/"
                className="px-8 py-4 border-2 border-cyan-500 rounded-xl text-white font-semibold text-lg hover:bg-cyan-500/10 transition inline-flex items-center justify-center gap-2"
              >
                En savoir plus
              </Link>
            </motion.div>

            {/* Trust Signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-10 flex items-center gap-4 text-sm text-slate-400"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full border-2 border-slate-800"
                  ></div>
                ))}
              </div>
              <span>Rejoins les centaines de Camerounais qui trouvent des jobs</span>
            </motion.div>
          </motion.div>

          {/* Right: Animated Shapes & Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-96"
          >
            {/* Gradient Background Orbs */}
            <div className="absolute inset-0">
              {/* Blue Orb - Top Right */}
              <motion.div
                animate={{
                  x: [0, 20, -20, 0],
                  y: [0, -30, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"
              ></motion.div>

              {/* Cyan Orb - Bottom Left */}
              <motion.div
                animate={{
                  x: [0, -30, 30, 0],
                  y: [0, 20, -20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-600/25 rounded-full blur-3xl"
              ></motion.div>

              {/* Purple Orb - Center */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl"
              ></motion.div>

              {/* Pink Orb - Top Left */}
              <motion.div
                animate={{
                  x: [0, 25, -25, 0],
                  y: [0, 25, -25, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 2,
                }}
                className="absolute top-0 left-0 w-56 h-56 bg-pink-600/20 rounded-full blur-3xl"
              ></motion.div>
            </div>

            {/* Animated Geometric Shapes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Rotating Circle - Large */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-64 h-64 border-2 border-cyan-500/30 rounded-full"
              ></motion.div>

              {/* Rotating Circle - Medium */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-52 h-52 border-2 border-blue-500/30 rounded-full"
              ></motion.div>

              {/* Rotating Square - Large */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-48 h-48 border-2 border-purple-500/20"
              ></motion.div>

              {/* Rotating Triangle (using border styling) */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 35,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-40 h-40 border-2 border-pink-500/20"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                }}
              ></motion.div>

              {/* Hexagon Shape */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 28,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute w-36 h-36 border-2 border-cyan-500/20"
                style={{
                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                }}
              ></motion.div>

              {/* Floating Circles */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -30, 0],
                    x: [0, 25 * Math.cos((i * 2 * Math.PI) / 4), 0],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`absolute w-16 h-16 rounded-full ${
                    i === 0
                      ? 'bg-cyan-500/20'
                      : i === 1
                        ? 'bg-blue-500/20'
                        : i === 2
                          ? 'bg-purple-500/20'
                          : 'bg-pink-500/20'
                  }`}
                  style={{
                    left: `${25 + i * 20}%`,
                    top: `${15 + (i % 3) * 35}%`,
                  }}
                ></motion.div>
              ))}

              {/* Floating Squares */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`square-${i}`}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 5 + i * 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.5,
                  }}
                  className={`absolute w-8 h-8 ${
                    i === 0
                      ? 'bg-blue-400/30'
                      : i === 1
                        ? 'bg-cyan-400/30'
                        : 'bg-purple-400/30'
                  }`}
                  style={{
                    left: `${20 + i * 35}%`,
                    top: `${60 + i * 10}%`,
                  }}
                ></motion.div>
              ))}

              {/* Pulse Dots */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`dot-${i}`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    i === 0
                      ? 'bg-blue-500'
                      : i === 1
                        ? 'bg-cyan-500'
                        : i === 2
                          ? 'bg-purple-500'
                          : 'bg-pink-500'
                  }`}
                  style={{
                    left: `${15 + i * 25}%`,
                    top: `${40 + i * 5}%`,
                  }}
                ></motion.div>
              ))}

              {/* Center Icon */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative z-10"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
                  <Sparkles className="text-white" size={48} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - Animated Cards */}
      <section id="comment-ca-marche" className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Comment ça marche</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {['Crée ton profil', 'CVs personnalisés', 'Candidatures auto'].map((title, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative group"
              >
                {/* Animated Border Gradient */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 blur-sm"></div>

                {/* Card Content */}
                <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-cyan-500/50 transition">
                  {/* Animated Shape Background */}
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className="absolute top-4 right-4 w-24 h-24 border border-blue-500/10 rounded-lg opacity-50"
                  ></motion.div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-cyan-600' : 'bg-purple-600'
                      }`}>
                        {i + 1}
                      </div>
                      <h3 className="text-xl font-semibold">{title}</h3>
                    </div>

                    <p className="text-slate-300">
                      {i === 0
                        ? 'Réponds à 5 questions simples en 3 minutes sur tes compétences et préférences.'
                        : i === 1
                          ? 'Notre IA génère automatiquement des CVs adaptés pour chaque offre d\'emploi.'
                          : 'Envoie automatiquement jusqu\'à 50+ candidatures/mois vers les meilleures offres.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Candidatures/mois', value: '50+' },
              { label: 'Plus de réponses', value: '+60%' },
              { label: 'Temps sauvegardé', value: '20h' },
              { label: 'Gain de chances', value: '300%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Animated Gradient Border on Hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"></div>

                <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                    className="text-4xl font-bold text-cyan-400 mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Animated Background */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <motion.div
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20"
        ></motion.div>

        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer ta recherche d'emploi?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Rejoins les centaines de Camerounais qui trouvent leur emploi plus rapidement
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Commencer maintenant
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problems & Solutions Section - Split Screen */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Le Problème vs La Solution</h2>
            <p className="text-xl text-slate-300">Découvrez comment RecruitAI transforme ta recherche d'emploi</p>
          </div>

          {/* Split Screen Container */}
          <div className="space-y-8">
            {[
              {
                problem: 'Offres dispersées entre LinkedIn, Facebook, WhatsApp, emails',
                solution: 'Centralisation - RecruitAI agrège toutes les offres camerounaises en un seul endroit'
              },
              {
                problem: 'Manque de visibilité auprès des recruteurs camerounais',
                solution: 'Visibilité Pro - Ton profil optimisé visible auprès de 500+ recruteurs'
              },
              {
                problem: 'Coûts élevés: transport, cybercafé, imprimerie pour candidatures',
                solution: 'Économies - Candidatures gratuites: sauvegarde 50 000 FCFA/mois'
              },
              {
                problem: 'Favoritism et réseautage privilégiés vs compétences réelles',
                solution: 'Méritocratie - Portfolio IA qui montre tes vraies compétences'
              },
              {
                problem: 'Arnaqueurs et faux entretiens qui volent ton temps et argent',
                solution: 'Sécurité - Scoring pour identifier les offres fiables et éliminer les arnaqueurs'
              },
              {
                problem: 'Aucun feedback après candidature = démotivation',
                solution: 'Transparence - Suivi complet de chaque candidature en temps réel'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                className="grid md:grid-cols-2 gap-6 items-center"
              >
                {/* Problem Side */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700/30">
                        <span className="text-slate-400 font-bold text-lg">×</span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-medium">{item.problem}</p>
                  </div>
                </div>

                {/* Connector Arrow - Hidden on Mobile */}
                <div className="hidden md:flex justify-center">
                  <div className="text-2xl text-cyan-400">→</div>
                </div>

                {/* Solution Side */}
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-8 md:col-start-2 md:row-start-1">
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-600/30 border border-cyan-500/50">
                        <span className="text-cyan-400 font-bold text-sm">✓</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-cyan-400 font-semibold mb-2">{item.solution.split(' - ')[0]}</p>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.solution.split(' - ')[1]}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center"
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl text-white font-semibold text-lg hover:opacity-90 transition inline-flex items-center gap-2 group"
            >
              Commencer Maintenant
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Company Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">RecruitAI par les chiffres</h2>
            <p className="text-xl text-slate-300">Impact et croissance en Afrique de l'Ouest</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Candidats actifs', value: '12,500+', icon: '👥' },
              { label: 'Offres disponibles', value: '2,400+', icon: '💼' },
              { label: 'Recruteurs partenaires', value: '500+', icon: '🏢' },
              { label: 'Placements réussis', value: '1,850+', icon: '✨' },
              { label: 'Temps moyen d\'embauche', value: '18 jours', icon: '⏱️' },
              { label: 'Taux de réponse moyen', value: '68%', icon: '📈' },
              { label: 'Économies réalisées', value: '250M FCFA', icon: '💰' },
              { label: 'Satisfaction client', value: '4.9/5', icon: '⭐' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (i % 4) * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
