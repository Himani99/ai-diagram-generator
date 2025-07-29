"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { apiKeyAtom, modelAtom } from "@/lib/atom";
import { ChatInput } from "@/components/ChatInput";
import { CodeBlock } from "@/components/CodeBlock";
import { ChatMessage } from "@/components/ChatMessage";
import type { Message, RequestBody, OpenAIModel } from "@/types/type";
import { parseMermaidCodeFromMessage, parseSvgCodeFromMessage } from "@/lib/utils";
import { useContextValues } from "./context";
import DiagramModalView from "@/components/DiagramModalView";

export default function Home() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [model, setModel] = useAtom(modelAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    draftMessage, setDraftMessage,
    messages, setMessages,
    draftOutputCode, setDraftOutputCode,
    outputCode, setOutputCode,
    mode, setMode
  } = useContextValues();

  // Load local settings on mount
  useEffect(() => {
    const storedKey = localStorage.getItem("apiKey");
    const storedModel = localStorage.getItem("model");
    const storedMode = localStorage.getItem("mode") || "mermaid";

    if (storedKey) setApiKey(storedKey);
    if (storedModel) setModel(storedModel as OpenAIModel);
    if (storedMode) setMode(storedMode as "mermaid" | "svg");
  }, []);

  // Open modal when diagram is ready
  useEffect(() => {
    if (outputCode) setIsModalOpen(true);
  }, [outputCode]);

  const handleSubmit = async () => {
    if (!apiKey) return alert("Please enter an API key.");
    if (!draftMessage) return alert("Please enter a prompt.");

    const newMessage: Message = {
      role: "user",
      content: draftMessage,
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setDraftMessage("");
    setDraftOutputCode("");

    const body: RequestBody = {
      messages: updatedMessages,
      model,
      apiKey,
      mode,
    };

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Something went wrong.");
      return;
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      accumulated += decoder.decode(value);
      setDraftOutputCode(accumulated);
    }

    const finalCode =
      mode === "mermaid"
        ? parseMermaidCodeFromMessage(accumulated)
        : parseSvgCodeFromMessage(accumulated);

    setOutputCode(finalCode);
  };

  return (
    <main className="container flex-1 w-full flex flex-wrap">
      {/* Left: Message + Input */}
      <div className="flex border md:border-r-0 flex-col justify-between w-full md:w-1/4">
        <div>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message.content} />
          ))}
        </div>
        <div className="w-full p-2">
          <ChatInput
            messageCotent={draftMessage}
            onChange={setDraftMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      {/* Right: Code output */}
      <div className="border w-full md:w-3/4 p-2 flex flex-col">
        <CodeBlock code={draftOutputCode} />
      </div>

      {/* Modal: Diagram Preview */}
      <DiagramModalView
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        code={outputCode}
        mode={mode}
      />
    </main>
  );
}
