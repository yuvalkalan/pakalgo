import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  ClickAwayListener,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, api, themeClass } from "../../../App";
import "./PermissionTab.css";
import { SpeedDialButton } from "../../DataDisplay/Interfaces";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveSnackbar from "../../Snackbars/SaveSnackbar";
import ErrorSnackbar from "../../Snackbars/ErrorSnackbar";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import RemoveDialog from "./RemoveDialog";

export interface permissionEntry {
  id: number;
  name: string;
  siteView: string[];
  siteEdit: string[];
  enableChangeMarks: boolean;
  enableChangeSites: boolean;
  enableChangeNets: boolean;
  enableDeleteHistory: boolean;
}

export interface permissionsInfoData {
  entries: permissionEntry[];
  sites: string[];
}

function getData(
  setPermissionsInfo: React.Dispatch<React.SetStateAction<permissionEntry[]>>,
  setSites: React.Dispatch<React.SetStateAction<string[]>>
): void {
  setPermissionsInfo([]);
  api.getPermissions((data: permissionsInfoData) => {
    setPermissionsInfo(data.entries);
    setSites(data.sites);
  });
}

interface PermissionRowProps {
  entry: permissionEntry;
  sites: string[];
}

function PermissionRow({ entry, sites }: PermissionRowProps) {
  const [name, setName] = useState(entry.name);
  const [siteView, setSiteView] = useState(entry.siteView);
  const [siteEdit, setSiteEdit] = useState(entry.siteEdit);
  const [siteViewValue, setSiteViewValue] = useState([
    ...siteEdit,
    ...siteView,
  ]);
  const [changeMarks, setChangeMarks] = useState(entry.enableChangeMarks);
  const [changeSites, setChangeSites] = useState(entry.enableChangeSites);
  const [changeNets, setChangeNets] = useState(entry.enableChangeNets);
  const [deleteHistory, setDeleteHistory] = useState(entry.enableDeleteHistory);
  return (
    <TableRow>
      <TableCell>{entry.id}</TableCell>
      <TableCell>
        <TextField
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            entry.name = event.target.value;
          }}
        />
      </TableCell>
      <TableCell style={{ padding: "5px" }}>
        <Autocomplete
          className="permission-check"
          multiple
          value={siteViewValue}
          onChange={(_event, newValue) => {
            const newSiteView = [
              ...newValue.filter((option) => siteEdit.indexOf(option) === -1),
            ];
            setSiteView(newSiteView);
            entry.siteView = newSiteView;
            setSiteViewValue([...siteEdit, ...newSiteView]);
          }}
          options={sites}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                disabled={siteEdit.indexOf(option) !== -1}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} />}
        />
      </TableCell>
      <TableCell style={{ padding: "5px" }}>
        <Autocomplete
          className="permission-check"
          multiple
          options={sites}
          value={siteEdit}
          onChange={(_e, newValue) => {
            setSiteEdit(newValue);
            entry.siteEdit = newValue;
            const newSiteView = siteView.filter(
              (site) => newValue.indexOf(site) === -1
            );
            setSiteView(newSiteView);
            entry.siteView = newSiteView;
            setSiteViewValue([...newValue, ...newSiteView]);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <Checkbox
          onChange={() => {
            setChangeMarks((v) => !v);
            entry.enableChangeMarks = !entry.enableChangeMarks;
          }}
          checked={changeMarks}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <Checkbox
          onChange={() => {
            setChangeSites((v) => !v);
            entry.enableChangeSites = !entry.enableChangeSites;
          }}
          checked={changeSites}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <Checkbox
          onChange={() => {
            setChangeNets((v) => !v);
            entry.enableChangeNets = !entry.enableChangeNets;
          }}
          checked={changeNets}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <Checkbox
          onChange={() => {
            setDeleteHistory((v) => !v);
            entry.enableDeleteHistory = !entry.enableDeleteHistory;
          }}
          checked={deleteHistory}
        />
      </TableCell>
    </TableRow>
  );
}

function PermissionTab() {
  const headers = [
    "#",
    "שם הרשאה",
    "אתרים בצפייה",
    "אתרים בעריכה",
    "אפשר שינוי סימונים",
    "אפשר שינוי אתרים",
    "אפשר שינוי רשתות",
    "אפשר מחיקת היסטוריה",
  ];
  const defaultPermissionInfo: permissionEntry = {
    id: -1,
    name: "הרשאה",
    siteView: [],
    siteEdit: [],
    enableChangeMarks: false,
    enableChangeSites: false,
    enableChangeNets: false,
    enableDeleteHistory: false,
  };
  const darkMode = useContext(ThemeContext);
  const [permissionsInfo, setPermissionsInfo] = useState<permissionEntry[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [haveData, setHaveData] = useState(false);
  const [saveSnackbar, setSaveSnackbar] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState<null | string>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [removeDialog, setRemoveDialog] = useState(false);
  const [reCreate, setReCreate] = useState(true);

  const checkNames = () => {
    let error: string | null = null;
    const names = new Set<string>();
    permissionsInfo.forEach((permission) => {
      const name = permission.name.trim();
      if (name) names.add(name);
      else error = `#${permission.id} - שם הרשאה לא תקין!`;
    });
    if (error) return error;
    if (names.size !== permissionsInfo.length) {
      error = "שמות הרשאה צריכים להיות יחודיים!";
    }
    return error;
  };

  const handleSave = () => {
    const error = checkNames();
    if (error) setErrorSnackbar(error);
    else {
      api.setPermissions(permissionsInfo);
      setSaveSnackbar(true);
      setHaveData(false);
    }
  };

  const MenuButtons: SpeedDialButton[] = [
    {
      name: "שמור שינויים",
      icon: <SaveIcon />,
      onClick: handleSave,
      disable: false,
    },
    {
      name: "בטל שינויים",
      icon: <CancelIcon />,
      onClick: () => setHaveData(false),
      disable: false,
    },
    {
      name: "מחק",
      icon: <PlaylistRemoveIcon />,
      onClick: () => setRemoveDialog(true),
      disable: false,
    },
  ];
  useEffect(() => {
    if (!haveData) {
      getData(setPermissionsInfo, setSites);
      setHaveData(true);
    }
  }, [haveData]);
  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  return (
    <div className={themeClass("main-table-container", darkMode)}>
      <Table style={{ tableLayout: "fixed" }} stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                className={themeClass("pakal-header-cell", darkMode)}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {permissionsInfo.map(
            (entry, index) =>
              reCreate && (
                <PermissionRow key={index} entry={entry} sites={sites} />
              )
          )}
          <TableRow>
            <TableCell
              className={themeClass("pakal-body-cell", darkMode)}
              colSpan={headers.length}
              style={{
                textAlign: "center",
              }}
            >
              <Button
                onClick={() =>
                  setPermissionsInfo((u) => [
                    ...u,
                    { ...defaultPermissionInfo },
                  ])
                }
                style={{ fontWeight: "bold", fontSize: "2em", width: "100%" }}
              >
                +
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
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
      <SaveSnackbar open={saveSnackbar} onClose={() => setSaveSnackbar(false)}>
        שינויים נשמרו
      </SaveSnackbar>
      {errorSnackbar && (
        <ErrorSnackbar open={true} onClose={() => setErrorSnackbar(null)}>
          {errorSnackbar}
        </ErrorSnackbar>
      )}
      <RemoveDialog
        open={removeDialog}
        onClose={() => setRemoveDialog(false)}
        onSubmit={(values) => {
          setPermissionsInfo((p) => [
            ...p.filter((_v, index) => !values[index]),
          ]);
          setReCreate(false);
          setRemoveDialog(false);
        }}
        permissions={permissionsInfo}
        title="מחק הרשאות"
      />
    </div>
  );
}

export default PermissionTab;
