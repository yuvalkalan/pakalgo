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
import { ThemeContext, UserContext, themeClass } from "../../../../App";
import { Net, NetDialogEntry } from "../../Interfaces";
import ErrorSnackbar from "../../../Snackbars/ErrorSnackbar";
import EncSwitch from "./EncSwitch/EncSwitch";
import FreqInput from "./FreqInput/FreqInput";
import { stringCmp } from "../../NetViewBody/NetTable/NetTable";
import SkeletonTable from "../../Skeletons/SkeletonTable/SkeletonTable";
import SortTableCell from "../SortTableCell/SortTableCell";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (nets: NetDialogEntry[]) => void;
  nets: Net[];
}

interface TableRowProps {
  netEntry: NetDialogEntry;
  onChange: () => void;
}

function getData(
  setNets: React.Dispatch<React.SetStateAction<NetDialogEntry[]>>,
  nets: Net[]
) {
  setNets(
    nets.map<NetDialogEntry>((net) => ({
      id: net.id,
      group: net.group,
      name: net.name,
      encryption: net.encryption,
      ok: net.ok,
      frequency: net.frequency,
      hasChanged: net.hasChanged,
      checked: false,
      isNew: false,
    }))
  );
}

const sortOptions = [
  "id" as keyof NetDialogEntry,
  "group" as keyof NetDialogEntry,
  "name" as keyof NetDialogEntry,
  "encryption" as keyof NetDialogEntry,
  "ok" as keyof NetDialogEntry,
  "frequency" as keyof NetDialogEntry,
];

const sortByFunc: {
  [sortBy: string]: (a: NetDialogEntry, b: NetDialogEntry) => number;
} = {
  id: (a: NetDialogEntry, b: NetDialogEntry) => a.id - b.id,
  group: (a: NetDialogEntry, b: NetDialogEntry) => stringCmp(a.group, b.group),
  name: (a: NetDialogEntry, b: NetDialogEntry) => stringCmp(a.name, b.name),
  encryption: (a: NetDialogEntry, b: NetDialogEntry) =>
    (Number(a.encryption) ? 1 : 0) - (b.encryption ? 1 : 0),
  ok: (a: NetDialogEntry, b: NetDialogEntry) => stringCmp(a.ok, b.ok),
  frequency: (a: NetDialogEntry, b: NetDialogEntry) =>
    a.frequency - b.frequency,
};

const TEXT_COLOR = { error: "#b00020", warning: "#daa520" };

function sortedEntries(
  entries: NetDialogEntry[],
  sortBy: keyof NetDialogEntry,
  isReverse: boolean
) {
  const newEntries = [...entries].sort(sortByFunc[sortBy]);
  if (isReverse) newEntries.reverse();
  return newEntries;
}

function validNetName(name: string, maxlength: number | null) {
  return (
    name.trim() &&
    name.trim() === name &&
    (!maxlength || name.length <= maxlength)
  );
}

function DialogTableRow({ netEntry, onChange }: TableRowProps) {
  const darkMode = useContext(ThemeContext);
  const userProfile = useContext(UserContext);
  const [netGroup, setNetGroup] = useState<string>(netEntry.group);
  const [netName, setNetName] = useState(netEntry.name);
  const [netEncryption, setNetEncryption] = useState(netEntry.encryption);
  const [netOk, setNetOk] = useState(netEntry.ok);
  const [netFreq, setNetFreq] = useState<number | null>(netEntry.frequency);

  const changeGroup = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    netEntry.group = event.target.value;
    setNetGroup(event.target.value);
  };
  const changeName = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    netEntry.name = event.target.value;
    setNetName(event.target.value);
  };
  const changeOk = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    netEntry.ok = event.target.value;
    setNetOk(event.target.value);
  };
  const changeEncryption = () => {
    setNetEncryption(!netEncryption);
    netEntry.encryption = !netEncryption;
  };
  const changeFreq = (value: number | null) => {
    setNetFreq(value);
    if (value) netEntry.frequency = value;
  };
  const isWarningOk = netOk.includes(" "); // if ok is more then one word
  const isErrorOk = netOk.trim() !== netOk;
  const isErrorName = !validNetName(
    netName,
    userProfile.rules.netRules.maxNetName
  );
  const isErrorGroup = netGroup.trim() !== netGroup;
  const canChange = userProfile.changeNets || netEntry.isNew;
  return (
    <TableRow>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <Checkbox
          disabled={!canChange}
          checked={netEntry.checked}
          onChange={onChange}
        />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        {netEntry.id}
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <TextField
          disabled={!canChange}
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={netGroup}
          onChange={changeGroup}
          InputProps={{
            disableUnderline: true,
            ...(isErrorGroup && { style: { color: TEXT_COLOR.error } }),
          }}
        />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <TextField
          disabled={!canChange}
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={netName}
          onChange={changeName}
          InputProps={{
            disableUnderline: true,
            ...(isErrorName && { style: { color: TEXT_COLOR.error } }),
          }}
        />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <EncSwitch
          disabled={!canChange}
          value={netEncryption}
          onClick={changeEncryption}
        />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <TextField
          disabled={!canChange}
          variant="filled"
          fullWidth
          className={themeClass("pakal-body-input", darkMode)}
          value={netOk}
          onChange={changeOk}
          InputProps={{
            disableUnderline: true,
            ...(isWarningOk && { style: { color: TEXT_COLOR.warning } }),
            ...(isErrorOk && { style: { color: TEXT_COLOR.error } }),
          }}
        />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <FreqInput
          disabled={!canChange}
          onChange={changeFreq}
          value={netFreq}
        />
      </TableCell>
    </TableRow>
  );
}

function NetDialog({ open, onClose, onSubmit, nets }: Props) {
  const headers = ["#", "קבוצה", "שם רשת", "הצפנה", 'או"ק', "תדר"];
  const darkMode = useContext(ThemeContext);
  const userProfile = useContext(UserContext);
  const [netEntries, setNetEntries] = useState<NetDialogEntry[]>([]);
  const [haveData, setHaveData] = useState(false);
  const [reCreate, setReCreate] = useState(false); // set to false to load at start
  const [generateId, setGenerateId] = useState(
    Math.min(...nets.map((net) => net.id), 0) - 1
  );
  const [errorSnackBar, setErrorSnackbar] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<keyof NetDialogEntry>(sortOptions[0]);
  const [isReverse, setIsReverse] = useState<boolean>(false);
  const showEntries = sortedEntries(netEntries, sortBy, isReverse);

  const isSelectAll = !showEntries.some((entry) => entry.checked === false);
  const isIndeterminate =
    showEntries.some((entry) => entry.checked === true) && !isSelectAll;
  const netsValid = () => {
    // check if names are unique
    const set = new Set<string>();
    showEntries.forEach((entry) => {
      set.add(entry.name);
    });
    if (set.size !== showEntries.length)
      return "שמות רשתות צריכים להיות יחודיים!";
    // check if names are valid
    if (
      showEntries.some(
        (entry) =>
          !validNetName(
            entry.name.trim(),
            userProfile.rules.netRules.maxNetName
          )
      )
    )
      return "שמות רשתות לא תקינים!";
    // check if groups are valid
    if (
      showEntries.some(
        (entry) => entry.group.trim() && entry.group.trim() !== entry.group
      )
    )
      return "שמות קבוצות לא תקינים!";
    // check if oks are valid
    if (
      showEntries.some(
        (entry) => entry.ok.trim() && entry.ok.trim() !== entry.ok
      )
    )
      return 'שמות או"קים לא תקינים!';
    return null;
  };

  const handleSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < showEntries.length; i++) {
      currentValue &&= showEntries[i].checked;
    }
    setNetEntries((current) =>
      current.map((entry) => ({ ...entry, checked: !currentValue }))
    );
  };

  const handleSelectChange = (index: number) => {
    showEntries[index].checked = !showEntries[index].checked;
    setNetEntries((current) => [...current]);
  };

  const handleSortBy = (index: number) => {
    if (sortBy === sortOptions[index]) setIsReverse((v) => !v);
    else setIsReverse(false);
    setSortBy(sortOptions[index]);
    setReCreate(false);
  };

  const deleteSelected = () => {
    setNetEntries((current) => current.filter((entry) => !entry.checked));
    setReCreate(false);
  };

  const addNet = () => {
    setNetEntries((current) => [
      ...current,
      {
        id: generateId,
        group: "",
        name: "",
        encryption: true,
        ok: "",
        frequency: 30,
        hasChanged: true,
        checked: false,
        isNew: true,
      },
    ]);
    setGenerateId((v) => v - 1);
    setReCreate(false);
  };

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  useEffect(() => {
    if (!haveData) getData(setNetEntries, nets);
    setHaveData(true);
  }, [haveData]);

  return (
    <Dialog style={{ direction: "rtl" }} open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">נהל רשתות</DialogTitle>
      <DialogContent
        style={{
          padding: "0px",
          marginLeft: "10px",
          marginRight: "10px",
          width: "580px",
        }}
      >
        {reCreate ? (
          <Table dir="rtl" stickyHeader style={{ width: "580px" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  className={themeClass("pakal-header-cell", darkMode)}
                >
                  <Checkbox
                    disabled={!userProfile.changeNets}
                    checked={isSelectAll}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                {headers.map((header, index) => (
                  <SortTableCell<keyof NetDialogEntry>
                    key={index}
                    index={index}
                    handleSortBy={handleSortBy}
                    value={header}
                    sortOptions={sortOptions}
                    sortBy={sortBy}
                    isReverse={isReverse}
                  />
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {showEntries.map((NetEntry, index) => (
                <DialogTableRow
                  key={index}
                  netEntry={NetEntry}
                  onChange={() => handleSelectChange(index)}
                />
              ))}
            </TableBody>
          </Table>
        ) : (
          <SkeletonTable rows={10} />
        )}
        {errorSnackBar && (
          <ErrorSnackbar open={true} onClose={() => setErrorSnackbar(null)}>
            {errorSnackBar}
          </ErrorSnackbar>
        )}
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={addNet}>
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
            const error = netsValid();
            if (!error) onSubmit(netEntries);
            else setErrorSnackbar(error);
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

export default NetDialog;
