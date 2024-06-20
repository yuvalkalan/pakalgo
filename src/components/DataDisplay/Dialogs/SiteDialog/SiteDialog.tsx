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
import { stringCmp } from "../../NetViewBody/NetTable/NetTable";
import SkeletonTable from "../../Skeletons/SkeletonTable/SkeletonTable";
import SortTableCell from "../SortTableCell/SortTableCell";

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

const sortOptions = ["id" as keyof Site, "name" as keyof Site];

const sortByFunc: {
  [sortBy: string]: (a: SiteDialogEntry, b: SiteDialogEntry) => number;
} = {
  id: (a: SiteDialogEntry, b: SiteDialogEntry) => a.site.id - b.site.id,
  name: (a: SiteDialogEntry, b: SiteDialogEntry) =>
    stringCmp(a.site.name, b.site.name),
};

function sortedEntries(
  entries: SiteDialogEntry[],
  sortBy: keyof Site,
  isReverse: boolean
) {
  const newEntries = [...entries].sort(sortByFunc[sortBy]);
  if (isReverse) newEntries.reverse();
  return newEntries;
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
  const headers = ["#", "שם אתר"];
  const darkMode = useContext(ThemeContext);
  const [siteEntries, setSiteEntries] = useState<SiteDialogEntry[]>([]);
  const [haveData, setHaveData] = useState(false);
  const [reCreate, setReCreate] = useState(false);
  const [generateId, setGenerateId] = useState(
    Math.min(...sites.map((site) => site.id), 0) - 1
  );
  const [errorSnackBar, setErrorSnackbar] = useState(false);

  const [sortBy, setSortBy] = useState<keyof Site>(sortOptions[0]);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const showEntries = sortedEntries(siteEntries, sortBy, isReverse);

  const isSelectAll = !showEntries.some((entry) => entry.checked === false);
  const isIndeterminate =
    showEntries.some((entry) => entry.checked === true) && !isSelectAll;
  const sitesNameValid = () => {
    const set = new Set();
    showEntries.map((entry) => set.add(entry.site.name));
    return set.size === showEntries.length;
  };

  const handleSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < showEntries.length; i++) {
      currentValue &&= showEntries[i].checked;
    }
    setSiteEntries((current) =>
      current.map((entry) => ({ ...entry, checked: !currentValue }))
    );
  };

  const handleSelectChange = (index: number) => {
    showEntries[index].checked = !showEntries[index].checked;
    setSiteEntries((current) => [...current]);
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
    setReCreate(false);
  };

  const handleSortBy = (index: number) => {
    if (sortBy === sortOptions[index]) setIsReverse((v) => !v);
    else setIsReverse(false);
    setSortBy(sortOptions[index]);
    setReCreate(false);
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
      <DialogContent
        style={{
          padding: "0px",
          marginLeft: "10px",
          marginRight: "10px",
          width: "580px",
        }}
      >
        {reCreate ? (
          <Table dir="rtl" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  className={themeClass("pakal-header-cell", darkMode)}
                >
                  <Checkbox
                    checked={isSelectAll}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {headers.map((header, index) => (
                  <SortTableCell<keyof Site>
                    key={index}
                    index={index}
                    handleSortBy={handleSortBy}
                    value={header}
                    sortOptions={sortOptions}
                    sortBy={sortBy}
                    isReverse={isReverse}
                  />
                ))}
                <TableCell
                  className={themeClass("pakal-header-cell", darkMode)}
                >
                  עמדות
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showEntries.map(
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
        ) : (
          <SkeletonTable rows={10} />
        )}
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
