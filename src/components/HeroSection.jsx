"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const benefitItems = [
    {
      label: "Live Classes (6 × ₹350)................",
      price: 2100,
      subtitle: "Access to Strenght, Zumba, Pilates, Yoga etc",
    },
    {
      label: "Fitness Assessment......................",
      price: 1950,
      subtitle: "Blueprint for your best physique",
    },
    {
      label: "Accountability Partner...................",
      price: 597,
      subtitle: "To guide you every step of the way",
    },
  ];

  const totalValue = benefitItems.reduce((sum, item) => sum + item.price, 0);

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Please enter your name");
      return false;
    }

    if (!formData.email && !formData.phoneNumber) {
      alert("Please provide either email or phone number");
      return false;
    }

    if (formData.phoneNumber && formData.phoneNumber.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleRegistration = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          frontEndClient: "nrahulraju",
        }),
      });

      if (response.ok) {
        setRegistrationSuccess({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        });
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowThankYou(true);
      } else {
        alert("❌ Registration failed. Please try again or contact support.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      alert("❌ Registration failed. Please try again or contact support.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegistration();
  };

  return (
    <section id="hero-section" className="w-full py-10 md:py-16 bg-[#eeece0] text-center">
      <div className="max-w-screen-xl left mx-auto px-4 md:px-6">
        {/* Logo */}
        <div className="flex md:justify-start justify-center md:-left-10 md:-ml-35 items-center mb-7">
          <Image
            src="/photos/nrrLogo.png"
            alt="Logo"
            width={200}
            height={200}
            className="h-20 w-20 md:h-40 md:w-40 rounded-lg"
          />
        </div>

        {/* Top Banner */}
        <div className="md:-mt-45">
          <div className="bg-[var(--secondary)] text-[var(--secondary-foreground)] text-center p-4 rounded-2xl mb-8 max-w-4xl mx-auto">
            <p className="text-xl md:text-2xl font-semibold">
              One decision. Transform your life. A healthier, stronger YOU
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--primary-foreground)] mb-8 leading-tight">
            See the glow, feel the difference - Transform with our
            personalized fitness programs.
          </h1>

          {/* Highlight Buttons */}
        </div>

        {/* Video + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start place-items-center mx-auto max-w-5xl">
          <div className="relative w-full aspect-video min-h-[315px] bg-[var(--muted)] rounded-lg overflow-hidden">
           <img src="/photos/IMG-20251001-WA0008.jpg" alt="Hero Section" className="absolute top-0 left-0 w-full h-full object-cover" />
          </div>

          <div className="w-full bg-[var(--card)] p-6 md:p-8 rounded-lg shadow-lg border border-[var(--border)] text-left">
            <h2 className="text-xl md:text-2xl font-bold text-[var(--primary-foreground)] mb-6 text-center md:text-left">
              Get FREE Consultation - Fill the form below for personalized one-to-one guidance
            </h2>
            <form className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Full Name"
                className="w-full"
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full"
              />
              <div className="flex items-center border border-[var(--border)] rounded-md overflow-hidden">
                <span className="px-3 text-[var(--secondary)]">+91</span>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="flex-1 border-l border-[var(--border)] focus:outline-none"
                />
              </div>
              <div className="relative w-full">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[var(--secondary)] hover:bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-3 relative rounded-md text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Get FREE Consultation"
                  )}
                </Button>
                <div className="px-3 absolute -top-2 -right-2 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-md">
                  Limited time offer
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              "5+ Years of Experience",
              "5000+ Happy Client Results",
              "Dedicated Dietitians",
              "No Bounce Back",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-2"
              >
                <div className="w-6 h-6 bg-[var(--secondary)] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-[var(--accent-foreground)]" />
                </div>
                <span className="text-sm sm:text-base font-medium text-black">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Thank You Modal */}
        {showThankYou && registrationSuccess && (
          <div className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4" style={{zIndex: 10000}}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg text-center relative shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowThankYou(false);
                  setRegistrationSuccess(null);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-2xl"
                aria-label="Close"
              >
                ×
              </button>
              
              {/* Success Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Registration Successful! 🎉
                </h2>
                
                <p className="text-slate-600 mb-4">
                  Thank you, <span className="font-semibold text-emerald-600">{registrationSuccess.name}</span>!
                </p>
              </div>

              {/* Consultation Details */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 mb-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Free Consultation Booked
                </h3>
                <p className="text-emerald-600 font-semibold mb-1">
                  Personalized 1:1 Session
                </p>
                <p className="text-sm text-slate-600">
                  We'll contact you within 24 hours
                </p>
              </div>

              {/* Next Steps */}
              <div className="text-left mb-6">
                <h4 className="text-base font-semibold text-slate-800 mb-3 text-center">
                  What happens next?
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Consultation call scheduled</p>
                      <p className="text-xs text-slate-600">Our team will call you within 24 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Personalized fitness assessment</p>
                      <p className="text-xs text-slate-600">We'll analyze your goals and create a custom plan</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Program recommendations</p>
                      <p className="text-xs text-slate-600">Get expert advice on the best program for you</p>
                    </div>
                  </div>
                </div>
              </div>

            

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowThankYou(false);
                    setRegistrationSuccess(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Continue Exploring
                </Button>
                <Button
                  onClick={() => {
                    const programsSection = document.querySelector('[id*="program"]');
                    if (programsSection) {
                      programsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    setShowThankYou(false);
                    setRegistrationSuccess(null);
                  }}
                  variant="outline"
                  className="flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  View Programs
                </Button>
              </div>

              {/* Contact Info */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-1">
                  Questions about your consultation?
                </p>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span className="text-slate-600">📞 +91 98765 43210</span>
                  <span className="text-slate-600">✉️ support@nrahulraju.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
