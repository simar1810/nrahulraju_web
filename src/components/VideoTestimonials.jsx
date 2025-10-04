"use client";
import React, { useRef, useState, useEffect } from "react";

const videoTestimonials = [
  {
    id: 1,
    videoUrl:
      "https://drive.google.com/file/d/1tn5zTM8cVX93A8qgqEde7UItapv7_VeZ/preview",
  },
  {
    id: 2,
    videoUrl:
      "https://drive.google.com/file/d/1KWOp9GJBXviyqBSCGZb2NsU0M1YuuyGv/preview",
  },
  {
    id: 3,
    videoUrl:
      "https://drive.google.com/file/d/1gZjoGoG3rwOXeWlCLjW7b050cgVlfOFR/preview",
  },
  {
    id: 4,
    videoUrl:
      "https://drive.google.com/file/d/1NLEV8SvKNHqNOrX-ajUgQrtHBSyuX3-d/preview",
  },
];

export default function VideoTestimonials() {
  const [current, setCurrent] = useState(0);

  // Responsive number of visible videos
  const getVisible = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
    }
    return 3;
  };

  const [visible, setVisible] = useState(getVisible());
  const maxIndex = videoTestimonials.length - visible;

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [maxIndex]);

  // Update visible on resize
  useEffect(() => {
    const handleResize = () => setVisible(getVisible());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Swipe support
  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goLeft();
    if (delta < -50) goRight();
    touchStartX.current = null;
  };

  const goLeft = () => setCurrent((c) => (c === 0 ? maxIndex : c - 1));
  const goRight = () => setCurrent((c) => (c === maxIndex ? 0 : c + 1));

  return (
    <section className="w-full py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Real Results, Real Stories
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Watch how our detox plan has transformed lives across India. These
            are real people sharing their genuine experiences and results.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative max-w-7xl  mx-auto">
          {/* Left button */}
          <button
            onClick={goLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 text-xl"
            aria-label="Previous"
          >
            &#8592;
          </button>

          {/* Slides */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform gap-5 duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(100 / visible) * current}%)`,
              }}
            >
              {videoTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-xl"
                  style={{
                    minWidth: `${100 / visible}%`,
                    maxWidth: `${100 / visible}%`,
                  }}
                >
                  <iframe
                    src={testimonial.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`Testimonial ${testimonial.id}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right button */}
          <button
            onClick={goRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-2 text-xl"
            aria-label="Next"
          >
            &#8594;
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full ${
                  current === i ? "bg-emerald-600" : "bg-slate-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
