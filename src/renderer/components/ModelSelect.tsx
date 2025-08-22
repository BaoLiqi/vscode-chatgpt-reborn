import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateConversationModel } from "../store/conversation";
import { Conversation, Model } from "../types";
import Icon from "./Icon";

const models = [
  { name: "grok4", model: Model.grok4 },
  { name: "g25pro", model: Model.gemini_25_pro },
  { name: "g25lite", model: Model.gemini_25_lite },

  // { name: "gpt-oss", model: Model.gpt_oss_120b },
  // { name: "41mini", model: Model.gpt_41_mini },
  // { name: "gpt5-nano", model: Model.gpt_5_nano },
  // { name: "gpt5-mini", model: Model.gpt_5_mini },
  { name: "gpt5-chat", model: Model.gpt_5_chat },

  { name: "qwen3", model: Model.qwen },
  // { name: "kimiK2", model: Model.kimi },
  { name: "ds31", model: Model.deepseek_31 },
];

// Create a mapping from model to name
const modelToNameMap = new Map(models.map(({ name, model }) => [model, name]));

export default function ModelSelect({
  currentConversation,
  conversationList,
  vscode,
  className,
  dropdownClassName,
  tooltipId,
  showParentMenu,
}: {
  currentConversation: Conversation;
  conversationList: Conversation[];
  vscode: any;
  className?: string;
  dropdownClassName?: string;
  tooltipId?: string;
  showParentMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const t = useAppSelector((state: any) => state.app.translations);
  const [showModels, setShowModels] = useState(false);
  const settings = useAppSelector((state: any) => state.app.extensionSettings);

  const setModel = (model: Model) => {
    // Update settings
    vscode.postMessage({
      type: "setModel",
      value: model,
      conversationId: currentConversation.id,
    });

    dispatch(
      updateConversationModel({
        conversationId: currentConversation.id,
        model,
      })
    );

    // Close the menu
    setShowModels(false);
  };

  const friendlyName = (model: Model | undefined | null): string => {
    return modelToNameMap.get(model ?? Model.none) ?? (model || "None");
  };

  return (
    <>
      <div className={`${className}`}>
        <button
          className={`rounded py-0.5 px-1 flex flex-row items-center hover:bg-button-secondary focus:bg-button-secondary whitespace-nowrap hover:text-button-secondary focus:text-button-secondary`}
          onClick={() => {
            setShowModels(!showModels);
          }}
          data-tooltip-id={tooltipId ?? "footer-tooltip"}
          data-tooltip-content="Change the AI model being used"
        >
          <Icon icon="box" className="w-3 h-3 mr-1" />
          {friendlyName(currentConversation.model ?? Model.none)}
        </button>
        <div
          className={`fixed items-center more-menu border text-menu bg-menu border-menu shadow-xl text-xs rounded
          ${showModels ? "block" : "hidden"}
          ${dropdownClassName ? dropdownClassName : "bottom-8 left-4 z-10"}
  `}
        >
          {models.map(({ name, model }) => (
            <button
              key={name}
              className="flex flex-col gap-2 items-start justify-start p-2 w-full hover:bg-menu-selection"
              onClick={() => {
                setModel(model);
                if (showParentMenu) {
                  showParentMenu(false);
                }
              }}
            >
              <code>{name}</code>
              <p>"{model}"</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
