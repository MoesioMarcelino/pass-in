import { ComponentProps, ReactNode } from "react";

export type NavLinkProps = {
  children: ReactNode;
  active?: boolean;
} & ComponentProps<"a">;

export function NavLink({ children, active, ...linkProps }: NavLinkProps) {
  return (
    <a
      className={`font-medium text-lg ${active ? "" : "text-zinc-300"}`}
      {...linkProps}
    >
      {children}
    </a>
  );
}
