import { atom } from "jotai";
import type { OpenAIModel } from "@/types/type";

export type Provider = "openai";

export const providerAtom = atom<Provider>("openai");
export const apiKeyAtom = atom("");
export const modelAtom = atom<OpenAIModel>("gpt-3.5-turbo");
