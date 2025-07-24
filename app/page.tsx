"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { apiKeyAtom, modelAtom } from "@/lib/atom";
import { Mermaid } from "@/components/Mermaids";
import { ChatInput } from "@/components/ChatInput";
import { CodeBlock } from "@/components/CodeBlock";
import { ChatMessage } from "@/components/ChatMessage";
import type { Message, RequestBody, OpenAIModel } from "@/types/type";
import { parseMermaidCodeFromMessage, parseSvgCodeFromMessage } from "@/lib/utils";
import { useContextValues } from "./context";
import SVGRender from "@/components/SVG";

export default function Home() {
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [model, setModel] = useAtom(modelAtom);

  const { 
    draftMessage, setDraftMessage, 
    messages, setMessages, 
    draftOutputCode, setDraftOutputCode, 
    outputCode, setOutputCode,
    mode, setMode
  } = useContextValues();

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    const model = localStorage.getItem("model");
    const mode = localStorage.getItem("mode") || "mermaid";

    if (apiKey) {
      setApiKey(apiKey);
    }
    if (model) {
      setModel(model as OpenAIModel);
    }
    if (mode) {
      setMode(mode as "mermaid" | "svg");
    }
  }, []);

  const handleSubmit = async () => {
    if (!apiKey) {
      alert("Please enter an API key.");
      return;
    }

    if (!draftMessage) {
      alert("Please enter a message.");
      return;
    }

    const newMessage: Message = {
      role: "user",
      content: draftMessage,
    };
    const newMessages = [...messages, newMessage];

    setMessages(newMessages);
    setDraftMessage("");
    setDraftOutputCode("");

    const controller = new AbortController();
    const body: RequestBody = { messages: newMessages, model, apiKey, mode };

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      alert("Something went wrong.");
      return;
    }

    const data = response.body;

    if (!data) {
      alert("Something went wrong.");
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let accumulated = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      accumulated += chunkValue;
      setDraftOutputCode(accumulated); // ✅ FIXED: directly set the updated string
    }

    setOutputCode(
      mode === "mermaid"
        ? parseMermaidCodeFromMessage(accumulated)
        : parseSvgCodeFromMessage(accumulated)
    );
  };

  return (
    <main className="container flex-1 w-full flex flex-wrap">
      <div className="flex border md:border-r-0 flex-col justify-between w-full md:w-1/4">
        <div>
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.content} message={message.content} />
            ))}
          </div>
        </div>
        <div className="w-full p-2">
          <ChatInput
            messageCotent={draftMessage}
            onChange={setDraftMessage}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
      <div className="border w-full md:w-3/4 p-2 flex flex-col">
        <div className="flex-1 flex justify-center border relative">
          {mode === "mermaid" ? (
            <Mermaid chart={outputCode} />
          ) : (
            <SVGRender code={outputCode} />
          )}
        </div>
        <CodeBlock code={draftOutputCode} />
      </div>
    </main>
  );
}
