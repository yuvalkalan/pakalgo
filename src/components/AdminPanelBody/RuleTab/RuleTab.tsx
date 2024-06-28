import { useContext, useEffect, useState } from "react";
import { ThemeContext, api, themeClass } from "../../../App";
import { Button, Table, TableCell, TextField, styled } from "@mui/material";
import SaveSnackbar from "../../Snackbars/SaveSnackbar";
import NetAccordion from "./NetAccordion/NetAccordion";
import PakalAccordion from "./PakalAccordion/PakalAccordion";
import PasswordAccordion from "./PasswordAccordion/PasswordAccordion";

export interface PasswordRules {
  minLength: number;
  upperLetter: boolean;
  spacialChar: boolean;
  defaultPassword: string;
}

export interface NetRules {
  multiWordOk: boolean;
  maxNetName: number;
  ableNoneVhf: boolean;
}

export interface PakalRules {
  enablePullPakal: boolean;
}

export interface Rules {
  passwordRules: PasswordRules;
  netRules: NetRules;
  pakalRules: PakalRules;
}

export const StyledTable = styled(Table)({
  width: "50%",
  marginLeft: "5%",
  fontFamily: "heeboFont",
});
export const StyledTableCell = styled(TableCell)({ fontFamily: "heeboFont" });
export const StyledInput = styled(TextField)({ fontFamily: "heeboFont" });

export const defaultPasswordRules: PasswordRules = {
  minLength: 8,
  upperLetter: false,
  spacialChar: false,
  defaultPassword: "Aa123456",
};
export const defaultNetRules: NetRules = {
  multiWordOk: false,
  maxNetName: 20,
  ableNoneVhf: false,
};
export const defaultPakalRules: PakalRules = { enablePullPakal: false };

function RuleTab() {
  const darkMode = useContext(ThemeContext);
  const [passwordRules, setPasswordRules] =
    useState<PasswordRules>(defaultPasswordRules);
  const [netRules, setNetRules] = useState<NetRules>(defaultNetRules);
  const [pakalRules, setPakalRules] = useState<PakalRules>(defaultPakalRules);
  const [saveSnackBar, setSaveSnackBar] = useState<boolean>(false);
  const setRules = () => {
    api.setRules(
      {
        passwordRules: passwordRules,
        netRules: netRules,
        pakalRules: pakalRules,
      },
      () => {
        setSaveSnackBar(true);
      }
    );
  };
  const getRules = () => {
    api.getRules((rules: Rules) => {
      setPasswordRules(rules.passwordRules);
      setNetRules(rules.netRules);
      setPakalRules(rules.pakalRules);
    });
  };
  useEffect(() => {
    getRules();
  }, []);
  return (
    <div
      style={{ display: "block" }}
      className={themeClass("main-table-container", darkMode)}
    >
      <PasswordAccordion
        passwordRules={passwordRules}
        setPasswordRules={setPasswordRules}
      />
      <NetAccordion netRules={netRules} setNetRules={setNetRules} />
      <PakalAccordion pakalRules={pakalRules} setPakalRules={setPakalRules} />
      <Button onClick={setRules}>שמור שינויים</Button>
      <SaveSnackbar open={saveSnackBar} onClose={() => setSaveSnackBar(false)}>
        שינויים נשמרו
      </SaveSnackbar>
    </div>
  );
}

export default RuleTab;
