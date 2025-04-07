import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateConversationModel } from "../store/conversation";
import { Conversation, Model } from "../types";
import Icon from "./Icon";

const models = [
  { name: "e-g2p", model: Model.gemini_2_pro_exp },
  { name: "e-g25p", model: Model.gemini_25_pro_exp },
  { name: "e-g25pre", model: Model.gemini_25_pro_preview },
  // { name: "e-g2f", model: Model.gemini_2_flash_exp },
  // { name: "e-g2f-thinking", model: Model.gemini_2_flash_thinking_exp },
  { name: "g2f-001", model: Model.gemini_2_flash_001 },
  // { name: "dsR1", model: Model.deepseek_r1 },
  { name: "dsV3", model: Model.deepseek_v3 },
  { name: "dsV3f", model: Model.deepseek_v3f },
  // { name: "qwq_free", model: Model.qwq_free },
  // { name: "qwq", model: Model.qwq },
  { name: "o3mini", model: Model.gpt_o3_m },
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
