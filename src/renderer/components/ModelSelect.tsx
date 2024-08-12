import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateConversationModel } from "../store/conversation";
import {
  Conversation,
  Model
} from "../types";
import Icon from "./Icon";

const models = [
  { name: "free", model: Model.free },
  // { name: "gemini-flash",model:Model.gemini_flash},
  // { name: "wizardlm-2", model: Model.wizard },
  // { name: "mistral8x22instruct", model: Model.mistral8x22b_instruct },
  // { name: "llama3-70b", model: Model.llama3_70b },
  { name: "llama3-nitro", model: Model.llama3_70b_nitro },
  { name: "llama3-405b", model: Model.llama3_405 },
  { name: "qwen2-72B", model: Model.qwen2 },
  { name: "gemini-pro",model:Model.gemini_pro},
  { name: "gpt-4om", model: Model.gpt_4o_m },
  { name: "gpt-4o", model: Model.gpt_4o },
  { name: "gpt4turbo", model: Model.gpt_4_turbo },
];

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

  const friendlyName = (model: string): string => {
    switch (model) {
      case Model.wizard:
        return "Wizard2";
      case Model.free:
        return "M-7";
      case Model.mistral8x22b_instruct:
        return "M-8x22";
      case Model.llama3_70b:
        return "llama3";
      case Model.llama3_70b_nitro:
        return "l3n";
      case Model.llama3_405:
        return "l405";
      case Model.qwen2:
        return "qwen2";
      case Model.haiku:
        return "haiku";
      case Model.gpt_4o:
        return "gpt-4o86";
      case Model.gpt_4o_m:
        return "gpt-4m";
      case Model.gpt_4_turbo:
        return "4turbo";
      case Model.gemini_flash:
        return "gf1.5";
      case Model.gemini_pro:
        return "g-pro";
      default:
        return model;
    }
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
