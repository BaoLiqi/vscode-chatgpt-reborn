import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Conversation } from "../types";

export default function TokenCountPopup({
  currentConversation,
  showTokenBreakdown,
  setTokenCountLabel,
  className,
}: {
  currentConversation: Conversation;
  conversationList: Conversation[];
  vscode: any;
  showTokenBreakdown: boolean;
  setTokenCountLabel: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
}) {
  // const settings = useAppSelector((state: any) => state.app.extensionSettings);
  // const t = useAppSelector((state: any) => state.app.translations);

  const [minPromptTokens, setMinPromptTokens] = useState(
    currentConversation.tokenCount?.minTotal ?? 0
  );


  // On model change and token count change, update the token count label
  useEffect(() => {

    const minPromptTokens =
      (currentConversation.tokenCount?.messages ?? 0) +
      (currentConversation.tokenCount?.userInput ?? 0);

    setMinPromptTokens(minPromptTokens);

    setTokenCountLabel(minPromptTokens.toString());
  }, [currentConversation.tokenCount, currentConversation.model]);

  return (
    <div
      className={clsx(
        "TokenCountPopup",
        "absolute w-[calc(100% - 3em) max-w-[25em] items-center border text-menu bg-menu border-menu shadow-xl text-xs rounded z-10 bottom-6 right-4",
        className,
        showTokenBreakdown ? "block" : "hidden"
      )}
    >

    </div>
  );
}
