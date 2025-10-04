"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Zap, User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function HeroSection() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [mobileStep, setMobileStep] = useState(1);
  const formSectionRef = useRef(null);

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 499, // ₹999 in rupees (backend will multiply by 100)
            note: { client: "nrahulraju" },
            type: "nrahulraju",
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create order: ${res.status} - ${errorText}`);
      }

      const orderData = await res.json();

      // Check if the response has a data property (common API pattern)
      const order = orderData.data || orderData;

      return order;
    } catch (error) {
      throw error;
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      if (!paymentData.razorpay_payment_id) {
        throw new Error("Missing payment ID");
      }

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
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowPaymentModal(false);
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
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowPaymentModal(false);
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

      if (!order.id || !order.amount) {
        throw new Error("Failed to create valid order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "nrahulraju Wellness",
        description: "Premium Fitness Community Membership",
        image: "/photos/nrrLogo.png",
        order_id: order.id,
        handler: async function (response) {
          if (!response.razorpay_payment_id) {
            alert(
              "Payment verification failed: No payment ID received. Please try again."
            );
            setIsLoading(false);
            return;
          }

          const paymentData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id || order?.id,
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Show payment modal and reset step
    setShowPaymentModal(true);
    setMobileStep(1);
  };

  return (
    <section className="w-full py-10 md:py-16 bg-[#eeece0] text-center">
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
              One decision. 11 days. A lighter, fresher YOU
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--primary-foreground)] mb-8 leading-tight">
            See the glow, feel the difference in just 11 days - Transform with our
            ₹499 Detox Plan.
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
              Kindly fill the form to grab free personalised one to one consultation
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
                  className="w-full bg-[var(--secondary)] hover:bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-3 relative rounded-md text-lg font-semibold"
                >
                  Buy Now
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

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{zIndex: 9999}}>
            <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-4 md:gap-8 relative">
              {/* Cross button at top right */}
              <button
                onClick={() => {
                  setShowPaymentModal(false);
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
                      htmlFor="hs_name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="hs_name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="hs_email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="hs_email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="hs_phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="hs_phone"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
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
      </div>
    </section>
  );
}
