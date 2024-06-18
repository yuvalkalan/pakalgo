import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  DialogActions,
  Button,
  TableHead,
  Checkbox,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, themeClass } from "../../../../App";
import { Mark, MarkDialogEntry } from "../../Interfaces";
import ErrorSnackbar from "../../../Snackbars/ErrorSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (nets: MarkDialogEntry[]) => void;
  marks: Mark[];
}

interface TableRowProps {
  markEntry: MarkDialogEntry;
  onChange: () => void;
}

function getData(
  setMarks: React.Dispatch<React.SetStateAction<MarkDialogEntry[]>>,
  marks: Mark[]
) {
  setMarks(
    marks.map<MarkDialogEntry>((mark) => ({
      id: mark.id,
      color: mark.color,
      name: mark.name,
      checked: false,
    }))
  );
}

function DialogTableRow({ markEntry, onChange }: TableRowProps) {
  const darkMode = useContext(ThemeContext);
  const [MarkName, setMarkName] = useState(markEntry.name);
  const [MarkColor, setMarkColor] = useState<string>(markEntry.color);
  const changeName = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    markEntry.name = event.target.value;
    setMarkName(event.target.value);
  };
  const changeColor = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    markEntry.color = event.target.value;
    setMarkColor(event.target.value);
  };
  const isValidColor = MarkColor.match(/^#([0-9A-Fa-f]{6})$/);
  return (
    <TableRow>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <Checkbox checked={markEntry.checked} onChange={onChange} />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        {markEntry.id}
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{ background: MarkColor }}
      >
        <TextField
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={MarkName}
          onChange={changeName}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </TableCell>
      <TableCell
        className={themeClass("pakal-body-cell", darkMode)}
        style={{ background: MarkColor }}
      >
        <TextField
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={MarkColor}
          onChange={changeColor}
          InputProps={{
            disableUnderline: true,
            ...(!isValidColor && { style: { color: "RGB(218, 165, 32)" } }),
          }}
        />
      </TableCell>
    </TableRow>
  );
}

function MarkDialog({ open, onClose, onSubmit, marks }: Props) {
  const darkMode = useContext(ThemeContext);
  const [MarkEntries, setMarkEntries] = useState<MarkDialogEntry[]>([]);
  const [haveData, setHaveData] = useState(false);
  const [reCreate, setReCreate] = useState(true);
  const [generateId, setGenerateId] = useState(
    Math.min(...marks.map((mark) => mark.id), 0) - 2
  );
  const [errorSnackBar, setErrorSnackbar] = useState(false);

  const isSelectAll = !MarkEntries.some((entry) => entry.checked === false);
  const isIndeterminate =
    MarkEntries.some((entry) => entry.checked === true) && !isSelectAll;
  const MarksNameValid = () => {
    const set = new Set();
    MarkEntries.map((entry) => set.add(entry.name));
    return set.size === MarkEntries.length;
  };

  const handleSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < MarkEntries.length; i++) {
      currentValue &&= MarkEntries[i].checked;
    }
    setMarkEntries((current) =>
      current.map((entry) => ({ ...entry, checked: !currentValue }))
    );
  };

  const handleSelectChange = (index: number) => {
    setMarkEntries((current) =>
      current.map((entry, i) => ({
        ...entry,
        ...(index === i ? { checked: !entry.checked } : {}),
      }))
    );
  };

  const deleteSelected = () => {
    setMarkEntries((current) => current.filter((entry) => !entry.checked));
    setReCreate(false);
  };

  const addMark = () => {
    setMarkEntries((current) => [
      ...current,
      {
        id: generateId,
        color: "",
        name: "",
        checked: false,
      },
    ]);
    setGenerateId((v) => v - 1);
  };

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  useEffect(() => {
    if (!haveData) getData(setMarkEntries, marks);
    setHaveData(true);
  }, [haveData]);

  return (
    <Dialog style={{ direction: "rtl" }} open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">נהל סימונים</DialogTitle>
      <DialogContent>
        <Table dir="rtl" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                <Checkbox
                  checked={isSelectAll}
                  indeterminate={isIndeterminate}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                #
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                שם סימון
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                צבע
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MarkEntries.map(
              (NetEntry, index) =>
                reCreate && (
                  <DialogTableRow
                    key={index}
                    markEntry={NetEntry}
                    onChange={() => handleSelectChange(index)}
                  />
                )
            )}
          </TableBody>
        </Table>
        <ErrorSnackbar
          open={errorSnackBar}
          onClose={() => setErrorSnackbar(false)}
        >
          שמות סימונים חייבים להיות יחודיים!
        </ErrorSnackbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={addMark}>
          הוסף
        </Button>
        <Button
          disabled={!(isIndeterminate || isSelectAll)}
          color="primary"
          onClick={deleteSelected}
        >
          מחק
        </Button>
        <Button
          onClick={() => {
            if (MarksNameValid()) {
              onSubmit(MarkEntries);
            } else setErrorSnackbar(true);
          }}
          color="primary"
        >
          שמור
        </Button>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MarkDialog;
