'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, MapPin, DollarSign, Clock, CheckCircle, AlertCircle,
  MessageSquare, Calendar, ArrowRight, Filter, ChevronDown, Inbox
} from 'lucide-react';

interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  status: 'sent' | 'viewed' | 'interviewing' | 'rejected' | 'accepted';
  applied_at: string;
  last_update: string;
  messages_count: number;
  interview_scheduled?: string;
  salary_min?: number;
  salary_max?: number;
}

type StatusFilter = 'all' | 'sent' | 'viewed' | 'interviewing' | 'rejected' | 'accepted';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // TODO: Replace with actual API endpoint
        // GET /api/applications
        const mockApplications: Application[] = [
          {
            id: '1',
            job_id: '1',
            job_title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'Douala, Cameroon',
            status: 'interviewing',
            applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 3,
            interview_scheduled: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            salary_min: 800000,
            salary_max: 1200000,
          },
          {
            id: '2',
            job_id: '2',
            job_title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Yaoundé, Cameroon',
            status: 'viewed',
            applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            last_update: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 1,
            salary_min: 600000,
            salary_max: 900000,
          },
          {
            id: '3',
            job_id: '3',
            job_title: 'Backend Developer',
            company: 'WebAgency',
            location: 'Douala, Cameroon',
            status: 'sent',
            applied_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 0,
          },
          {
            id: '4',
            job_id: '4',
            job_title: 'Frontend Developer',
            company: 'OldCompany',
            location: 'Yaoundé, Cameroon',
            status: 'rejected',
            applied_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            last_update: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            messages_count: 2,
          },
        ];

        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [router]);

  // Apply filter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === statusFilter));
    }
  }, [statusFilter, applications]);

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
      sent: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: <FileText size={18} />,
        label: 'Envoyée',
      },
      viewed: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        icon: <MessageSquare size={18} />,
        label: 'En cours',
      },
      interviewing: {
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        icon: <Calendar size={18} />,
        label: 'Entretien',
      },
      rejected: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        icon: <AlertCircle size={18} />,
        label: 'Rejetée',
      },
      accepted: {
        bg: 'bg-green-50',
        text: 'text-green-700',
        icon: <CheckCircle size={18} />,
        label: 'Acceptée',
      },
    };
    return configs[status] || configs.sent;
  };

  const stats = {
    total: applications.length,
    interviewing: applications.filter(a => a.status === 'interviewing').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    pending: applications.filter(a => ['sent', 'viewed'].includes(a.status)).length,
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
          <p className="text-gray-600 font-medium">Chargement des candidatures...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-8">
          <h1 className="text-3xl font-black text-gray-900">Candidatures</h1>
          <p className="text-sm text-gray-500 mt-2">
            Suivi de vos {stats.total} candidature{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="border-b border-gray-200 bg-gray-50 px-6 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            {showStats ? 'Masquer' : 'Afficher'} les statistiques
            <ChevronDown
              size={16}
              className={`transition-transform ${showStats ? 'rotate-180' : ''}`}
            />
          </button>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                {[
                  { label: 'Total', value: stats.total, color: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
                  { label: 'En attente', value: stats.pending, color: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200' },
                  { label: 'Entretiens', value: stats.interviewing, color: 'from-purple-50 to-purple-100', border: 'border-purple-200' },
                  { label: 'Acceptées', value: stats.accepted, color: 'from-green-50 to-green-100', border: 'border-green-200' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-lg bg-gradient-to-br ${stat.color} border ${stat.border} p-4`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Filter & List */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-8 space-y-6">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'sent', 'viewed', 'interviewing', 'rejected', 'accepted'] as StatusFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                statusFilter === filter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter === 'all' ? 'Tout' : getStatusConfig(filter).label}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredApplications.map((app, index) => {
                const statusConfig = getStatusConfig(app.status);
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-900 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Left: Job Info */}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                            {app.job_title}
                          </h3>
                          <p className="text-sm text-gray-600">{app.company}</p>
                        </div>

                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-gray-400" />
                            {app.location}
                          </div>
                          {app.salary_min && (
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} className="text-gray-400" />
                              {app.salary_min.toLocaleString()} - {app.salary_max?.toLocaleString()} FCFA
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-gray-400" />
                            {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {/* Status & Messages */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}
                          >
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>

                          {app.messages_count > 0 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              <MessageSquare size={14} />
                              {app.messages_count} message{app.messages_count > 1 ? 's' : ''}
                            </span>
                          )}

                          {app.interview_scheduled && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              <Calendar size={14} />
                              {new Date(app.interview_scheduled).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: CTA */}
                      <div className="flex gap-2">
                        <Link
                          href={`/applications/${app.id}`}
                          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 font-medium text-sm hover:bg-gray-200 transition flex items-center gap-2"
                        >
                          Détails
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Inbox className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Aucune candidature
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous n'avez pas encore envoyé de candidatures
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition"
              >
                Parcourir les offres
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
