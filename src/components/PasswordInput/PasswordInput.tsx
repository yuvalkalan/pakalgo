import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";

interface Props {
  title: string;
  password: string;
  setPassword: (newPassword: string) => void;
  checkPassword: (password: string) => boolean;
}

function PasswordInput({ title, password, setPassword, checkPassword }: Props) {
  const [innerPassword, setInnerPassword] = useState(password);
  const [showPassword, setShowPassword] = useState(false);
  const isValidPassword = checkPassword(innerPassword);
  const changePassword = (newPassword: string) => {
    setInnerPassword(newPassword);
    setPassword(newPassword);
  };
  return (
    <FormControl fullWidth required error={!isValidPassword} variant="outlined">
      <InputLabel>{title}</InputLabel>
      <OutlinedInput
        value={password}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          changePassword(event.target.value)
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
        label={title}
      />
    </FormControl>
  );
}

export default PasswordInput;
