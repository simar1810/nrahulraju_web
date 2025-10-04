"use client";
import { Button } from "@/components/ui/button";
import { CheckCircle, Instagram, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function ConsultationSection() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleSmoothScroll = (e) => {
        const target = document.querySelector(
          e.currentTarget.getAttribute("href")
        );
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth" });
        }
      };

      const link = document.querySelector("a[href='#highlight-buttons']");
      if (link) link.addEventListener("click", handleSmoothScroll);

      return () => {
        if (link) link.removeEventListener("click", handleSmoothScroll);
      };
    }
  }, []);
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[var(--background)] text-center">
     
      <div className="max-w-screen-xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--primary-foreground)]">
          Questions?
        </h2>
        <p className="text-lg md:text-xl mb-8 text-[var(--foreground)]">
          Schedule A FREE Consultation Call With One Of Our Experts.
        </p>

        <h3 className="text-xl md:text-2xl font-bold mb-6 text-[var(--primary-foreground)]">
          What To Expect in the FREE Consultation:
        </h3>
        <div className="grid gap-4 max-w-2xl mx-auto mb-12">
          {[
            "Quick understanding of your current situation, health and your fitness goals",
            "Get a custom roadmap to achieve lifelong lasting results.",
            "Clarify & answer any of your questions & doubts.",
          ].map((text, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-[var(--accent)] p-4 rounded-lg shadow-sm"
            >
              <CheckCircle className="w-6 h-6 text-black" />
              <span className="text-base font-medium text-white">{text}</span>
            </div>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--primary-foreground)]">
          Start Your Health Journey With nrahulraju
        </h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-black">
          Our System is so Easy, Sustainable and Doable that it becomes part of
          your lifestyle and the results are sustainable in the long run 😊😉
        </p>

        <div className="text-center mb-12">
          <button
            type="button"
            className="block w-full sm:inline-block sm:w-auto bg-black hover:bg-gray-800 text-[var(--accent-foreground)] px-6 sm:px-8 py-4 rounded-md text-base sm:text-lg font-semibold shadow-lg text-center"
            onClick={() => {
              const banner = document.getElementById('payment-banner');
              if (banner) {
                banner.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {
                  const payBtn = banner.querySelector('button');
                  if (payBtn) {
                    payBtn.click();
                  }
                }, 500);
              }
            }}
          >
            Start Your Personalized Health Plan Now
          </button>
        </div>

        {/* Social Media Links */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 text-[var(--primary-foreground)]">
            Follow Us for More Health Tips & Updates
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Stay connected with us on social media for daily fitness tips, success stories, and exclusive content!
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://instagram.com/nrahulraju"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
            
            <a
              href="https://facebook.com/nrahulraju"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Facebook className="w-5 h-5" />
              Facebook
            </a>
            
            <a
              href="https://m.youtube.com/@nrahulraju9920"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Youtube className="w-5 h-5" />
              YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
