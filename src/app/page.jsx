import BonusSection from "@/components/BonusSection";
import ClientTestimonialsGrid from "@/components/ClientTestimonials";
import ConsultationSection from "@/components/ConsultationSecction";
import DetailedTestimonials from "@/components/DetailedTestimonals";
import HeroSection from "@/components/HeroSection";
import PaymentBanner from "@/components/paymentbanner";
import ProgramsGrid from "@/components/ProgramsGrid";
import SocialProofSection from "@/components/SocialProof";
import VideoTestimonials from "@/components/VideoTestimonials";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#eeece0] text-gray-900">
      <HeroSection />
      <DetailedTestimonials />
      <SocialProofSection />
      <ProgramsGrid />
      {/* <PaymentBanner /> */}
      <BonusSection />
      {/* <VideoTestimonials /> */}
      <ClientTestimonialsGrid />
      <ConsultationSection />
    </div>
  );
}
