import Link from "next/link";
import { getUserResults } from "@/lib/data/users";
import { getAllRoles } from "@/lib/data/roles";
import { RoleId } from "@/lib/types";
import RadarChart from "./RadarChart";
import AISummary from "./AISummary";
import AIChat from "./AIChat";

export default function Summary() {
  // Fetch data for user 24601
  const results = getUserResults("24601");
  const allRoles = getAllRoles();

  if (!results) {
    return <div>User not found</div>;
  }

  // Roles in original order (for radar chart - consistent positions)
  const rolesForChart = allRoles.map((role) => ({
    id: role.id,
    name: role.name,
    score: results[role.id as RoleId],
  }));

  // Sorted by score (for the lists)
  const sortedRoles = [...rolesForChart].sort((a, b) => b.score - a.score);

  // Get top 4 (core) and bottom 3 (peripheral) roles
  const coreRoles = sortedRoles.slice(0, 4);
  const peripheralRoles = sortedRoles.slice(7, 10);

  return (
    <div className="px-8 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-[#2D3A2D] mb-4">
            Your Role Identity Profile
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            This visualization shows how you align with each of the 10 role identities. 
            The shape reveals your unique pattern of strengths and tendencies.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Radar Chart */}
          <div className="flex justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <RadarChart roles={rolesForChart} size={420} />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="space-y-6">
            {/* Core Roles Card */}
            <div className="bg-[#F5F3EE] rounded-2xl p-6">
              <h2 className="text-xl font-serif text-[#2D3A2D] mb-4">
                Your Core Roles
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                These roles feel most natural to you and represent your primary strengths.
              </p>
              <div className="space-y-3">
                {coreRoles.map((role, index) => (
                  <div 
                    key={role.id}
                    className="flex items-center justify-between bg-white rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">
                        {index + 1}
                      </span>
                      <span className="font-medium text-[#2D3A2D]">
                        {role.name}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-[#8B7355]">
                      {role.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peripheral Roles Card */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h2 className="text-xl font-serif text-[#2D3A2D] mb-4">
                Peripheral Roles
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                These roles are less central to your identity but still part of who you are.
              </p>
              <div className="space-y-3">
                {peripheralRoles.map((role, index) => (
                  <div 
                    key={role.id}
                    className="flex items-center justify-between bg-white rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">
                        {index + 8}
                      </span>
                      <span className="font-medium text-gray-600">
                        {role.name}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-gray-400">
                      {role.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/discover/breakdown"
              className="block w-full text-center py-4 bg-[#2D3A2D] text-white rounded-xl font-medium hover:bg-[#1D2A1D] transition"
            >
              View Detailed Breakdown →
            </Link>
          </div>
        </div>

        {/* AI-Generated Summary */}
        <div className="mt-16">
          <AISummary userId="24601" />
        </div>

        {/* AI Chat Interface */}
        <div className="mt-8">
          <AIChat userId="24601" />
        </div>
      </div>
    </div>
  );
}
