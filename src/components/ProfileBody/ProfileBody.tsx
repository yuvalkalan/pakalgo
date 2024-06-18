import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import ErrorSnackbar from "../Snackbars/ErrorSnackbar";
import { useContext, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  UserContext,
  UserProfile,
  api,
  defaultUserProfile,
  hashString,
} from "../../App";
import { useNavigate } from "react-router-dom";

interface Props {
  changeProfile: (newProfile: UserProfile) => void;
}

function ProfileBody({ changeProfile }: Props) {
  const userProfile = useContext(UserContext);
  const [password1, setPassword1] = useState("");
  const [showPassword1, setShowPassword1] = useState(false);
  const [password2, setPassword2] = useState("");
  const [showPassword2, setShowPassword2] = useState(false);
  const isValidPassword = password1 !== "";
  const isMatching = password1 === password2;
  const [errorSnackbar, setErrorSnackbar] = useState("");
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const handleLogOut = () => {
    changeProfile(defaultUserProfile);
    navigate("/");
  };

  const confirmSubmit = () => {
    return window.confirm(
      "This action will change your password and force you to log in again.\nAre you sure you want to proceed?"
    );
  };

  useEffect(() => {
    if (submit && confirmSubmit()) {
      api.setPassword(userProfile.username, hashString(password1), () => {
        handleLogOut();
      });
    } else {
      setSubmit(false);
    }
  }, [submit]);
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
        <h1
          style={{ fontFamily: "heeboBoldFont", textDecoration: "underline" }}
        >
          {userProfile.username} ({userProfile.permissionName})
        </h1>
        <h2>שינוי סיסמה</h2>
        <div>
          <FormControl
            fullWidth
            required
            error={!isValidPassword}
            variant="outlined"
          >
            <InputLabel>סיסמה</InputLabel>
            <OutlinedInput
              value={password1}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword1(event.target.value)
              }
              type={showPassword1 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword1((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword1 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="סיסמה"
            />
          </FormControl>
          <FormControl
            fullWidth
            required
            error={!isMatching}
            variant="outlined"
          >
            <InputLabel>ווידוא סיסמה</InputLabel>
            <OutlinedInput
              value={password2}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword2(event.target.value)
              }
              type={showPassword2 ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword2((show) => !show)}
                    onMouseDown={(event) => event.preventDefault()}
                  >
                    {showPassword2 ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="ווידוא סיסמה"
            />
          </FormControl>
          <Button
            onClick={() => {
              if (isValidPassword) {
                if (isMatching) {
                  setSubmit(true);
                } else {
                  setErrorSnackbar("סיסמאות לא תואמות!");
                }
              } else {
                setErrorSnackbar("סיסמה חדשה לא תקינה!");
              }
            }}
            fullWidth
            variant="contained"
          >
            החלף סיסמה!
          </Button>
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

export default ProfileBody;
