import { ReactNode, useContext } from "react";
import { /*Link,*/ useLocation, useNavigate } from "react-router-dom";
import { ChangedContext } from "../../App";
import { Button } from "@mui/material";

interface ConfirmLinkProps {
  to: string;
  disabled: boolean;
  children: ReactNode;
  onClick: () => void;
}

function ConfirmLink({ to, disabled, children, onClick }: ConfirmLinkProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const hasChanged = useContext(ChangedContext);
  const handleClick = () => {
    if (location.pathname !== to) {
      const isConfirmed =
        !hasChanged ||
        window.confirm(
          "Changes you made may not be saved.\nAre you sure you want to proceed?"
        );
      if (isConfirmed) {
        navigate(disabled ? "#" : to);
        onClick();
      }
    }
  };

  return (
    <Button disabled={disabled} onClick={handleClick}>
      {children}
    </Button>
  );
}

export default ConfirmLink;
