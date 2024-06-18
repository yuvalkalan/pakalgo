import { ChangeEvent, useContext, useState } from "react";
import { TextField } from "@mui/material";
import { ThemeContext, themeClass } from "../../../../../App";

interface Props {
  value: number | null;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}

function FreqInput({ value, onChange, disabled }: Props) {
  const darkMode = useContext(ThemeContext);
  const [hasFocus, setHasFocus] = useState(false);

  const error =
    !value || !(30 <= value && value <= 87.975 && (value * 1000) % 25 == 0);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    onChange(currentValue ? parseFloat(currentValue) : null);
  };

  const checkValue = () => {
    if (error) {
      onChange(
        Number.parseFloat(
          (
            Math.round(Math.max(30, Math.min(value || 0, 87.975)) / 0.025) *
            0.025
          )
            .toString()
            .substring(0, 6) // returning 3 digit after the dot
        )
      );
    }
  };
  const displayValue =
    (!hasFocus ? value?.toFixed(3) : value?.toString()) || "";
  return (
    <TextField
      disabled={disabled}
      error={error}
      style={{ direction: "ltr" }}
      type="number"
      value={displayValue}
      inputProps={{ style: { textAlign: "right" } }}
      variant="filled"
      className={themeClass("pakal-body-input", darkMode)}
      onChange={handleChange}
      onBlur={() => {
        setHasFocus(false);
        checkValue();
      }}
      onFocus={() => setHasFocus(true)}
      InputProps={{
        disableUnderline: true,
        ...(error && { style: { color: "red" } }),
      }}
    />
  );
}
FreqInput.defaultProps = { disabled: false };

export default FreqInput;
