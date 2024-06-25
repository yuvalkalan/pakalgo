import { Box, Button } from "@mui/material";
import ErrorSnackbar from "../Snackbars/ErrorSnackbar";
import { useContext, useEffect, useState } from "react";
import {
  UserContext,
  UserProfile,
  api,
  defaultUserProfile,
  hashString,
} from "../../App";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../PasswordInput/PasswordInput";

interface Props {
  changeProfile: (newProfile: UserProfile) => void;
}

function ProfileBody({ changeProfile }: Props) {
  const userProfile = useContext(UserContext);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
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
          <PasswordInput
            title="סיסמה"
            password={password1}
            setPassword={(newPassword: string) => setPassword1(newPassword)}
            checkPassword={(password: string) => password !== ""}
          />
          <PasswordInput
            title="ווידוא סיסמה"
            password={password2}
            setPassword={(newPassword: string) => setPassword2(newPassword)}
            checkPassword={(_password: string) => isMatching}
          />
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
