export const ICON_MAP: Record<string, string> = {
    analytics: "📊",
    testing: "🧪",
    test: "🧪",
    data: "💾",
    wafer: "🟦",
    chip: "🧱",
    design: "🧱",
    ai: "🧠",
    ml: "🧠",
    automation: "⚙️",
    debug: "🔍",
    validate: "🔍",
    interface: "🔌",
    io: "🔌",
  };
  
  export function replaceKeywordsWithIcons(input: string): string {
    let result = input;
    for (const [word, icon] of Object.entries(ICON_MAP)) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      result = result.replace(regex, icon + " " + word);
    }
    return result;
  }
  