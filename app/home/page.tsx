'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, MessageSquare, FileText, Calendar, CheckCircle, Clock,
  User, Settings, Moon, Sun, ChevronRight, Zap, TrendingUp, ArrowRight
} from 'lucide-react';
// Removed ThemeContext - using HTML dark mode via class

interface Profile {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  candidate: {
    firstName?: string;
    lastName?: string;
    currentTitle?: string;
    location?: string;
  } | null;
  statistics: {
    total: number;
    sent: number;
    responded: number;
    interview: number;
    accepted: number;
  };
}

interface Candidature {
  id: string;
  job_title: string;
  company: string;
  status: 'sent' | 'viewed' | 'interviewing' | 'rejected' | 'accepted';
  last_update: string;
  messages_count: number;
}

export default function HomePage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>('candidatures');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch profile
        const profileRes = await fetch('/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          router.push('/login');
          return;
        }

        const profileData = await profileRes.json();
        setProfile(profileData);

        // Mock candidatures for now
        const mockCandidatures: Candidature[] = [
          {
            id: '1',
            job_title: 'Senior Frontend Developer',
            company: 'TechCorp',
            status: 'interviewing',
            last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 3,
          },
          {
            id: '2',
            job_title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            status: 'viewed',
            last_update: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 1,
          },
          {
            id: '3',
            job_title: 'Backend Developer',
            company: 'WebAgency',
            status: 'sent',
            last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 0,
          },
        ];
        setCandidatures(mockCandidatures);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      sent: <FileText size={18} className="text-blue-600 dark:text-blue-400" />,
      viewed: <MessageSquare size={18} className="text-yellow-600 dark:text-yellow-400" />,
      interviewing: <Calendar size={18} className="text-purple-600 dark:text-purple-400" />,
      rejected: <Clock size={18} className="text-red-600 dark:text-red-400" />,
      accepted: <CheckCircle size={18} className="text-green-600 dark:text-green-400" />,
    };
    return icons[status] || icons.sent;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      sent: 'Envoyée',
      viewed: 'En cours',
      interviewing: 'Entretien',
      rejected: 'Rejetée',
      accepted: 'Acceptée',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
      viewed: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300',
      interviewing: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
      rejected: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300',
      accepted: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    };
    return colors[status] || colors.sent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-gray-900 dark:border-t-white animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header - 2025 Modern Design */}
      <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              🎯 RecruitAI
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Votre assistant de recrutement IA</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              title={`Mode ${theme === 'light' ? 'sombre' : 'clair'}`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </motion.button>

            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-800 transition"
              title="Déconnexion"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        {/* Welcome Card - Gradient 2025 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 p-8"
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          <div className="relative z-10">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Bienvenue, {profile?.user.firstName || 'candidat'} ! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {profile?.candidate?.currentTitle ? (
                <>L'IA recherche les meilleures offres pour vous en tant que <strong>{profile.candidate.currentTitle}</strong></>
              ) : (
                <>L'IA analyse votre profil et vous propose les meilleures opportunités</>
              )}
            </p>
          </div>
        </motion.div>

        {/* Stats Grid - 2025 Style */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Total candidatures
            </p>
            <p className="text-3xl font-black text-gray-900 dark:text-white">
              {profile?.statistics.total || 0}
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              En cours
            </p>
            <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
              {profile?.statistics.responded || 0}
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Entretiens
            </p>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400">
              {profile?.statistics.interview || 0}
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
              Acceptées
            </p>
            <p className="text-3xl font-black text-green-600 dark:text-green-400">
              {profile?.statistics.accepted || 0}
            </p>
          </div>
        </motion.div>

        {/* Sections - Collapsible with smooth animations */}
        <div className="space-y-4">
          {/* Candidatures Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === 'candidatures' ? null : 'candidatures')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center">
                  <Zap size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Mes candidatures</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{candidatures.length} offres en cours</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === 'candidatures' ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={20} className="text-gray-400 dark:text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSection === 'candidatures' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="p-6 space-y-3">
                    {candidatures.length > 0 ? (
                      candidatures.map((cand, index) => (
                        <motion.div
                          key={cand.id}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex-1 flex items-center gap-3">
                            {getStatusIcon(cand.status)}
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{cand.company}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{cand.job_title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(cand.status)}`}>
                              {getStatusLabel(cand.status)}
                            </span>
                            {cand.messages_count > 0 && (
                              <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                {cand.messages_count} msg
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                        Aucune candidature pour le moment. L'IA en prépare pour vous ! 🚀
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Profil Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === 'profil' ? null : 'profil')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 flex items-center justify-center">
                  <User size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Mon profil</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mes informations et préférences</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === 'profil' ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={20} className="text-gray-400 dark:text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSection === 'profil' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Prénom</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.user.firstName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Nom</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.user.lastName}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</p>
                        <p className="font-medium text-gray-900 dark:text-white break-all">{profile?.user.email}</p>
                      </div>
                      {profile?.candidate?.location && (
                        <div className="col-span-2">
                          <p className="text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 mb-1">Localisation</p>
                          <p className="font-medium text-gray-900 dark:text-white">{profile.candidate.location}</p>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/onboarding"
                      className="w-full mt-4 px-4 py-3 rounded-lg bg-purple-600 dark:bg-purple-700 text-white font-medium hover:bg-purple-700 dark:hover:bg-purple-600 transition flex items-center justify-center gap-2"
                    >
                      Modifier mon profil
                      <ArrowRight size={18} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Paramètres Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
          >
            <button
              onClick={() => setExpandedSection(expandedSection === 'settings' ? null : 'settings')}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-800/50 flex items-center justify-center">
                  <Settings size={24} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Paramètres</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Compte et préférences</p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedSection === 'settings' ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronRight size={20} className="text-gray-400 dark:text-gray-600" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedSection === 'settings' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-800"
                >
                  <div className="p-6 space-y-3">
                    <button className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                      <span className="font-medium text-gray-900 dark:text-white">Notifications</span>
                      <ChevronRight size={18} className="text-gray-400 dark:text-gray-600" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left">
                      <span className="font-medium text-gray-900 dark:text-white">Confidentialité</span>
                      <ChevronRight size={18} className="text-gray-400 dark:text-gray-600" />
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-4 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-left"
                    >
                      <span className="font-medium text-red-700 dark:text-red-300">Se déconnecter</span>
                      <LogOut size={18} className="text-red-700 dark:text-red-300" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8 border-t border-gray-200 dark:border-gray-800"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🤖 L'IA travaille pour vous • Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </motion.div>
      </main>
    </div>
  );
}
