"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function LText({ content }: { content: any }) {
  const { t } = useLanguage();
  return <>{t(content)}</>;
}