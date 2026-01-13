"use client";

import { useState, useRef } from "react";
import Image from "next/image";

// Define the type for a role with its score
type RoleWithScore = {
  id: string;
  name: string;
  score: number;
  role_desc: string;
  core_drive: string;
  most_like_when: string;
  core_rank_desc: string;
  peripheral_rank_desc: string;
  top_rank_desc: string;
  bottom_rank_desc: string;
};

type Props = {
  sortedRoles: RoleWithScore[]; // All 10 roles sorted by score
};

// Color themes for each role - extracted with ai from svg files
const roleColors: Record<string, { bg: string; border: string; text: string }> = {
  leader: { bg: "#FEF3C7", border: "#D97706", text: "#92400E" },
  innovator: { bg: "#F5F3FF", border: "#7C3AED", text: "#5B21B6" },
  expert: { bg: "#ECFDF5", border: "#059669", text: "#065F46" },
  organizer: { bg: "#EFF6FF", border: "#2563EB", text: "#1E40AF" },
  connector: { bg: "#F0FDFA", border: "#0F766E", text: "#115E59" },
  strategist: { bg: "#F1F5F9", border: "#334155", text: "#1E293B" },
  supporter: { bg: "#FFF1F2", border: "#E11D48", text: "#9F1239" },
  challenger: { bg: "#FFFBEB", border: "#B45309", text: "#78350F" },
  caretaker: { bg: "#ECFDF3", border: "#16A34A", text: "#166534" },
  builder: { bg: "#E0F2FE", border: "#0284C7", text: "#075985" },
};

export default function BreakdownClient({ sortedRoles }: Props) {
  // Track which role is selected (default to first/highest role)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Determine which category the selected role belongs to
  const getCategory = (index: number) => {
    if (index < 4) return "core";
    if (index < 7) return "intermediate";
    return "peripheral";
  };

  const activeCategory = getCategory(selectedIndex);

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="py-6">
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-6 border-b border-gray-200 px-8">
        <button
          onClick={() => setSelectedIndex(0)}
          className={`pb-3 text-sm font-medium transition relative ${
            activeCategory === "core"
              ? "text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Core Roles
          {activeCategory === "core" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSelectedIndex(4)}
          className={`pb-3 text-sm font-medium transition relative ${
            activeCategory === "intermediate"
              ? "text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Intermediate Roles
          {activeCategory === "intermediate" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setSelectedIndex(7)}
          className={`pb-3 text-sm font-medium transition relative ${
            activeCategory === "peripheral"
              ? "text-gray-900"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Peripheral Roles
          {activeCategory === "peripheral" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Horizontal Scrolling Role Cards */}
      <div className="relative px-4">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition border border-gray-200"
        >
          <span className="text-gray-400 text-xl">‹</span>
        </button>

        {/* Scrollable Container - fixed height to prevent layout shift */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 overflow-x-auto px-10 py-4 scrollbar-hide"
          style={{ minHeight: "160px" }}
        >
          {sortedRoles.map((role, index) => {
            const isSelected = selectedIndex === index;
            const colors = roleColors[role.id] || { bg: "#F3F4F6", border: "#9CA3AF", text: "#374151" };
            
            return (
              <button
                key={role.id}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 rounded-2xl transition-all duration-200 border-2 ${
                  isSelected
                    ? "shadow-lg"
                    : "bg-gray-50 hover:bg-gray-100 border-transparent"
                }`}
                style={{
                  backgroundColor: isSelected ? colors.bg : undefined,
                  borderColor: isSelected ? colors.border : "transparent",
                  minWidth: isSelected ? "165px" : "140px",
                  height: isSelected ? "130px" : "110px",
                  padding: isSelected ? "20px" : "16px",
                }}
              >
                {/* Role Name - Top */}
                <p
                  className={`text-sm font-medium mb-3 text-center ${
                    isSelected ? "" : "text-gray-500"
                  }`}
                  style={{ color: isSelected ? colors.text : undefined }}
                >
                  {role.name}
                </p>
                
                {/* Number + Icon Row */}
                <div className="flex items-center justify-center gap-2">
                  {/* Rank Number */}
                  <span
                    className="text-5xl font-bold opacity-30"
                    style={{ color: isSelected ? colors.border : "#D1D5DB" }}
                  >
                    {index + 1}
                  </span>
                  
                  {/* Role Icon in Circle */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                    style={{
                      borderColor: colors.border,
                      backgroundColor: isSelected ? "white" : colors.bg,
                    }}
                  >
                    <Image
                      src={`/roles/${role.id}.svg`}
                      alt={role.name}
                      width={28}
                      height={28}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 rounded-full shadow-md flex items-center justify-center hover:bg-white transition border border-gray-200"
        >
          <span className="text-gray-400 text-xl">›</span>
        </button>
      </div>

      {/* Role Detail Section */}
      <RoleDetail 
        role={sortedRoles[selectedIndex]} 
        rank={selectedIndex + 1}
        category={activeCategory}
        colors={roleColors[sortedRoles[selectedIndex].id]}
      />
    </div>
  );
}

// Helper function to get the rank-specific description
function getRankDescription(
  role: RoleWithScore,
  rank: number,
  category: "core" | "intermediate" | "peripheral"
): string | null {
  // Highest role (#1)
  if (rank === 1) {
    return role.top_rank_desc;
  }
  // Lowest role (#10)
  if (rank === 10) {
    return role.bottom_rank_desc;
  }
  // Core roles (#2-4)
  if (category === "core") {
    return role.core_rank_desc;
  }
  // Peripheral roles (#8-9)
  if (category === "peripheral") {
    return role.peripheral_rank_desc;
  }
  // Intermediate roles (#5-7) - leave blank for now
  return null;
}

// Role Detail Component
function RoleDetail({
  role,
  rank,
  category,
  colors,
}: {
  role: RoleWithScore;
  rank: number;
  category: "core" | "intermediate" | "peripheral";
  colors: { bg: string; border: string; text: string };
}) {
  const rankDescription = getRankDescription(role, rank, category);
  
  // Category label for display
  const categoryLabel = 
    rank === 1 ? "Highest Role" :
    rank === 10 ? "Lowest Role" :
    category === "core" ? "Core Role" :
    category === "peripheral" ? "Peripheral Role" :
    "Intermediate Role";

  return (
    <div className="px-8 py-6">
      <div className="max-w-3xl mx-auto">
        {/* Role Header */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: colors.border, backgroundColor: colors.bg }}
          >
            <Image
              src={`/roles/${role.id}.svg`}
              alt={role.name}
              width={36}
              height={36}
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: colors.text }}>
              {role.name}
            </h2>
            <p className="text-sm text-gray-500">
              Rank #{rank} • {categoryLabel}
            </p>
          </div>
        </div>

        {/* Alignment Meter */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Role Alignment</span>
            <span>{role.score}%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${role.score}%`,
                backgroundColor: colors.border,
              }}
            />
          </div>
        </div>

        {/* Role Description */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            About This Role
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {role.role_desc}
          </p>
        </div>

        {/* Core Drive */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Core Drive
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {role.core_drive}
          </p>
        </div>

        {/* Most Like When */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            You&apos;re Most Like This When
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {role.most_like_when}
          </p>
        </div>

        {/* Rank-Specific Description (Role Alignment Section) */}
        {rankDescription && (
          <div
            className="p-6 rounded-2xl"
            style={{ backgroundColor: colors.bg }}
          >
            <h3
              className="text-sm font-semibold uppercase tracking-wide mb-3"
              style={{ color: colors.text }}
            >
              What This Ranking Means For You
            </h3>
            <p className="leading-relaxed" style={{ color: colors.text }}>
              {rankDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

