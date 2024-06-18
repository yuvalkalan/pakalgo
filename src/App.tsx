import * as CryptoJS from "crypto-js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Context, createContext, useEffect, useState } from "react";
import { Paper } from "@mui/material";

// import PakalBody from "./components/DataDisplay/NetViewBody/PakalBody.tsx";
import SiteViewBody from "./components/DataDisplay/SiteViewBody/SiteViewBody.tsx";
import HistoryBody from "./components/HistoryBody/HistoryBody.tsx";
import HistoryRecordBody from "./components/DataDisplay/RecordBody/RecordBody.tsx";
import AppDrawer from "./components/AppDrawer/AppDrawer.tsx";
import AboutBody from "./components/AboutBody/AboutBody.tsx";
import AdminPanelBody from "./components/AdminPanelBody/AdminPanelBody.tsx";
import HomeBody, { Login } from "./components/HomeBody/HomeBody.tsx";
import ProfileBody from "./components/ProfileBody/ProfileBody.tsx";
import AppHeader from "./components/AppHeader/AppHeader.tsx";
import Api from "./Api.ts";
import "./App.css";
import NetViewBody from "./components/DataDisplay/NetViewBody/NetViewBody.tsx";

export interface UserProfile {
  username: string;
  password: string;
  permissionName: string;
  adminPermission: boolean;
  changeMarks: boolean;
  changeSites: boolean;
  changeNets: boolean;
  deleteHistory: boolean;
}
export const defaultUserProfile: UserProfile = {
  username: "",
  password: "",
  permissionName: "",
  adminPermission: false,
  changeMarks: false,
  changeSites: false,
  changeNets: false,
  deleteHistory: false,
};
export const ThemeContext: Context<boolean> = createContext(false);
export const UserContext: Context<UserProfile> =
  createContext(defaultUserProfile);
export const ChangedContext: Context<boolean> = createContext(false);

export const themeClass = (className: string, theme: boolean) =>
  `${className} ${theme ? "dark" : "light"}`;

export function hashString(input: string): string {
  return CryptoJS.SHA256(input).toString();
}

function getLocalUserProfile(): UserProfile {
  const value = localStorage.getItem("userProfile");
  return value ? JSON.parse(value) : defaultUserProfile;
}

function setLocalUserProfile(newUserProfile: UserProfile = defaultUserProfile) {
  localStorage.setItem("userProfile", JSON.stringify(newUserProfile));
}

export const api = new Api(getLocalUserProfile());

const RtlCache = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

const RtlTheme = createTheme({
  direction: "rtl",
});

const RtlAndDarkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
  },
});

function App() {
  const DarkModeStorage = (value: boolean) => {
    localStorage.setItem("theme", value.toString());
  };
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") == "true"
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(
    getLocalUserProfile()
  );
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const changeMode = (newMode: boolean) => {
    setDarkMode(newMode);
    DarkModeStorage(newMode);
  };
  const changeProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setLocalUserProfile(newProfile);
  };
  const changeHasChanged = (newValue: boolean) => {
    setHasChanged(newValue);
  };
  const changeDrawerOpen = (newValue: boolean) => {
    setDrawerOpen(newValue);
  };
  useEffect(() => {
    if (userProfile.username && userProfile.password)
      Login(
        userProfile.username,
        userProfile.password,
        changeProfile,
        undefined,
        undefined
      );
  }, []);
  // bind screen size change
  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <CacheProvider value={RtlCache}>
      <ThemeProvider theme={darkMode ? RtlAndDarkTheme : RtlTheme}>
        <ThemeContext.Provider value={darkMode}>
          <UserContext.Provider value={userProfile}>
            <ChangedContext.Provider value={hasChanged}>
              <BrowserRouter>
                <AppDrawer
                  open={drawerOpen}
                  setOpen={changeDrawerOpen}
                  changeHasChanged={changeHasChanged}
                />
                <Paper
                  style={{
                    borderRadius: "0px",
                    background: darkMode ? "rgb(60 60 60)" : "#ebebe1",
                  }}
                  sx={{
                    width: screenSize.width,
                    height: screenSize.height,
                    overflow: "hidden",
                  }}
                >
                  <AppHeader
                    drawerOpen={drawerOpen}
                    changeDrawerOpen={changeDrawerOpen}
                    changeMode={changeMode}
                    changeProfile={changeProfile}
                    changeHasChanged={changeHasChanged}
                  />
                  <Routes>
                    <Route
                      path="/"
                      element={<HomeBody changeProfile={changeProfile} />}
                    />
                    <Route path="/net-view" element={<NetViewBody />} />
                    <Route
                      path="/site-view"
                      element={
                        <SiteViewBody changeHasChanged={changeHasChanged} />
                      }
                    />
                    <Route path="/history" element={<HistoryBody />} />
                    <Route
                      path="/history/:datetime"
                      element={<HistoryRecordBody />}
                    />
                    <Route path="/admin-panel" element={<AdminPanelBody />} />
                    <Route path="/about" element={<AboutBody />} />
                    <Route
                      path="/profile"
                      element={<ProfileBody changeProfile={changeProfile} />}
                    />
                  </Routes>
                  <div className={themeClass("watermark", darkMode)}>
                    Pakalgo Web by Yuval Kalanthroff
                  </div>
                </Paper>
              </BrowserRouter>
            </ChangedContext.Provider>
          </UserContext.Provider>
        </ThemeContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default App;
