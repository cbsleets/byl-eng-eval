"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Determine which category the selected role belongs to
  const getCategory = (index: number) => {
    if (index < 4) return "core";
    if (index < 7) return "intermediate";
    return "peripheral";
  };

  const activeCategory = getCategory(selectedIndex);

  // Scroll to center the selected card
  const scrollToCenter = useCallback((index: number) => {
    const card = cardRefs.current[index];
    const container = scrollRef.current;
    if (card && container) {
      const cardRect = card.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft = card.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  // Scroll to center when selection changes
  useEffect(() => {
    scrollToCenter(selectedIndex);
  }, [selectedIndex, scrollToCenter]);

  // Select previous role
  const selectPrevious = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  // Select next role
  const selectNext = () => {
    setSelectedIndex((prev) => Math.min(sortedRoles.length - 1, prev + 1));
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
        {/* Left Arrow - now selects previous */}
        <button
          onClick={selectPrevious}
          disabled={selectedIndex === 0}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition border border-gray-200 ${
            selectedIndex === 0 
              ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
              : "bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-xl">‹</span>
        </button>

        {/* Edge fade container */}
        <div 
          className="relative"
          style={{
            maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)"
          }}
        >
          {/* Scrollable Container - fixed height to prevent layout shift */}
          <div
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto px-16 py-4 scrollbar-hide"
            style={{ minHeight: "160px" }}
          >
            {sortedRoles.map((role, index) => {
              const isSelected = selectedIndex === index;
              const colors = roleColors[role.id] || { bg: "#F3F4F6", border: "#9CA3AF", text: "#374151" };
              
              return (
                <button
                  key={role.id}
                  ref={(el) => { cardRefs.current[index] = el; }}
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
        </div>

        {/* Right Arrow - now selects next */}
        <button
          onClick={selectNext}
          disabled={selectedIndex === sortedRoles.length - 1}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full shadow-md flex items-center justify-center transition border border-gray-200 ${
            selectedIndex === sortedRoles.length - 1
              ? "bg-gray-100 text-gray-300 cursor-not-allowed"
              : "bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="text-xl">›</span>
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

  // Alignment level for the title
  const alignmentLevel = 
    role.score >= 60 ? "High" :
    role.score >= 40 ? "Neutral" :
    "Low";

  // Determine article (a vs an) based on role name
  const article = ["A", "E", "I", "O", "U"].includes(role.name[0].toUpperCase()) ? "an" : "a";

  return (
    <div className="px-8 py-10">
      <div className="max-w-3xl mx-auto">
        {/* Role Header with Icon */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: colors.border, backgroundColor: colors.bg }}
          >
            <Image
              src={`/roles/${role.id}.svg`}
              alt={role.name}
              width={32}
              height={32}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
              {role.name}
            </h2>
            <p className="text-sm text-gray-500">
              Rank #{rank} • {categoryLabel}
            </p>
          </div>
        </div>

        {/* Who is a [Role]? */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D3A2D] mb-4">
            Who <em>is</em> {article} {role.name}?
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {role.role_desc}
          </p>
        </div>

        {/* You Feel Most Like You When... */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D3A2D] mb-4">
            You Feel Most Like You When...
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {role.most_like_when}
          </p>
        </div>

        {/* Core Drive */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-serif text-[#2D3A2D] mb-4">
            Core Drive
          </h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            {role.core_drive}
          </p>
        </div>

        {/* Role Alignment Card - Combined meter + description */}
        <div className="bg-[#F5F3EE] rounded-3xl p-8">
          {/* Title */}
          <h2 className="text-3xl font-serif text-[#2D3A2D] mb-8">
            Role Alignment
          </h2>

          {/* Labels above meter */}
          <div className="relative mb-1">
            <div className="flex justify-between text-sm text-gray-500 px-1">
              <span>Low</span>
              <span>Neutral</span>
              <span>High</span>
            </div>
          </div>

          {/* Alignment Meter with gradient */}
          <div className="relative mb-8">
            {/* Gradient bar background */}
            <div 
              className="h-12 rounded-xl relative"
              style={{
                background: "linear-gradient(to right, #F2D5D5 0%, #F5E6AA 50%, #D4E7D4 100%)"
              }}
            >
              {/* Fill from center to score */}
              <div 
                className="absolute top-0 bottom-0 transition-all duration-500"
                style={{
                  // If score > 50: start at 50%, width is (score - 50)%
                  // If score < 50: start at score%, width is (50 - score)%
                  left: role.score >= 50 ? "50%" : `${role.score}%`,
                  width: `${Math.abs(role.score - 50)}%`,
                  background: role.score >= 50 
                    ? "linear-gradient(to right, rgba(180, 200, 140, 0.6), rgba(140, 180, 140, 0.7))"
                    : "linear-gradient(to right, rgba(220, 180, 180, 0.6), rgba(200, 190, 150, 0.6))",
                  borderRadius: role.score >= 50 ? "0 12px 12px 0" : "12px 0 0 12px",
                }}
              />

              {/* Score number positioned at score location */}
              <div 
                className="absolute top-1/2 transition-all duration-500 z-20"
                style={{ 
                  left: `${role.score}%`,
                  transform: "translate(-50%, -50%)"
                }}
              >
                <span className="text-4xl font-serif text-[#2D3A2D] opacity-70">
                  {role.score}
                </span>
              </div>
            </div>

            {/* Center line (Neutral marker) */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 w-px bg-gray-400 z-10" 
              style={{ top: "-8px", height: "calc(100% + 16px)" }} 
            />
          </div>

          {/* Understanding section */}
          {rankDescription && (
            <div>
              <h3 className="text-2xl font-serif text-[#2D3A2D] mb-4">
                Understanding Your {alignmentLevel} Role Alignment
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {rankDescription}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

