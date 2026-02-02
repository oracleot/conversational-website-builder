"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartBuilding = async () => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to create conversation");
      const data = await response.json();
      router.push(`/builder/${data.id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      setIsCreating(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06060a]">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent blur-[120px]" />
        <div className="absolute -bottom-60 -right-40 h-[700px] w-[700px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/25 via-blue-600/20 to-transparent blur-[120px]" style={{ animationDelay: "1s", animationDuration: "4s" }} />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 animate-pulse rounded-full bg-gradient-to-r from-rose-500/15 via-orange-400/10 to-transparent blur-[100px]" style={{ animationDelay: "2s", animationDuration: "5s" }} />
      </div>

      {/* Grain texture overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 sm:px-12 lg:px-20">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-tight text-white">Buildware</span>
        </div>
        <div className="hidden items-center gap-8 sm:flex">
          <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">Features</a>
          <a href="#how-it-works" className="text-sm text-zinc-400 transition-colors hover:text-white">How it works</a>
          <Link href="/login" className="text-sm text-zinc-400 transition-colors hover:text-white">Sign in</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-12 lg:px-20 lg:pt-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div 
              className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm"
              style={{ animation: "fadeSlideUp 0.8s ease-out forwards", opacity: 0 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm text-zinc-300">AI-powered website creation</span>
            </div>

            {/* Headline */}
            <h1 
              className="mb-6 font-serif text-5xl font-normal leading-[1.1] tracking-tight text-white sm:text-6xl lg:text-7xl"
              style={{ animation: "fadeSlideUp 0.8s ease-out 0.1s forwards", opacity: 0 }}
            >
              <span className="block">Build your</span>
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                dream website
              </span>
              <span className="block font-serif italic text-zinc-500">through conversation</span>
            </h1>

            {/* Subheadline */}
            <p 
              className="mb-10 max-w-lg text-lg leading-relaxed text-zinc-400 sm:text-xl"
              style={{ animation: "fadeSlideUp 0.8s ease-out 0.2s forwards", opacity: 0 }}
            >
              Just chat with our AI. Describe your business, see your website take shape in real-time, and get a professional site ready to launch in minutes.
            </p>

            {/* CTAs */}
            <div 
              className="flex flex-col gap-4 sm:flex-row"
              style={{ animation: "fadeSlideUp 0.8s ease-out 0.3s forwards", opacity: 0 }}
            >
              <button
                onClick={handleStartBuilding}
                disabled={isCreating}
                className="group relative flex h-14 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 text-base font-medium text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_-5px_rgba(167,139,250,0.5)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isCreating ? (
                    <>
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating workspace...
                    </>
                  ) : (
                    <>
                      Start building free
                      <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-violet-600 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
              <a
                href="#how-it-works"
                className="flex h-14 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-8 text-base font-medium text-zinc-300 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                </svg>
                Watch demo
              </a>
            </div>

            {/* Social proof */}
            <div 
              className="mt-12 flex items-center gap-8"
              style={{ animation: "fadeSlideUp 0.8s ease-out 0.4s forwards", opacity: 0 }}
            >
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#06060a] bg-gradient-to-br from-zinc-600 to-zinc-700 text-xs font-medium text-white"
                  >
                    {["JD", "AK", "MR", "SL", "TC"][i]}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-zinc-500">Loved by 2,000+ small businesses</span>
              </div>
            </div>
          </div>

          {/* Right column - Visual */}
          <div 
            className="relative flex items-center justify-center lg:justify-end"
            style={{ animation: "fadeSlideUp 0.8s ease-out 0.5s forwards", opacity: 0 }}
          >
            {/* Floating preview mockups */}
            <div className="relative h-[500px] w-full max-w-[500px]">
              {/* Main preview card */}
              <div className="absolute left-1/2 top-1/2 w-[340px] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] rounded-2xl border border-white/10 bg-zinc-900/80 p-3 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0 hover:scale-105 sm:w-[380px]">
                <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 rounded-md bg-white/5 px-3 py-1 text-center text-xs text-zinc-500">
                    yoursite.com
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="h-40 overflow-hidden rounded-lg bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-cyan-500/20">
                    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
                      <span className="font-serif text-2xl text-white">Acme Studio</span>
                      <span className="mt-2 text-sm text-zinc-400">Creative Design Agency</span>
                      <div className="mt-4 rounded-full bg-white/10 px-4 py-2 text-xs text-white">Get Started</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 rounded-full bg-white/10" />
                    <div className="h-3 w-1/2 rounded-full bg-white/5" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 rounded-lg bg-white/5" />
                    <div className="h-16 rounded-lg bg-white/5" />
                    <div className="h-16 rounded-lg bg-white/5" />
                  </div>
                </div>
              </div>

              {/* Chat bubble - floating left */}
              <div className="absolute -left-4 top-8 w-64 rotate-[-4deg] rounded-2xl border border-white/10 bg-zinc-800/90 p-4 shadow-xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0 sm:left-0">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">What&apos;s your business name?</p>
                  </div>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-medium text-white">
                    You
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-zinc-300">Acme Studio - we&apos;re a creative design agency</p>
                  </div>
                </div>
              </div>

              {/* Progress indicator - floating right */}
              <div className="absolute -right-4 bottom-20 w-48 rotate-[3deg] rounded-2xl border border-white/10 bg-zinc-800/90 p-4 shadow-xl backdrop-blur-sm transition-transform duration-500 hover:rotate-0 sm:right-0">
                <div className="text-xs font-medium text-zinc-400">Progress</div>
                <div className="mt-3 space-y-2">
                  {["Hero", "Services", "About", "Contact"].map((section, i) => (
                    <div key={section} className="flex items-center gap-2">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${i < 2 ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-700"}`}>
                        {i < 2 ? (
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span className="text-[10px] text-zinc-500">{i + 1}</span>
                        )}
                      </div>
                      <span className={`text-xs ${i < 2 ? "text-white" : "text-zinc-500"}`}>{section}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-600/30 to-fuchsia-500/20 blur-[80px]" />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <section id="features" className="mt-32 scroll-mt-20 lg:mt-40">
          <div 
            className="mb-16 text-center"
            style={{ animation: "fadeSlideUp 0.8s ease-out forwards", opacity: 0, animationDelay: "0.6s" }}
          >
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              Everything you need to <span className="italic text-zinc-500">launch</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              No coding, no design skills, no complexity. Just a conversation that turns into a beautiful website.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                ),
                title: "Conversational Interface",
                description: "No forms or configurators. Just chat naturally and watch your website take shape.",
                gradient: "from-violet-500/20 to-fuchsia-500/10",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: "Real-time Preview",
                description: "See your website update instantly as you describe your business and preferences.",
                gradient: "from-cyan-500/20 to-blue-500/10",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                  </svg>
                ),
                title: "AI-Matched Designs",
                description: "Our AI selects the perfect design variant based on your brand personality and industry.",
                gradient: "from-emerald-500/20 to-teal-500/10",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                ),
                title: "Export & Deploy",
                description: "Download your complete website as a deployable project, ready for any hosting platform.",
                gradient: "from-rose-500/20 to-orange-500/10",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                ),
                title: "Human-Assisted Launch",
                description: "Our expert team helps finalize your site with custom images and domain setup.",
                gradient: "from-amber-500/20 to-yellow-500/10",
              },
              {
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                ),
                title: "Industry Templates",
                description: "Optimized layouts for service businesses, restaurants, salons, and local shops.",
                gradient: "from-indigo-500/20 to-purple-500/10",
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.04]"
                style={{ animation: "fadeSlideUp 0.8s ease-out forwards", opacity: 0, animationDelay: `${0.7 + i * 0.1}s` }}
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white`}>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-medium text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{feature.description}</p>
                <div className={`absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-3xl transition-opacity group-hover:opacity-100`} />
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="mt-32 scroll-mt-20 lg:mt-40">
          <div className="mb-16 text-center">
            <h2 className="font-serif text-3xl text-white sm:text-4xl">
              From chat to <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">launch</span> in minutes
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Three simple steps to your professional website. No technical skills required.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-px -translate-x-1/2 bg-gradient-to-b from-violet-500/50 via-fuchsia-500/30 to-transparent lg:block" />

            <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  step: "01",
                  title: "Describe your business",
                  description: "Tell our AI about your business, services, and brand personality. Just like chatting with a designer friend.",
                },
                {
                  step: "02",
                  title: "Watch it come alive",
                  description: "See your website build section by section with professional designs matched to your brand.",
                },
                {
                  step: "03",
                  title: "Launch with confidence",
                  description: "Export your site or let our team help you launch with custom imagery and domain setup.",
                },
              ].map((item, i) => (
                <div key={item.step} className="relative text-center lg:text-left">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900 lg:mx-0">
                    <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text font-serif text-2xl text-transparent">{item.step}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-medium text-white">{item.title}</h3>
                  <p className="text-zinc-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-32 lg:mt-40">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-violet-600/10 via-fuchsia-600/5 to-transparent p-12 text-center lg:p-20">
            <div className="relative z-10">
              <h2 className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl">
                Ready to build your website?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-400">
                Start for free. No credit card required. See your website come together in real-time.
              </p>
              <button
                onClick={handleStartBuilding}
                disabled={isCreating}
                className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-white px-8 text-base font-medium text-zinc-900 transition-all hover:scale-[1.02] hover:bg-zinc-100 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating workspace...
                  </>
                ) : (
                  <>
                    Start building now
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            {/* Background decoration */}
            <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-600/20 blur-[100px]" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[100px]" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row sm:px-12 lg:px-20">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-zinc-400">Buildware</span>
          </div>
          <p className="text-sm text-zinc-600">© 2026 Buildware. All rights reserved.</p>
        </div>
      </footer>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
