'use client';

import { BarChart3, Users, Send, CheckCircle, TrendingUp, AlertCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Supprimer le token du localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Appeler l'API de déconnexion (optionnel si tu crées le workflow)
      // await fetch('https://reveilart4arist.com/webhook/auth-logout', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      // Rediriger vers la page de login
      router.push('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
      // Rediriger quand même
      router.push('/login');
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            RecruitAI
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/" className="hover:text-cyan-400 transition">Accueil</Link>
            <Link href="/dashboard" className="text-cyan-400">Dashboard</Link>
            <Link href="/settings" className="hover:text-cyan-400 transition">Paramètres</Link>
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
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Bienvenue, Candidat! 👋</h1>
            <p className="text-slate-300">Suivi complet de tes candidatures et opportunités d'emploi</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: <Send className="text-blue-400" size={32} />,
                label: "Candidatures Envoyées",
                value: "0",
                change: "+5 ce mois"
              },
              {
                icon: <CheckCircle className="text-green-400" size={32} />,
                label: "Réponses Reçues",
                value: "0",
                change: "0% du total"
              },
              {
                icon: <Users className="text-purple-400" size={32} />,
                label: "Entretiens Programmés",
                value: "0",
                change: "À venir"
              },
              {
                icon: <TrendingUp className="text-yellow-400" size={32} />,
                label: "Taux de Réussite",
                value: "0%",
                change: "En attente de données"
              }
            ].map((stat, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-xl hover:border-cyan-500/50 transition">
                <div className="mb-4">{stat.icon}</div>
                <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Main Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Candidatures Récentes</h2>

              <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-slate-500 mb-4" />
                <p className="text-slate-300 mb-4">Aucune candidature encore.</p>
                <Link
                  href="/onboarding"
                  className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition"
                >
                  Créer mon profil
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold mb-6">Actions Rapides</h2>
              <div className="space-y-3">
                <Link
                  href="/onboarding"
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg text-center font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                >
                  Mettre à jour le profil
                </Link>
                <button className="w-full px-4 py-3 border border-cyan-500 rounded-lg font-semibold hover:bg-cyan-500/10 transition">
                  Voir les offres
                </button>
                <button className="w-full px-4 py-3 border border-slate-600 rounded-lg font-semibold hover:bg-slate-600/20 transition text-slate-300">
                  Télécharger le rapport
                </button>
                <button className="w-full px-4 py-3 border border-slate-600 rounded-lg font-semibold hover:bg-slate-600/20 transition text-slate-300">
                  Paramètres
                </button>
              </div>

              {/* Tips Section */}
              <div className="mt-8 bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-400 mb-2">💡 Conseil du jour</h3>
                <p className="text-sm text-slate-300">
                  Personnalisez votre profil pour augmenter vos chances de réponse!
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 size={32} className="text-cyan-400" />
              <h2 className="text-2xl font-bold">Analytics</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Répartition des Candidatures</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>En attente</span>
                      <span className="text-slate-400">0</span>
                    </div>
                    <div className="bg-slate-700/50 h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full" style={{width: '0%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Top Secteurs</h3>
                <div className="space-y-2 text-slate-400 text-sm">
                  <p>Aucune candidature envoyée.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
