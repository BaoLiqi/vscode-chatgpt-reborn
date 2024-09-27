import React from "react";
import { useAppSelector } from "../hooks";

export default function ({ className }: { vscode: any; className?: string }) {
  const t = useAppSelector((state: any) => state.app.translations);

  return (
    <div
      className={`flex flex-col justify-start gap-3.5 h-full items-center px-6 pt-2 pb-24 w-full relative login-screen overflow-auto ${className}`}
    >
    </div>
  );
}
