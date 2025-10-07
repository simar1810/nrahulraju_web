"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Star, Shield, Users, Heart, Zap, Dumbbell, Video, Utensils, Package, Calendar, ArrowRight, Loader2, User, Mail, Phone } from "lucide-react";

export default function ProgramsGrid() {
  const [selectedProgram, setSelectedProgram] = useState(null);
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
  const [currentProgram, setCurrentProgram] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  const programs = [
    {
      id: "personal-training",
      title: "Personal Training",
      price: "₹15,000",
      amount: 15000,
      period: "per month",
      badge: "Most Popular",
      headerBg: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
      cardBg: "bg-white",
      buttonColor: "from-blue-500 to-blue-600",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-100",
      features: [
        { icon: <Dumbbell className="w-5 h-5" />, text: "1:1 Personal Training", highlight: "Expert coaching sessions" },
        { icon: <Video className="w-5 h-5" />, text: "Zoom Call Guidance", highlight: "Live workout sessions" },
        { icon: <Utensils className="w-5 h-5" />, text: "Custom Diet Plan", highlight: "Personalized nutrition" },
        { icon: <Heart className="w-5 h-5" />, text: "Lifestyle Coaching", highlight: "Complete transformation" },
        { icon: <Users className="w-5 h-5" />, text: "Monthly Support", highlight: "Ongoing guidance" },
        { icon: <Shield className="w-5 h-5" />, text: "Progress Tracking", highlight: "Regular assessments" }
      ],
      rating: "4.9/5 from 500+ clients"
    },
    {
      id: "herbalife-training",
      title: "Herbalife + Personal Training",
      price: "₹15,000",
      amount: 15000,
      period: "per month",
      badge: "Complete Package",
      headerBg: "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600",
      cardBg: "bg-white",
      buttonColor: "from-green-500 to-green-600",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      shadowColor: "shadow-green-100",
      features: [
        { icon: <Package className="w-5 h-5" />, text: "Herbalife Basic Set", highlight: "Complete nutrition package" },
        { icon: <Dumbbell className="w-5 h-5" />, text: "Premium Personal Training", highlight: "1:1 coaching sessions" },
        { icon: <Video className="w-5 h-5" />, text: "Zoom Call Guidance", highlight: "Live workout sessions" },
        { icon: <Utensils className="w-5 h-5" />, text: "Custom Diet Plan", highlight: "Personalized nutrition" },
        { icon: <Heart className="w-5 h-5" />, text: "Lifestyle Coaching", highlight: "Complete wellness" },
        { icon: <Users className="w-5 h-5" />, text: "Monthly Support", highlight: "Ongoing guidance" }
      ],
      rating: "4.9/5 from 300+ clients"
    },
    {
      id: "general-training",
      title: "General Training",
      price: "₹3,500",
      amount: 3500,
      period: "per month",
      badge: "Best Value",
      headerBg: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-500",
      cardBg: "bg-white",
      buttonColor: "from-orange-500 to-orange-600",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      shadowColor: "shadow-orange-100",
      features: [
        { icon: <Dumbbell className="w-5 h-5" />, text: "Diet & Fitness Program", highlight: "Comprehensive plans" },
        { icon: <Calendar className="w-5 h-5" />, text: "Weekly Zoom Follow-up", highlight: "Once a week guidance" },
        { icon: <Users className="w-5 h-5" />, text: "Monitoring & Support", highlight: "Progress tracking" },
        { icon: <Utensils className="w-5 h-5" />, text: "Custom Diet Plans", highlight: "Personalized nutrition" },
        { icon: <Heart className="w-5 h-5" />, text: "Lifestyle Guidance", highlight: "Wellness support" },
        { icon: <Shield className="w-5 h-5" />, text: "Community Access", highlight: "Connect with others" }
      ],
      rating: "4.8/5 from 1000+ members"
    }
  ];

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

  const createOrder = async (program) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: program.amount,
            note: { client: "nrahulraju", program: program.id },
            type: "nrahulraju",
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create order: ${res.status} - ${errorText}`);
      }

      const orderData = await res.json();
      const order = orderData.data || orderData;
      return order;
    } catch (error) {
      throw error;
    }
  };

  const verifyPayment = async (paymentData, program) => {
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
        amount: program.amount,
      };

      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/razorpay/verify-payment`,
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
        }

        setPaymentSuccess({
          program: program.title,
          amount: program.price,
          name: formData.name
        });
        setFormData({ name: "", email: "", phoneNumber: "" });
        setShowForm(false);
        setShowThankYou(true);
      } else {
        alert(
          `❌ Payment verification failed: ${data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      alert("❌ Payment verification failed. Please contact support.");
    }
  };

  const openRazorpay = async (program) => {
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
      const order = await createOrder(program);

      if (!order.id || !order.amount) {
        throw new Error("Failed to create valid order");
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "nrahulraju Wellness",
        description: `${program.title} - Premium Fitness Program`,
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
            await verifyPayment(paymentData, program);
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
          membership_type: program.id,
          validity: "monthly",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleProgramSelect = (programId) => {
    const program = programs.find(p => p.id === programId);
    setCurrentProgram(program);
    setSelectedProgram(programId);
    setShowForm(true);
    setMobileStep(1);
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 bg-slate-100 text-slate-800 border-slate-200 px-4 py-2 text-sm font-medium"
          >
            💪 Choose Your Fitness Journey
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 bg-clip-text text-transparent leading-tight">
            Our Training Programs
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-3xl mx-auto leading-relaxed">
            Select the perfect program for your fitness goals and budget
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <Card 
              key={program.id} 
              className={`relative ${program.cardBg} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-3xl overflow-hidden ${selectedProgram === program.id ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
            >
              {/* Badge */}
              <div className="absolute top-4 right-4 z-20">
                <Badge className={`${program.badge === 'Most Popular' ? 'bg-blue-500' : program.badge === 'Complete Package' ? 'bg-green-500' : 'bg-orange-500'} text-white border-0 px-3 py-1 rounded-full text-xs font-medium`}>
                  {program.badge}
                </Badge>
              </div>

              {/* Header Section */}
              <div className={`${program.headerBg} p-8 text-white relative overflow-hidden`}>
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none animate-pulse" />
                
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <span className="text-4xl font-bold">{program.price}</span>
                    <Badge className="bg-white/20 text-white border-0 px-3 py-1 rounded-full">
                      {program.period}
                    </Badge>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{program.title}</h3>
                  
                  <div className="flex items-center justify-center gap-2 text-amber-300 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    <span className="text-white/90 ml-2 font-medium text-sm">
                      {program.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Features Section */}
              <div className="p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-6 text-center">
                  What's Included?
                </h4>
                
                <div className="space-y-4">
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-10 h-10 border-2 ${program.borderColor} rounded-xl flex items-center justify-center ${program.iconColor} bg-white`}>
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-800 text-sm mb-1">
                          {feature.text}
                        </h5>
                        <p className="text-slate-600 text-xs">
                          {feature.highlight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="mt-8">
                  <Button
                    onClick={() => handleProgramSelect(program.id)}
                    className={`w-full bg-gradient-to-r ${program.buttonColor} hover:opacity-90 text-white px-6 py-4 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105`}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Choose This Program
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-6">
                  <div className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>30-Day Guarantee</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Free Consultation CTA */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Not Sure Which Program is Right for You?
            </h3>
            <p className="text-slate-600 mb-6">
              Get a FREE personalized consultation to help you choose the perfect program
            </p>
            <Button
              onClick={() => {
                const heroSection = document.getElementById('hero-section');
                if (heroSection) {
                  heroSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get FREE Consultation
            </Button>
          </Card>
        </div>

        {/* Payment Modal */}
        {showForm && currentProgram && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{zIndex: 9999}}>
            <div className="bg-white rounded-2xl p-4 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row gap-4 md:gap-8 relative">
              {/* Cross button at top right */}
              <button
                onClick={() => {
                  setShowForm(false);
                  setMobileStep(1);
                  setCurrentProgram(null);
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
                    mobileStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className="w-8 h-1 bg-gray-200 rounded"></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    mobileStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>
              </div>

              {/* Left: Program Details */}
              <div className={`${mobileStep === 1 ? "block" : "hidden"} md:block flex-1 min-w-[300px] pr-8 relative`}>
                <div className="text-center">
                  <div className={`${currentProgram.headerBg} p-6 rounded-2xl text-white mb-6`}>
                    <h3 className="text-2xl font-bold mb-2">{currentProgram.title}</h3>
                    <div className="text-3xl font-bold mb-2">{currentProgram.price}</div>
                    <div className="text-sm opacity-90">{currentProgram.period}</div>
                  </div>
                  
                  <div className="space-y-3">
                    {currentProgram.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-left">
                        <div className={`w-8 h-8 border-2 ${currentProgram.borderColor} rounded-lg flex items-center justify-center ${currentProgram.iconColor} bg-white`}>
                          {feature.icon}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Mobile continue button */}
                <div className="md:hidden mt-6">
                  <Button
                    onClick={() => setMobileStep(2)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
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
                    className="md:hidden text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="pg_name"
                      className="text-sm font-medium text-slate-700"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="pg_name"
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
                      htmlFor="pg_email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="pg_email"
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
                      htmlFor="pg_phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="pg_phone"
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
                  * Name is required. Please provide either email or phone number.
                </p>
                <div
                  className={`flex gap-3 mt-6 ${mobileStep === 2 ? "flex" : "hidden"} md:flex`}
                >
                  <Button
                    onClick={() => openRazorpay(currentProgram)}
                    disabled={isLoading || !scriptLoaded}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Pay {currentProgram.price} & Join Now
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

        {/* Thank You Modal */}
        {showThankYou && paymentSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{zIndex: 10000}}>
            <div className="bg-white rounded-3xl p-8 w-full max-w-2xl text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
              <div className="absolute top-4 right-4 w-20 h-20 bg-green-100 rounded-full blur-xl opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-100 rounded-full blur-lg opacity-30"></div>
              
              {/* Success Icon */}
              <div className="relative z-10 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Payment Successful! 🎉
                </h2>
                
                <p className="text-lg text-slate-600 mb-6">
                  Thank you, <span className="font-semibold text-green-600">{paymentSuccess.name}</span>!
                </p>
              </div>

              {/* Program Details */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-200">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {paymentSuccess.program}
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-2">
                  {paymentSuccess.amount}
                </p>
                <p className="text-sm text-slate-600">
                  Monthly subscription activated
                </p>
              </div>

              {/* Next Steps */}
              <div className="text-left mb-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                  What happens next?
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Welcome email sent</p>
                      <p className="text-sm text-slate-600">Check your email for program access details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">WhatsApp group invitation</p>
                      <p className="text-sm text-slate-600">You'll receive an invite to our exclusive community</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Program coordinator contact</p>
                      <p className="text-sm text-slate-600">Our team will reach out within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    setShowThankYou(false);
                    setPaymentSuccess(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Continue Exploring
                </Button>
                <Button
                  onClick={() => {
                    const heroSection = document.getElementById('hero-section');
                    if (heroSection) {
                      heroSection.scrollIntoView({ behavior: 'smooth' });
                    }
                    setShowThankYou(false);
                    setPaymentSuccess(null);
                  }}
                  variant="outline"
                  className="flex-1 border-green-500 text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-semibold"
                >
                  Get Free Consultation
                </Button>
              </div>

         
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
