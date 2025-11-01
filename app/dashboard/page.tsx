'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut, Mail, MapPin, Briefcase, Award, User, Target, Phone,
  Linkedin, Globe, ChevronDown, Plus, X, Trash2, AlertCircle
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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['personal']));
  const [editData, setEditData] = useState<any>(null);
  const [newSkill, setNewSkill] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const candidate = profile?.candidate;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');

        // Verify user is authenticated
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/profiles/me', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Impossible de récupérer le profil');
        }

        const data = await response.json();
        if (data.success && data.data) {
          // Check if profile is complete
          const hasCandidate = data.data?.candidate !== null && data.data?.candidate !== undefined;
          const profileCompleted = hasCandidate && (
            data.data.candidate.first_name ||
            data.data.candidate.current_title ||
            data.data.candidate.skills?.length > 0
          );

          // Redirect to onboarding if profile is incomplete
          if (!profileCompleted) {
            console.log('[Dashboard] Profile incomplete, redirecting to onboarding');
            router.push('/onboarding');
            return;
          }

          setProfile(data.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const startEditingSection = (section: string) => {
    setEditingSection(section);
    if (section === 'personal') {
      setEditData({
        firstName: candidate?.firstName || '',
        lastName: candidate?.lastName || '',
        email: candidate?.email || profile?.user.email || '',
        phone: candidate?.phone || '',
        location: candidate?.location || '',
      });
    } else if (section === 'experience') {
      setEditData({
        currentTitle: candidate?.currentTitle || '',
        yearsExperience: candidate?.yearsExperience || '',
        educationLevel: candidate?.educationLevel || '',
        languages: candidate?.languages || [],
      });
    } else if (section === 'preferences') {
      setEditData({
        desiredPositions: candidate?.desiredPositions || [],
        minSalary: candidate?.minSalary || '',
        linkedinUrl: candidate?.linkedinUrl || '',
        portfolioUrl: candidate?.portfolioUrl || '',
      });
    } else if (section === 'skills') {
      setEditData({
        skills: candidate?.skills || [],
      });
    }
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData(null);
    setNewSkill('');
  };

  const saveSection = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profiles/me', {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Update local profile
      if (profile && profile.candidate) {
        setProfile({
          ...profile,
          candidate: {
            ...profile.candidate,
            ...editData,
          },
        });
      }

      setEditingSection(null);
      setEditData(null);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
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

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profiles/delete', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Impossible de supprimer le compte');
      }

      localStorage.removeItem('token');
      router.push('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-gray-900 animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white text-gray-900">
      {/* LEFT SIDEBAR */}
      <div className="hidden lg:flex w-80 flex-col gap-8 border-r border-gray-200 bg-gray-50 p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-black text-gray-900">RecruitAI</h2>
          <p className="mt-1 text-sm text-gray-500">Votre profil candidat</p>
        </motion.div>

        {profile?.user && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="rounded-lg bg-white p-4 border border-gray-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Profil</p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {profile.user.firstName} {profile.user.lastName}
                </p>
                <p className="text-xs text-gray-500 break-all">{profile.user.email}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-4">Actions</p>
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              <Trash2 size={16} />
              Supprimer le compte
            </button>
          </div>
        </motion.div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-6 sm:px-8 py-6 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                Vérifie ton profil
              </h1>
              <p className="text-sm text-gray-500 mt-1">Revois tes informations et modifie-les si nécessaire</p>
            </div>
            <div className="lg:hidden flex gap-2">
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="flex-1 p-6 sm:p-8">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* SECTION 1: Informations Personnelles */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleSection('personal')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Infos personnelles</p>
                    <p className="text-xs text-gray-500">Prénom, email, téléphone, localisation</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.has('personal') ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.has('personal') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 p-4 space-y-4 bg-white"
                  >
                    {editingSection === 'personal' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Prénom"
                            value={editData?.firstName || ''}
                            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Nom"
                            value={editData?.lastName || ''}
                            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={editData?.email || ''}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="tel"
                            placeholder="Téléphone"
                            value={editData?.phone || ''}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Localisation"
                            value={editData?.location || ''}
                            onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={saveSection}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Prénom</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.firstName || '(non renseigné)'}</p>
                          </div>
                          <button
                            onClick={() => startEditingSection('personal')}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                          >
                            Modifier
                          </button>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Nom</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.lastName || '(non renseigné)'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Email</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.email || profile?.user.email}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Téléphone</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.phone || '(non renseigné)'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Localisation</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.location || '(non renseigné)'}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* SECTION 2: Expérience Professionnelle */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleSection('experience')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Briefcase size={20} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Expérience</p>
                    <p className="text-xs text-gray-500">Titre, années, études, langues</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.has('experience') ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.has('experience') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 p-4 space-y-4 bg-white"
                  >
                    {editingSection === 'experience' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Titre actuel"
                            value={editData?.currentTitle || ''}
                            onChange={(e) => setEditData({ ...editData, currentTitle: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="number"
                            placeholder="Années d'expérience"
                            value={editData?.yearsExperience || ''}
                            onChange={(e) => setEditData({ ...editData, yearsExperience: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Niveau d'études"
                            value={editData?.educationLevel || ''}
                            onChange={(e) => setEditData({ ...editData, educationLevel: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 md:col-span-2"
                          />
                          <input
                            type="text"
                            placeholder="Langues (séparées par des virgules)"
                            value={(editData?.languages || []).join(', ') || ''}
                            onChange={(e) => setEditData({ ...editData, languages: e.target.value.split(',').map((l) => l.trim()) })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 md:col-span-2"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={saveSection}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Titre actuel</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.currentTitle || '(non renseigné)'}</p>
                          </div>
                          <button
                            onClick={() => startEditingSection('experience')}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                          >
                            Modifier
                          </button>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Années d'expérience</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.yearsExperience || '(non renseigné)'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Niveau d'études</p>
                            <p className="text-sm text-gray-900 font-medium">{candidate?.educationLevel || '(non renseigné)'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Langues</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {candidate?.languages?.length ? candidate.languages.join(', ') : '(non renseigné)'}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* SECTION 3: Compétences */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Award size={20} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Compétences</p>
                    <p className="text-xs text-gray-500">Tes domaines d'expertise</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.has('skills') ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.has('skills') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 p-4 space-y-4 bg-white"
                  >
                    {editingSection === 'skills' ? (
                      <>
                        <div className="space-y-3">
                          {editData?.skills?.map((skill: string, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium text-gray-900">{skill}</span>
                              <button
                                onClick={() => removeSkill(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ajouter une compétence"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addSkill();
                                e.preventDefault();
                              }
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <button
                            onClick={addSkill}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={saveSection}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {candidate?.skills && candidate.skills.length > 0 ? (
                          <>
                            <div className="flex flex-wrap gap-2">
                              {candidate.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-900 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                            <button
                              onClick={() => startEditingSection('skills')}
                              className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                              Modifier
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditingSection('skills')}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          >
                            Ajouter des compétences
                          </button>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* SECTION 4: Préférences */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white"
            >
              <button
                onClick={() => toggleSection('preferences')}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Target size={20} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Préférences</p>
                    <p className="text-xs text-gray-500">Postes, salaire, liens</p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.has('preferences') ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </motion.div>
              </button>

              <AnimatePresence>
                {expandedSections.has('preferences') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-200 p-4 space-y-4 bg-white"
                  >
                    {editingSection === 'preferences' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Postes souhaités (séparés par des virgules)"
                            value={(editData?.desiredPositions || []).join(', ') || ''}
                            onChange={(e) => setEditData({ ...editData, desiredPositions: e.target.value.split(',').map((p) => p.trim()) })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 md:col-span-2"
                          />
                          <input
                            type="number"
                            placeholder="Salaire attendu (FCFA)"
                            value={editData?.minSalary || ''}
                            onChange={(e) => setEditData({ ...editData, minSalary: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="url"
                            placeholder="URL LinkedIn"
                            value={editData?.linkedinUrl || ''}
                            onChange={(e) => setEditData({ ...editData, linkedinUrl: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="url"
                            placeholder="URL Portfolio"
                            value={editData?.portfolioUrl || ''}
                            onChange={(e) => setEditData({ ...editData, portfolioUrl: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={saveSection}
                            className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
                          >
                            Annuler
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Postes souhaités</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {candidate?.desiredPositions?.length ? candidate.desiredPositions.join(', ') : '(non renseigné)'}
                            </p>
                          </div>
                          <button
                            onClick={() => startEditingSection('preferences')}
                            className="text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                          >
                            Modifier
                          </button>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Salaire attendu</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {candidate?.minSalary ? `${candidate.minSalary.toLocaleString('fr-FR')} FCFA` : '(non renseigné)'}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">LinkedIn</p>
                            {candidate?.linkedinUrl ? (
                              <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Voir le profil
                              </a>
                            ) : (
                              <p className="text-sm text-gray-900 font-medium">(non renseigné)</p>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Portfolio</p>
                            {candidate?.portfolioUrl ? (
                              <a href={candidate.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Voir le portfolio
                              </a>
                            ) : (
                              <p className="text-sm text-gray-900 font-medium">(non renseigné)</p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-sm w-full p-6"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">Supprimer le compte ?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Cette action est irréversible. Toutes tes données seront supprimées définitivement.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
