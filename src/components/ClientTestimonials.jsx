import Image from "next/image";

const testimonials = [
  {
    name: "Pallavi Kale",
    date: "",
    image: null,
    rating: 5,
    text: "I was struggling with hormonal imbalance and constant fatigue. After joining Monali's wellness program, my energy levels skyrocketed, and I lost 8 kg in just two months! The best part is how sustainable and family-friendly the plan is. My sleep has improved, I feel lighter, and my skin is glowing! Monali’s personal journey and practical tips made all the difference.",
  },
  {
    name: "Vilas Lade",
    date: "",
    image: null,
    rating: 5,
    text: "High blood pressure and work stress were taking a toll on me. But with Ashutosh's mentorship and Monali's guidance on nutrition, I reversed my BP levels naturally. They don’t just offer diet plans – they focus on mindset, habits, and long-term wellness. I feel more productive and calm at work. Forever grateful!",
  },
  {
    name: "Manisha Ramteke",
    date: "",
    image: null,
    rating: 5,
    text: "PCOS had made my life miserable — irregular cycles, weight gain, mood swings. But Monali changed everything for me! With her structured support, I've lost 10 kg, my periods are regular now, and migraines have vanished. She truly understands women's issues and guides like a sister. nrahulraju changed my life!",
  },
];

export default function ClientTestimonialsGrid() {
  return (
    <section className="w-full py-12 md:py-14 lg:py-14 bg-white">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-gray-200 p-4 shadow-md text-left flex flex-col"
            >
              <div className="flex items-center gap-3 mb-2">
                {review.image ? (
                  <Image
                    src={review.image}
                    alt={review.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {review.initials}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
                <Image
                  src="/google-icon.svg" // Replace with your own icon
                  alt="Google"
                  width={20}
                  height={20}
                  className="text-blue-800 object-cntain"
                />
              </div>

              <div className="flex items-center mb-2">
                {Array.from({ length: review.rating }).map((_, idx) => (
                  <span key={idx} className="text-yellow-500 text-sm">
                    ★
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-700 line-clamp-3">
                {review.text}
              </p>

              {/* <a className="text-blue-500 text-sm mt-2 cursor-pointer hover:underline">
                Read more
              </a> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
