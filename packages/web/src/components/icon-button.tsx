import { ComponentProps } from "react";

export type IconButtonProps = {
  transparent?: boolean;
} & ComponentProps<"button">;

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`
        border border-white/10 rounded-md p-1.5 
        ${transparent ? "bg-black/20" : "bg-white/20"}
        ${props.disabled ? "opacity-50" : null} 
      `}
    />
  );
}
