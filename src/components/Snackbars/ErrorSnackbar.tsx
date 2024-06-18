import PopupSnackbar from "./PopupSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function ErrorSnackbar({ open, onClose, children }: Props) {
  return (
    <PopupSnackbar open={open} onClose={onClose} severity="error">
      {children}
    </PopupSnackbar>
  );
}

export default ErrorSnackbar;
