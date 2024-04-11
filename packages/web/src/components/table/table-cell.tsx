import { ComponentProps } from "react";

export type TableCellProps = ComponentProps<"td">;

export function TableCell(props: TableCellProps) {
  return <td className="py-3 px-4 text-lg text-zinc-300" {...props} />;
}
