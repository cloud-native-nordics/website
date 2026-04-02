export function CfpSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nord12 to-nord12 opacity-90" />
      <div className="absolute inset-0 bg-nord0/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
          Share Your Knowledge
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Got a talk idea? Submit a proposal to speak at any of our Nordic meetups.
          We welcome topics on Kubernetes, DevOps, Security, Observability, Platform Engineering, and more.
        </p>
        <a
          href="/cfp"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-nord0 font-heading font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Submit a Talk
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
