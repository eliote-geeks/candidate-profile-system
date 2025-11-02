'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Mail, Calendar, MessageSquare, FileText, CheckCircle,
  AlertCircle, Clock, Building, MapPin, DollarSign, Download, Trash2
} from 'lucide-react';

interface ApplicationMessage {
  id: string;
  from: 'company' | 'candidate';
  content: string;
  sent_at: string;
  attachment?: string;
}

interface ApplicationDetail {
  id: string;
  job_id: string;
  job_title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  status: 'sent' | 'viewed' | 'interviewing' | 'rejected' | 'accepted';
  applied_at: string;
  last_update: string;
  messages: ApplicationMessage[];
  interview_date?: string;
  cv_used?: string;
  cover_letter_used?: string;
}

export default function ApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const appId = params.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // TODO: Replace with actual API endpoint
        // GET /api/applications/:id
        const mockApp: ApplicationDetail = {
          id: appId,
          job_id: '1',
          job_title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'Douala, Cameroon',
          salary_min: 800000,
          salary_max: 1200000,
          status: 'interviewing',
          applied_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          last_update: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          interview_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          cv_used: 'CV_Senior_Frontend_2025.pdf',
          cover_letter_used: 'Lettre_Motivation_TechCorp.pdf',
          messages: [
            {
              id: '1',
              from: 'company',
              content: 'Merci pour votre candidature! Votre profil nous intéresse beaucoup.',
              sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '2',
              from: 'company',
              content: 'Nous aimerions vous faire passer un entretien technique. Êtes-vous disponible jeudi 14 novembre à 14h?',
              sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              id: '3',
              from: 'candidate',
              content: 'Merci beaucoup! Oui, je suis disponible jeudi 14 novembre à 14h. À bientôt!',
              sent_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            },
          ],
        };

        setApplication(mockApp);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [appId, router]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !application) return;

    setSending(true);
    try {
      // TODO: POST /api/applications/:id/messages
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newMsg: ApplicationMessage = {
        id: Date.now().toString(),
        from: 'candidate',
        content: newMessage,
        sent_at: new Date().toISOString(),
      };

      setApplication({
        ...application,
        messages: [...application.messages, newMsg],
      });
      setNewMessage('');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sent: 'bg-blue-50 border-blue-200',
      viewed: 'bg-yellow-50 border-yellow-200',
      interviewing: 'bg-purple-50 border-purple-200',
      rejected: 'bg-red-50 border-red-200',
      accepted: 'bg-green-50 border-green-200',
    };
    return colors[status] || colors.sent;
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

  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Candidature non trouvée</h1>
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <ArrowLeft size={16} />
            Retour aux candidatures
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
            href="/applications"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Retour
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 sm:px-8 py-8 space-y-8">
        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-lg border ${getStatusColor(application.status)} p-6`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {application.job_title}
              </h1>
              <p className="text-gray-600">{application.company}</p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm bg-white border border-gray-200">
              {application.status === 'interviewing' && (
                <>
                  <Calendar size={18} className="text-purple-600" />
                  <span>Entretien prévu</span>
                </>
              )}
              {application.status === 'accepted' && (
                <>
                  <CheckCircle size={18} className="text-green-600" />
                  <span>Acceptée</span>
                </>
              )}
              {application.status === 'rejected' && (
                <>
                  <AlertCircle size={18} className="text-red-600" />
                  <span>Rejetée</span>
                </>
              )}
              {application.status === 'viewed' && (
                <>
                  <MessageSquare size={18} className="text-yellow-600" />
                  <span>En cours</span>
                </>
              )}
              {application.status === 'sent' && (
                <>
                  <Mail size={18} className="text-blue-600" />
                  <span>Envoyée</span>
                </>
              )}
            </span>
          </div>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Postuler le
            </p>
            <p className="font-medium text-gray-900">
              {new Date(application.applied_at).toLocaleDateString('fr-FR')}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Localisation
            </p>
            <div className="flex items-center gap-1 font-medium text-gray-900">
              <MapPin size={14} />
              {application.location}
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
              Salaire
            </p>
            <p className="font-medium text-gray-900">
              {application.salary_min?.toLocaleString()} - {application.salary_max?.toLocaleString()}
            </p>
          </div>

          {application.interview_date && (
            <div className="rounded-lg bg-green-50 p-4 border border-green-200">
              <p className="text-xs font-semibold uppercase tracking-wide text-green-600 mb-2">
                Entretien
              </p>
              <p className="font-medium text-green-900">
                {new Date(application.interview_date).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </motion.div>

        {/* Documents */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Documents utilisés</h2>
          <div className="space-y-2">
            {application.cv_used && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{application.cv_used}</span>
                </div>
                <button className="p-1 text-gray-600 hover:text-gray-900 transition">
                  <Download size={18} />
                </button>
              </div>
            )}
            {application.cover_letter_used && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-900">{application.cover_letter_used}</span>
                </div>
                <button className="p-1 text-gray-600 hover:text-gray-900 transition">
                  <Download size={18} />
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* Messages Thread - 2025 Chat Style */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="border border-gray-200 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-xl font-bold text-gray-900">Conversation</h2>

          {/* Messages */}
          <div className="space-y-4 max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4">
            {application.messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.from === 'candidate' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                    msg.from === 'candidate'
                      ? 'bg-gray-900 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.from === 'candidate' ? 'text-gray-300' : 'text-gray-500'}`}>
                    {new Date(msg.sent_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !sending) {
                  handleSendMessage();
                }
              }}
              placeholder="Votre message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-gray-900 focus:ring-0 text-sm"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {sending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                </>
              ) : (
                <>
                  <Mail size={16} />
                  Envoyer
                </>
              )}
            </button>
          </div>
        </motion.section>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition">
            Voir l'offre
          </button>
          <button className="flex-1 px-4 py-3 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition flex items-center justify-center gap-2">
            <Trash2 size={16} />
            Supprimer
          </button>
        </div>
      </main>
    </div>
  );
}
