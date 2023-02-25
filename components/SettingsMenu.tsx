import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { ReactNode, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import logout from "../utils/logout";

const MenuItem = ({ children }: { children: ReactNode }) => (
  <div tw="group-hover:bg-[rgba(255, 255, 255, 0.1)] group-focus-visible:bg-[rgba(255, 255, 255, 0.1)] relative min-w-[200px] p-3 pl-8 rounded-sm">
    {children}
  </div>
);

const SettingsMenu = () => {
  const router = useRouter();
  const [useWebPlayer, setUseWebPlayer] = useLocalStorage(
    "useWebPlayer",
    false
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          tw="fixed right-2 bottom-2 sm:bottom-auto sm:top-2 block p-3 focus:outline-none rounded-full text-gray-400 sm:text-gray-200 hover:text-white focus-visible:ring focus-visible:ring-white"
          aria-label="Settings"
        >
          <GearIcon />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          tw="bg-menu-background text-gray-200 text-sm rounded shadow-xl overflow-hidden cursor-default"
          sideOffset={0}
          collisionPadding={8}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenu.CheckboxItem
            className="group"
            tw="focus:outline-none px-1 pt-1"
            checked={useWebPlayer}
            onCheckedChange={(checked) => setUseWebPlayer(checked)}
          >
            <MenuItem>
              <DropdownMenu.ItemIndicator tw="absolute left-3 top-[14px]">
                <CheckIcon />
              </DropdownMenu.ItemIndicator>
              Use web player
            </MenuItem>
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Item
            className="group"
            tw="focus:outline-none px-1 pb-1"
            onClick={() => router.push("/privacy")}
          >
            <MenuItem>Privacy policy</MenuItem>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="group"
            tw="focus:outline-none px-1 pb-1"
            onClick={() => logout(router)}
          >
            <MenuItem>Log out</MenuItem>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SettingsMenu;
