import { TableCell, TableRow, Tooltip } from "@mui/material";
import { useContext } from "react";
import { Mark, NetViewCell, NetViewEntry } from "../../Interfaces";
import { ThemeContext, themeClass } from "../../../../App";
import {
  getHasChanged,
  getMarkName,
} from "../../SiteViewBody/SiteTable/SiteTable";

const EMPTY_CELL_COLOR_DARK = "black";
const EMPTY_CELL_COLOR_LIGHT = "white";
const FILLED_CELL_COLOR_DARK = "#36363399";
const FILLED_CELL_COLOR_LIGHT = "#bbbbbb";

interface Props {
  entry: NetViewEntry;
  marks: Mark[];
}

function getBackgroundColor(
  cell: NetViewCell,
  marks: Mark[],
  darkMode: boolean
) {
  if (!cell.value)
    return {
      background: darkMode ? EMPTY_CELL_COLOR_DARK : EMPTY_CELL_COLOR_LIGHT,
    };
  if (cell.markId)
    return { background: marks.find((mark) => mark.id === cell.markId)?.color };
  return {
    background: darkMode ? FILLED_CELL_COLOR_DARK : FILLED_CELL_COLOR_LIGHT,
  };
}

function NetTableRow({ entry, marks }: Props) {
  const darkMode = useContext(ThemeContext);
  const cells = [...entry.cells];
  return (
    <TableRow>
      {cells.map((cell: NetViewCell, index) => (
        <TableCell
          key={index}
          className={themeClass("pakal-body-cell", darkMode)}
          style={{
            ...getHasChanged(cell, null),
            ...getBackgroundColor(cell, marks, darkMode),
          }}
        >
          <Tooltip
            className={themeClass("pakal-body-cell", darkMode)}
            title={getMarkName(marks, cell.markId)}
          >
            <div style={{ height: "50%" }}>{cell.value}</div>
          </Tooltip>
        </TableCell>
      ))}
    </TableRow>
  );
}

export default NetTableRow;
