import React from "react";
import {
  LuBriefcase,
  LuCoins,
  LuTrendingUp,
  LuGift,
  LuUtensils,
  LuHouse,
  LuZap,
  LuCar,
  LuShoppingBag,
  LuGamepad2,
  LuHeartPulse,
  LuInfo,
  LuBookmark,
} from "react-icons/lu";

export const ICON_MAP = {
  // Income Sources
  salary: LuBriefcase,
  freelance: LuCoins,
  investment: LuTrendingUp,
  gift: LuGift,
  
  // Expenses
  food: LuUtensils,
  rent: LuHouse,
  utilities: LuZap,
  transport: LuCar,
  shopping: LuShoppingBag,
  entertainment: LuGamepad2,
  health: LuHeartPulse,
  
  // Fallbacks / Gen
  other: LuInfo,
  bookmark: LuBookmark,
};

const CategoryIcon = ({ iconName, className = "text-lg" }) => {
  const IconComponent = ICON_MAP[iconName?.toLowerCase()] || LuInfo;
  return <IconComponent className={className} />;
};

export default CategoryIcon;
