import { useState } from "react";
import { LogOut, Settings, ChevronUp } from "lucide-react";

type SidebarPosition = "left" | "right";

interface User {
  name: string;
  avatarUrl?: string;
}

interface UserMenuProps {
  user?: User;
  collapsed: boolean;
  showLabels: boolean;
  sidebarPosition?: SidebarPosition;
  onLogout?: () => void;
}

export function UserMenu({
  user,
  collapsed,
  showLabels,
  sidebarPosition = "left",
  onLogout,
}: UserMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  const isRight = sidebarPosition === "right";

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`
          w-full flex items-center gap-3 p-2 rounded-xl
          text-stone-700 dark:text-stone-300
          hover:bg-stone-100 dark:hover:bg-stone-800
          transition-all duration-200
          ${collapsed && !showLabels ? "justify-center" : ""}
        `}
        aria-haspopup="true"
        aria-expanded={menuOpen}
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-stone-300 dark:bg-stone-600 flex items-center justify-center flex-shrink-0">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
              {initials}
            </span>
          )}
        </div>

        {showLabels && (
          <>
            <span className="flex-1 text-left text-sm font-medium truncate transition-opacity duration-150">
              {user?.name || "User"}
            </span>
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-200 ${menuOpen ? "" : "rotate-180"}`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div
          className={`
            absolute bottom-full mb-2
            ${isRight ? "right-0" : "left-0"}
            bg-white dark:bg-stone-800
            border border-stone-200 dark:border-stone-700
            rounded-xl shadow-lg overflow-hidden
            min-w-[160px]
          `}
          role="menu"
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            role="menuitem"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              onLogout?.();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
            role="menuitem"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
