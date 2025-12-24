import { Header } from '@/components/Header';
import { FloatingBitcoins } from '@/components/FloatingBitcoins';
import { HeroStats } from '@/components/HeroStats';
import { TipForm } from '@/components/TipForm';
import { TipFeed } from '@/components/TipFeed';
import { OwnerPanel } from '@/components/OwnerPanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <FloatingBitcoins />
      
      {/* Gradient Overlays */}
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <HeroStats />
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Left Column - Tip Form & Owner Panel */}
          <div className="space-y-8">
            <TipForm />
            <OwnerPanel />
          </div>
          
          {/* Right Column - Tip Feed */}
          <div>
            <TipFeed />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center pb-8">
          <p className="text-sm text-muted-foreground">
            Built on{' '}
            <a 
              href="https://stacks.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Stacks
            </a>
            {' '}— Bitcoin L2 ⚡
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            Contract: STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.tip-jar (Testnet)
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
