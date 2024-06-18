import PopupSnackbar from "./PopupSnackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

function SaveSnackbar({ open, onClose, children }: Props) {
  return (
    <PopupSnackbar open={open} onClose={onClose} severity="success">
      {children}
    </PopupSnackbar>
  );
}

export default SaveSnackbar;
