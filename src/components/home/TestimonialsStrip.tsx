import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

interface TestimonialCard {
  name: string;
  city: string;
  rating: number;
  productUsed: string;
  quote: string;
}

const REVIEWS: TestimonialCard[] = [
  {
    name: 'Sneha Patel',
    city: 'Ahmedabad',
    rating: 5,
    productUsed: 'Hydrating Ceramide Barrier Moisturizer',
    quote: 'My skin barrier had been peeling from retinoids. CBS Hydrating Moisturizer repaired it in less than 5 days. Truly a clinical marvel without greasiness!',
  },
  {
    name: 'Rohit Verma',
    city: 'Bengaluru',
    rating: 5,
    productUsed: 'Ray Barrier Sunscreen Fluid SPF 50+',
    quote: 'Finally a sunscreen that leaves 0% white cast on dusky Indian skin and doesn’t sting the eyes during morning runs. Instant Holy Grail!',
  },
  {
    name: 'Pooja Nair',
    city: 'Kochi',
    rating: 5,
    productUsed: 'Refreshing Gentle Cleanser pH 5.5',
    quote: 'Soap-free and super gentle. My face feels clean, calm and nourished. Ordering the 200ml family pump for my entire household.',
  },
];

export const TestimonialsStrip: React.FC = () => {
  return (
    <section id="testimonials-strip-section" className="py-8 sm:py-12 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E85D5D] block mb-1">
            Real Customer Reviews
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A]">
            Trusted by 50,000+ Indian Skincare Enthusiasts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {REVIEWS.map((r, idx) => (
            <div
              key={idx}
              className="ecom-card bg-[#FAF9F6] p-4 sm:p-6 rounded-2xl relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2D5A3D] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed italic mb-3">
                  "{r.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5E5E5]">
                <p className="text-xs font-bold text-[#1A1A1A]">{r.name}</p>
                <p className="text-[11px] text-[#6B6B6B]">
                  {r.city} • <span className="font-semibold text-neutral-800">{r.productUsed}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
