import { ComponentProps } from "react";

export type TableRowProps = ComponentProps<"tr">;

export function TableRow(props: TableRowProps) {
  return (
    <tr {...props} className="border-b border-white/30 hover:bg-white/5" />
  );
}
