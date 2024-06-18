import { ChangeEvent, useContext, useEffect, useState } from "react";
import "../../Table.css";
import {
  NetViewEntry,
  SpeedDialButton,
  Net,
  Mark,
  Site,
} from "../../Interfaces";
import {
  ClickAwayListener,
  Pagination,
  PaginationItem,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SortIcon from "@mui/icons-material/Sort";
import NetTableRow from "./NetTableRow";
import SortDialog from "../../Dialogs/SortDialog/SortDialog";
import NetHeaderTable from "./NetHeaderTable";
import { ThemeContext, themeClass } from "../../../../App";

const headers = ["#", "קבוצה", "שם רשת", "הצפנה", "אוק", "תדר"];
const pagingSize = 20;
const entryHeaderParams: (keyof Net)[] = [
  "id" as keyof Net,
  "group" as keyof Net,
  "name" as keyof Net,
  "encryption" as keyof Net,
  "ok" as keyof Net,
  "frequency" as keyof Net,
];

export interface SortByValue {
  key: keyof Net;
  reversed: boolean;
}

interface NetTableProps {
  entries: NetViewEntry[];
  marks: Mark[];
  sites: Site[];
  newOnly: boolean;
  handleNewOnly: () => void;
}

export const stringCmp = (a: string, b: string) => {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  } else {
    return 0;
  }
};

export const sortByFunc: {
  [sortBy: string]: (a: NetViewEntry, b: NetViewEntry) => number;
} = {
  id: (a: NetViewEntry, b: NetViewEntry) => a.net.id - b.net.id,
  group: (a: NetViewEntry, b: NetViewEntry) =>
    stringCmp(a.net.group, b.net.group),
  name: (a: NetViewEntry, b: NetViewEntry) => stringCmp(a.net.name, b.net.name),
  encryption: (a: NetViewEntry, b: NetViewEntry) =>
    (Number(a.net.encryption) ? 1 : 0) - (b.net.encryption ? 1 : 0),
  ok: (a: NetViewEntry, b: NetViewEntry) => stringCmp(a.net.ok, b.net.ok),
  frequency: (a: NetViewEntry, b: NetViewEntry) =>
    a.net.frequency - b.net.frequency,
};

function filterEntries(
  entries: NetViewEntry[],
  headersValue: string[],
  sortBy: SortByValue
): NetViewEntry[] {
  const filteredEntries: NetViewEntry[] = [];
  const sorted = [...entries];
  sorted.sort(sortByFunc[sortBy.key]);
  if (sortBy.reversed) {
    sorted.reverse();
  }
  sorted.forEach((entry) => {
    let isFiltered = true;
    for (let i = 0; i < entryHeaderParams.length; i++) {
      if (
        !entry.net[entryHeaderParams[i]].toString().includes(headersValue[i])
      ) {
        isFiltered = false;
      }
    }
    if (isFiltered) {
      filteredEntries.push(entry);
    }
  });
  return filteredEntries;
}

function NetTable({
  entries,
  marks,
  sites,
  newOnly,
  handleNewOnly,
}: NetTableProps) {
  const darkMode = useContext(ThemeContext);
  const [showEntries, setShowEntries] = useState(entries);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortDialogOpen, setSortDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<string[]>(
    entryHeaderParams.map(() => "")
  );
  const [sortBy, setSortBy] = useState<SortByValue>({
    key: entryHeaderParams[0],
    reversed: false,
  });
  const [reCreate, setReCreate] = useState(true);
  const MenuButtons: SpeedDialButton[] = [
    {
      name: newOnly ? "הצג הכל" : "הצג חדש בלבד",
      icon: newOnly ? <FilterAltOffIcon /> : <FilterAltIcon />,
      onClick: handleNewOnly,
      disable: false,
    },
    {
      name: "מיין",
      icon: <SortIcon />,
      onClick: () => setSortDialogOpen(true),
      disable: false,
    },
  ];

  useEffect(() => {
    setShowEntries(entries);
  }, [entries]);

  useEffect(() => {
    if (!reCreate) setReCreate((v) => !v);
  }, [reCreate]);

  useEffect(() => {
    setShowEntries(filterEntries(entries, search, sortBy));
    setSearch(search);
    setPage(1);
    setReCreate((v) => !v);
  }, [sortBy]);

  const handleSearch = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newSearch = [...search];
    newSearch[index] = event.target.value;
    setShowEntries(filterEntries(entries, newSearch, sortBy));
    setSearch(newSearch);
    setPage(1);
    setReCreate((v) => !v);
  };
  return (
    <>
      <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
        <SpeedDial
          open={menuOpen}
          onClick={() => setMenuOpen((m) => !m)}
          ariaLabel="menu"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          {MenuButtons.map((action) => (
            <SpeedDialAction
              onClick={action.onClick}
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              FabProps={{ disabled: action.disable }}
            />
          ))}
        </SpeedDial>
      </ClickAwayListener>
      <div className={themeClass("main-table-container", darkMode)}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {sites.map((site, index) => (
                <TableCell
                  className={themeClass("pakal-header-cell", darkMode)}
                  key={index}
                >
                  {site.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {showEntries
              .slice((page - 1) * pagingSize, page * pagingSize)
              .map(
                (entry, index) =>
                  reCreate && (
                    <NetTableRow
                      key={index + (page - 1) * pagingSize}
                      entry={entry}
                      marks={marks}
                    />
                  )
              )}
          </TableBody>
        </Table>
        <NetHeaderTable
          showEntries={showEntries}
          headers={headers}
          searchValues={search}
          handleSearch={handleSearch}
          netPage={page}
          pagingSize={pagingSize}
        />
      </div>
      <Pagination
        className="table-pagination"
        variant="outlined"
        showFirstButton
        showLastButton
        count={Math.ceil(showEntries.length / pagingSize)}
        page={page}
        onChange={(_event, value) => setPage(value)}
        color="primary"
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
      <SortDialog<Net>
        open={sortDialogOpen}
        onClose={() => setSortDialogOpen(false)}
        onSubmit={(newSortBy: SortByValue) => {
          setSortBy(newSortBy);
          setSortDialogOpen(false);
        }}
        options={headers}
        optionsValue={entryHeaderParams}
      />
    </>
  );
}

export default NetTable;
