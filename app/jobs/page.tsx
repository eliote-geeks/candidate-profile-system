'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Briefcase, DollarSign, Heart, ArrowRight,
  Filter, ChevronDown, Zap, TrendingUp, CheckCircle, AlertCircle
} from 'lucide-react';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  match_score?: number;
  description: string;
  posted_at: string;
  is_saved: boolean;
}

interface FilterState {
  search: string;
  location: string;
  min_salary: number;
  max_salary: number;
  match_min: number;
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    min_salary: 0,
    max_salary: 999999,
    match_min: 0,
  });

  // Fetch user profile and job matches
  useEffect(() => {
    const fetchJobMatches = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch profile first to ensure user is authenticated
        const profileRes = await fetch('/api/profiles/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!profileRes.ok) {
          router.push('/login');
          return;
        }

        // TODO: Replace with actual job API endpoint
        // This would fetch jobs from database with match scores from job_offers table
        const mockJobs: JobListing[] = [
          {
            id: '1',
            title: 'Senior Frontend Developer',
            company: 'TechCorp',
            location: 'Douala, Cameroon',
            salary_min: 800000,
            salary_max: 1200000,
            match_score: 95,
            description: 'Looking for experienced React developer with TypeScript knowledge',
            posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            is_saved: false,
          },
          {
            id: '2',
            title: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Yaoundé, Cameroon',
            salary_min: 600000,
            salary_max: 900000,
            match_score: 87,
            description: 'Build scalable web applications with Next.js and Node.js',
            posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            is_saved: false,
          },
        ];

        setJobs(mockJobs);
        setFilteredJobs(mockJobs);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des offres');
        setLoading(false);
      }
    };

    fetchJobMatches();
  }, [router]);

  // Apply filters
  useEffect(() => {
    let result = jobs;

    if (filters.search) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.company.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.location) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.min_salary > 0) {
      result = result.filter(job =>
        job.salary_max && job.salary_max >= filters.min_salary
      );
    }

    if (filters.max_salary < 999999) {
      result = result.filter(job =>
        job.salary_min && job.salary_min <= filters.max_salary
      );
    }

    if (filters.match_min > 0) {
      result = result.filter(job =>
        (job.match_score || 0) >= filters.match_min
      );
    }

    setFilteredJobs(result);
  }, [filters, jobs]);

  const handleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, is_saved: !job.is_saved } : job
    ));
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getMatchIcon = (score: number) => {
    if (score >= 90) return <Zap size={16} />;
    if (score >= 75) return <TrendingUp size={16} />;
    return <CheckCircle size={16} />;
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
          <p className="text-gray-600 font-medium">Recherche d'offres...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-white">
      {/* SIDEBAR - Navigation & Filters */}
      <nav className="hidden lg:flex w-80 flex-col border-r border-gray-200 bg-gray-50">
        {/* Header */}
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-black text-gray-900">RecruitAI</h2>
          <p className="mt-1 text-sm text-gray-500">Offres d'emploi</p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-8 space-y-4"
        >
          <div className="rounded-lg bg-white p-4 border border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Résultats
            </p>
            <p className="text-3xl font-black text-gray-900">{filteredJobs.length}</p>
            <p className="text-xs text-gray-500 mt-1">offres correspondent</p>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">
              Score moyen
            </p>
            <p className="text-3xl font-black text-blue-900">
              {Math.round(
                filteredJobs.reduce((sum, job) => sum + (job.match_score || 0), 0) /
                (filteredJobs.length || 1)
              )}%
            </p>
          </div>
        </motion.div>

        {/* Filter Button */}
        <div className="px-8 pb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-gray-200 hover:border-gray-900 transition-all font-medium text-sm text-gray-900 group"
          >
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-600 group-hover:text-gray-900" />
              <span>Filtres avancés</span>
            </div>
            <motion.div
              animate={{ rotate: showFilters ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-8 pb-8 space-y-4 border-t border-gray-200"
            >
              {/* Search */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Poste ou entreprise
                </label>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-0 text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  placeholder="Ville..."
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-0 text-sm"
                />
              </div>

              {/* Match Score */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Score minimum: {filters.match_min}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.match_min}
                  onChange={(e) => setFilters({ ...filters, match_min: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Salary Range */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Salaire: {filters.min_salary.toLocaleString()} - {filters.max_salary.toLocaleString()} FCFA
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="999999"
                    value={filters.min_salary}
                    onChange={(e) => setFilters({ ...filters, min_salary: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                  <input
                    type="range"
                    min="0"
                    max="999999"
                    value={filters.max_salary}
                    onChange={(e) => setFilters({ ...filters, max_salary: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-auto p-8 border-t border-gray-200 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 hover:bg-gray-50 transition"
          >
            <ArrowRight size={16} />
            Retour au profil
          </Link>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white px-6 sm:px-8 py-6 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-black text-gray-900">
              Offres d'emploi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredJobs.length} offre{filteredJobs.length !== 1 ? 's' : ''} correspond{filteredJobs.length !== 1 ? 'ent' : ''} à votre profil
            </p>
          </div>
        </header>

        {/* Mobile Filter Button */}
        <div className="lg:hidden border-b border-gray-200 bg-white px-6 py-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition text-sm font-medium text-gray-900"
          >
            <Filter size={16} />
            Filtrer
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Job Listings */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-5xl mx-auto space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg bg-red-50 border border-red-200 p-4 flex gap-3"
              >
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-medium text-red-900">{error}</p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="popLayout">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-lg border border-gray-200 bg-white p-6 hover:border-gray-900 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Title */}
                        <div>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition"
                          >
                            {job.title}
                          </Link>
                          <p className="text-sm text-gray-600 mt-1">{job.company}</p>
                        </div>

                        {/* Info Row */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-gray-400" />
                            {job.location}
                          </div>
                          {job.salary_min && (
                            <div className="flex items-center gap-1.5">
                              <DollarSign size={16} className="text-gray-400" />
                              {job.salary_min.toLocaleString()} - {job.salary_max?.toLocaleString()} FCFA
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Briefcase size={16} className="text-gray-400" />
                            {new Date(job.posted_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>

                        {/* Description Preview */}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      {/* Right Side: Match Score & Actions */}
                      <div className="flex flex-col items-end gap-4">
                        {/* Match Badge */}
                        {job.match_score && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm ${getMatchColor(job.match_score)}`}
                          >
                            {getMatchIcon(job.match_score)}
                            {job.match_score}%
                          </motion.div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveJob(job.id)}
                            className={`p-2 rounded-lg border transition-all ${
                              job.is_saved
                                ? 'bg-red-50 border-red-300 text-red-600'
                                : 'border-gray-200 text-gray-600 hover:border-gray-900'
                            }`}
                            title={job.is_saved ? 'Retirer' : 'Ajouter aux favoris'}
                          >
                            <Heart
                              size={20}
                              fill={job.is_saved ? 'currentColor' : 'none'}
                            />
                          </button>
                          <Link
                            href={`/jobs/${job.id}`}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 transition flex items-center gap-2"
                          >
                            Voir détails
                            <ArrowRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Aucune offre trouvée
                  </h3>
                  <p className="text-sm text-gray-600">
                    Essayez d'ajuster vos filtres ou revenez plus tard
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
