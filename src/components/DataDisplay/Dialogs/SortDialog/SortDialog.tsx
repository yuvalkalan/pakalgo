import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import "./SortDialog.css";
import { useState } from "react";
import DirSwitch from "./DirSwitch/DirSwitch";

interface Props<T> {
  open: boolean;
  onClose: () => void;
  onSubmit: (sortBy: { key: keyof T; reversed: boolean }) => void;
  options: string[];
  optionsValue: (keyof T)[];
}

function SortDialog<T>({
  open,
  onClose,
  onSubmit,
  options,
  optionsValue,
}: Props<T>) {
  const [value, setValue] = useState<keyof T>(optionsValue[0]);
  const [dir, setDir] = useState(false);
  return (
    <Dialog style={{ direction: "rtl" }} open={open} onClose={onClose}>
      <DialogTitle className="dialog-title">
        <DirSwitch onClick={() => setDir((d) => !d)} startState={dir} />
        מיין לפי
      </DialogTitle>
      <DialogContent sx={{ minWidth: "200px" }}>
        <FormControl>
          <RadioGroup
            className="sort-option"
            value={value}
            onChange={(event) =>
              setValue((event.target as HTMLInputElement).value as keyof T)
            }
          >
            {options.map((option, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={optionsValue[index]}
                  control={<Radio />}
                  label={option}
                />
              );
            })}
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => onSubmit({ key: value, reversed: dir })}
          color="primary"
        >
          בחר
        </Button>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SortDialog;
