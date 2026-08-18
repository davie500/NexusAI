import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import AboutSection from "@/components/AboutSection";
import PageTransition from "@/components/PageTransition";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Fixed Theme Toggle and Language Selector for mobile */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <LanguageSelector />
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <AboutSection />
        </main>
      </div>
    </PageTransition>
  );
};

export default Index;
