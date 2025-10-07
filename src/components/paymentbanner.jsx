"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Star,
  Shield,
  Users,
  Zap,
  Heart,
  Loader2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";

export default function PaymentBanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [mobileStep, setMobileStep] = useState(1);
  const formSectionRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      alert("Failed to load payment gateway. Please refresh and try again.");
    };
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

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

  const createOrder = async () => {
    try {
      console.error("Creating order with:", {
        amount: 499,
        note: { client: "nrahulraju" },
        type: "nrahulraju",
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 499, // ₹499 in rupees (backend will multiply by 100)
            note: { client: "nrahulraju" },
            type: "nrahulraju",
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Order creation failed:", res.status, errorText);
        throw new Error(`Failed to create order: ${res.status} - ${errorText}`);
      }

      const orderData = await res.json();
      console.error("Order creation response:", orderData);

      // Check if the response has a data property (common API pattern)
      const order = orderData.data || orderData;
      console.error("Final order object:", order);

      return order;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      // Validate that at least payment ID is present
      if (!paymentData.razorpay_payment_id) {
        throw new Error("Missing payment ID");
      }

      // Check if we have all required parameters for signature verification
      const hasAllParams =
        paymentData.razorpay_order_id &&
        paymentData.razorpay_payment_id &&
        paymentData.razorpay_signature;

      if (!hasAllParams) {
        alert(
          "Payment received! Your payment ID is: " +
          paymentData.razorpay_payment_id +
          "\n\nPlease contact support with this payment ID for manual verification."
        );
        // Reset form
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowForm(false);
        return;
      }

      const verificationPayload = {
        name: formData.name,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
        clientId: "nrahulraju",
        frontEndClient: "nrahulraju",
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
        amount: 499, // Amount in rupees (backend will handle conversion)
      };

      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(verificationPayload),
        }
      );

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text();
        throw new Error(
          `Verification failed: ${verifyRes.status} - ${errorText}`
        );
      }

      const data = await verifyRes.json();

      if (data.success) {
        // Call registration API after successful payment
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register-user`, {
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
        } catch (registrationError) {
          console.error("Registration API Error:", registrationError);
          // Continue with success flow even if registration fails
        }

        alert(
          "🎉 Payment Successful! Welcome to nrahulraju Fitness Community! Check your email/phone for access details."
        );
        // Reset form
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowForm(false);
      } else {
        alert(
          `❌ Payment verification failed: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      alert("❌ Payment verification failed. Please contact support.");
    }
  };

  const openRazorpay = async () => {
    if (!scriptLoaded) {
      alert(
        "Payment gateway is still loading. Please wait a moment and try again."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      alert("Payment configuration error. Please contact support.");
      return;
    }

    setIsLoading(true);

    try {
      const order = await createOrder();

      // Check if order has required fields
      if (!order.id || !order.amount) {
        throw new Error("Failed to create valid order");
      }

      console.log("Razorpay Key ID:", process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      console.log("Order details:", {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "nrahulraju Wellness",
        description: "Premium Fitness Community Membership",
        image: "/photos/nrrLogo.png",
        order_id: order.id,
        handler: async function (response) {
          // Check if we have at least the payment ID
          if (!response.razorpay_payment_id) {
            alert(
              "Payment verification failed: No payment ID received. Please try again."
            );
            setIsLoading(false);
            return;
          }

          // If we're missing order_id or signature, we'll try to verify with just the payment ID
          // This is a fallback for cases where the order_id might be stored in the order object
          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || order?.id, // Use order.id as fallback
            razorpay_signature: response.razorpay_signature || null,
          };

          try {
            await verifyPayment(paymentData);
          } catch (error) {
            alert(
              "Payment verification failed. Please contact support with payment ID: " +
              response.razorpay_payment_id
            );
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phoneNumber,
        },
        notes: {
          membership_type: "nrahulraju",
          validity: "lifetime",
        },
        theme: {
          color: "#059669",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      // @ts-ignore
      const rzp = new window.Razorpay(options);

      // Add error handling for Razorpay
      rzp.on("payment.failed", function (response) {
        alert(
          `Payment failed: ${response.error.description || "Unknown error"}`
        );
        setIsLoading(false);
      });

      rzp.open();
    } catch (error) {
      alert("Failed to initiate payment. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const features = [
    {
      icon: <Star className="w-5 h-5" />,
      text: "Top Performer Bonuses",
      highlight: "Exclusive rewards for top achievers",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Money Back Guarantee",
      highlight: "Risk-free commitment",
    },
    {
      icon: <Heart className="w-5 h-5" />,
      text: "Lifetime App Access",
      highlight: "Access anytime, forever",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Daily Live Sessions",
      highlight: "Stay motivated every day",
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "2 Premium Live Sessions",
      highlight: "Special expert-led events",
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "1:1 Personalized Support",
      highlight: "Direct guidance for your goals",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "WhatsApp Community Support",
      highlight: "Connect & grow together",
    },
  ];

  const benefitItems = [
    { label: "Live Classes (6 × ₹350)................", price: 2100, subtitle: "Access to strenght, Zumba, Pilates, Yoga etc" },
    { label: "Fitness Assessment......................", price: 1950, subtitle: "Blueprint for your best physique" },
    { label: "Accountability Partner...................", price: 597, subtitle: "To guide you every step of the way" },
  ];

  const totalValue = benefitItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <section id="payment-banner" className="relative py-20 px-4 overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),rgba(5,150,105,0.05),transparent_60%)]" />

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-teal-200/20 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-200/25 rounded-full blur-xl animate-pulse delay-500" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 bg-emerald-100 text-emerald-800 border-emerald-200 px-4 py-2 text-sm font-medium"
          >
            🔥 Limited Time Offer
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Join nrahulraju Community
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            Transform your fitness journey with India's premier fitness
            community
          </p>

          <div className="flex items-center justify-center gap-2 text-amber-500 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
            <span className="text-slate-600 ml-2 font-medium">
              4.9/5 from 2,000+ members
            </span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="relative bg-[#F8FCF8] border-0 shadow-2xl shadow-emerald-100/50 p-0 rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 min-h-[600px]">
            {/* Left Column - Pricing Section */}
            <div className="bg-gradient-to-b from-[#008080] to-[#00C8C8] p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
              <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse" />
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/15 rounded-full blur-lg pointer-events-none animate-pulse delay-1000" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/8 rounded-full blur-lg pointer-events-none animate-pulse delay-500" />
              <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-white/12 rounded-full blur-md pointer-events-none animate-pulse delay-700" />
              {/* Pricing */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-6xl font-bold">₹499</span>
                  <Badge className="bg-[#4CAF50] text-white border-0 px-3 py-1 rounded-full">
                    Save 50%
                  </Badge>
                </div>
                <div className="mb-8">
                  <span className="text-4xl text-[#E0E0E0] line-through">
                    ₹1999
                  </span>
                </div>

                {/* Key Benefits */}
                <div className="space-y-4 mb-8">
                  <div className="border-t border-dashed border-white/30 pt-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#008080]" />
                      </div>
                      <span className="text-lg">One Time Payment</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#008080]" />
                      </div>
                      <span className="text-lg">Lifetime Access</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#008080]" />
                      </div>
                      <span className="text-lg">No Hidden Fees</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="text-center relative z-10">
                <Button
                  onClick={() => {
                    console.log("Button clicked, opening modal");
                    setShowForm(true);
                    setMobileStep(1);
                  }}
                  className="w-full bg-gradient-to-r from-[#80D8D8] to-[#B2EBF2] hover:from-[#70C8C8] hover:to-[#A2DBE2] text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started - Join Now
                </Button>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-center gap-6 text-sm mt-6 relative z-10">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>2000+ Happy Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>30-Day Guarantee</span>
                </div>
              </div>
            </div>

            {/* Right Column - Features Section */}
            <div className="bg-white p-8 md:p-12">
              <h2 className="text-3xl font-bold text-[#333333] mb-8">
                Whats in it?
              </h2>

              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-[#80D8D8] rounded-xl flex items-center justify-center text-[#008080]">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#333333] mb-1 flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#008080]" />
                        {feature.text}
                      </h3>
                      <p className="text-[#666666] text-sm">
                        {feature.highlight}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* User Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{zIndex: 9999}}>
            <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-4 md:gap-8 relative">
              {/* Cross button at top right */}
              <button
                onClick={() => {
                  setShowForm(false);
                  setMobileStep(1);
                }}
                className="absolute top-2 right-4 z-10 text-slate-500 hover:text-slate-900 text-3xl"
                aria-label="Close"
              >
                &times;
              </button>
              
              {/* Mobile step indicator */}
              <div className="md:hidden flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    mobileStep === 1 ? 'bg-[#008080] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    mobileStep === 2 ? 'bg-[#008080] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>
              </div>

              {/* Left: Payment Details */}
              <div className={`${mobileStep === 1 ? "block" : "hidden"} md:block flex-1 min-w-[300px] pr-8 relative`}>
                <div className="w-full h-64 md:min-h-[400px] relative">
                  <Image
                    alt=""
                    src="/photos/IMG-20251001-WA0012.jpg"
                    className="min-h-full min-w-full object-cover"
                    fill
                  />
                </div>
                
                {/* Mobile continue button */}
                <div className="md:hidden mt-6">
                  <Button
                    onClick={() => setMobileStep(2)}
                    className="w-full bg-gradient-to-r from-[#008080] to-[#00C8C8] hover:from-[#006666] hover:to-[#00A8A8] text-white"
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
              
              {/* Right: User Details */}
              <div
                ref={formSectionRef}
                className={`${mobileStep === 2 ? "block" : "hidden"} md:block flex-1 min-w-[300px] md:border-l border-gray-200 md:pl-8 pl-0`}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Details
                  </h3>
                  <button
                    onClick={() => setMobileStep(1)}
                    className="md:hidden text-sm text-[#008080] hover:text-[#006666] font-medium"
                  >
                    ← Back
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit number"
                      maxLength={10}
                      className="mt-1"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  * Name is required. Please provide either email or phone
                  number.
                </p>
                <div
                  className={`flex gap-3 mt-6 ${mobileStep === 2 ? "flex" : "hidden"
                    } md:flex`}
                >
                  <Button
                    onClick={openRazorpay}
                    disabled={isLoading || !scriptLoaded}
                    className="flex-1 bg-gradient-to-r from-[#008080] to-[#00C8C8] hover:from-[#006666] hover:to-[#00A8A8] text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Pay ₹499 & Join Now
                      </>
                    )}
                  </Button>
                </div>
                {!scriptLoaded && (
                  <p className="mt-2 text-sm text-slate-500 text-center">
                    Loading payment gateway...
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Trusted by fitness enthusiasts across India
          </p>
          <div className="flex items-center justify-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">2000+</div>
            <div className="text-2xl font-bold text-slate-400">Members</div>
            <div className="text-2xl font-bold text-slate-400">50+</div>
            <div className="text-2xl font-bold text-slate-400">Cities</div>
            <div className="text-2xl font-bold text-slate-400">4.9★</div>
            <div className="text-2xl font-bold text-slate-400">Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
