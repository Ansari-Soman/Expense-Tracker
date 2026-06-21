import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../utils/data";
import CharAvatar from "../cards/CharAvatar";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const Sidemenu = ({ activeMenu, closeMobileMenu, isCollapsed, onToggle }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (closeMobileMenu) closeMobileMenu();
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div 
      className={`h-[calc(100vh-57px)] bg-[var(--bg-card)] border-r border-[var(--border-color)] p-3 sticky top-[57px] z-20 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div>
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-2 mt-2 mb-4 pb-4 border-b border-[var(--border-color)] overflow-hidden">
          <CharAvatar
            fullName={user?.fullName}
            width={isCollapsed ? "w-9" : "w-14"}
            height={isCollapsed ? "h-9" : "h-14"}
            style="text-sm bg-[var(--color-primary-light)] text-[var(--color-primary)] font-bold border border-[var(--border-color)] rounded-md font-mono transition-all duration-300"
          />

          {!isCollapsed && (
            <div className="text-center animate-fadeIn">
              <h5 className="text-[var(--text-main)] font-mono font-bold text-xs truncate max-w-[200px]">
                {user?.fullName || ""}
              </h5>
              <span className="text-[9px] text-[var(--text-muted)] font-mono">
                role: administrator
              </span>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col gap-1">
          {SIDE_MENU_DATA.map((item, index) => {
            const isActive = activeMenu === item.label;
            return (
              <button
                key={`menu_${index}`}
                title={isCollapsed ? item.label : ""}
                className={`flex items-center text-xs font-semibold rounded-md cursor-pointer transition-all duration-200 active:scale-[0.98] ${
                  isCollapsed ? "justify-center p-2.5" : "gap-3.5 py-2 px-3.5"
                } ${
                  isActive
                    ? "text-[var(--color-primary)] bg-[var(--color-primary-light)] border border-[var(--border-color)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-app)] border border-transparent"
                }`}
                onClick={() => handleClick(item.path)}
              >
                <item.icon className="text-sm flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapse Trigger (Only shown on Desktop) */}
      <div className="hidden lg:block pt-3 border-t border-[var(--border-color)]">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-md hover:bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer border border-transparent hover:border-[var(--border-color)] transition-all duration-150"
        >
          {isCollapsed ? <LuChevronRight size={14} /> : (
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold">
              <LuChevronLeft size={14} />
              <span>COLLAPSE_MENU</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidemenu;
