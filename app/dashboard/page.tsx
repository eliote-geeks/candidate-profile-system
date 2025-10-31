'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LogOut, Mail, MapPin, Briefcase, Award, TrendingUp, Send,
  CheckCircle, Clock, User, Code, Globe, FileText, Linkedin
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
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white">Chargement du profil...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Erreur de chargement'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-white"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const user = profile.user;
  const candidate = profile.candidate;
  const stats = profile.statistics;

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            RecruitAI
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 mb-8 border border-slate-600/50"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-slate-400 flex items-center gap-2">
                  <Mail size={16} /> {user.email}
                </p>
              </div>
              {user.isVerified && (
                <span className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded-full text-sm">
                  ✓ Vérifié
                </span>
              )}
            </div>

            {candidate && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-600/50">
                {candidate.currentTitle && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Poste actuel</p>
                      <p className="font-semibold">{candidate.currentTitle}</p>
                    </div>
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Localisation</p>
                      <p className="font-semibold">{candidate.location}</p>
                    </div>
                  </div>
                )}
                {candidate.yearsExperience !== undefined && (
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-cyan-400" />
                    <div>
                      <p className="text-slate-400 text-sm">Expérience</p>
                      <p className="font-semibold">{candidate.yearsExperience} ans</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total', value: stats.total, icon: Send, color: 'from-blue-600' },
              { label: 'Envoyées', value: stats.sent, icon: Send, color: 'from-purple-600' },
              { label: 'Réponses', value: stats.responded, icon: CheckCircle, color: 'from-green-600' },
              { label: 'Entretiens', value: stats.interview, icon: Clock, color: 'from-yellow-600' },
              { label: 'Acceptées', value: stats.accepted, icon: TrendingUp, color: 'from-emerald-600' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} to-slate-800 rounded-xl p-6 border border-slate-600/30`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon size={28} className="opacity-50" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skills & Info */}
          {candidate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50 mb-8"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code size={20} /> Compétences & Infos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidate.skills && candidate.skills.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Compétences</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => (
                        <span key={idx} className="bg-blue-600/30 border border-blue-500/50 text-blue-300 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {candidate.languages && candidate.languages.length > 0 && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Langues</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages.map((lang, idx) => (
                        <span key={idx} className="bg-cyan-600/30 border border-cyan-500/50 text-cyan-300 px-3 py-1 rounded-full text-sm">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-600/50">
                {candidate.linkedinUrl && (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Linkedin size={16} /> LinkedIn
                  </a>
                )}
                {candidate.portfolioUrl && (
                  <a
                    href={candidate.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <Globe size={16} /> Portfolio
                  </a>
                )}
                {candidate.minSalary && (
                  <div className="text-slate-400">
                    Salaire attendu: <span className="text-cyan-400 font-semibold">{candidate.minSalary.toLocaleString()} €</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Applications */}
          {profile.recentApplications && profile.recentApplications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-800/50 rounded-xl p-6 border border-slate-600/50"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText size={20} /> Dernières Candidatures
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {profile.recentApplications.map((app) => (
                  <div key={app.id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/30">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{app.title}</p>
                        <p className="text-sm text-slate-400">{app.company_name} • {app.location}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        app.outcome === 'accepted' ? 'bg-green-600/30 text-green-300' :
                        app.interview_scheduled ? 'bg-blue-600/30 text-blue-300' :
                        app.response_received ? 'bg-purple-600/30 text-purple-300' :
                        'bg-slate-600/30 text-slate-300'
                      }`}>
                        {app.outcome === 'accepted' ? 'Acceptée' :
                         app.interview_scheduled ? 'Entretien' :
                         app.response_received ? 'Réponse' :
                         app.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Envoyée le {new Date(app.sent_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
