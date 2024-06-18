import { ReactElement } from "react";
import ConfirmLink from "../ConfirmLink/ConfirmLink";

interface Props {
  to: string;
  title: string;
  icon: ReactElement<any, any>;
  disabled: boolean;
  changeHasChanged: (newValue: boolean) => void;
}

function SideCard({ to, title, icon, disabled, changeHasChanged }: Props) {
  return (
    <ConfirmLink
      to={to}
      disabled={disabled}
      onClick={() => changeHasChanged(false)}
    >
      {icon}
      {title}
    </ConfirmLink>
  );
  // return (
  //   <Link // if using link change AppDrawer.css from 'button' to 'a'
  //     to={disabled ? "#" : to}
  //     replace
  //     style={{ color: disabled ? "gray" : "none" }}
  //   >
  //     {icon}
  //     {title}
  //   </Link>
  // );
}

export default SideCard;
