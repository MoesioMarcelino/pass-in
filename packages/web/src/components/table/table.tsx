import { ComponentProps } from "react";

export type TableProps = ComponentProps<"table">;

export function Table(props: TableProps) {
  return (
    <div className="w-full border border-white/30 rounded-lg">
      <table {...props} className="w-full" />
    </div>
  );
}
