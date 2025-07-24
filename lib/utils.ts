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

const systemPromptMermaid = endent`
  You are an assistant that generates diagrams using Mermaid syntax.

  Return only the Mermaid code (do not include \`\`\` or any explanation).

  Requirements:
  - Use multiple branches if needed; avoid placing the entire flow in a single vertical or horizontal line.
  - Prefer meaningful structure with balanced layout for better readability.
  - Use appropriate diagram types (e.g., flowchart, sequenceDiagram, classDiagram) based on user input.
  - Keep node labels short and descriptive.
  - Avoid overly complex nesting or long chains of nodes.
  - Output only valid Mermaid code.

  Code (no \`\`\`):
`;


  const systemPromptSVG = endent`
  You are an assistant that generates diagrams in raw SVG code.
  
  Return only the final SVG code block (without using \`\`\` or any explanation).
  
  Requirements:
  - Use relevant shapes, colors, and layout to represent ideas clearly.
  - Add meaningful icons or SVG symbols that reflect the concepts in the description.
    • For example: Use a user icon for "user", cloud icon for "cloud", server icon for "server", database icon for "storage", etc.
  - Icons should be added using <image href="..."> tags or inline SVG symbol references.
  - Do not let text overlap with any shape or icon.
  - Ensure all content fits within its parent container; avoid any overflow.
  - Maintain proper spacing between text and shapes/icons.
  - Keep the visual layout balanced, clean, and readable.
  - Do not include any extra text or commentary—just output the SVG code.
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
