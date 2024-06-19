import { TableCell } from "@mui/material";
import { ThemeContext, themeClass } from "../../../../App";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useContext } from "react";

interface Props<T> {
  index: number;
  handleSortBy: (index: number) => void;
  value: string;
  sortOptions: T[];
  sortBy: T;
  isReverse: boolean;
}

function SortTableCell<T>({
  index,
  handleSortBy,
  value,
  sortOptions,
  sortBy,
  isReverse,
}: Props<T>) {
  const darkMode = useContext(ThemeContext);

  return (
    <TableCell
      className={themeClass("pakal-header-cell", darkMode)}
      onClick={() => handleSortBy(index)}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        {value}
        {sortOptions[index] === sortBy &&
          (isReverse ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />)}
      </div>
    </TableCell>
  );
}

export default SortTableCell;
