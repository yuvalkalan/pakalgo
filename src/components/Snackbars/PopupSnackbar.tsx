import { Alert, Snackbar } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  severity: "error" | "info" | "success" | "warning";
  children: React.ReactNode;
}

function PopupSnackbar({ open, onClose, severity, children }: Props) {
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {children}
      </Alert>
    </Snackbar>
  );
}

export default PopupSnackbar;
