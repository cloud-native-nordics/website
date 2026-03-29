import type { Organizer } from "@/lib/types";

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function BlueskyIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 600 530" fill="currentColor">
      <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.24 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { key: "linkedin" as const, Icon: LinkedInIcon },
  { key: "github" as const, Icon: GitHubIcon },
  { key: "bluesky" as const, Icon: BlueskyIcon },
  { key: "twitter" as const, Icon: XIcon },
];

export function OrganizerCard({ org }: { org: Organizer }) {
  const initials = org.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-navy-card border border-gray-200 dark:border-white/10 hover:border-brand-pink/50 transition-colors">
      {org.photo ? (
        <img
          src={org.photo}
          alt={org.name}
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink to-brand-gold flex items-center justify-center text-white font-heading font-bold text-xl mb-3">
          {initials}
        </div>
      )}
      <div className="font-heading font-bold text-navy dark:text-white text-sm">
        {org.name}
      </div>
      {org.role && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {org.role}
        </div>
      )}
      {org.company && (
        <div className="text-xs text-brand-pink font-medium mt-0.5">
          {org.company}
        </div>
      )}
      <div className="flex items-center gap-3 mt-3">
        {SOCIAL_LINKS.map(({ key, Icon }) =>
          org[key] ? (
            <a
              key={key}
              href={org[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-brand-pink transition-colors"
            >
              <Icon />
            </a>
          ) : null
        )}
      </div>
    </div>
  );
}
