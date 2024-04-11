import { AttendeeList, Header } from "./components";

export function App() {
  return (
    <div className="max-w-[1216px] mx-auto p-5 flex flex-col gap-5">
      <Header />
      <AttendeeList />
    </div>
  );
}
