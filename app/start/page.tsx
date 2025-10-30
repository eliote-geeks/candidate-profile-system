'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Target, TrendingUp, Clock, ArrowRight, Users, Briefcase } from 'lucide-react';

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

      {/* Hero Section - Minimal, Action-Oriented */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-300 text-sm font-semibold">12,500+ candidats actifs</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Envoie <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text">50+ candidatures</span> au lieu de 5
          </motion.h1>

          {/* Subheading - More Concrete */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto"
          >
            RecruitAI automatise ta recherche d'emploi: trouve les meilleures offres, génère des CVs adaptés à chaque job, et envoie tes candidatures automatiquement. Le tout en 3 minutes.
          </motion.p>

          {/* Key Metrics - Concrete Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {[
              { metric: '50+', label: 'candidatures/mois' },
              { metric: '+60%', label: 'plus de réponses' },
              { metric: '20h', label: 'temps sauvegardé' },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4"
              >
                <div className="text-3xl font-bold text-cyan-400 mb-1">{item.metric}</div>
                <div className="text-slate-400 text-sm">{item.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Primary CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/onboarding"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-white font-semibold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition inline-flex items-center justify-center gap-2 group"
            >
              Commencer maintenant (gratuit)
              <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-slate-400 text-sm"
          >
            <p>✓ Sans carte bancaire • ✓ Résultats en 24h • ✓ 4.9/5 ⭐</p>
          </motion.div>
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
                  title: 'Crée ton profil',
                  desc: 'Réponds à 5 questions sur tes compétences, tes préférences de job, et ton secteur.',
                  time: '3 min',
                  icon: '📝',
                  color: 'blue',
                },
                {
                  step: 2,
                  title: 'Génère des CVs',
                  desc: 'Notre IA adapte ton CV pour chaque offre d\'emploi automatiquement. Zero effort.',
                  time: 'Instant',
                  icon: '🤖',
                  color: 'cyan',
                },
                {
                  step: 3,
                  title: 'Candidatures auto',
                  desc: 'Envoie jusqu\'à 50+ candidatures/mois en 1 clic. Suivi en temps réel de tes réponses.',
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
                icon: '🤖',
                title: 'Sélection IA intelligente',
                desc: 'L\'algorithme filtre les 1000+ offres quotidiennes pour te proposer seulement celles qui correspondent à ton profil. Zéro perte de temps.',
              },
              {
                icon: '📄',
                title: 'CVs adaptés = Plus de réponses',
                desc: 'Chaque CV est personnalisé avec les mots-clés de l\'offre. +60% de chances de réponse prouvé en AB test.',
              },
              {
                icon: '⚡',
                title: 'Automatisation totale',
                desc: 'Pendant que tu dors, tes candidatures partent automatiquement. Plus besoin de cliquer, remplir, envoyer.',
              },
              {
                icon: '🎯',
                title: 'Scoring "arnaqueur" détection',
                desc: 'Identifie les offres douteuses et les arnaqueurs potentiels. Protège ton temps et ton argent.',
              },
              {
                icon: '📊',
                title: 'Suivi en temps réel',
                desc: 'Dashboard complet: qui a vu ton CV, qui a ignoré, les offres en cours d\'examen. Zéro surprise.',
              },
              {
                icon: '🌍',
                title: 'Aggrégation locale',
                desc: 'Scrape LinkedIn, Facebook, offres privées, emails. Toutes les offres camerounaises en un seul endroit.',
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
              { value: '12,500+', label: 'Candidats actifs' },
              { value: '50+', label: 'Candidatures/mois' },
              { value: '+60%', label: 'Réponses en +' },
              { value: '68%', label: 'Taux de réponse' },
              { value: '20h', label: 'Temps sauvegardé/mois' },
              { value: '18j', label: 'Temps moyen d\'embauche' },
              { value: '4.9/5', label: 'Satisfaction' },
              { value: '1,850+', label: 'Emplois trouvés' },
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
