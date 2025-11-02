'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, Share2, MapPin, DollarSign, Briefcase, Building,
  CheckCircle, AlertCircle, TrendingUp, Zap, Mail, Clock, User
} from 'lucide-react';

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  match_score?: number;
  description: string;
  requirements: string[];
  benefits: string[];
  posted_at: string;
  application_deadline: string;
  job_type: string;
  is_saved: boolean;
  match_details?: {
    experience_match: number;
    skills_match: number;
    location_match: number;
    salary_match: number;
    reason: string;
  };
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // TODO: Replace with actual API endpoint
        // GET /api/jobs/:id
        const mockJob: JobDetail = {
          id: jobId,
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'Douala, Cameroon',
          salary_min: 800000,
          salary_max: 1200000,
          match_score: 95,
          description:
            'We are looking for an experienced Frontend Developer to join our team. You will work on building modern web applications using React and TypeScript. This role offers great learning opportunities and competitive compensation.',
          requirements: [
            '5+ years of React experience',
            'Strong TypeScript knowledge',
            'Experience with Next.js',
            'Understanding of state management (Redux, Context API)',
            'Experience with REST APIs and GraphQL',
          ],
          benefits: [
            'Competitive salary',
            'Remote work options',
            'Health insurance',
            'Professional development allowance',
            '20 days paid leave',
          ],
          posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          job_type: 'CDI',
          is_saved: false,
          match_details: {
            experience_match: 95,
            skills_match: 92,
            location_match: 85,
            salary_match: 100,
            reason: 'Your profile matches 95% with this role. You have all required skills and relevant experience.',
          },
        };

        setJob(mockJob);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement');
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId, router]);

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem('token');

      // TODO: Call application API
      // POST /api/applications with { job_id: jobId }
      // This should trigger the Application Sender n8n workflow

      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (err) {
      setError('Erreur lors de la candidature');
      setApplying(false);
    }
  };

  const handleSave = () => {
    if (job) {
      setJob({ ...job, is_saved: !job.is_saved });
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-gray-900 animate-spin" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Offre non trouvée</h1>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <ArrowLeft size={16} />
            Retour aux offres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between">
          <Link
            href="/jobs"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Retour aux offres
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg border transition-all ${
                job.is_saved
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-900'
              }`}
              title={job.is_saved ? 'Retirer' : 'Ajouter aux favoris'}
            >
              <Heart size={20} fill={job.is_saved ? 'currentColor' : 'none'} />
            </button>
            <button
              className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-900 transition"
              title="Partager"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3"
          >
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-900">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-green-50 border border-green-200 p-4 flex gap-3"
          >
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-green-900 font-medium">Candidature envoyée! Redirection...</p>
          </motion.div>
        )}

        {/* Job Header */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-8 space-y-6"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-3">{job.title}</h1>
            <p className="text-xl text-gray-600">{job.company}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Localisation
              </p>
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                <MapPin size={18} className="text-gray-600" />
                {job.location}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Salaire
              </p>
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                <DollarSign size={18} className="text-gray-600" />
                {job.salary_min?.toLocaleString()} - {job.salary_max?.toLocaleString()}
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Type
              </p>
              <div className="flex items-center gap-2 text-gray-900 font-medium">
                <Briefcase size={18} className="text-gray-600" />
                {job.job_type}
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
                Compatibilité
              </p>
              <div className="flex items-center gap-2 text-blue-900 font-black text-xl">
                <Zap size={20} className="text-blue-600" />
                {job.match_score}%
              </div>
            </div>
          </div>
        </motion.section>

        {/* Match Analysis - 2025 Tendency */}
        {job.match_details && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-green-200 bg-green-50 rounded-lg p-8 space-y-6"
          >
            <div>
              <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                <CheckCircle size={24} className="text-green-600" />
                Analyse de compatibilité
              </h2>
              <p className="text-green-700 mt-2">{job.match_details.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Expérience', score: job.match_details.experience_match },
                { label: 'Compétences', score: job.match_details.skills_match },
                { label: 'Localisation', score: job.match_details.location_match },
                { label: 'Salaire', score: job.match_details.salary_match },
              ].map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <span className="text-sm font-bold text-green-600">{item.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Description */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos du poste</h2>
          <div className="prose prose-sm max-w-none text-gray-600 space-y-4">
            <p>{job.description}</p>
          </div>
        </motion.section>

        {/* Requirements & Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Requirements */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Compétences requises</h2>
            <div className="space-y-2">
              {job.requirements.map((req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{req}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Avantages</h2>
            <div className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
                >
                  <Zap size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-blue-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Info & CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-gray-200 rounded-lg p-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Publié</p>
                <p>{new Date(job.posted_at).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Deadline</p>
                <p>{new Date(job.application_deadline).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Building size={18} className="text-gray-400" />
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Entreprise</p>
                <p>{job.company}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              disabled={applying || success}
              className="flex-1 py-3 rounded-lg bg-gray-900 text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Envoi en cours...
                </>
              ) : success ? (
                <>
                  <CheckCircle size={20} />
                  Candidature envoyée
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Postuler maintenant
                </>
              )}
            </button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

// Add Calendar import
import { Calendar } from 'lucide-react';
