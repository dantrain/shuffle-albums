import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { useCallback } from "react";

const SettingsMenu = () => {
  const router = useRouter();

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
          tw="fixed right-2 bottom-2 sm:bottom-auto sm:top-2 p-3 focus:outline-none focus-visible:ring focus-visible:ring-white focus-visible:ring-offset-3 focus-visible:ring-offset-background rounded-full text-gray-200 hover:text-white"
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
          <DropdownMenu.Item
            tw="p-3 min-w-[200px] focus:outline-none focus-visible:bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.1)] border-4 rounded-md border-menu-background"
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
