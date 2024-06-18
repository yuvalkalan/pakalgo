import { Drawer } from "@mui/material";
import "./AppDrawer.css";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import HistoryIcon from "@mui/icons-material/History";
import LanguageIcon from "@mui/icons-material/Language";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import InfoIcon from "@mui/icons-material/Info";
import SideCard from "./SideCard";
import { ThemeContext, UserContext } from "../../App";
import { useContext } from "react";

interface Props {
  open: boolean;
  setOpen: (newValue: boolean) => void;
  changeHasChanged: (newValue: boolean) => void;
}

function AppDrawer({ open, setOpen, changeHasChanged }: Props) {
  const userProfile = useContext(UserContext);
  const darkTheme = useContext(ThemeContext);
  return (
    <Drawer open={open} onClose={() => setOpen(!open)}>
      <div className={`main-drawer ${darkTheme ? "dark" : "light"}`}>
        <h2>תצוגה</h2>
        <SideCard
          to="/net-view"
          title="תצוגת רשת"
          icon={<LeakAddIcon />}
          disabled={!userProfile.permissionName}
          changeHasChanged={changeHasChanged}
        />
        <SideCard
          to="/site-view"
          title="תצוגת אתר"
          icon={<LanguageIcon />}
          disabled={!userProfile.permissionName}
          changeHasChanged={changeHasChanged}
        />
        <SideCard
          to="/history"
          title="היסטוריה"
          icon={<HistoryIcon />}
          disabled={!userProfile.permissionName}
          changeHasChanged={changeHasChanged}
        />

        <h2>טכנאי</h2>
        <SideCard
          to="/admin-panel"
          title="ניהול"
          icon={<AdminPanelSettingsIcon />}
          disabled={!userProfile.adminPermission}
          changeHasChanged={changeHasChanged}
        />

        <h2>כללי</h2>
        <SideCard
          to="/about"
          title="אודות"
          icon={<InfoIcon />}
          disabled={!userProfile.permissionName}
          changeHasChanged={changeHasChanged}
        />
      </div>
    </Drawer>
  );
}

export default AppDrawer;
