import {
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { NetViewEntry } from "../../Interfaces";
import { ChangeEvent, useContext } from "react";
import "../../Table.css";
import { ThemeContext, themeClass } from "../../../../App";
import {
  ENCRYPTION_FALSE,
  ENCRYPTION_TRUE,
} from "../../SiteViewBody/SiteTable/SiteTable";

interface Props {
  showEntries: NetViewEntry[];
  headers: string[];
  searchValues: string[];
  handleSearch: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  netPage: number;
  pagingSize: number;
}

function themeColor(darkMode: boolean) {
  return darkMode ? "white" : "black";
}

function themeBgColor(darkMode: boolean) {
  return darkMode ? "black" : "white";
}

function NetHeaderTable({
  showEntries,
  headers,
  searchValues,
  handleSearch,
  netPage,
  pagingSize,
}: Props) {
  const darkMode = useContext(ThemeContext);
  return (
    <Table
      stickyHeader
      style={{
        position: "sticky",
        right: "-1px",
        zIndex: 5,
      }}
    >
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableCell
              key={header}
              className={themeClass("pakal-header-cell", darkMode)}
            >
              <TextField
                variant="standard"
                className={themeClass("table-filter", darkMode)}
                value={searchValues[index]}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleSearch(event, index)
                }
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

              {/* <TextField
                fullWidth
                className={themeClass("pakal-filter", darkMode)}
                label={header}
                value={searchValues[index]}
                variant="filled"
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleSearch(event, index)
                }
                InputProps={{
                  disableUnderline: true,
                }}
              /> */}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {showEntries
          .slice((netPage - 1) * pagingSize, netPage * pagingSize)
          .map((entry, index) => (
            <TableRow key={index}>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : themeColor(darkMode),
                  background: themeBgColor(darkMode),
                }}
              >
                {entry.net.id}
              </TableCell>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : themeColor(darkMode),
                  background: themeBgColor(darkMode),
                }}
              >
                {entry.net.group}
              </TableCell>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : themeColor(darkMode),
                  background: themeBgColor(darkMode),
                }}
              >
                {entry.net.name}
              </TableCell>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : "white",
                  background: entry.net.encryption ? "green" : "#eb0f0f",
                }}
              >
                {entry.net.encryption ? ENCRYPTION_TRUE : ENCRYPTION_FALSE}
              </TableCell>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : themeColor(darkMode),
                  background: themeBgColor(darkMode),
                }}
              >
                {entry.net.ok}
              </TableCell>
              <TableCell
                className={themeClass("pakal-body-cell", darkMode)}
                style={{
                  color: entry.net.hasChanged ? "red" : themeColor(darkMode),
                  background: themeBgColor(darkMode),
                }}
              >
                {entry.net.frequency.toFixed(3)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default NetHeaderTable;
