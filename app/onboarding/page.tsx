import ChatOnboarding from '@/components/ChatOnboarding';

export const metadata = {
  title: 'RecruitAI Cameroun - Créer ton profil',
  description: 'Chat conversationnel IA pour automatiser ta recherche d\'emploi au Cameroun',
};

export default function OnboardingPage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <ChatOnboarding />
    </main>
  );
}
