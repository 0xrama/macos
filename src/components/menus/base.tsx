import React from "react";

interface MenuItemProps {
  onClick?: (e: React.MouseEvent<HTMLLIElement>) => void;
  children: React.ReactNode;
}

interface MenuItemGroupProps {
  border?: boolean;
  children: React.ReactNode;
}

const MenuItem = (props: MenuItemProps) => {
  return (
    <li
      onClick={props.onClick}
      className="leading-6 cursor-default px-2 mx-1 rounded-[4px] transition-colors duration-75 hover:text-white hover:bg-blue-500/90 active:bg-blue-600"
    >
      {props.children}
    </li>
  );
};

const MenuItemGroup = (props: MenuItemGroupProps) => {
  const border =
    props.border === false
      ? "pb-0.5"
      : "after:(content-empty block pb-0.5 h-px max-w-full mx-2.5 mt-1 bg-gray-400/30 dark:bg-gray-500/30)";
  return <ul className={`relative px-0.5 pt-1 ${border}`}>{props.children}</ul>;
};

export { MenuItem, MenuItemGroup };
