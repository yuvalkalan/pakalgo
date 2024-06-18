import {
  Alert,
  Autocomplete,
  Button,
  ClickAwayListener,
  Snackbar,
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
import { ThemeContext, api, themeClass } from "../../../App";
import { useContext, useEffect, useState } from "react";
import { SpeedDialButton } from "../../DataDisplay/Interfaces";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveSnackbar from "../../Snackbars/SaveSnackbar";
import ErrorSnackbar from "../../Snackbars/ErrorSnackbar";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import RemoveDialog from "./RemoveDialog";

export interface userEntry {
  userId: number;
  username: string;
  permissionId: number | null;
  canChange: boolean;
}

interface permissionEntry {
  id: number;
  name: string;
}

export interface usersInfoData {
  entries: userEntry[];
  permissions: permissionEntry[];
}

interface UserRowProps {
  entry: userEntry;
  permissions: permissionEntry[];
}

function getData(
  setUsersInfo: React.Dispatch<React.SetStateAction<userEntry[]>>,
  setPermissions: React.Dispatch<React.SetStateAction<permissionEntry[]>>
): void {
  setUsersInfo([]);
  api.getUsers((data: usersInfoData) => {
    setPermissions(data.permissions);
    setUsersInfo(data.entries);
  });
}

function UserRow({ entry, permissions }: UserRowProps) {
  const currentPermission = permissions.find(
    (p) => p.id === entry.permissionId
  );
  const [username, setUserName] = useState(entry.username);
  const [permission, setPermission] = useState(
    currentPermission ? currentPermission : null
  );
  const [inputValue, setInputValue] = useState(permission?.name);
  const [snackbar, setSnackbar] = useState(false);
  return (
    <TableRow>
      <TableCell>{entry.userId}</TableCell>
      <TableCell>
        <TextField
          disabled={!entry.canChange}
          placeholder="שם משתמש"
          value={username}
          onChange={(e) => {
            const newValue = e.target.value;
            entry.username = newValue;
            setUserName(newValue);
          }}
        />
      </TableCell>
      <TableCell>
        <Autocomplete
          disabled={!entry.canChange}
          className="dialog-autocomplete"
          value={permission}
          onChange={(_e, newValue: permissionEntry | null) => {
            setPermission(newValue);
            entry.permissionId = newValue ? newValue.id : null;
          }}
          onInputChange={(_event, newValue: string) => setInputValue(newValue)}
          disablePortal
          getOptionLabel={(p) => p.name}
          options={permissions}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} value={inputValue} placeholder="הרשאה" />
          )}
        />
      </TableCell>
      <TableCell style={{ textAlign: "center" }}>
        <Button
          disabled={!entry.canChange}
          onClick={() => {
            api.setResetPassword(entry.userId);
            setSnackbar(true);
          }}
        >
          איפוס
        </Button>
        <Snackbar
          open={snackbar}
          autoHideDuration={6000}
          onClose={() => setSnackbar(false)}
        >
          <Alert
            onClose={() => setSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            סיסמה עבור "{entry.username}" אופסה
          </Alert>
        </Snackbar>
      </TableCell>
    </TableRow>
  );
}

function UserTab() {
  const defaultUserEntry: userEntry = {
    userId: -1,
    username: "שם משתמש",
    permissionId: null,
    canChange: true,
  };
  const headers = ["#", "שם משתמש", "הרשאה", "איפוס סיסמה"];
  const darkMode = useContext(ThemeContext);
  const [usersInfo, setUsersInfo] = useState<userEntry[]>([]);
  const [permissions, setPermissions] = useState<permissionEntry[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [haveData, setHaveData] = useState(false);
  const [saveSnackbar, setSaveSnackbar] = useState<boolean>(false);
  const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
  const [removeDialog, setRemoveDialog] = useState(false);
  const [reCreate, setReCreate] = useState(true);

  const checkUsernames = () => {
    let error: string | null = null;
    const usernames = new Set<string>();
    usersInfo.forEach((user) => {
      const username = user.username.trim();
      if (username) usernames.add(username);
      else error = `#${user.userId} - שם משתמש לא תקין!`;
    });
    if (error) return error;
    if (usernames.size !== usersInfo.length) {
      error = "שמות משתמש צריכים להיות יחודיים!";
    }
    return error;
  };

  const handleSave = () => {
    const error = checkUsernames();
    if (error) setErrorSnackbar(error);
    else {
      api.setUsers(usersInfo);
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
      getData(setUsersInfo, setPermissions);
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
          {usersInfo.map(
            (entry, index) =>
              reCreate && (
                <UserRow key={index} entry={entry} permissions={permissions} />
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
                  setUsersInfo((u) => [...u, { ...defaultUserEntry }])
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
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
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
          setUsersInfo((u) => [...u.filter((_v, index) => !values[index])]);
          setReCreate(false);
          setRemoveDialog(false);
        }}
        users={usersInfo}
        title="הסר משתמשים"
      />
    </div>
  );
}

export default UserTab;
