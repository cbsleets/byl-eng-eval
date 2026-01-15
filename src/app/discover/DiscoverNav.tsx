"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DiscoverNav() {
  const pathname = usePathname();
  
  const isBreakdown = pathname === "/discover/breakdown";
  const isSummary = pathname === "/discover" || pathname === "/discover/";

  return (
    <div className="bg-[#f8f5f0]">
      {/* Top Navigation Tabs */}
      <div className="flex gap-8 px-8 pt-6">
        <Link
          href="/discover"
          className={`pb-3 text-base font-medium transition relative ${
            isSummary ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Summary
          {isSummary && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B7355] rounded-full" />
          )}
        </Link>
        <Link
          href="/discover/breakdown"
          className={`pb-3 text-base font-medium transition relative ${
            isBreakdown ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Role Breakdown
          {isBreakdown && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B7355] rounded-full" />
          )}
        </Link>
      </div>

      {/* Back to Summary button - only show on breakdown page */}
      {isBreakdown && (
        <div className="px-8 pt-6">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition shadow-sm border border-gray-200"
          >
            <span>‹</span>
            <span>Back to Summary</span>
          </Link>
        </div>
      )}
    </div>
  );
}

