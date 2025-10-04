import React from "react";

const bonuses = [
  {
    img: "/bonus1.webp", 
    title: "BONUS 1",
    subtitle: "Self Evaluation",
    worth: "Worth ₹ 2,999/-",
  },
  {
    img: "/bonus2.webp",
    title: "BONUS 2",
    subtitle: "30 Fitness Myth Debunked",
    worth: "Worth ₹ 3,999/-",
  },
  {
    img: "/bonus3.webp",
    title: "BONUS 3",
    subtitle: "Powerful Weight Loss Affirmations",
    worth: "Worth ₹ 1,999/-",
  },
  {
    img: "/bonus4.webp",
    title: "BONUS 4",
    subtitle: "Free Access to the WhatsApp Community",
    worth: "Worth ₹ 3,999/-",
  },
  {
    img: "/bonus5.webp",
    title: "BONUS 5",
    subtitle: "Wellness Guide for Busy Professionals- ebook",
    worth: "Worth ₹ 3,599/-",
  },
  {
    img: "/bonus6.webp",
    title: "BONUS 6",
    subtitle: "Time Management - ebook",
    worth: "Worth ₹ 3,599/-",
  },
];

export default function BonusSection() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {bonuses.map((bonus, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-gray-200"
          >
            <img
              src={bonus.img}
              alt={bonus.title}
              className="w-20 h-20 mb-4 object-contain shadow-xl"
              style={{
                background: idx < 3 ? "#8BC34A" : "transparent",
                borderRadius: "8px",
              }}
            />
            <h3 className="text-2xl font-bold mb-2">{bonus.title}</h3>
            <p className="text-lg text-gray-700 font-semibold mb-2">
              {bonus.subtitle}
            </p>
            <p className="text-xl text-blue-600 font-bold">{bonus.worth}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
