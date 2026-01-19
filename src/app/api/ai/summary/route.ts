import { NextRequest, NextResponse } from "next/server";
import { getAllRoles } from "@/lib/data/roles";
import { getUserResults } from "@/lib/data/users";
import { RoleId } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Get user results and all roles
    const results = getUserResults(userId);
    const allRoles = getAllRoles();

    if (!results) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Combine and sort roles by score
    const rolesWithScores = allRoles
      .map((role) => ({
        ...role,
        score: results[role.id as RoleId],
      }))
      .sort((a, b) => b.score - a.score);

    // Build the context for the AI
    const systemPrompt = `You are an expert in role identity analysis for Becoming You Labs. Your task is to provide a personalized, insightful summary of a user's role identity profile.

THE 10 ROLES AND THEIR MEANINGS:
${allRoles.map(r => `- ${r.name}: ${r.role_desc}`).join('\n')}

USER'S RESULTS (sorted by score, highest to lowest):
${rolesWithScores.map((r, i) => {
  const category = i < 4 ? 'CORE ROLE' : i < 7 ? 'INTERMEDIATE ROLE' : 'PERIPHERAL ROLE';
  return `${i + 1}. ${r.name}: ${r.score}% (${category})`;
}).join('\n')}

INTERPRETATION GUIDELINES:
- Core roles (top 4, scores typically 60%+): These feel most natural and represent primary identity strengths
- Intermediate roles (ranks 5-7): Present but not dominant in their identity
- Peripheral roles (bottom 3, scores typically below 30%): Less central to their identity, may even be avoided

SPECIFIC INTERPRETATIONS FOR THIS USER:
${rolesWithScores.slice(0, 4).map((r, i) => {
  const desc = i === 0 ? r.top_rank_desc : r.core_rank_desc;
  return `${r.name} (Core - ${r.score}%): ${desc}`;
}).join('\n\n')}

${rolesWithScores.slice(7, 10).map((r, i) => {
  const desc = i === 2 ? r.bottom_rank_desc : r.peripheral_rank_desc;
  return `${r.name} (Peripheral - ${r.score}%): ${desc}`;
}).join('\n\n')}

Please provide a warm, insightful 2-3 paragraph summary that:
1. Highlights their strongest roles and what this means for them
2. Notes interesting patterns or contrasts in their profile
3. Offers an encouraging perspective on their unique combination

Write in second person ("You are..."). Be specific and reference their actual scores. Keep it conversational but professional.`;

    const userMessage = "Please provide my personalized role identity summary.";

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content || "Unable to generate summary.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

