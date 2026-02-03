'use client';

/**
 * OnboardingForm - Collects all business information upfront
 * Beautiful form matching the landing page aesthetic
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { IndustryType } from '@/lib/db/types';

interface OnboardingFormProps {
  onComplete: (data: OnboardingData) => void;
  isLoading?: boolean;
}

export interface OnboardingData {
  industry: IndustryType;
  businessName: string;
  tagline: string;
  description: string;
  brandPersonality: string[];
  email: string;
  phone?: string;
  address?: string;
}

const BRAND_PERSONALITIES = [
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'friendly', label: 'Friendly', icon: '😊' },
  { id: 'modern', label: 'Modern', icon: '✨' },
  { id: 'luxury', label: 'Luxury', icon: '💎' },
  { id: 'bold', label: 'Bold', icon: '🔥' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'trustworthy', label: 'Trustworthy', icon: '🤝' },
  { id: 'innovative', label: 'Innovative', icon: '💡' },
];

const INDUSTRY_OPTIONS = [
  {
    id: 'service' as IndustryType,
    label: 'Service Business',
    description: 'Consulting, agencies, professional services',
    icon: '💼',
    examples: ['Marketing Agency', 'Law Firm', 'Design Studio', 'IT Consulting'],
  },
  {
    id: 'local' as IndustryType,
    label: 'Local Business',
    description: 'Restaurants, salons, retail, local services',
    icon: '📍',
    examples: ['Restaurant', 'Hair Salon', 'Gym', 'Medical Practice'],
  },
];

export function OnboardingForm({ onComplete, isLoading = false }: OnboardingFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    brandPersonality: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const togglePersonality = (personality: string) => {
    const current = formData.brandPersonality || [];
    if (current.includes(personality)) {
      updateField(
        'brandPersonality',
        current.filter((p) => p !== personality)
      );
    } else if (current.length < 3) {
      updateField('brandPersonality', [...current, personality]);
    }
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0 && !formData.industry) {
      newErrors.industry = 'Please select a business type';
    }

    if (step === 1) {
      if (!formData.businessName?.trim()) {
        newErrors.businessName = 'Business name is required';
      }
      if (!formData.tagline?.trim()) {
        newErrors.tagline = 'A short tagline is required';
      }
    }

    if (step === 2) {
      if (!formData.description?.trim()) {
        newErrors.description = 'Please describe your business';
      }
      if (!formData.brandPersonality?.length) {
        newErrors.brandPersonality = 'Select at least one brand personality';
      }
    }

    if (step === 3) {
      if (!formData.email?.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(formData as OnboardingData);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const totalSteps = 4;
  const progressPercent = ((step + 1) / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-[#06060a] flex flex-col">
      {/* Header Section */}
      <div className="shrink-0 px-6 py-6 sm:px-12 lg:px-20">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Buildware</span>
          </div>
          
          <div className="text-sm text-zinc-400">
            Step {step + 1} of {totalSteps}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="shrink-0 px-6 sm:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <IndustryStep
                  selected={formData.industry}
                  onSelect={(industry) => updateField('industry', industry)}
                  error={errors.industry}
                />
              )}

              {step === 1 && (
                <BusinessInfoStep
                  businessName={formData.businessName || ''}
                  tagline={formData.tagline || ''}
                  onBusinessNameChange={(value) => updateField('businessName', value)}
                  onTaglineChange={(value) => updateField('tagline', value)}
                  errors={errors}
                />
              )}

              {step === 2 && (
                <BrandStep
                  description={formData.description || ''}
                  personalities={formData.brandPersonality || []}
                  onDescriptionChange={(value) => updateField('description', value)}
                  onPersonalityToggle={togglePersonality}
                  errors={errors}
                />
              )}

              {step === 3 && (
                <ContactStep
                  email={formData.email || ''}
                  phone={formData.phone || ''}
                  address={formData.address || ''}
                  onEmailChange={(value) => updateField('email', value)}
                  onPhoneChange={(value) => updateField('phone', value)}
                  onAddressChange={(value) => updateField('address', value)}
                  errors={errors}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={cn(
                'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all',
                step === 0
                  ? 'opacity-0 pointer-events-none'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={isLoading}
              className={cn(
                'group relative flex items-center gap-2 overflow-hidden rounded-xl px-8 py-3',
                'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium',
                'hover:shadow-[0_0_40px_-5px_rgba(167,139,250,0.5)]',
                'transition-all duration-300',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <span className="relative z-10">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Setting up...
                  </span>
                ) : step === 3 ? (
                  'Start Building'
                ) : (
                  'Continue'
                )}
              </span>
              {!isLoading && (
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-transparent blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
      </div>

      {/* Grain texture overlay */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  );
}

// Step Components

interface IndustryStepProps {
  selected?: IndustryType;
  onSelect: (industry: IndustryType) => void;
  error?: string;
}

function IndustryStep({ selected, onSelect, error }: IndustryStepProps) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
        What type of <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">business</span> are you building for?
      </h1>
      <p className="mt-4 text-lg text-zinc-400">
        This helps us tailor your website sections and design.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {INDUSTRY_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={cn(
              'group relative p-6 rounded-2xl border text-left transition-all duration-300',
              'hover:scale-[1.02]',
              selected === option.id
                ? 'border-violet-500/50 bg-violet-500/10'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]'
            )}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{option.icon}</span>
              <div>
                <h3 className="text-lg font-medium text-white">{option.label}</h3>
                <p className="mt-1 text-sm text-zinc-400">{option.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {option.examples.slice(0, 3).map((example) => (
                    <span
                      key={example}
                      className="text-xs px-2 py-1 rounded-full bg-white/5 text-zinc-500"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {selected === option.id && (
              <div className="absolute top-4 right-4">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
}

interface BusinessInfoStepProps {
  businessName: string;
  tagline: string;
  onBusinessNameChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
  errors: Record<string, string>;
}

function BusinessInfoStep({
  businessName,
  tagline,
  onBusinessNameChange,
  onTaglineChange,
  errors,
}: BusinessInfoStepProps) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
        Tell us about your <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">business</span>
      </h1>
      <p className="mt-4 text-lg text-zinc-400">
        Your business name and tagline will appear prominently on your site.
      </p>

      <div className="mt-10 space-y-6 text-left">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => onBusinessNameChange(e.target.value)}
            placeholder="e.g., Acme Design Studio"
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              'transition-all duration-200',
              errors.businessName ? 'border-rose-500/50' : 'border-white/10'
            )}
          />
          {errors.businessName && (
            <p className="mt-2 text-sm text-rose-400">{errors.businessName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => onTaglineChange(e.target.value)}
            placeholder="e.g., Crafting Digital Experiences"
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              'transition-all duration-200',
              errors.tagline ? 'border-rose-500/50' : 'border-white/10'
            )}
          />
          {errors.tagline && (
            <p className="mt-2 text-sm text-rose-400">{errors.tagline}</p>
          )}
          <p className="mt-2 text-xs text-zinc-500">
            A short, catchy phrase that captures what you do
          </p>
        </div>
      </div>
    </div>
  );
}

interface BrandStepProps {
  description: string;
  personalities: string[];
  onDescriptionChange: (value: string) => void;
  onPersonalityToggle: (personality: string) => void;
  errors: Record<string, string>;
}

function BrandStep({
  description,
  personalities,
  onDescriptionChange,
  onPersonalityToggle,
  errors,
}: BrandStepProps) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
        Define your <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">brand</span>
      </h1>
      <p className="mt-4 text-lg text-zinc-400">
        Help us understand your business and the vibe you want to convey.
      </p>

      <div className="mt-10 space-y-8 text-left">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            What does your business do?
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="e.g., We help small businesses grow their online presence through strategic design and marketing..."
            rows={4}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-zinc-500 resize-none',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              'transition-all duration-200',
              errors.description ? 'border-rose-500/50' : 'border-white/10'
            )}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-rose-400">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Brand Personality <span className="text-zinc-500">(select up to 3)</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {BRAND_PERSONALITIES.map((personality) => (
              <button
                key={personality.id}
                onClick={() => onPersonalityToggle(personality.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200',
                  'hover:scale-[1.02]',
                  personalities.includes(personality.id)
                    ? 'border-violet-500/50 bg-violet-500/20 text-white'
                    : 'border-white/10 bg-white/[0.02] text-zinc-400 hover:border-white/20'
                )}
              >
                <span>{personality.icon}</span>
                <span className="text-sm font-medium">{personality.label}</span>
              </button>
            ))}
          </div>
          {errors.brandPersonality && (
            <p className="mt-2 text-sm text-rose-400">{errors.brandPersonality}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContactStepProps {
  email: string;
  phone: string;
  address: string;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  errors: Record<string, string>;
}

function ContactStep({
  email,
  phone,
  address,
  onEmailChange,
  onPhoneChange,
  onAddressChange,
  errors,
}: ContactStepProps) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-4xl font-normal leading-tight text-white sm:text-5xl">
        How can customers <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">reach you</span>?
      </h1>
      <p className="mt-4 text-lg text-zinc-400">
        Contact information for your website&apos;s contact section.
      </p>

      <div className="mt-10 space-y-6 text-left">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="hello@yourbusiness.com"
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-zinc-500',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50',
              'transition-all duration-200',
              errors.email ? 'border-rose-500/50' : 'border-white/10'
            )}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-rose-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Phone Number <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Business Address <span className="text-zinc-500">(optional)</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="123 Main St, City, State 12345"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
}
