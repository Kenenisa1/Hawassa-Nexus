"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LText({ content }: { content: Record<string, string> | string | undefined | null }) {
  const { t } = useLanguage();
  return <>{t(content)}</>;
}