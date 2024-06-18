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
  Chip,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, themeClass } from "../../../../App";
import { Site, SiteDialogEntry, SiteViewEntry } from "../../Interfaces";
import ErrorSnackbar from "../../../Snackbars/ErrorSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (siteEntries: SiteDialogEntry[]) => void;
  sites: Site[];
  entries: SiteViewEntry[];
}

interface TableRowProps {
  siteEntry: SiteDialogEntry;
  onChange: () => void;
}

function getData(
  setSiteEntries: React.Dispatch<React.SetStateAction<SiteDialogEntry[]>>,
  sites: Site[],
  entries: SiteViewEntry[]
) {
  const siteEntries: SiteDialogEntry[] = [];
  sites.forEach((site) => {
    const units = entries
      .filter((entry) => entry.siteId === site.id)
      .map((entry) => entry.name);
    siteEntries.push({ site: site, checked: false, units: units });
  });
  setSiteEntries(siteEntries);
}

function DialogTableRow({ siteEntry, onChange }: TableRowProps) {
  const darkMode = useContext(ThemeContext);
  const [siteName, setSiteName] = useState(siteEntry.site.name);
  const [unitInput, setUnitInput] = useState("");
  const [reCreate, setReCreate] = useState(true);
  const [units, setUnits] = useState<string[]>(siteEntry.units);
  const changeName = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    siteEntry.site.name = event.target.value;
    setSiteName(event.target.value);
  };

  const handleAddUnit = () => {
    const newUnits = [...units, unitInput];
    setUnits(newUnits);
    siteEntry.units = newUnits;
    setUnitInput("");
  };

  const handleDeleteUnit = (index: number) => {
    const newUnits = units.filter((_unit, i) => i !== index);
    setUnits(newUnits);
    siteEntry.units = newUnits;
    setReCreate(false);
  };

  const IsInputError =
    units.includes(unitInput) ||
    unitInput === "" ||
    unitInput.trim() != unitInput;

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);
  return (
    <TableRow>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <Checkbox checked={siteEntry.checked} onChange={onChange} />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        {siteEntry.site.id}
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <TextField
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={siteName}
          onChange={changeName}
          InputProps={{
            disableUnderline: true,
          }}
        />
      </TableCell>
      <TableCell style={{ fontFamily: "heeboFont" }}>
        <div
          style={{
            overflow: "auto",
            height: "150px",
          }}
        >
          {units.map(
            (unit, index) =>
              reCreate && (
                <Chip
                  onDelete={() => {
                    handleDeleteUnit(index);
                  }}
                  key={index}
                  label={unit}
                />
              )
          )}
          <TextField
            placeholder="הוסף..."
            variant="filled"
            fullWidth
            className={themeClass("pakal-body-input", darkMode)}
            style={{ paddingTop: "10px", height: "20px" }}
            value={unitInput}
            onChange={(e) => setUnitInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !IsInputError) handleAddUnit();
            }}
            error={IsInputError}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

function SiteDialog({ open, onClose, onSubmit, sites, entries }: Props) {
  const darkMode = useContext(ThemeContext);
  const [siteEntries, setSiteEntries] = useState<SiteDialogEntry[]>([]);
  const [haveData, setHaveData] = useState(false);
  const [reCreate, setReCreate] = useState(true);
  const [generateId, setGenerateId] = useState(
    Math.min(...sites.map((site) => site.id), 0) - 1
  );
  const [errorSnackBar, setErrorSnackbar] = useState(false);

  const isSelectAll = !siteEntries.some((entry) => entry.checked === false);
  const isIndeterminate =
    siteEntries.some((entry) => entry.checked === true) && !isSelectAll;
  const sitesNameValid = () => {
    const set = new Set();
    siteEntries.map((entry) => set.add(entry.site.name));
    return set.size === siteEntries.length;
  };

  const handleSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < siteEntries.length; i++) {
      currentValue &&= siteEntries[i].checked;
    }
    setSiteEntries((current) =>
      current.map((entry) => ({ ...entry, checked: !currentValue }))
    );
  };

  const handleSelectChange = (index: number) => {
    setSiteEntries((current) =>
      current.map((entry, i) => ({
        ...entry,
        ...(index === i ? { checked: !entry.checked } : {}),
      }))
    );
  };

  const deleteSelected = () => {
    setSiteEntries((current) => current.filter((entry) => !entry.checked));
    setReCreate(false);
  };

  const addSite = () => {
    setSiteEntries((current) => [
      ...current,
      { checked: false, site: { id: generateId, name: "" }, units: [] },
    ]);
    setGenerateId((v) => v - 1);
  };

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  useEffect(() => {
    if (!haveData) getData(setSiteEntries, sites, entries);
    setHaveData(true);
  }, [haveData]);

  return (
    <Dialog style={{ direction: "rtl" }} open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">נהל אתרים</DialogTitle>
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
                שם אתר
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                עמדות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {siteEntries.map(
              (SiteEntry, index) =>
                reCreate && (
                  <DialogTableRow
                    key={index}
                    siteEntry={SiteEntry}
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
          שמות אתרים חייבים להיות יחודיים!
        </ErrorSnackbar>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={addSite}>
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
            if (sitesNameValid()) onSubmit(siteEntries);
            else setErrorSnackbar(true);
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

export default SiteDialog;
