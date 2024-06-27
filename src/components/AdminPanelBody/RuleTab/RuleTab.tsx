import { useContext, useState } from "react";
import { ThemeContext, themeClass } from "../../../App";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface PasswordRules {
  minLength: number;
  upperLetter: boolean;
  spacialChar: boolean;
  defaultPassword: string;
}

interface NetRules {
  multiWordOk: boolean;
  maxNetName: number;
  ableNoneVhf: boolean;
}

interface PakalRules {
  enablePullPakal: boolean;
}

interface PasswordAccordionProps {
  passwordRules: PasswordRules;
  setPasswordRules: React.Dispatch<React.SetStateAction<PasswordRules>>;
}

interface NetAccordionProps {
  netRules: NetRules;
  setNetRules: React.Dispatch<React.SetStateAction<NetRules>>;
}

interface PakalAccordionProps {
  pakalRules: PakalRules;
  setPakalRules: React.Dispatch<React.SetStateAction<PakalRules>>;
}

const StyledTable = styled(Table)({
  width: "50%",
  marginLeft: "5%",
  fontFamily: "heeboFont",
});
const StyledTableCell = styled(TableCell)({ fontFamily: "heeboFont" });
const StyledInput = styled(TextField)({ fontFamily: "heeboFont" });

const defaultPasswordRules: PasswordRules = {
  minLength: 8,
  upperLetter: false,
  spacialChar: false,
  defaultPassword: "Aa123456",
};
const defaultNetRules: NetRules = {
  multiWordOk: false,
  maxNetName: 20,
  ableNoneVhf: false,
};
const defaultPakalRules: PakalRules = { enablePullPakal: false };

function PasswordAccordion({
  passwordRules,
  setPasswordRules,
}: PasswordAccordionProps) {
  return (
    <Accordion style={{ fontFamily: "heeboFont" }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>סיסמה</AccordionSummary>
      <AccordionDetails>
        <StyledTable>
          <TableBody>
            <TableRow>
              <StyledTableCell>אורך מינימלי</StyledTableCell>
              <StyledTableCell>
                <StyledInput
                  value={Number(passwordRules.minLength).toString()}
                  type="number"
                  onChange={(event) => {
                    const newLength = Math.min(
                      Math.max(0, Number(event.target.value)),
                      15
                    );
                    setPasswordRules((pr) => ({
                      ...pr,
                      minLength: newLength,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>חייב אותיות גדולות</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={passwordRules.upperLetter}
                  onChange={(event) => {
                    setPasswordRules((pr) => ({
                      ...pr,
                      upperLetter: event.target.checked,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>חייב סימנים מיוחדים</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={passwordRules.spacialChar}
                  onChange={(event) => {
                    setPasswordRules((pr) => ({
                      ...pr,
                      spacialChar: event.target.checked,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>סיסמת ברירת מחדל</StyledTableCell>
              <StyledTableCell>
                <StyledInput
                  value={passwordRules.defaultPassword}
                  onChange={(event) => {
                    setPasswordRules((pr) => ({
                      ...pr,
                      defaultPassword: event.target.value,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={() => setPasswordRules(defaultPasswordRules)}>
          אפס
        </Button>
      </AccordionActions>
    </Accordion>
  );
}

function NetAccordion({ netRules, setNetRules }: NetAccordionProps) {
  return (
    <Accordion style={{ fontFamily: "heeboFont" }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>רשת</AccordionSummary>
      <AccordionDetails>
        <StyledTable>
          <TableBody>
            <TableRow>
              <StyledTableCell>אורך שם רשת מקסימלי</StyledTableCell>
              <StyledTableCell>
                <StyledInput
                  value={Number(netRules.maxNetName).toString()}
                  type="number"
                  onChange={(event) => {
                    const newLength = Math.min(
                      Math.max(10, Number(event.target.value)),
                      30
                    );
                    setNetRules((nr) => ({
                      ...nr,
                      maxNetName: newLength,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>אפשר לאוק להיות ארוך ממילה אחת</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={netRules.multiWordOk}
                  onChange={(event) => {
                    setNetRules((nr) => ({
                      ...nr,
                      multiWordOk: event.target.checked,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
            <TableRow>
              <StyledTableCell>
                אפשר הכנסת תדרים שאינם בתחום התג"מ
              </StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={netRules.ableNoneVhf}
                  onChange={(event) => {
                    setNetRules((nr) => ({
                      ...nr,
                      ableNoneVhf: event.target.checked,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={() => setNetRules(defaultNetRules)}>אפס</Button>
      </AccordionActions>
    </Accordion>
  );
}

function PakalAccordion({ pakalRules, setPakalRules }: PakalAccordionProps) {
  return (
    <Accordion style={{ fontFamily: "heeboFont" }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>פק"ל</AccordionSummary>
      <AccordionDetails>
        <StyledTable>
          <TableBody>
            <TableRow>
              <StyledTableCell>אפשר משיכת פק"ל לכולם</StyledTableCell>
              <StyledTableCell>
                <Switch
                  checked={pakalRules.enablePullPakal}
                  onChange={(event) => {
                    setPakalRules((pr) => ({
                      ...pr,
                      enablePullPakal: event.target.checked,
                    }));
                  }}
                />
              </StyledTableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </AccordionDetails>
      <AccordionActions>
        <Button onClick={() => setPakalRules(defaultPakalRules)}>אפס</Button>
      </AccordionActions>
    </Accordion>
  );
}
function RuleTab() {
  const darkMode = useContext(ThemeContext);
  const [passwordRules, setPasswordRules] =
    useState<PasswordRules>(defaultPasswordRules);
  const [netRules, setNetRules] = useState<NetRules>(defaultNetRules);
  const [pakalRules, setPakalRules] = useState<PakalRules>(defaultPakalRules);
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
    </div>
  );
}

export default RuleTab;
