import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  Flower2,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';

const services = [
  {
    icon: Droplets,
    title: 'Facial Treatments',
    description: 'Clinical glow rituals that hydrate, brighten and support your skin barrier.',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    icon: Scissors,
    title: 'Hair Care',
    description: 'Luxury scalp therapies and finishing rituals for healthy, glossy movement.',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
  },
  {
    icon: Sparkles,
    title: 'Body Spa',
    description: 'Relaxing full-body rituals that restore softness, balance and calm.',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
  },
  {
    icon: Flower2,
    title: 'Bridal Makeup',
    description: 'Flawless makeup artistry designed for luminous, long-lasting celebration days.',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    icon: Sparkles,
    title: 'Nail Art',
    description: 'Precision nail styling and spa care with a refined, modern finish.',
    image:
      'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&w=900&q=80',
  },
  {
    icon: ShieldCheck,
    title: 'Skin Consultation',
    description: 'Personalized treatment planning for your skin goals and daily wellness routine.',
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
  },
];

const features = [
  {
    icon: BadgeCheck,
    title: 'Expert Therapists',
    description: 'Certified beauty and skincare specialists creating elevated experiences.',
  },
  {
    icon: Flower2,
    title: 'Organic Products',
    description: 'Thoughtful botanical formulations chosen for gentle, visible results.',
  },
  {
    icon: ShieldCheck,
    title: 'Hygienic Environment',
    description: 'Sanitized spaces and meticulous standards for complete peace of mind.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Care',
    description: 'Each treatment is tailored to your skin, tone, goals and lifestyle.',
  },
];

const galleryFilters = ['All', 'Skin', 'Hair', 'Makeup'];

const galleryItems = [
  {
    category: 'Skin',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Hair',
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Makeup',
    image:
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Skin',
    image:
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Hair',
    image:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  {
    category: 'Makeup',
    image:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80',
  },
];

const testimonials = [
  {
    name: 'Aarohi Sharma',
    role: 'Bride to be',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    review:
      'The facial experience felt luxurious and deeply personalized. My skin looked brighter and calmer for weeks.',
  },
  {
    name: 'Meher Patel',
    role: 'Wellness client',
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
    review:
      'Every detail felt considered—from the consultation to the glow ritual. The results were visible and long-lasting.',
  },
  {
    name: 'Naina Kapoor',
    role: 'Salon regular',
    image:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80',
    review:
      'A perfect blend of clinical expertise and relaxing care. I finally found a place that understands my skin.',
  },
];

const pricing = [
  {
    name: 'Glow',
    price: '₹2,499',
    description: 'Perfect for a quick refresh and weekly maintenance.',
    features: ['Signature facial', 'Deep cleanse', 'Hydration boost'],
    featured: false,
  },
  {
    name: 'Radiance',
    price: '₹4,999',
    description: 'Best for smooth texture, brightening and long-lasting glow.',
    features: ['Advanced derm facial', 'Scalp ritual', 'LED therapy'],
    featured: true,
  },
  {
    name: 'Luxury',
    price: '₹8,999',
    description: 'A complete spa-level reset with premium finishing rituals.',
    features: ['Full ritual experience', 'Tailored nutrition plan', 'Priority booking'],
    featured: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export const LuxuryBeautyLanding: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sliderValue, setSliderValue] = useState(52);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    service: 'Facial Treatments',
    date: '',
    time: '10:30 AM',
    message: '',
  });
  const [bookingState, setBookingState] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredGallery = useMemo(() => {
    if (selectedFilter === 'All') return galleryItems;
    return galleryItems.filter(item => item.category === selectedFilter);
  }, [selectedFilter]);

  const handleChange = (key: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) {
      setBookingState({ type: 'error', message: 'Please complete your name, phone, and preferred date.' });
      return;
    }

    setBookingState({ type: 'success', message: 'Your consultation request has been sent. We will contact you soon.' });
    setBookingForm({
      name: '',
      phone: '',
      service: 'Facial Treatments',
      date: '',
      time: '10:30 AM',
      message: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2D2D]">
      <section id="top" className="relative isolate overflow-hidden bg-[#FAF7F2]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1800&q=80"
            alt="Spa and skincare luxury portrait"
            className="h-full w-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,247,242,0.88),rgba(250,247,242,0.55),rgba(250,247,242,0.24))]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center rounded-full border border-[#C75B7A]/20 bg-white/55 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-[#C75B7A] backdrop-blur-md"
            >
              Luxury beauty • wellness • glow
            </motion.p>

            <motion.h1
              variants={fadeUp}
              transition={{ delay: 0.2 }}
              className="font-display text-5xl leading-none tracking-[-0.05em] text-[#2D2D2D] sm:text-6xl lg:text-7xl"
            >
              Reveal Your
              <span className="block text-[#C75B7A]">Natural Radiance</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ delay: 0.35 }}
              className="mt-6 max-w-xl text-base leading-7 text-[#2D2D2D]/75 sm:text-lg"
            >
              Premium beauty & skincare solutions tailored to your unique glow, blending clinical expertise with a deeply calming luxury experience.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ delay: 0.45 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <a
                href="#booking"
                className="inline-flex items-center justify-center rounded-full bg-[#C75B7A] px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(199,91,122,0.25)] transition hover:-translate-y-0.5 hover:bg-[#b64d69]"
              >
                Book a Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-[#2D2D2D]/15 bg-white/50 px-6 py-3 text-sm font-semibold text-[#2D2D2D] backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-[#C75B7A]/30 hover:text-[#C75B7A]"
              >
                Explore Services
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ delay: 0.55 }}
              className="mt-10 flex flex-wrap gap-4 text-sm text-[#2D2D2D]/75"
            >
              {['500+ Happy Clients', 'Certified Experts', 'Premium Products'].map(item => (
                <div key={item} className="flex items-center gap-2 rounded-full border border-white/60 bg-white/35 px-3 py-2 backdrop-blur-sm">
                  <BadgeCheck className="h-4 w-4 text-[#C75B7A]" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="services" className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C75B7A]">Our services</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#2D2D2D] sm:text-5xl">
              Tailored rituals for your glow
            </h2>
          </div>
          <a href="#booking" className="hidden text-sm font-medium text-[#2D2D2D] md:inline-flex items-center gap-2">
            Book your session <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group overflow-hidden rounded-[28px] border border-[#2D2D2D]/5 bg-white/80 p-3 shadow-[0_20px_60px_rgba(45,45,45,0.04)]"
              >
                <div className="overflow-hidden rounded-[22px]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-2 pb-2 pt-5">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8E8E8] text-[#C75B7A]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-2xl text-[#2D2D2D]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#2D2D2D]/70">{service.description}</p>
                  <a href="#booking" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C75B7A]">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="about" className="relative overflow-hidden bg-[#F8E8E8]/40 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -left-6 top-10 h-32 w-32 rounded-full bg-[#F8E8E8] blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1200&q=80"
              alt="Beauty consultant with glowing skin"
              className="h-[560px] w-full rounded-[32px] object-cover shadow-[0_30px_80px_rgba(45,45,45,0.1)]"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C75B7A]">Why choose us</p>
            <h2 className="mt-4 font-display text-4xl tracking-[-0.05em] text-[#2D2D2D] sm:text-5xl">
              Beauty care rooted in science and soul
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#2D2D2D]/70">
              We blend expert beauty guidance, skin-first rituals and a deeply calming atmosphere to help every client feel seen, cared for and beautifully confident.
            </p>

            <div className="mt-8 space-y-5">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-start gap-4 rounded-[24px] border border-[#2D2D2D]/5 bg-white/75 p-4 shadow-[0_16px_40px_rgba(45,45,45,0.04)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8E8E8] text-[#C75B7A]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-[#2D2D2D]">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[#2D2D2D]/70">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C75B7A]">Transformation gallery</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#2D2D2D] sm:text-5xl">
              Before & after, beautifully showcased
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {galleryFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  selectedFilter === filter
                    ? 'bg-[#2D2D2D] text-white'
                    : 'bg-[#F8E8E8] text-[#2D2D2D] hover:bg-[#F1D7D7]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-[#2D2D2D]/5 bg-white p-4 shadow-[0_25px_60px_rgba(45,45,45,0.05)]">
            <div className="relative overflow-hidden rounded-[22px]">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1400&q=80"
                alt="Before and after skincare result"
                className="h-[420px] w-full object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-[52%] overflow-hidden border-r-2 border-white bg-white/10 backdrop-blur-[1px]">
                <img
                  src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=80"
                  alt="Before skincare result"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-y-0 left-[52%] flex items-center">
                <div className="h-10 w-10 -translate-x-1/2 rounded-full border-2 border-white bg-[#FAF7F2] text-[#2D2D2D] shadow-lg">
                  <div className="flex h-full items-center justify-center">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={event => setSliderValue(Number(event.target.value))}
                className="absolute inset-x-0 bottom-4 mx-auto w-[88%] accent-[#C75B7A]"
                aria-label="Before and after comparison"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredGallery.slice(0, 4).map(item => (
              <div key={`${item.category}-${item.image}`} className="overflow-hidden rounded-[24px] bg-white p-2 shadow-[0_18px_40px_rgba(45,45,45,0.04)]">
                <img src={item.image} alt={item.category} className="h-40 w-full rounded-[18px] object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-[#2D2D2D] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">Client stories</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-white sm:text-5xl">
                Loved by clients who want lasting glow
              </h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((person, index) => (
              <motion.article
                key={person.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <img src={person.image} alt={person.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <h3 className="font-display text-2xl text-white">{person.name}</h3>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/60">{person.role}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-1 text-[#D4AF37]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={starIndex} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-7 text-white/80">“{person.review}”</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C75B7A]">Packages</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#2D2D2D] sm:text-5xl">
            Choose a ritual that fits your glow
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map(plan => (
            <div
              key={plan.name}
              className={`rounded-[30px] border p-6 shadow-[0_20px_60px_rgba(45,45,45,0.04)] ${
                plan.featured
                  ? 'border-[#C75B7A]/30 bg-[linear-gradient(180deg,#F8E8E8_0%,#fff_100%)] shadow-[0_30px_70px_rgba(199,91,122,0.12)]'
                  : 'border-[#2D2D2D]/5 bg-white'
              }`}
            >
              {plan.featured && (
                <div className="mb-5 inline-flex rounded-full bg-[#C75B7A] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Most Popular
                </div>
              )}
              <h3 className="font-display text-3xl text-[#2D2D2D]">{plan.name}</h3>
              <div className="mt-5 flex items-end gap-2">
                <span className="font-display text-5xl leading-none text-[#2D2D2D]">{plan.price}</span>
                <span className="pb-1 text-sm text-[#2D2D2D]/60">/ session</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#2D2D2D]/70">{plan.description}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-[#2D2D2D]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#F8E8E8] text-[#C75B7A]">
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="#booking"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.featured
                    ? 'bg-[#C75B7A] text-white hover:bg-[#b64d69]'
                    : 'border border-[#2D2D2D]/10 bg-[#FAF7F2] text-[#2D2D2D] hover:border-[#C75B7A]/20 hover:text-[#C75B7A]'
                }`}
              >
                Book Now
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="bg-[linear-gradient(135deg,#F8E8E8_0%,#FAF7F2_100%)] py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div className="rounded-[30px] bg-[#2D2D2D] p-7 text-white shadow-[0_25px_60px_rgba(45,45,45,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">Book with us</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.05em] text-white">Plan your next glow session</h2>
            <div className="mt-8 space-y-5 text-sm text-white/75">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 text-[#D4AF37]" />
                <span>28 Rose Avenue, Studio 4, Bengaluru</span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 text-[#D4AF37]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-1 h-4 w-4 text-[#D4AF37]" />
                <span>Mon-Sat: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
            <div className="mt-8 h-40 rounded-[24px] bg-[radial-gradient(circle_at_center,_rgba(212,175,55,0.3),_transparent_60%)] p-4">
              <div className="flex h-full items-center justify-center rounded-[18px] border border-dashed border-white/20 text-center text-sm text-white/70">
                Map Location Placeholder
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[30px] border border-[#2D2D2D]/5 bg-white p-6 shadow-[0_20px_60px_rgba(45,45,45,0.05)] sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D]">
                <span>Name</span>
                <input
                  value={bookingForm.name}
                  onChange={event => handleChange('name', event.target.value)}
                  className="w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                  placeholder="Your full name"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D]">
                <span>Phone</span>
                <input
                  value={bookingForm.phone}
                  onChange={event => handleChange('phone', event.target.value)}
                  className="w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                  placeholder="+91 98xxxxxxx"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D]">
                <span>Service</span>
                <select
                  value={bookingForm.service}
                  onChange={event => handleChange('service', event.target.value)}
                  className="w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                >
                  <option>Facial Treatments</option>
                  <option>Hair Care</option>
                  <option>Body Spa</option>
                  <option>Bridal Makeup</option>
                  <option>Nail Art</option>
                  <option>Skin Consultation</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D]">
                <span>Date</span>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={event => handleChange('date', event.target.value)}
                  className="w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D] sm:col-span-2">
                <span>Preferred Time</span>
                <input
                  value={bookingForm.time}
                  onChange={event => handleChange('time', event.target.value)}
                  className="w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                  placeholder="10:30 AM"
                />
              </label>
              <label className="space-y-2 text-sm font-medium text-[#2D2D2D] sm:col-span-2">
                <span>Message</span>
                <textarea
                  value={bookingForm.message}
                  onChange={event => handleChange('message', event.target.value)}
                  className="min-h-[120px] w-full rounded-2xl border border-[#2D2D2D]/10 bg-[#FAF7F2] px-4 py-3 outline-none transition focus:border-[#C75B7A]"
                  placeholder="Tell us about your skin goals or preferred treatment..."
                />
              </label>
            </div>

            {bookingState && (
              <div
                className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                  bookingState.type === 'success'
                    ? 'bg-[#E8F7EE] text-[#1B5E3F]'
                    : 'bg-[#FDECEC] text-[#9A3C3C]'
                }`}
              >
                {bookingState.message}
              </div>
            )}

            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[#C75B7A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b64d69]"
            >
              Reserve My Slot
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-[#2D2D2D]/5 bg-[#FAF7F2] py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E8E8] text-[#C75B7A]">C</div>
              <div>
                <p className="font-display text-3xl text-[#2D2D2D]">Care</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-[#2D2D2D]/70">
              A wellness sanctuary for beauty, confidence and calm—built around expert care and skin-first rituals.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C75B7A]">Quick links</p>
            <ul className="mt-5 space-y-3 text-sm text-[#2D2D2D]/75">
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C75B7A]">Services</p>
            <ul className="mt-5 space-y-3 text-sm text-[#2D2D2D]/75">
              <li>Facial Treatments</li>
              <li>Hair Care</li>
              <li>Body Spa</li>
              <li>Bridal Makeup</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#C75B7A]">Contact</p>
            <div className="mt-5 space-y-3 text-sm text-[#2D2D2D]/75">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#C75B7A]" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#C75B7A]" /> hello@caresalon.in</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#C75B7A]" /> Bengaluru, India</div>
            </div>
            <div className="mt-5 flex gap-3 text-[#2D2D2D]/70">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E8E8]"><Instagram className="h-4 w-4" /></div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8E8E8]"><MessageCircle className="h-4 w-4" /></div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-[#2D2D2D]/10 px-4 pt-6 text-sm text-[#2D2D2D]/70 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Care Beauty Solution. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
