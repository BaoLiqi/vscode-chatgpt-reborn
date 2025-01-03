import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateConversationModel } from "../store/conversation";
import { Conversation, Model } from "../types";
import Icon from "./Icon";

const models = [
  // { name: "free", model: Model.free },
  // { name: "gem-p", model: Model.gemini_pro },
  // { name: "gem-pe", model: Model.gemini_pro_e },
  // { name: "gem-e", model: Model.gemini_e },
  { name: "deepseek3", model: Model.deepseek3 },
  { name: "llama3", model: Model.llama3_70b },
  { name: "gpt-4om", model: Model.gpt_4o_m },
  { name: "gpt-4o", model: Model.gpt_4o },
  { name: "gpt-o1m", model: Model.gpt_o1_m },
  { name: "gpt-o1", model: Model.gpt_o1 },
  // { name: "sonnet", model: Model.sonnet },
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
      case Model.gpt_o1_m:
        return "o1-m";
      case Model.gpt_o1:
        return "o1";
      case Model.gpt_4o:
        return "4o";
      case Model.gpt_4o_m:
        return "gpt-4m";
      case Model.sonnet:
        return "sonnet";
      case Model.llama3_70b:
        return "llama3.3";
      case Model.deepseek3:
        return "ds3";
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
