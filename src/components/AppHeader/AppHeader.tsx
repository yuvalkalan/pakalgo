import { Avatar, Button, Divider, ListItemIcon, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import "./AppHeader.css";
import { useContext, useState } from "react";
import {
  ChangedContext,
  ThemeContext,
  UserContext,
  UserProfile,
  defaultUserProfile,
} from "../../App";
import PopupMenu from "../PopupMenu/PopupMenu";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ThemeSwitch from "./ThemeSwitch/ThemeSwitch";

interface Props {
  drawerOpen: boolean;
  changeDrawerOpen: (newValue: boolean) => void;
  changeMode: (newMode: boolean) => void;
  changeProfile: (newProfile: UserProfile) => void;
  changeHasChanged: (newValue: boolean) => void;
}

function AppHeader({
  drawerOpen,
  changeDrawerOpen,
  changeMode,
  changeProfile,
  changeHasChanged,
}: Props) {
  const darkTheme = useContext(ThemeContext);
  const userProfile = useContext(UserContext);
  const hasChanged = useContext(ChangedContext);

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConfirm = () => {
    return (
      !hasChanged ||
      window.confirm(
        "Changes you made may not be saved.\nAre you sure you want to proceed?"
      )
    );
  };

  const handleProfile = () => {
    if (handleConfirm()) {
      navigate(userProfile.adminPermission ? "#" : "/profile");
      changeHasChanged(false);
    }
  };

  const handleLogOut = () => {
    if (handleConfirm()) {
      changeProfile(defaultUserProfile);
      navigate("/");
    }
  };

  return (
    <div className="main-header">
      <div className={`header-info ${darkTheme ? "dark" : "light"}`}>
        <Button onClick={() => changeDrawerOpen(!drawerOpen)}>
          <MenuIcon />
        </Button>
        <Button
          onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(
              !!userProfile.permissionName ? event.currentTarget : null
            )
          }
        >
          <Avatar sx={{ width: 50, height: 50 }} />
          {!!userProfile.permissionName && (
            <div className={`header-user-info ${darkTheme ? "dark" : "light"}`}>
              <h2>{userProfile.permissionName}</h2>
              <div>{userProfile.username}</div>
            </div>
          )}
        </Button>
        <PopupMenu
          anchorEl={anchorEl}
          handleClose={handleCloseMenu}
          open={Boolean(anchorEl)}
        >
          <MenuItem
            onClick={handleProfile}
            disabled={userProfile.adminPermission}
          >
            <Avatar />
            פרופיל
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            התנתק
          </MenuItem>
        </PopupMenu>
      </div>
      <div className={`header-logos ${darkTheme ? "dark" : "light"}`}>
        <ThemeSwitch onClick={() => changeMode(!darkTheme)} />
        <div
          style={{
            borderLeft: "2px solid #0000003d",
            height: "auto",
            marginLeft: "10px",
            marginRight: "10px",
          }}
        ></div>
        <Avatar
          style={{ marginRight: "10px" }}
          sx={{ width: 50, height: 50 }}
          src="../src/assets/static/images/ishay.png"
        />
        <Avatar
          style={{ marginRight: "10px" }}
          variant="square"
          sx={{ width: 50, height: 50 }}
          src="../src/assets/static/images/IsraeliNavy.png"
        ></Avatar>
      </div>
    </div>
  );
}

export default AppHeader;
