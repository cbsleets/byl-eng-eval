import { NextRequest, NextResponse } from "next/server";
import { getAllRoles } from "@/lib/data/roles";
import { getUserResults } from "@/lib/data/users";
import { RoleId } from "@/lib/types";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { userId, messages } = await req.json() as { 
      userId: string; 
      messages: Message[];
    };

    if (!userId || !messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Missing userId or messages" },
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
    const systemPrompt = `You are a friendly, insightful AI assistant for Becoming You Labs, specializing in role identity analysis. You help users understand their role identity profile results.

THE 10 ROLES AND THEIR MEANINGS:
${allRoles.map(r => `
**${r.name}**
- Description: ${r.role_desc}
- Core Drive: ${r.core_drive}
- You feel most like this when: ${r.most_like_when}
- High alignment means: ${r.core_rank_desc}
- Low alignment means: ${r.peripheral_rank_desc}
`).join('\n')}

THIS USER'S RESULTS (sorted by score, highest to lowest):
${rolesWithScores.map((r, i) => {
  const category = i < 4 ? 'CORE' : i < 7 ? 'INTERMEDIATE' : 'PERIPHERAL';
  return `${i + 1}. ${r.name}: ${r.score}% (${category})`;
}).join('\n')}

SPECIFIC INTERPRETATIONS FOR THIS USER:
Top Role: ${rolesWithScores[0].name} (${rolesWithScores[0].score}%) - ${rolesWithScores[0].top_rank_desc}
Lowest Role: ${rolesWithScores[9].name} (${rolesWithScores[9].score}%) - ${rolesWithScores[9].bottom_rank_desc}

GUIDELINES FOR RESPONDING:
1. Be warm, encouraging, and conversational
2. Reference the user's specific scores when relevant
3. Help them understand what their results mean practically
4. If they ask about a specific role, explain it in the context of THEIR score
5. Avoid being preachy or overly formal
6. Keep responses concise but insightful (2-3 paragraphs max)
7. Use "you" and "your" to make it personal

If the user asks something unrelated to role identity, gently redirect them to discussing their results.`;

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "Failed to get response" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

