export function Footer() {
  return (
    <footer className="py-8 bg-nord0 text-nord4 border-t border-nord3/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm">
            &copy; {new Date().getFullYear()} Cloud Native Nordics. Part of the{" "}
            <a
              href="https://www.cncf.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-nord8 hover:text-nord13 transition-colors"
            >
              CNCF
            </a>{" "}
            community.
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="/#groups" className="hover:text-white transition-colors">Groups</a>
            <a href="/#events" className="hover:text-white transition-colors">Events</a>
            <a href="/cfp" className="hover:text-white transition-colors">CFP</a>
            <a
              href="https://github.com/cloud-native-nordics"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
