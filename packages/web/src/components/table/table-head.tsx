import { ComponentProps } from "react";

export type TableHeadProps = ComponentProps<"th">;

export function TableHead(props: TableHeadProps) {
  return (
    <th {...props} className="py-3 px-4 text-lg font-semibold text-left" />
  );
}
