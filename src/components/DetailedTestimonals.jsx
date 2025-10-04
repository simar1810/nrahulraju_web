"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { name: "IMG-20251001-WA0008", image: "/photos/IMG-20251001-WA0008.jpg" },
  { name: "IMG-20251001-WA0009", image: "/photos/IMG-20251001-WA0009.jpg" },
  { name: "IMG-20251001-WA0010", image: "/photos/IMG-20251001-WA0010.jpg" },
  { name: "IMG-20251001-WA0011", image: "/photos/IMG-20251001-WA0011.jpg" },
  { name: "IMG-20251001-WA0012", image: "/photos/IMG-20251001-WA0012.jpg" },
  { name: "IMG-20251001-WA0013", image: "/photos/IMG-20251001-WA0013.jpg" },
  { name: "IMG-20251001-WA0014", image: "/photos/IMG-20251001-WA0014.jpg" },
  { name: "IMG-20251001-WA0015", image: "/photos/IMG-20251001-WA0015.jpg" },
  { name: "IMG-20251001-WA0016", image: "/photos/IMG-20251001-WA0016.jpg" },
  { name: "IMG-20251001-WA0017", image: "/photos/IMG-20251001-WA0017.jpg" },
];

export default function DetailedTestimonials() {
  const itemsPerSlide = 3; // show 3 at once (desktop)
  const totalSlides = Math.ceil(testimonials.length / itemsPerSlide);

  const [current, setCurrent] = useState(0);

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  const nextSlide = () => setCurrent((prev) => (prev + 1) % totalSlides);

  // Slice testimonials into groups of 3
  const currentItems = testimonials.slice(
    current * itemsPerSlide,
    current * itemsPerSlide + itemsPerSlide
  );

  return (
    <section className="w-full py-12 bg-green-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Carousel */}
        <div className="relative w-full max-w-5xl mx-auto h-[350px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute w-full h-full flex justify-center gap-4"
            >
              {currentItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex-shrink-0 w-1/1 sm:w-1/3 cursor-pointer"
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
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Prev Button */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 transition"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${
                  i === current ? "bg-black" : "bg-gray-300"
                }`}
                animate={{
                  scale: i === current ? 1.3 : 1,
                  opacity: i === current ? 1 : 0.6,
                }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <Button
            className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-xl text-lg font-semibold shadow-lg transition"
            onClick={() => {
              const banner = document.getElementById('payment-banner');
              if (banner) {
                banner.scrollIntoView({ behavior: 'smooth' });
                // Try to open the payment modal after scrolling
                setTimeout(() => {
                  // Find the Get Started button inside the banner and click it
                  const payBtn = banner.querySelector('button');
                  if (payBtn) {
                    payBtn.click();
                  }
                }, 500);
              }
            }}
          >
            Book your Consultation Now
          </Button>
        </div>
      </div>
    </section>
  );
}
