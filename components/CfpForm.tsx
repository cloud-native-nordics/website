"use client";

import { useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import groupsData from "@/lib/groups-data.json";

const LOCATIONS = {
  Denmark: ["Aalborg", "Aarhus", "Copenhagen"],
  Finland: ["Helsinki", "Tampere", "Turku"],
  Norway: ["Bergen", "Oslo", "Stavanger"],
  Sweden: ["Göteborg", "Stockholm", "Umeå"],
};

const TAGS = [
  "Kubernetes", "DevOps", "Security", "Observability",
  "CI/CD", "Platform Engineering", "Cloud Native", "Networking",
  "Storage", "AI/ML", "Other",
];

const TALK_TYPES = [
  { value: "lightning", label: "Lightning (5-10 min)" },
  { value: "full", label: "Full Talk (25-45 min)" },
  { value: "workshop", label: "Workshop (60+ min)" },
];

const LANGUAGES = ["English", "Danish", "Finnish", "Norwegian", "Swedish", "Other"];

export function CfpForm() {
  const searchParams = useSearchParams();
  const preselectedLocation = searchParams.get("location") || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openToAny, setOpenToAny] = useState(false);
  const [bioCount, setBioCount] = useState(0);
  const [abstractCount, setAbstractCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    // Validate locations
    if (!openToAny) {
      const locations = formData.getAll("locations");
      if (locations.length === 0) {
        setError("Please select at least one location or check 'open to any'.");
        return;
      }
    }

    // Build location → slack channel ID mapping
    const channelMap: Record<string, string> = {};
    for (const group of groupsData as any[]) {
      if (group.slack_channel_id) {
        channelMap[group.city] = group.slack_channel_id;
      }
    }
    formData.set("slack_channels", JSON.stringify(channelMap));

    setSubmitting(true);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://cfp.cloudnativenordics.com";
      const res = await fetch(`${apiBase}/api/submissions`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-nord12 to-nord12 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold text-nord0 dark:text-white mb-3">
          Thank you for your submission!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Your talk proposal has been received. Our organizers will review it and get back to you.
        </p>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-nord0 px-4 py-2.5 text-sm text-nord0 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-nord8/50 focus:border-nord8 transition-colors";
  const labelClass = "block text-sm font-medium text-nord0 dark:text-white mb-1.5";
  const sectionClass = "bg-white dark:bg-nord1 rounded-xl border border-gray-200 dark:border-white/10 p-6 mb-6";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Speaker Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-nord0 dark:text-white mb-4 pb-2 border-b-2 border-gradient-to-r from-nord12 to-nord12">
          Speaker Information
        </h3>

        <div className="mb-4">
          <label className={labelClass}>Full Name <span className="gradient-text">*</span></label>
          <input type="text" name="name" required minLength={2} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Email <span className="gradient-text">*</span></label>
            <input type="email" name="email" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Company</label>
            <input type="text" name="company" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Job Title</label>
            <input type="text" name="job_title" className={inputClass} />
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Bio</label>
          <textarea
            name="bio"
            rows={3}
            maxLength={500}
            className={inputClass}
            onChange={(e) => setBioCount(e.target.value.length)}
          />
          <p className="text-xs text-gray-400 mt-1">{bioCount}/500 characters</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>LinkedIn URL</label>
            <input type="url" name="linkedin_url" placeholder="https://linkedin.com/in/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input type="url" name="github_url" placeholder="https://github.com/..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Twitter/X Handle</label>
            <input type="text" name="twitter_handle" placeholder="@handle" className={inputClass} />
          </div>
        </div>
      </div>

      {/* Talk Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-nord0 dark:text-white mb-4 pb-2 pb-2 border-b-2 border-nord12">
          Talk Information
        </h3>

        <div className="mb-4">
          <label className={labelClass}>Talk Title <span className="gradient-text">*</span></label>
          <input type="text" name="title" required minLength={5} maxLength={200} className={inputClass} />
        </div>

        <div className="mb-4">
          <label className={labelClass}>Abstract <span className="gradient-text">*</span></label>
          <textarea
            name="abstract"
            rows={5}
            required
            minLength={50}
            maxLength={2000}
            className={inputClass}
            onChange={(e) => setAbstractCount(e.target.value.length)}
          />
          <p className="text-xs text-gray-400 mt-1">{abstractCount}/2000 characters (minimum 50)</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Talk Type <span className="gradient-text">*</span></label>
            <select name="talk_type" required className={inputClass}>
              <option value="">Select...</option>
              {TALK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Preferred Duration (min)</label>
            <input type="number" name="preferred_duration" min={5} max={480} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Language <span className="gradient-text">*</span></label>
            <select name="language" required className={inputClass} defaultValue="English">
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className={labelClass}>Topic Tags</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TAGS.map((tag) => (
              <label key={tag} className="flex items-center gap-2 text-sm text-nord0 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" name="tags" value={tag} className="rounded border-gray-300 dark:border-white/20 text-nord12 focus:ring-nord8" />
                {tag}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Co-speaker Name</label>
            <input type="text" name="co_speaker_name" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Co-speaker Email</label>
            <input type="email" name="co_speaker_email" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Previous Speaking Experience</label>
          <textarea name="previous_experience" rows={3} placeholder="Links to past talks or videos..." className={inputClass} />
        </div>
      </div>

      {/* Location Selection */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-nord0 dark:text-white mb-4 pb-2 pb-2 border-b-2 border-nord12">
          Location Selection
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select the chapter(s) you'd like to present at. <span className="gradient-text">*</span>
        </p>

        <label className="flex items-center gap-2 text-sm font-semibold text-nord0 dark:text-white mb-4 cursor-pointer">
          <input
            type="checkbox"
            name="open_to_any"
            value="1"
            checked={openToAny}
            onChange={(e) => setOpenToAny(e.target.checked)}
            className="rounded border-gray-300 dark:border-white/20 text-nord12 focus:ring-nord8"
          />
          I'm open to presenting at any location
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(LOCATIONS).map(([country, cities]) => (
            <div key={country}>
              <h4 className="text-sm font-heading font-bold gradient-text mb-2">{country}</h4>
              {cities.map((city) => (
                <label key={city} className="flex items-center gap-2 text-sm text-nord0 dark:text-gray-300 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="locations"
                    value={city}
                    disabled={openToAny}
                    defaultChecked={city === preselectedLocation}
                    className="rounded border-gray-300 dark:border-white/20 text-nord12 focus:ring-nord8 disabled:opacity-50"
                  />
                  {city}
                </label>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className={labelClass}>Travel Notes</label>
          <textarea name="travel_notes" rows={2} placeholder="E.g. 'Can only travel within Denmark'" className={inputClass} />
        </div>
      </div>

      {/* Consent */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-nord0 dark:text-white mb-4 pb-2 pb-2 border-b-2 border-nord12">
          Data Consent
        </h3>
        <label className="flex items-start gap-2 text-sm text-nord0 dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            required
            className="rounded border-gray-300 dark:border-white/20 text-nord12 focus:ring-nord8 mt-0.5"
          />
          <span>
            I consent to my data being stored and shared with Cloud Native Nordics organisers for the purpose of reviewing my submission. <span className="gradient-text">*</span>
          </span>
        </label>
        <p className="text-xs text-gray-400 mt-2 ml-6">
          Your data will be retained for the duration of the CFP review process. To request deletion, contact us at info@cloudnativenordics.com.
        </p>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-nord12 to-nord12 text-white font-heading font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Proposal"}
        </button>
      </div>
    </form>
  );
}
