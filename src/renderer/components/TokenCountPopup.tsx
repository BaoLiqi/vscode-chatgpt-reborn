import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../hooks";
import { Conversation, MODEL_COSTS, MODEL_TOKEN_LIMITS, Model } from "../types";

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
  const settings = useAppSelector((state: any) => state.app.extensionSettings);
  const t = useAppSelector((state: any) => state.app.translations);
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(0);
  const [minPromptTokens, setMinPromptTokens] = useState(
    currentConversation.tokenCount?.minTotal ?? 0
  );
  const [maxCompleteTokens, setMaxCompleteTokens] = useState(0);
  const [promptRate, setPromptRate] = useState(0);
  const [completeRate, setCompleteRate] = useState(0);

  // On model change and token count change, update the token count label
  useEffect(() => {

    let current_model:string = currentConversation?.model??Model.gpt_35_turbo;
    if(!(current_model in MODEL_TOKEN_LIMITS)){
      current_model=Model.gpt_35_turbo;
    }

    const minPromptTokens =
      (currentConversation.tokenCount?.messages ?? 0) +
      (currentConversation.tokenCount?.userInput ?? 0);
    const modelContextLimit =
      MODEL_TOKEN_LIMITS[current_model]
        .context;

    const modelMax =
      MODEL_TOKEN_LIMITS[current_model].max;
    let maxCompleteTokens = modelContextLimit - minPromptTokens;

    if (modelMax) {
      maxCompleteTokens = Math.min(maxCompleteTokens, modelMax);
    }

    let ratePrompt =
      MODEL_COSTS[current_model].prompt;
    let rateComplete =
      MODEL_COSTS[current_model].complete;
    let minCost = (minPromptTokens / 1000) * ratePrompt;
    // maxCost is based on current convo text at ratePrompt pricing + theoretical maximum response at rateComplete pricing
    let maxCost = minCost + (maxCompleteTokens / 1000) * rateComplete;

    setMinPromptTokens(minPromptTokens);
    setMaxCompleteTokens(maxCompleteTokens);
    setPromptRate(ratePrompt);
    setCompleteRate(rateComplete);
    setMinCost(minCost);
    setMaxCost(maxCost);
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
      {/* Show a breakdown of the token count with min tokens, max tokens, min cost, and max cost */}
      <div className="p-4 flex flex-col gap-2 whitespace-pre-wrap">
        <p>
          <span className="block">
            <span className="font-bold">
              {t?.questionInputField?.tokenBreakdownAtLeast ?? "At least:"}
            </span>
            <br />
            <span className="font-italic text-[10px]">
              {t?.questionInputField?.tokenBreakdownAtLeastNote ??
                "(no answer)"}
              <br />(
              <code>{currentConversation.tokenCount?.messages ?? 0}</code> +{" "}
              <code>{currentConversation.tokenCount?.userInput ?? 0}</code>)
            </span>
          </span>
          <code>{minPromptTokens}</code>{" "}
          {t?.questionInputField?.tokenBreakdownTokensWhichIs ??
            "tokens which is"}
          <code> ${minCost?.toFixed(4) ?? 0}</code>
        </p>
        <p>
          <span className="block">
            <span className="font-bold">
              {t?.questionInputField?.tokenBreakdownAtMost ?? "At most:"}
            </span>
            <br />
            <span className="font-italic text-[10px]">
              {t?.questionInputField?.tokenBreakdownAtMostNote ??
                "(all messages + prompt + longest answer)"}
              <br />(
              <code>{currentConversation.tokenCount?.messages ?? 0}</code> +{" "}
              <code>{currentConversation.tokenCount?.userInput ?? 0}</code> +{" "}
              <code>{maxCompleteTokens})</code>
            </span>
          </span>
          <code>{minPromptTokens + maxCompleteTokens}</code>{" "}
          {t?.questionInputField?.tokenBreakdownTokensWhichIs ??
            "tokens which is"}
          <code> ${maxCost?.toFixed(4) ?? 0}</code>
        </p>
        <p>
          {`(prompt: $${promptRate} / 1000 tokens, completion: $${completeRate} / 1000 tokens)`}
        </p>
      </div>
    </div>
  );
}
