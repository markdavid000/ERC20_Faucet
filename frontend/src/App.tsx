import React from "react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/sections/HeroSection";
import { StatsSection } from "./components/sections/StatsSection";
import { FaucetSection } from "./components/sections/FaucetSection";
import { TransferSection } from "./components/sections/TransferSection";
import { AdminSection } from "./components/sections/AdminSection";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/ui/Toast";
import { useContractRead } from "./hooks/useContractRead";
import { useWallet } from "./hooks/useWallet";

function WalletSync() {
  useWallet();
  return null;
}

const App: React.FC = () => {
  useContractRead();

  return (
    <div className="synthetic-void-bg min-h-screen">
      <WalletSync />

      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <HeroSection />
        <StatsSection />
        <FaucetSection />
        <TransferSection />
        <AdminSection />
      </main>
      <Footer />
      <ToastContainer />

      <div className="fixed top-1/4 -right-20 w-[500px] h-[500px] bg-secondary/5 blur-[150px] rounded-full pointer-events-none -z-10" />
      <div className="fixed -bottom-20 -left-20 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
};

export default App;
