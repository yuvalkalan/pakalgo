import { useContext, useEffect, useState } from "react";
import {
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { Mark, Net, Site, SiteViewEntry, SpeedDialButton } from "../Interfaces";
import {
  ENCRYPTION_FALSE,
  ENCRYPTION_FALSE_COLOR,
  ENCRYPTION_NONE,
  ENCRYPTION_TRUE,
  ENCRYPTION_TRUE_COLOR,
  SiteColors,
  SiteTableRowProps,
  TABLE_HEADERS,
  filterEntries,
  getHasChanged,
  getMarkColor,
  getMarkName,
} from "../SiteViewBody/SiteTable/SiteTable";
import { ThemeContext, themeClass } from "../../../App";

interface RecordTableProps {
  entries: SiteViewEntry[];
  marks: Mark[];
  nets: Net[];
  sites: Site[];
  newOnly: boolean;
  handleNewOnly: () => void;
}

function RecordTableRow({
  entry,
  sites,
  marks,
  nets,
  bgColor,
}: SiteTableRowProps) {
  const darkMode = useContext(ThemeContext);
  const net: Net | null = nets.find((n) => n.id === entry.netId) || null;
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
        className={themeClass("pakal-body-cell", darkMode)}
        style={{
          ...getHasChanged(entry, null),
          ...getMarkColor(entry.markId, marks),
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
        {net?.name || ""}
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
        {entry.notes}
      </TableCell>
    </TableRow>
  );
}

function RecordTable({
  entries,
  marks,
  nets,
  sites,
  newOnly,
  handleNewOnly,
}: RecordTableProps) {
  const darkMode = useContext(ThemeContext);
  const [showEntries, setShowEntries] = useState(entries);
  const [search, setSearch] = useState<string[]>(TABLE_HEADERS.map(() => ""));
  const [netPage, setPage] = useState(1);
  const pagingSize = 20;
  const [reCreate, setReCreate] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const MenuButtons: SpeedDialButton[] = [
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
                    <RecordTableRow
                      key={index + (netPage - 1) * pagingSize}
                      entry={entry}
                      sites={sites}
                      marks={marks}
                      nets={nets}
                      bgColor={bgColor}
                      newOnly={false}
                      handleChange={() => {}}
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
    </>
  );
}
export default RecordTable;
