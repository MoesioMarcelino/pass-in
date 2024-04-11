import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

import "dayjs/locale/pt-br";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { IconButton, Table, TableHead, TableCell, TableRow } from ".";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDebounce } from "../utils";
import { attendeeMockList } from "../mocks";

dayjs.extend(relativeTime);

export interface Attendee {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  checkedInAt: string | null;
}

const PAGE_LENGTH = 10;
const INITIAL_PAGE = 1;
// dayjs.locale("pt-br");

export function AttendeeList() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("page")) {
      return Number(url.searchParams.get("page"));
    }

    return INITIAL_PAGE;
  });

  const [search, setSearch] = useState(() => {
    const url = new URL(window.location.toString());

    if (url.searchParams.has("search")) {
      return url.searchParams.get("search") ?? "";
    }

    return "";
  });

  const debouncedValue = useDebounce(search, 400);
  const lastPage = Math.ceil(total / PAGE_LENGTH);
  const currentAmount = page * PAGE_LENGTH - 9;

  function updateSearchParams(field: string, value: string | number) {
    const url = new URL(window.location.toString());
    url.searchParams.set(field, String(value));
    window.history.pushState({}, "", url);

    if (field === "page") {
      setPage(Number(value));
    } else {
      setSearch(String(value));
      setPage(INITIAL_PAGE);
    }
  }

  function handleChangeSearch(event: ChangeEvent<HTMLInputElement>) {
    updateSearchParams("search", event.target.value);
  }

  const getDataFromBackend = useCallback(() => {
    const eventId = "5b92b613-dc87-487e-843a-a2915353b5a6";

    const url = new URL(`http://localhost:3333/events/${eventId}/attendees`);

    url.searchParams.set("pageIndex", String(page - 1));

    if (debouncedValue.length > 1) {
      url.searchParams.set("query", debouncedValue);
    }

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        setAttendees(res.attendees);
        setTotal(res.total);
      });
  }, [debouncedValue, page]);

  const getDataMocked = useCallback(() => {
    const attendeesFiltered = debouncedValue
      ? attendeeMockList.filter(({ email, id, name }) => {
          const value = debouncedValue.toLowerCase();

          return (
            id.toLowerCase().includes(value) ||
            email.toLowerCase().includes(value) ||
            name.toLowerCase().includes(value)
          );
        })
      : attendeeMockList;

    const atteendeesPerPage = attendeesFiltered.slice(
      page * PAGE_LENGTH - 9,
      page * PAGE_LENGTH
    );

    setAttendees(atteendeesPerPage);
    setTotal(attendeesFiltered.length);
  }, [debouncedValue, page]);

  useEffect(() => {
    // getDataFromBackend();
    getDataMocked();
  }, [getDataFromBackend, getDataMocked, debouncedValue, page]);

  function goToFirstPage() {
    updateSearchParams("page", INITIAL_PAGE);
  }

  function goToNextPage() {
    updateSearchParams("page", page + 1);
  }

  function goToPreviousPage() {
    updateSearchParams("page", page - 1);
  }

  function goToLastPage() {
    updateSearchParams("page", lastPage);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-3 items-center">
        <h1 className="text-2xl font-bold">Participantes</h1>
        <div className="flex items-center gap-5 px-3 py-1.5 w-96 border border-white/30 bg-transparent rounded-lg text-lg">
          <Search className="size-4 text-emerald-300" />
          <input
            type="text"
            placeholder="Buscar participante"
            className="flex-1 bg-transparent border-none p-0 focus:ring-0"
            onChange={handleChangeSearch}
            value={search}
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr className="border-b border-white/30">
            <TableHead style={{ width: 48 }}>
              <input
                type="checkbox"
                className="size-4 bg-black/20 rounded border border-white/10"
              />
            </TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Participante</TableHead>
            <TableHead>Data de inscrição</TableHead>
            <TableHead>Data de check-in</TableHead>
            <th
              className="py-3 px-4 text-lg font-semibold text-left"
              style={{ width: 64 }}
            />
          </tr>
        </thead>
        <tbody>
          {attendees.map(({ id, name, email, createdAt, checkedInAt }) => (
            <TableRow key={id}>
              <TableCell>
                <input
                  type="checkbox"
                  className="size-4 bg-black/20 rounded border border-white/30 cursor-pointer checked:bg-orange-400 aria-checked:bg-orange-400"
                />
              </TableCell>
              <TableCell>{id}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-white">{name}</span>
                  <span>{email}</span>
                </div>
              </TableCell>
              <TableCell>{dayjs().to(createdAt)}</TableCell>
              <TableCell>
                {checkedInAt ? (
                  dayjs().to(checkedInAt)
                ) : (
                  <span className="text-white/40">Not complete yet</span>
                )}
              </TableCell>
              <TableCell>
                <IconButton transparent>
                  <MoreHorizontal className="size-4" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
        <tfoot>
          {attendees.length > 0 ? (
            <TableRow>
              <TableCell colSpan={2}>
                Mostrando {currentAmount} de {total} itens
              </TableCell>
              <TableCell>Total: {total} item(s)</TableCell>
              <TableCell
                className="py-3 px-4 text-lg text-zinc-300 text-right"
                colSpan={3}
                align="right"
              >
                <div className="inline-flex gap-8 items-center">
                  <span>
                    Página {page} de {lastPage}
                  </span>
                  <div className="flex items-center gap-2">
                    <IconButton onClick={goToFirstPage} disabled={page === 1}>
                      <ChevronsLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToPreviousPage}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToNextPage}
                      disabled={page >= lastPage}
                    >
                      <ChevronRight className="size-4" />
                    </IconButton>
                    <IconButton
                      onClick={goToLastPage}
                      disabled={page === lastPage}
                    >
                      <ChevronsRight className="size-4" />
                    </IconButton>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhuma informação encontrada
              </TableCell>
            </TableRow>
          )}
        </tfoot>
      </Table>
    </div>
  );
}
