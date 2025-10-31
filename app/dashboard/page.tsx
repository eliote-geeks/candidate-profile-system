'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LogOut, Mail, MapPin, Briefcase, Award, TrendingUp, Send,
  CheckCircle, Clock, User, Code, Globe, FileText, Linkedin,
  Zap, Target, BarChart3, Sparkles, Phone, Trash2, ArrowRight,
  Eye, EyeOff, Plus, X
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 400, damping: 40 },
  },
};

const cardVariants: any = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  hover: {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 40 },
  },
};

export default function Dashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [newSkill, setNewSkill] = useState('');

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

        const data = await response.json();
        console.log('Profile response:', data);

        if (data.success && data.data) {
          setProfile(data.data);
        } else {
          setError(data.error || 'Erreur lors de la récupération du profil');
        }
      } catch (err) {
        setError('Une erreur est survenue lors de la récupération du profil');
        console.error('Fetch error:', err);
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

  const handleEditProfile = () => {
    if (profile) {
      const candidateData = profile.candidate || {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        location: '',
        currentTitle: '',
        yearsExperience: 0,
        educationLevel: '',
        skills: [],
        languages: [],
        desiredPositions: [],
        minSalary: 0,
        linkedinUrl: '',
        portfolioUrl: '',
      };
      setEditData(candidateData);
      setEditMode(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/profiles/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      if (data.success) {
        setProfile((prev) =>
          prev
            ? {
              ...prev,
              candidate: {
                ...prev.candidate,
                ...editData,
              },
            }
            : null
        );
        setEditMode(false);
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'SUPPRIMER') {
      alert('Veuillez taper "SUPPRIMER" pour confirmer');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');

      const response = await fetch('/api/profiles/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        router.push('/');
      } else {
        alert('Erreur: ' + data.error);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setSaving(false);
      setShowDeleteModal(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && editData) {
      setEditData({
        ...editData,
        skills: [...(editData.skills || []), newSkill],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    if (editData) {
      setEditData({
        ...editData,
        skills: editData.skills?.filter((_: string, i: number) => i !== index) || [],
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent mx-auto mb-6 animate-spin"></div>
          <p className="text-white text-lg font-medium">Chargement de votre profil...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center backdrop-blur-xl bg-gradient-to-br from-red-950/40 to-slate-900/40 border border-red-500/30 rounded-3xl p-12 max-w-md"
        >
          <p className="text-red-400 mb-8 text-lg">{error || 'Erreur de chargement'}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl transition font-semibold text-white"
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
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-gradient-to-br from-slate-950/80 to-slate-900/80 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent flex items-center gap-2"
          >
            <Sparkles size={28} className="text-cyan-400" />
            RecruitAI
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition px-4 py-2 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 size={18} />
              Supprimer
            </motion.button>
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
            {/* Hero Profile Section */}
            <motion.div
              variants={cardVariants}
              whileHover="hover"
              className="mb-12 relative backdrop-blur-xl bg-gradient-to-br from-cyan-500/10 via-slate-800/30 to-purple-500/10 border border-cyan-500/30 rounded-3xl p-10 overflow-hidden group"
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
                      {user.firstName} {user.lastName}
                    </h1>
                    <div className="flex items-center gap-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail size={18} className="text-cyan-400" />
                        {user.email}
                      </div>
                      {user.isVerified && (
                        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-300 text-sm">
                          <CheckCircle size={16} />
                          Vérifié
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEditProfile}
                    className="px-6 py-3 backdrop-blur-lg bg-gradient-to-r from-cyan-500/40 to-blue-500/40 border border-cyan-500/50 text-cyan-200 rounded-xl hover:from-cyan-500/60 hover:to-blue-500/60 transition font-semibold flex items-center gap-2"
                  >
                    <User size={18} />
                    Éditer
                  </motion.button>
                </div>

                {candidate && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-8 border-t border-cyan-500/20">
                    {candidate.currentTitle && (
                      <motion.div
                        variants={itemVariants}
                        className="group/item p-4 rounded-xl hover:bg-cyan-500/10 transition"
                      >
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Poste actuel</p>
                        <p className="font-semibold text-lg text-white group-hover/item:text-cyan-300 transition">{candidate.currentTitle}</p>
                      </motion.div>
                    )}
                    {candidate.location && (
                      <motion.div
                        variants={itemVariants}
                        className="group/item p-4 rounded-xl hover:bg-cyan-500/10 transition"
                      >
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Localisation</p>
                        <p className="font-semibold text-lg text-white group-hover/item:text-cyan-300 transition">{candidate.location}</p>
                      </motion.div>
                    )}
                    {candidate.yearsExperience !== undefined && candidate.yearsExperience > 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="group/item p-4 rounded-xl hover:bg-cyan-500/10 transition"
                      >
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Expérience</p>
                        <p className="font-semibold text-lg text-white group-hover/item:text-cyan-300 transition">{candidate.yearsExperience} ans</p>
                      </motion.div>
                    )}
                    {candidate.minSalary && candidate.minSalary > 0 && (
                      <motion.div
                        variants={itemVariants}
                        className="group/item p-4 rounded-xl hover:bg-cyan-500/10 transition"
                      >
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Salaire attendu</p>
                        <p className="font-semibold text-lg text-cyan-300 group-hover/item:text-cyan-200 transition">
                          {candidate.minSalary.toLocaleString('fr-FR')} FCFA
                        </p>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Statistics Grid */}
            <motion.div
              variants={itemVariants}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
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
                    variants={cardVariants}
                    whileHover="hover"
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
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-cyan-500/20 transition border border-cyan-500/20 group"
                    >
                      <Linkedin size={20} className="text-cyan-400 group-hover:text-cyan-300 transition" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase">Profil</p>
                        <span className="font-semibold group-hover:text-cyan-300 transition">LinkedIn</span>
                      </div>
                      <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
                    </motion.a>
                  )}
                  {candidate.portfolioUrl && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      href={candidate.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-cyan-500/20 transition border border-cyan-500/20 group"
                    >
                      <Globe size={20} className="text-cyan-400 group-hover:text-cyan-300 transition" />
                      <div>
                        <p className="text-xs text-slate-400 uppercase">Site</p>
                        <span className="font-semibold group-hover:text-cyan-300 transition">Portfolio</span>
                      </div>
                      <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition" />
                    </motion.a>
                  )}
                  {candidate.minSalary && (
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20">
                      <Target size={20} className="text-cyan-400" />
                      <div>
                        <p className="text-slate-400 text-xs uppercase">Salaire min</p>
                        <p className="text-xl font-bold text-cyan-400">{candidate.minSalary.toLocaleString('fr-FR')} FCFA</p>
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

      {/* Edit Profile Modal - 2025 Premium Design */}
      {editMode && editData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setEditMode(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="backdrop-blur-xl bg-gradient-to-br from-slate-800/95 to-slate-900/95 border border-cyan-500/30 rounded-3xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Éditer votre profil
              </h2>
              <button
                onClick={() => setEditMode(false)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                { label: 'Titre actuel', key: 'currentTitle', type: 'text', icon: Briefcase },
                { label: 'Localisation', key: 'location', type: 'text', icon: MapPin },
                { label: 'Années d\'expérience', key: 'yearsExperience', type: 'number', icon: Award },
                { label: 'Niveau d\'études', key: 'educationLevel', type: 'text', icon: User },
                { label: 'Salaire attendu (FCFA)', key: 'minSalary', type: 'number', icon: Target },
                { label: 'Téléphone', key: 'phone', type: 'tel', icon: Phone },
                { label: 'URL LinkedIn', key: 'linkedinUrl', type: 'url', icon: Linkedin },
                { label: 'URL Portfolio', key: 'portfolioUrl', type: 'url', icon: Globe },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key}>
                    <label className="block text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Icon size={16} className="text-cyan-400" />
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={editData[field.key] || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          [field.key]: field.type === 'number' ? (e.target.value ? parseInt(e.target.value) : '') : e.target.value,
                        })
                      }
                      placeholder={field.label}
                      className="w-full backdrop-blur-lg bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-800/70 transition"
                    />
                  </div>
                );
              })}
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <label className="block text-slate-300 text-sm font-semibold mb-4 uppercase tracking-wide flex items-center gap-2">
                <Code size={16} className="text-cyan-400" />
                Compétences
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill();
                    }
                  }}
                  placeholder="Ajouter une compétence..."
                  className="flex-1 backdrop-blur-lg bg-slate-800/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                />
                <button
                  onClick={addSkill}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 border border-cyan-500/50 text-cyan-200 rounded-xl hover:from-cyan-500/60 hover:to-blue-500/60 transition font-semibold flex items-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {editData.skills?.map((skill: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="backdrop-blur-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 text-cyan-200 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 group hover:from-cyan-500/50 hover:to-blue-500/50 transition"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(idx)}
                      className="ml-1 opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-8 border-t border-cyan-500/20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-xl font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Sauvegarder
                  </>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditMode(false)}
                className="flex-1 px-6 py-4 backdrop-blur-lg bg-slate-800/50 border border-slate-600/50 rounded-xl font-semibold text-white hover:bg-slate-800 transition"
              >
                Annuler
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="backdrop-blur-xl bg-gradient-to-br from-red-950/90 to-slate-900/90 border border-red-500/30 rounded-3xl p-10 max-w-md w-full"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-3xl font-bold mb-4 text-red-400">Supprimer le compte</h2>
              <p className="text-slate-300 mb-8">
                Cette action est irréversible. Tous vos données seront définitivement supprimées.
              </p>

              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-4">
                  Tapez <span className="font-bold text-red-400">SUPPRIMER</span> pour confirmer:
                </p>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="SUPPRIMER"
                  className="w-full backdrop-blur-lg bg-slate-800/50 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition text-center font-semibold tracking-wider"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDeleteAccount}
                  disabled={saving || deleteConfirm !== 'SUPPRIMER'}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? '...' : 'Supprimer'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirm('');
                  }}
                  className="flex-1 px-6 py-3 backdrop-blur-lg bg-slate-800/50 border border-slate-600/50 rounded-xl font-semibold text-white hover:bg-slate-800 transition"
                >
                  Annuler
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(34, 211, 238, 0.3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(34, 211, 238, 0.5);
        }
      `}</style>
    </main>
  );
}
