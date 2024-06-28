import { Alert, Box, Button } from "@mui/material";
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

const SPECIAL_CHARS_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;
const UPPERCASE_PATTERN = /[A-Z]/;

interface Props {
  changeProfile: (newProfile: UserProfile) => void;
}

function ProfileBody({ changeProfile }: Props) {
  const userProfile = useContext(UserContext);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorSnackbar, setErrorSnackbar] = useState("");
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  const isMatching = password1 === password2;
  const passwordRules = userProfile.rules.passwordRules;
  const passwordLengthOk = password1.length >= passwordRules.minLength;
  const passwordSpacialCharOk =
    !passwordRules.spacialChar || SPECIAL_CHARS_PATTERN.test(password1);
  const passwordUppercaseOk =
    !passwordRules.upperLetter || UPPERCASE_PATTERN.test(password1);
  const handleLogOut = () => {
    changeProfile(defaultUserProfile);
    navigate("/");
  };

  const confirmSubmit = () => {
    return window.confirm(
      "This action will change your password and force you to log in again.\nAre you sure you want to proceed?"
    );
  };

  const checkPassword = (password: string) => {
    console.log(
      password,
      SPECIAL_CHARS_PATTERN.test(password),
      UPPERCASE_PATTERN.test(password)
    );
    return (
      !password ||
      (passwordLengthOk && passwordSpacialCharOk && passwordUppercaseOk)
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
            checkPassword={checkPassword}
          />
          <PasswordInput
            title="ווידוא סיסמה"
            password={password2}
            setPassword={(newPassword: string) => setPassword2(newPassword)}
            checkPassword={(_password: string) => isMatching}
          />
          <Button
            onClick={() => {
              if (checkPassword(password1)) {
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
        {password1 && (
          <div>
            <Alert
              severity={passwordLengthOk ? "success" : "error"}
            >{`סיסמה חייבת להכיל לפחות ${userProfile.rules.passwordRules.minLength} תווים`}</Alert>
            {passwordRules.spacialChar && (
              <Alert severity={passwordSpacialCharOk ? "success" : "error"}>
                {"סיסמה חייבת להכיל סימנים מיוחדים"}
              </Alert>
            )}
            {passwordRules.upperLetter && (
              <Alert severity={passwordUppercaseOk ? "success" : "error"}>
                {"סיסמה חייבת להכיל אותיות גדולות"}
              </Alert>
            )}
          </div>
        )}
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
