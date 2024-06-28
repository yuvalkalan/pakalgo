import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableBody,
  TableRow,
  Switch,
  AccordionActions,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PasswordRules,
  StyledInput,
  StyledTable,
  StyledTableCell,
} from "../RuleTab";

interface PasswordAccordionProps {
  passwordRules: PasswordRules;
  setPasswordRules: React.Dispatch<React.SetStateAction<PasswordRules>>;
}

export const defaultPasswordRules: PasswordRules = {
  minLength: 8,
  upperLetter: false,
  spacialChar: false,
  defaultPassword: "Aa123456",
};

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

export default PasswordAccordion;
