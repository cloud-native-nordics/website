export function About() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-nord12 to-nord12 opacity-90" />
      <div className="absolute inset-0 bg-nord0/30" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
          Scaling adoption of Cloud Native in the Nordics
        </h2>
        <p className="text-lg text-white/80 mb-6 leading-relaxed">
          Cloud Native Nordics is a meetup alliance across four countries in northern Europe.
          We help each other with many things, some of them being; tooling, website, speakers,
          guidelines, workshops, branding, and much more. We are a community built and run by
          passionate people.
        </p>
        <p className="text-xl font-heading font-bold text-white">
          By the community, for the community.
        </p>
      </div>
    </section>
  );
}
