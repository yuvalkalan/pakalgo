import {
  Autocomplete,
  ClickAwayListener,
  InputAdornment,
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
  TextField,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./SiteTable.css";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, UserContext, themeClass } from "../../../../App";
import {
  SiteEntryRow,
  Mark,
  MarkDialogEntry,
  Net,
  NetDialogEntry,
  Site,
  SiteDialogEntry,
  SiteViewEntry,
  SpeedDialButton,
  NetViewCell,
} from "../../Interfaces";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SiteDialog from "../../Dialogs/SiteDialog/SiteDialog";
import NetDialog from "../../Dialogs/NetDialog/NetDialog";
import MarkDialog from "../../Dialogs/MarkDialog/MarkDialog";

export const SiteColors = [
  "#FFCCCC80",
  "#CCE5FF80",
  "#CCFFCC80",
  "#FFFFCC80",
  "#DDCCFF80",
  "#FFE5CC80",
  "#E6E6FA80",
  "#CCFFE580",
  "#FFD7B480",
  "#ADD8E680",
];
export const HAS_CHANGED_COLOR = "#FF0000C0";
export const ENCRYPTION_TRUE = "מוצפן";
export const ENCRYPTION_FALSE = "גלוי";
export const ENCRYPTION_NONE = "(ללא)";
export const ENCRYPTION_TRUE_COLOR = "#008500";
export const ENCRYPTION_FALSE_COLOR = "#cc5050";
export const DIALOG_VALUES = { net: 1, site: 2, mark: 3 };
export const TABLE_HEADERS = [
  "אתר",
  "עמדה",
  "שם רשת",
  "קבוצה",
  "הצפנה",
  "אוק",
  "תדר",
  "הערות",
];
export const ENTRY_PARAMS: (keyof SiteEntryRow)[] = [
  "siteName" as keyof SiteEntryRow,
  "name" as keyof SiteEntryRow,
  "netName" as keyof SiteEntryRow,
  "netGroup" as keyof SiteEntryRow,
  "netEncryption" as keyof SiteEntryRow,
  "netOk" as keyof SiteEntryRow,
  "frequency" as keyof SiteEntryRow,
  "unitNotes" as keyof SiteEntryRow,
];

export function filterEntries(
  entries: SiteViewEntry[],
  nets: Net[],
  sites: Site[],
  filter: string[]
): SiteViewEntry[] {
  const filteredEntries: SiteViewEntry[] = [];
  entries.forEach((entry) => {
    const net = nets.find((n) => n.id === entry.netId);
    const row: SiteEntryRow = {
      siteName:
        sites.find((site) => site.id === entry.siteId)?.name || "<ERROR>",
      name: entry.name,
      netGroup: net ? net.group : "",
      netName: net ? net.name : "",
      netEncryption: net
        ? net.encryption
          ? ENCRYPTION_TRUE
          : ENCRYPTION_FALSE
        : ENCRYPTION_NONE,
      netOk: net ? net.ok : "",
      frequency: net ? net.frequency : 0,
      unitNotes: entry.notes,
    };
    let filtered = ENTRY_PARAMS.every((param, index) =>
      row[param].toString().includes(filter[index])
    );
    if (filtered) filteredEntries.push(entry);
  });
  return filteredEntries;
}

export function getHasChanged(
  entry: SiteViewEntry | NetViewCell,
  net: Net | null
) {
  return entry.hasChanged || (net && net.hasChanged)
    ? { color: HAS_CHANGED_COLOR }
    : {};
}

export function getMarkColor(markId: number | null, marks: Mark[]) {
  return markId
    ? { background: marks.find((m) => m.id === markId)?.color }
    : {};
}

export function getMarkName(marks: Mark[], markID: number | null) {
  const mark = marks.find((mark) => mark.id === markID);
  return mark ? mark.name : "";
}

interface Props {
  entries: SiteViewEntry[];
  marks: Mark[];
  nets: Net[];
  sites: Site[];
  newOnly: boolean;
  handleEditSites: (siteEntries: SiteDialogEntry[]) => void;
  handleEditNets: (netEntries: NetDialogEntry[]) => void;
  handleEditMarks: (markEntries: MarkDialogEntry[]) => void;
  handleSavePakal: () => void;
  handleUndo: () => void;
  handleChange: () => void;
  handleNewOnly: () => void;
}

export interface SiteTableRowProps {
  entry: SiteViewEntry;
  sites: Site[];
  marks: Mark[];
  nets: Net[];
  bgColor: string;
  newOnly: boolean;
  handleChange: () => void;
}

function SiteTableRow({
  entry,
  sites,
  marks,
  nets,
  bgColor,
  newOnly,
  handleChange,
}: SiteTableRowProps) {
  const darkMode = useContext(ThemeContext);
  const [net, setNet] = useState<Net | null>(
    nets.find((n) => n.id === entry.netId) || null
  );
  const [netNameInput, setNetNameInput] = useState<string>("");
  const [notes, setNotes] = useState<string>(entry.notes);
  const [markId, setMarkId] = useState<number | null>(entry.markId);
  const changeNet = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: Net | null
  ) => {
    entry.netId = newValue?.id || null;
    setNet(newValue);
    handleChange();
  };
  const changeNotes = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    entry.notes = event.target.value;
    setNotes(event.target.value);
    handleChange();
  };
  const changeMark = () => {
    const currentMarkIndex = marks.findIndex(
      (mark) => mark.id === entry.markId
    );
    const newMarkIndex = ((currentMarkIndex + 2) % (marks.length + 1)) - 1;
    const newMarkId = newMarkIndex !== -1 ? marks[newMarkIndex].id : null;
    entry.markId = newMarkId;
    setMarkId(newMarkId);
    handleChange();
  };
  const canChange = entry.canEdit && !newOnly;
  return (
    <TableRow>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, null),
          background: bgColor,
        }}
      >
        {sites.find((site) => site.id === entry.siteId)?.name || "<ERROR>"}
      </TableCell>
      <TableCell
        onDoubleClick={canChange ? changeMark : () => {}}
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, null),
          ...getMarkColor(markId, marks),
        }}
      >
        <Tooltip
          className={themeClass("pakal-body-cell", darkMode)}
          title={getMarkName(marks, entry.markId)}
        >
          <div style={{ height: "50%" }}>{entry.name}</div>
        </Tooltip>
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, net),
        }}
      >
        <Autocomplete
          style={{ color: "inherit" }}
          disabled={!canChange}
          onChange={changeNet}
          value={net}
          inputValue={netNameInput}
          onInputChange={(_event, newValue: string) =>
            setNetNameInput(newValue)
          }
          options={nets}
          getOptionLabel={(net) => net.name}
          renderInput={(params) => (
            <TextField
              className={themeClass("pakal-body-input", darkMode)}
              {...params}
              InputProps={{
                ...params.InputProps,
                style: { paddingTop: "0px", color: "inherit" },
              }}
              value={netNameInput}
            />
          )}
        />
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, net),
        }}
      >
        {net ? net.group : ""}
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          background: net
            ? net.encryption
              ? ENCRYPTION_TRUE_COLOR
              : ENCRYPTION_FALSE_COLOR
            : "gray",
          ...getHasChanged(entry, net),
        }}
      >
        {net
          ? net.encryption
            ? ENCRYPTION_TRUE
            : ENCRYPTION_FALSE
          : ENCRYPTION_NONE}
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, net),
        }}
      >
        {net ? net.ok : ""}
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, net),
        }}
      >
        {(net ? net.frequency : 0).toFixed(3)}
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, net),
        }}
      >
        <TextField
          InputProps={{ style: { color: "inherit" } }}
          disabled={!canChange}
          className={themeClass("pakal-body-input", darkMode)}
          value={notes}
          onChange={changeNotes}
        />
      </TableCell>
    </TableRow>
  );
}

function SiteTable({
  entries,
  marks,
  nets,
  sites,
  newOnly,
  handleEditSites,
  handleEditNets,
  handleEditMarks,
  handleSavePakal,
  handleUndo,
  handleChange,
  handleNewOnly,
}: Props) {
  const darkMode = useContext(ThemeContext);
  const userProfile = useContext(UserContext);
  const [showEntries, setShowEntries] = useState(entries);
  const [search, setSearch] = useState<string[]>(TABLE_HEADERS.map(() => ""));
  const [netPage, setPage] = useState(1);
  const pagingSize = 20;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState<number | null>(null);
  const [reCreate, setReCreate] = useState(true);
  const MenuButtons: SpeedDialButton[] = [
    {
      name: "נהל רשתות",
      icon: <EditNoteIcon />,
      onClick: () => setDialogOpen(DIALOG_VALUES.net),
      disable: newOnly,
    },
    {
      name: "נהל אתרים",
      icon: <EditLocationAltIcon />,
      onClick: () => setDialogOpen(DIALOG_VALUES.site),
      disable: newOnly || !userProfile.changeSites,
    },
    {
      name: "נהל סימונים",
      icon: <BookmarkIcon />,
      onClick: () => setDialogOpen(DIALOG_VALUES.mark),
      disable: !userProfile.changeMarks || newOnly,
    },
    {
      name: "שמור שינויים",
      icon: <SaveIcon />,
      onClick: handleSavePakal,
      disable: newOnly,
    },
    {
      name: "בטל שינויים",
      icon: <CancelIcon />,
      onClick: handleUndo,
      disable: newOnly,
    },
    {
      name: newOnly ? "הצג הכל" : "הצג חדש בלבד",
      icon: newOnly ? <FilterAltOffIcon /> : <FilterAltIcon />,
      onClick: handleNewOnly,
      disable: false,
    },
  ];

  useEffect(() => {
    setShowEntries(entries);
  }, [entries]);

  useEffect(() => {
    if (!reCreate) setReCreate((v) => !v);
  }, [reCreate]);

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newSearch = [...search];
    newSearch[index] = event.target.value;
    setShowEntries(filterEntries(entries, nets, sites, newSearch));
    setSearch(newSearch);
    setPage(1);
    setReCreate((v) => !v);
  };

  return (
    <>
      <div className={themeClass("main-table-container", darkMode)}>
        <Table stickyHeader className={themeClass("site-view-table", darkMode)}>
          <TableHead>
            <TableRow>
              {TABLE_HEADERS.map((header, index) => (
                <TableCell
                  key={index}
                  className={themeClass("pakal-header-cell", darkMode)}
                >
                  <TextField
                    variant="standard"
                    className={themeClass("table-filter", darkMode)}
                    value={search[index]}
                    onChange={(event) => handleSearch(event, index)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon style={{ fontSize: "18px" }} />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ style: { border: "0px" } }}
                    placeholder={header}
                  />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {showEntries
              .slice((netPage - 1) * pagingSize, netPage * pagingSize)
              .map((entry, index) => {
                const bgColor =
                  SiteColors[
                    ((entry.siteId % SiteColors.length) + SiteColors.length) %
                      SiteColors.length
                  ];
                return (
                  reCreate && (
                    <SiteTableRow
                      key={index + (netPage - 1) * pagingSize}
                      entry={entry}
                      sites={sites}
                      marks={marks}
                      nets={nets}
                      bgColor={bgColor}
                      newOnly={newOnly}
                      handleChange={handleChange}
                    />
                  )
                );
              })}
          </TableBody>
        </Table>
      </div>
      <Pagination
        className="table-pagination"
        variant="outlined"
        showFirstButton
        showLastButton
        count={Math.ceil(showEntries.length / pagingSize)}
        page={netPage}
        onChange={(_event, value) => setPage(value)}
        color="primary"
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
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
      {dialogOpen === DIALOG_VALUES.site && (
        <SiteDialog
          open={dialogOpen === DIALOG_VALUES.site}
          onClose={() => setDialogOpen(null)}
          onSubmit={(values) => {
            handleChange();
            handleEditSites(values);
            setReCreate((v) => !v);
            setDialogOpen(null);
          }}
          sites={sites}
          entries={entries}
        />
      )}
      {dialogOpen === DIALOG_VALUES.net && (
        <NetDialog
          open={dialogOpen === DIALOG_VALUES.net}
          onClose={() => setDialogOpen(null)}
          onSubmit={(values) => {
            handleChange();
            handleEditNets(values);
            setReCreate((v) => !v);
            setDialogOpen(null);
          }}
          nets={nets}
        />
      )}
      {dialogOpen === DIALOG_VALUES.mark && (
        <MarkDialog
          open={dialogOpen === DIALOG_VALUES.mark}
          onClose={() => setDialogOpen(null)}
          onSubmit={(values) => {
            handleChange();
            handleEditMarks(values);
            setReCreate((v) => !v);
            setDialogOpen(null);
          }}
          marks={marks}
        />
      )}
    </>
  );
}

export default SiteTable;
