import "../HistoryBody.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (hours: number) => void;
}

function DeleteDialog({ open, onClose, onSubmit }: Props) {
  const [hours, setHours] = useState(72);
  useEffect(() => {
    setHours(72);
  }, [open]);
  return (
    <Dialog
      style={{ direction: "rtl" }}
      key="add site dialog"
      open={open}
      onClose={onClose}
    >
      <DialogTitle className="dialog-title">מחיקה</DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          alignItems: "center",
          fontFamily: "HeeboFont",
          fontSize: "1.5em",
        }}
      >
        <div style={{ padding: "10px" }}>השאר </div>
        <TextField
          type="number"
          value={hours}
          onChange={(e) =>
            setHours(Math.min(Math.max(0, Number(e.target.value)), 99))
          }
          variant="standard"
          style={{ width: "50px" }}
          inputProps={{ style: { fontSize: "1.5em", textAlign: "left" } }}
        />
        <div>שעות אחורה </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(hours)} color="primary">
          מחק
        </Button>
        <Button onClick={onClose} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
