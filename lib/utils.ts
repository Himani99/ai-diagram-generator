import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  createParser,
  ParsedEvent,
  ReconnectInterval,
} from "eventsource-parser";
import endent from "endent";
import { deflate } from "pako";
import { fromUint8Array } from "js-base64";

import { type Message } from "@/types/type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
//Prompt for Mermaid Diagram
export const systemPromptMermaid = endent`
You are an assistant that generates diagrams in Mermaid syntax.

Your role:
- Convert user input into clean, readable Mermaid diagrams.
- Use relevant EDA-related terms such as "analytics", "testing", "data", "wafer", "chip", "ai", "ml", "automation", etc.
- Use diagram types appropriately (flowchart, sequenceDiagram, classDiagram, etc.).

Structure Guidelines:
- Avoid placing the entire diagram in a single vertical or horizontal line.
- Use multiple branches and balanced layouts.
- Use subgraphs when needed to group related nodes.
- Keep node labels short, clear, and descriptive.
- Avoid unnecessary complexity or deep nesting.

Visual Enhancements:
- Apply different node colors using style or classDef (example: style A fill:#f9f,stroke:#333,stroke-width:1px).
- Use light blue, light yellow, red, green, purple, etc., to convey meaning visually:
  - Security/authentication nodes → red
  - AI/ML/automation → blue or purple
  - User-related steps → green
  - Data/storage → yellow
  - Default nodes → gray

Semantic Icons:
- Inline emojis for clarity and context:
  - 📊 analytics
  - 🧪 testing
  - 💾 data
  - 🟦 wafer
  - 🧱 chip/design
  - 🧠 ai/ml
  - ⚙️ automation
  - 🔍 debug/validate
  - 🔌 io/interface
  - 🔒 login/auth/security

Output Rules:
- Only return valid Mermaid code.
- Do NOT include \`\`\`, markdown, or explanation.
- Return code only — no formatting or extra text.
`;

//Prompt for SVG Diagram
const systemPromptSVG = endent`
  
 You are an assistant that generates diagrams in raw SVG code.

 Return only the final SVG code block (without using \`\`\` or any explanation).

Requirements:

- Use relevant shapes and layout to represent ideas clearly, focusing mainly on block diagrams.
- Use meaningful icons or SVG symbols that reflect the concepts described in the text.
  • For example:
    - "user" → user icon
    - "cloud" → cloud icon
    - "server" → server icon
    - "database" or "storage" → database icon
    - "analytics" → chart icon
    - "testing" or "test" → lab/flask icon
    - "wafer" or "chip" → CPU icon
  Icon Rules:
- Use icons from trusted public CDNs such as:
  - Flaticon: https://cdn-icons-png.flaticon.com
  - Iconify: https://api.iconify.design
  - Any other public URL with reliable SVG/PNG icons.
- Ensure no text overlaps with any shapes or icons.
- Keep all content fully inside its parent container—no overflow.
- Maintain spacing between text and shapes/icons.
- Keep the visual layout balanced, clean, and readable.
- Avoid placing any text partially inside and partially outside shapes—text should be either fully contained or outside, maintaining clarity.
- Do **not** include any commentary, explanation, or markdown formatting—just output raw SVG.
`;


export const OpenAIStream = async (
  messages: Message[],
  model: string,
  key: string,
  mode: 'mermaid' | 'svg'
) => {
  console.log("DEBUG System Prompt", mode, 'this was the mode used');
  const system = { role: "system", content: mode == 'mermaid' ? systemPromptMermaid : systemPromptSVG };
  const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key || process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model,
      messages: [system, ...messages],
      temperature: 0,
      stream: true,
    }),
  });

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  if (res.status !== 200) {
    const statusText = res.statusText;
    const result = await res.body?.getReader().read();
    throw new Error(
      `OpenAI API returned an error: ${
        decoder.decode(result?.value) || statusText
      }`
    );
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};

export const parseMermaidCodeFromMessage = (message: string) => {
  const regex = /```(?:mermaid)?\s*([\s\S]*?)```/;
  const match = message.match(regex);

  if (match) {
    return match[1];
  }
    return message;
};

export function parseSvgCodeFromMessage(aiResponse: string){
    const svgPattern = /(<svg[\s\S]*?<\/svg>)/;
    const match = aiResponse.match(svgPattern);
    return match ? match[0] : aiResponse;
}

export const externalCodeLinkMermaid = (code: string) => {
  const stateMermaid = {
    code: parseMermaidCodeFromMessage(code),

export function parseSvgCodeFromMessage(aiResponse: string){
    const svgPattern = /(<svg[\s\S]*?<\/svg>)/;
    const match = aiResponse.match(svgPattern);
    return match ? match[0] : aiResponse;
}

export const externalCodeLinkMermaid = (code: string) => {
  const stateMermaid = {
    code: parseMermaidCodeFromMessage(code),
    mermaid: JSON.stringify(
      {
        theme: "default",
      },
      undefined,
      2
    ),
    autoSync: true,
    updateDiagram: true,
  };

  const data = new TextEncoder().encode(JSON.stringify(stateMermaid));
  const compressed = deflate(data, { level: 9 });
  return `https://mermaid.live/edit#pako:${fromUint8Array(compressed, true)}`;
};
