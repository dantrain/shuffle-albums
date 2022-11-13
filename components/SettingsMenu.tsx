import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const SettingsMenu = () => {
  const router = useRouter();
  const [useWebPlayer, setUseWebPlayer] = useLocalStorage(
    "useWebPlayer",
    false
  );

  const handleLogOut = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("access_token_expiry");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }, [router]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          tw="fixed right-2 bottom-2 sm:bottom-auto sm:top-2 p-3 focus:outline-none rounded-full text-gray-300 sm:text-gray-200 hover:text-white"
          aria-label="Settings"
        >
          <GearIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          tw="bg-menu-background text-gray-200 text-sm rounded shadow-xl overflow-hidden"
          sideOffset={0}
          collisionPadding={8}
        >
          <DropdownMenu.CheckboxItem
            tw="relative p-3 pl-8 min-w-[200px] focus:outline-none focus-visible:bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] border-4 rounded-md border-menu-background"
            checked={useWebPlayer}
            onCheckedChange={(checked) => {
              setUseWebPlayer(checked === "indeterminate" ? false : checked);
            }}
          >
            <DropdownMenu.ItemIndicator tw="absolute left-3 top-[14px]">
              <CheckIcon />
            </DropdownMenu.ItemIndicator>
            Use web player
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Item
            tw="p-3 pl-8 min-w-[200px] focus:outline-none focus-visible:bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] border-4 rounded-md border-menu-background"
            onClick={handleLogOut}
          >
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SettingsMenu;
