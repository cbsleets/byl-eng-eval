"use client";

import { useState, useEffect } from "react";
import { useAI } from "./AIContext";

type Props = {
  userId: string;
};

export default function AISummary({ userId }: Props) {
  const { summary, setSummary, summaryLoaded, setSummaryLoaded } = useAI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      setSummaryLoaded(true);
    } catch (err) {
      setError("Unable to generate summary. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Only auto-generate if we haven't loaded a summary yet
  useEffect(() => {
    if (!summaryLoaded && !summary) {
      generateSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, summaryLoaded]);

  return (
    <div className="bg-gradient-to-br from-[#F5F3EE] to-white rounded-3xl p-8 border border-gray-100">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-12 h-12 bg-[#8B7355] rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl">✨</span>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-serif text-[#2D3A2D] mb-2">
            Your Personalized Insights
          </h2>

          {/* Loading State */}
          {loading && (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-red-600 mb-4">
              <p>{error}</p>
              <button
                onClick={generateSummary}
                className="mt-2 px-4 py-2 bg-[#8B7355] text-white rounded-lg text-sm hover:bg-[#7A6348] transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Summary Content */}
          {summary && !loading && (
            <div className="prose prose-gray max-w-none">
              {summary.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-600 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Regenerate Button */}
          {summary && !loading && (
            <button
              onClick={generateSummary}
              className="mt-4 text-sm text-[#8B7355] hover:text-[#6A5444] transition flex items-center gap-1"
            >
              <span>↻</span> Regenerate insights
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

