import Box from "@mui/material/Box";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useContext, useEffect, useState } from "react";
import "./HomeBody.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { UserContext, UserProfile, api } from "../../App";
import ErrorSnackbar from "../Snackbars/ErrorSnackbar";
import { useNavigate } from "react-router-dom";

interface Props {
  changeProfile: (newProfile: UserProfile) => void;
}

export interface loginResponse {
  isOk: boolean;
  error: string;
  permissionName: string;
  adminPermission: boolean;
  changeMarks: boolean;
  changeSites: boolean;
  changeNets: boolean;
  deleteHistory: boolean;
}

export function Login(
  username: string,
  password: string,
  changeProfile: (newProfile: UserProfile) => void,
  setErrorSnackbar?: React.Dispatch<React.SetStateAction<string>>,
  setHaveData?: React.Dispatch<React.SetStateAction<boolean>>
) {
  api.setLogin(username, password, (data: loginResponse) => {
    if (data.isOk) {
      const newUserProfile: UserProfile = {
        username: username,
        password: password,
        permissionName: data.permissionName,
        adminPermission: data.adminPermission,
        changeMarks: data.changeMarks,
        changeNets: data.changeNets,
        changeSites: data.changeSites,
        deleteHistory: data.deleteHistory,
      };
      changeProfile(newUserProfile);
    } else {
      if (setErrorSnackbar) setErrorSnackbar(data.error);
    }
    if (setHaveData) setHaveData(data.isOk);
  });
}

export default function HomeBody({ changeProfile }: Props) {
  const navigate = useNavigate();
  const userProfile = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isValidUsername = username !== "";
  const [showPassword, setShowPassword] = useState(false);
  const isValidPassword = password !== "";
  const [errorSnackbar, setErrorSnackbar] = useState("");
  const [submit, setSubmit] = useState(false);
  const [haveData, setHaveData] = useState(false);
  const handleSubmit = () => {
    Login(username, password, changeProfile, setErrorSnackbar, setHaveData);
  };
  useEffect(() => {
    if (userProfile.username && userProfile.password) {
      setUsername(userProfile.username);
      setPassword(userProfile.password);
      setSubmit(true);
    }
  }, []);

  useEffect(() => {
    if (submit && username && password) {
      handleSubmit();
      setSubmit(false);
    }
  }, [submit, username, password]);

  useEffect(() => {
    if (haveData) {
      navigate("/net-view");
    }
  }, [haveData]);

  return (
    <div className="main-login-page">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <h1>כניסה</h1>
        <div>
          <TextField
            value={username}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(event.target.value)
            }
            margin="normal"
            required
            fullWidth
            label="שם משתמש"
            error={!isValidUsername}
          />
          <FormControl
            fullWidth
            required
            error={!isValidPassword}
            variant="outlined"
          >
            <InputLabel>סיסמה</InputLabel>
            <OutlinedInput
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end" style={{ height: "100%" }}>
                  <IconButton
                    style={{ marginTop: "auto" }}
                    onClick={() => setShowPassword((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="סיסמה"
            />
          </FormControl>
          <Button
            onClick={() => {
              if (isValidUsername && isValidPassword) setSubmit(true);
              else setErrorSnackbar("שם משתמש או סיסמה לא חוקיים");
            }}
            fullWidth
            variant="contained"
          >
            התחבר
          </Button>
          <div style={{ textAlign: "center", fontFamily: "heeboFont" }}>
            {"שכחת סיסמה? עדיין אין חשבון?"}
            <br />
            {'התקשר למשל"ט הרויפ!'}
          </div>
        </div>
      </Box>
      <ErrorSnackbar
        open={errorSnackbar !== ""}
        onClose={() => setErrorSnackbar("")}
      >
        {errorSnackbar}
      </ErrorSnackbar>
    </div>
  );
}
