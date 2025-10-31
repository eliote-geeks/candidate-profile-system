'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LogOut, Mail, MapPin, Briefcase, Award, TrendingUp, Send,
  CheckCircle, Clock, User, Code, Globe, FileText, Linkedin,
  Zap, Target, BarChart3, Sparkles
} from 'lucide-react';

interface Profile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
  };
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location?: string;
    currentTitle?: string;
    yearsExperience?: number;
    educationLevel?: string;
    skills?: string[];
    languages?: string[];
    desiredPositions?: string[];
    minSalary?: number;
    linkedinUrl?: string;
    portfolioUrl?: string;
  } | null;
  statistics: {
    total: number;
    sent: number;
    responded: number;
    interview: number;
    accepted: number;
  };
  recentApplications: Array<{
    id: string;
    status: string;
    sent_at: string;
    response_received: boolean;
    interview_scheduled: boolean;
    outcome: string;
    title: string;
    location: string;
    company_name: string;
  }>;
}

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/profiles/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil');
        }

        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          setError(data.error || 'Erreur lors de la récupération du profil');
        }
      } catch (err) {
        setError('Une erreur est survenue');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      }
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent mx-auto mb-4 animate-spin"></div>
          <p className="text-white">Chargement de votre profil...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center backdrop-blur-xl bg-slate-900/40 border border-red-500/30 rounded-3xl p-8"
        >
          <p className="text-red-400 mb-6 text-lg">{error || 'Erreur de chargement'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full transition font-semibold text-white"
          >
            Retour à l'accueil
          </button>
        </motion.div>
      </div>
    );
  }

  const user = profile.user;
  const candidate = profile.candidate;
  const stats = profile.statistics;
  const responseRate = stats.total > 0 ? Math.round((stats.responded / stats.total) * 100) : 0;
  const acceptanceRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation - Glass Morphism */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-950/40 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Sparkles size={28} className="text-cyan-400" />
            RecruitAI
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition px-4 py-2 rounded-lg hover:bg-cyan-500/10"
          >
            <LogOut size={18} />
            Déconnexion
          </motion.button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Profile Header - Glass Morphism */}
            <motion.div
              variants={itemVariants}
              className="mb-12 backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/30 rounded-3xl p-10 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-slate-300 flex items-center gap-2 text-lg">
                      <Mail size={18} className="text-cyan-400" /> {user.email}
                    </p>
                  </div>
                  {user.isVerified && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 text-green-300 px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Vérifié
                    </motion.span>
                  )}
                </div>

                {candidate && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-cyan-500/20">
                    {candidate.currentTitle && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition"
                      >
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Briefcase size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wide">Poste actuel</p>
                          <p className="font-semibold text-lg">{candidate.currentTitle}</p>
                        </div>
                      </motion.div>
                    )}
                    {candidate.location && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition"
                      >
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <MapPin size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wide">Localisation</p>
                          <p className="font-semibold text-lg">{candidate.location}</p>
                        </div>
                      </motion.div>
                    )}
                    {candidate.yearsExperience !== undefined && (
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-500/10 transition"
                      >
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Award size={20} className="text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wide">Expérience</p>
                          <p className="font-semibold text-lg">{candidate.yearsExperience} ans</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics Section - 2025 Style */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={28} className="text-cyan-400" />
                Vue d'ensemble
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  {
                    label: 'Total',
                    value: stats.total,
                    icon: Send,
                    gradient: 'from-cyan-500/30 to-blue-500/30',
                    borderColor: 'border-cyan-500/50',
                    iconColor: 'text-cyan-400',
                  },
                  {
                    label: 'Envoyées',
                    value: stats.sent,
                    icon: Send,
                    gradient: 'from-blue-500/30 to-purple-500/30',
                    borderColor: 'border-blue-500/50',
                    iconColor: 'text-blue-400',
                  },
                  {
                    label: 'Taux réponse',
                    value: `${responseRate}%`,
                    icon: CheckCircle,
                    gradient: 'from-green-500/30 to-emerald-500/30',
                    borderColor: 'border-green-500/50',
                    iconColor: 'text-green-400',
                  },
                  {
                    label: 'Entretiens',
                    value: stats.interview,
                    icon: Clock,
                    gradient: 'from-yellow-500/30 to-orange-500/30',
                    borderColor: 'border-yellow-500/50',
                    iconColor: 'text-yellow-400',
                  },
                  {
                    label: 'Taux acceptation',
                    value: `${acceptanceRate}%`,
                    icon: TrendingUp,
                    gradient: 'from-emerald-500/30 to-teal-500/30',
                    borderColor: 'border-emerald-500/50',
                    iconColor: 'text-emerald-400',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, translateY: -5 }}
                    className={`backdrop-blur-xl bg-gradient-to-br ${stat.gradient} border ${stat.borderColor} rounded-2xl p-6 group cursor-pointer relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg bg-slate-900/50 ${stat.iconColor}`}>
                          <stat.icon size={24} />
                        </div>
                        <span className="text-xs text-slate-400 uppercase tracking-wider">KPI</span>
                      </div>
                      <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        {stat.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Skills & Infos */}
            {candidate && (
              <motion.div
                variants={itemVariants}
                className="mb-12 backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/30 rounded-3xl p-10"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <Zap size={28} className="text-cyan-400" />
                  Profil & Compétences
                </h2>

                {(candidate.skills?.length || 0) > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-8"
                  >
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-4 font-semibold">Compétences</p>
                    <div className="flex flex-wrap gap-3">
                      {candidate.skills?.map((skill, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="backdrop-blur-lg bg-gradient-to-br from-cyan-500/40 to-blue-500/40 border border-cyan-500/50 text-cyan-200 px-4 py-2 rounded-full text-sm font-medium hover:from-cyan-500/60 hover:to-blue-500/60 transition cursor-default"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {(candidate.languages?.length || 0) > 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="mb-8"
                  >
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-4 font-semibold">Langues</p>
                    <div className="flex flex-wrap gap-3">
                      {candidate.languages?.map((lang, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="backdrop-blur-lg bg-gradient-to-br from-purple-500/40 to-pink-500/40 border border-purple-500/50 text-purple-200 px-4 py-2 rounded-full text-sm font-medium hover:from-purple-500/60 hover:to-pink-500/60 transition cursor-default"
                        >
                          {lang}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-cyan-500/20">
                  {candidate.linkedinUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-cyan-500/20 transition border border-cyan-500/20"
                    >
                      <Linkedin size={20} className="text-cyan-400" />
                      <span className="font-semibold">Profil LinkedIn</span>
                    </motion.a>
                  )}
                  {candidate.portfolioUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={candidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-cyan-500/20 transition border border-cyan-500/20"
                    >
                      <Globe size={20} className="text-cyan-400" />
                      <span className="font-semibold">Portfolio</span>
                    </motion.a>
                  )}
                  {candidate.minSalary && (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20">
                      <Target size={20} className="text-cyan-400" />
                      <div>
                        <p className="text-slate-400 text-xs uppercase">Salaire attendu</p>
                        <p className="text-xl font-bold text-cyan-400">{candidate.minSalary.toLocaleString()} €</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Recent Applications */}
            {profile.recentApplications?.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="backdrop-blur-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-cyan-500/30 rounded-3xl p-10"
              >
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                  <FileText size={28} className="text-cyan-400" />
                  Dernières Candidatures
                </h2>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-3">
                  {profile.recentApplications.map((app, idx) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.02, translateX: 10 }}
                      className="backdrop-blur-lg bg-gradient-to-r from-slate-700/40 to-slate-800/40 border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/50 transition group cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-bold text-lg text-white group-hover:text-cyan-400 transition">{app.title}</p>
                          <p className="text-sm text-slate-400">{app.company_name} • {app.location}</p>
                        </div>
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          className={`text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap ${
                            app.outcome === 'accepted'
                              ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40 text-green-300 border border-green-500/30'
                              : app.interview_scheduled
                              ? 'bg-gradient-to-r from-blue-500/40 to-cyan-500/40 text-blue-300 border border-blue-500/30'
                              : app.response_received
                              ? 'bg-gradient-to-r from-purple-500/40 to-pink-500/40 text-purple-300 border border-purple-500/30'
                              : 'bg-gradient-to-r from-slate-500/40 to-slate-600/40 text-slate-300 border border-slate-500/30'
                          }`}
                        >
                          {app.outcome === 'accepted'
                            ? '✓ Acceptée'
                            : app.interview_scheduled
                            ? '→ Entretien'
                            : app.response_received
                            ? '✎ Réponse'
                            : app.status}
                        </motion.span>
                      </div>
                      <p className="text-xs text-slate-500">
                        📅 {new Date(app.sent_at).toLocaleDateString('fr-FR', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}
