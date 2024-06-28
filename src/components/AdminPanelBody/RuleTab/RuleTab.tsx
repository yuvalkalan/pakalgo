import { useContext, useState } from "react";
import {
  ThemeContext,
  UserContext,
  UserProfile,
  api,
  themeClass,
} from "../../../App";
import { Button, Table, TableCell, TextField, styled } from "@mui/material";
import SaveSnackbar from "../../Snackbars/SaveSnackbar";
import NetAccordion, { defaultNetRules } from "./NetAccordion/NetAccordion";
import PakalAccordion, {
  defaultPakalRules,
} from "./PakalAccordion/PakalAccordion";
import PasswordAccordion, {
  defaultPasswordRules,
} from "./PasswordAccordion/PasswordAccordion";

export interface PasswordRules {
  minLength: number;
  upperLetter: boolean;
  spacialChar: boolean;
  defaultPassword: string;
}

export interface NetRules {
  multiWordOk: boolean;
  maxNetName: number | null;
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

interface Props {
  changeProfile: (userProfile: UserProfile) => void;
}

export const StyledTable = styled(Table)({
  width: "50%",
  marginLeft: "5%",
  fontFamily: "heeboFont",
});
export const StyledTableCell = styled(TableCell)({ fontFamily: "heeboFont" });
export const StyledInput = styled(TextField)({ fontFamily: "heeboFont" });

export const defaultRules: Rules = {
  passwordRules: defaultPasswordRules,
  netRules: defaultNetRules,
  pakalRules: defaultPakalRules,
};

function RuleTab({ changeProfile }: Props) {
  const darkMode = useContext(ThemeContext);
  const userProfile = useContext(UserContext);
  const [passwordRules, setPasswordRules] = useState<PasswordRules>(
    userProfile.rules.passwordRules
  );
  const [netRules, setNetRules] = useState<NetRules>(
    userProfile.rules.netRules
  );
  const [pakalRules, setPakalRules] = useState<PakalRules>(
    userProfile.rules.pakalRules
  );
  const [limitNetLength, setLimitNetLength] = useState<boolean>(
    !!userProfile.rules.netRules.maxNetName
  );
  const [saveSnackBar, setSaveSnackBar] = useState<boolean>(false);

  const toggleLimitNetLength = () => {
    if (!limitNetLength)
      setNetRules((nr) => ({ ...nr, maxNetName: defaultNetRules.maxNetName }));
    setLimitNetLength((v) => !v);
  };

  const setRules = () => {
    if (
      window.confirm(
        "This action will change advanced system settings, and may affect the information currently in it.\nAre you sure you want to proceed?"
      )
    ) {
      const rules = {
        passwordRules: passwordRules,
        netRules: {
          ...netRules,
          maxNetName: limitNetLength ? netRules.maxNetName : null,
        },
        pakalRules: pakalRules,
      };
      api.setRules(rules, () => {
        setSaveSnackBar(true);
      });
      changeProfile({ ...userProfile, rules: rules });
    }
  };
  return (
    <div
      style={{ display: "block" }}
      className={themeClass("main-table-container", darkMode)}
    >
      <PasswordAccordion
        passwordRules={passwordRules}
        setPasswordRules={setPasswordRules}
      />
      <NetAccordion
        netRules={netRules}
        setNetRules={setNetRules}
        limitNetLength={limitNetLength}
        toggleLimitNetLength={toggleLimitNetLength}
      />
      <PakalAccordion pakalRules={pakalRules} setPakalRules={setPakalRules} />
      <Button onClick={setRules}>שמור שינויים</Button>
      <SaveSnackbar open={saveSnackBar} onClose={() => setSaveSnackBar(false)}>
        שינויים נשמרו
      </SaveSnackbar>
    </div>
  );
}

export default RuleTab;
