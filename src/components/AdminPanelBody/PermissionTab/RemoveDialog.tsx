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
} from "@mui/material";

import { permissionEntry } from "./PermissionTab";
import { useContext, useEffect, useState } from "react";
import { ThemeContext, themeClass } from "../../../App";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: boolean[]) => void;
  permissions: permissionEntry[];
  title: string;
}

interface TableRowProps {
  permission: permissionEntry;
  index: number;
  checked: boolean;
  onChange: (index: number) => void;
}
function DialogTableRow({
  permission,
  index,
  checked,
  onChange,
}: TableRowProps) {
  const darkMode = useContext(ThemeContext);
  return (
    <TableRow>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        <Checkbox checked={checked} onChange={() => onChange(index)} />
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        {permission.id}
      </TableCell>
      <TableCell className={themeClass("pakal-body-cell", darkMode)}>
        {permission.name}
      </TableCell>
    </TableRow>
  );
}

function RemoveDialog({ open, onClose, onSubmit, permissions, title }: Props) {
  const darkMode = useContext(ThemeContext);
  const emptyValues = () => {
    const temp: boolean[] = [];
    for (let i = 0; i < permissions.length; i++) {
      temp.push(false);
    }
    return temp;
  };
  const [values, setValues] = useState(emptyValues());
  const handleSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < permissions.length; i++) {
      currentValue &&= values[i];
    }
    const temp = [];
    for (let i = 0; i < permissions.length; i++) {
      temp.push(!currentValue);
    }
    setValues(temp);
  };
  const handleValueChange = (index: number) => {
    const temp = [...values];
    temp[index] = !temp[index];
    setValues(temp);
  };
  const isSelectAll = () => {
    let currentValue = true;
    for (let i = 0; i < permissions.length; i++) {
      currentValue &&= values[i];
    }
    return currentValue;
  };
  const isIndeterminate = () => {
    let counter = 0;
    for (let i = 0; i < permissions.length; i++) {
      if (values[i]) {
        counter++;
      }
    }
    return 0 < counter && !isSelectAll();
  };
  useEffect(() => {
    setValues(emptyValues());
  }, [permissions.length]);
  return (
    <Dialog
      style={{ direction: "rtl" }}
      key="delete net dialog"
      open={open}
      onClose={onClose}
    >
      <DialogTitle className="dialog-title">{title}</DialogTitle>
      <DialogContent>
        <Table dir="rtl" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                <Checkbox
                  checked={isSelectAll()}
                  indeterminate={isIndeterminate()}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                #
              </TableCell>
              <TableCell className={themeClass("pakal-header-cell", darkMode)}>
                שם הרשאה
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission, index) => (
              <DialogTableRow
                key={index}
                permission={permission}
                index={index}
                checked={values[index]}
                onChange={handleValueChange}
              />
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(values)} color="primary">
          הסר
        </Button>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default RemoveDialog;
