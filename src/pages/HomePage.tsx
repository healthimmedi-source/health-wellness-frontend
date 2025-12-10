const HomePage = () => (
  <main className="min-h-screen bg-slate-50">
    <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center">
      {/* Left: logo + text */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <img
            src="/immedihealth-logo.jpg"
            alt="ImmediHealth and Wellness Center logo"
            className="h-12 w-auto md:h-16"
          />
          <div className="leading-tight">
            <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">
              Immedi<span className="text-sky-700">Health</span>
            </h1>
            <p className="text-[0.65rem] tracking-[0.35em] uppercase text-slate-500 md:text-xs">
              And Wellness Center
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
          Book appointments with trusted doctors and wellness experts.
        </h2>

        <p className="max-w-xl text-sm text-slate-700 md:text-base">
          Manage your health in one place – browse specialists, view clinic details,
          and schedule visits at a time that works for you.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href="/doctors"
            className="rounded-lg bg-sky-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-sky-800"
          >
            Book an Appointment
          </a>
          <a
            href="/about"
            className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
          >
            Learn more about us
          </a>
        </div>
      </div>
    </section>
  </main>
);

export default HomePage;
