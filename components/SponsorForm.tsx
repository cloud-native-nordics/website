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

const SPONSORSHIP_TYPES = [
  { value: "venue", label: "Venue — host a meetup at your office or space" },
  { value: "food_drinks", label: "Food & Drinks — sponsor catering for a meetup" },
  { value: "other", label: "Other — custom sponsorship" },
];

export function SponsorForm() {
  const searchParams = useSearchParams();
  const preselectedLocation = searchParams.get("location") || "";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [openToAny, setOpenToAny] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    if (!openToAny) {
      const locations = formData.getAll("locations");
      if (locations.length === 0) {
        setError("Please select at least one location or check 'open to any'.");
        return;
      }
    }

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
      const res = await fetch(`${apiBase}/api/sponsorships`, {
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
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber to-ember flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-heading font-bold text-slate dark:text-white mb-3">
          Thank you for your sponsorship offer!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          We've received your information and the relevant organizers will be in touch.
        </p>
      </div>
    );
  }

  const inputClass = "w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-night px-4 py-2.5 text-sm text-slate dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ember/50 focus:border-ember transition-colors";
  const labelClass = "block text-sm font-medium text-slate dark:text-white mb-1.5";
  const sectionClass = "bg-white dark:bg-charcoal rounded-xl border border-gray-200 dark:border-white/10 p-6 mb-6";

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Company Information */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-slate dark:text-white mb-4 pb-2 pb-2 border-b-2 border-ember">
          Company Information
        </h3>

        <div className="mb-4">
          <label className={labelClass}>Company Name <span className="gradient-text">*</span></label>
          <input type="text" name="company_name" required minLength={2} className={inputClass} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Contact Name <span className="gradient-text">*</span></label>
            <input type="text" name="contact_name" required minLength={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Contact Email <span className="gradient-text">*</span></label>
            <input type="email" name="contact_email" required className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" name="phone" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input type="url" name="website" placeholder="https://..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Sponsorship Details */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-slate dark:text-white mb-4 pb-2 pb-2 border-b-2 border-ember">
          Sponsorship Details
        </h3>

        <div className="mb-4">
          <label className={labelClass}>How would you like to sponsor? <span className="gradient-text">*</span></label>
          <div className="space-y-3 mt-2">
            {SPONSORSHIP_TYPES.map((type) => (
              <label key={type.value} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer hover:border-ember/50 transition-colors">
                <input
                  type="radio"
                  name="sponsorship_type"
                  value={type.value}
                  required
                  className="mt-0.5 text-ember focus:ring-ember"
                />
                <span className="text-sm text-slate dark:text-gray-300">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Additional Details</label>
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us more about your sponsorship offer — venue capacity, budget, specific ideas..."
            className={inputClass}
          />
        </div>
      </div>

      {/* Location Selection */}
      <div className={sectionClass}>
        <h3 className="text-lg font-heading font-bold text-slate dark:text-white mb-4 pb-2 pb-2 border-b-2 border-ember">
          Which Groups?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Select the chapter(s) you'd like to sponsor. <span className="gradient-text">*</span>
        </p>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate dark:text-white mb-4 cursor-pointer">
          <input
            type="checkbox"
            name="open_to_any"
            value="1"
            checked={openToAny}
            onChange={(e) => setOpenToAny(e.target.checked)}
            className="rounded border-gray-300 dark:border-white/20 text-ember focus:ring-ember"
          />
          I'm open to sponsoring any group
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(LOCATIONS).map(([country, cities]) => (
            <div key={country}>
              <h4 className="text-sm font-heading font-bold gradient-text mb-2">{country}</h4>
              {cities.map((city) => (
                <label key={city} className="flex items-center gap-2 text-sm text-slate dark:text-gray-300 mb-1 cursor-pointer">
                  <input
                    type="checkbox"
                    name="locations"
                    value={city}
                    disabled={openToAny}
                    defaultChecked={city === preselectedLocation}
                    className="rounded border-gray-300 dark:border-white/20 text-ember focus:ring-ember disabled:opacity-50"
                  />
                  {city}
                </label>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div className={sectionClass}>
        <label className="flex items-start gap-2 text-sm text-slate dark:text-gray-300 cursor-pointer">
          <input
            type="checkbox"
            name="consent"
            required
            className="rounded border-gray-300 dark:border-white/20 text-ember focus:ring-ember mt-0.5"
          />
          <span>
            I consent to my data being stored and shared with Cloud Native Nordics organisers for the purpose of coordinating sponsorship. <span className="gradient-text">*</span>
          </span>
        </label>
      </div>

      <div className="text-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber to-ember text-white font-heading font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Sponsorship Offer"}
        </button>
      </div>
    </form>
  );
}
