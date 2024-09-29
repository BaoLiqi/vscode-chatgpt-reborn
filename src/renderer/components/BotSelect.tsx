import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setBot } from "../store/conversation";
import { Bot, Conversation } from "../types";
import Icon from "./Icon";

export default function BotSelect({
  vscode,
  currentConversation,
  className,
  dropdownClassName,
  tooltipId,
  showParentMenu,
}: {
  vscode: any;
  currentConversation: Conversation;
  className?: string;
  dropdownClassName?: string;
  tooltipId?: string;
  showParentMenu?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const dispatch = useAppDispatch();
  const t = useAppSelector((state: any) => state.app.translations);
  const [showOptions, setShowOptions] = useState(false);

  const getHumanFriendlyLabel = (bot:Bot) => {
    return bot;
  };

  const getHumanFriendlyDescription = (bot:Bot) => {
    return getHumanFriendlyLabel(bot);
  };

  return (
    <>
      <div
        className={`relative ${className}`}
        data-tooltip-id={tooltipId ?? "footer-tooltip"}
        data-tooltip-content={
          "Change bot"
        }
      >
        <button
          className="rounded py-0.5 px-1 flex flex-row items-center hover:bg-button-secondary focus:bg-button-secondary whitespace-nowrap hover:text-button-secondary focus:text-button-secondary"
          onClick={() => {
            setShowOptions(!showOptions);
          }}
        >
          <Icon icon="chat" className="w-3 h-3 mr-1" />
          {getHumanFriendlyLabel(
            currentConversation?.bot ?? Bot.basic
          )}
        </button>
        <div
          className={`fixed border text-menu bg-menu border-menu shadow-xl text-xs rounded z-10
          ${showOptions ? "block" : "hidden"}
          ${dropdownClassName ? dropdownClassName : "bottom-8 -ml-11"}
        `}
        >
          {Object.values(Bot).map((option) => (
            <button
              className="flex gap-2 items-center justify-start p-2 w-full hover:bg-menu-selection"
              key={option}
              onClick={() => {
                dispatch(
                  setBot({
                    conversationId: currentConversation.id,
                    bot: option,
                  })
                );

                // Update settings
                vscode.postMessage({
                  type: "setBot",
                  value: option,
                });

                // Close the menu
                setShowOptions(false);

                // Close parent menu if it exists
                if (showParentMenu) {
                  showParentMenu(false);
                }
              }}
            >
              {getHumanFriendlyDescription(option)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
