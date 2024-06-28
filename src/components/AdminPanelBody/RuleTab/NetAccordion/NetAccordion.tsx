import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableBody,
  TableRow,
  Switch,
  AccordionActions,
  Button,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  StyledTable,
  StyledTableCell,
  StyledInput,
  NetRules,
} from "../RuleTab";

interface NetAccordionProps {
  netRules: NetRules;
  setNetRules: React.Dispatch<React.SetStateAction<NetRules>>;
  limitNetLength: boolean;
  toggleLimitNetLength: () => void;
}

export const defaultNetRules: NetRules = {
  multiWordOk: false,
  maxNetName: 20,
  ableNoneVhf: false,
};

const COLOR_DISABLED = "rgba(255, 255, 255, 0.5)";

function NetAccordion({
  netRules,
  setNetRules,
  limitNetLength,
  toggleLimitNetLength,
}: NetAccordionProps) {
  return (
    <Accordion style={{ fontFamily: "heeboFont" }} defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>רשת</AccordionSummary>
      <AccordionDetails>
        <StyledTable>
          <TableBody>
            <TableRow>
              <StyledTableCell>
                <Checkbox
                  checked={limitNetLength}
                  onChange={toggleLimitNetLength}
                />
              </StyledTableCell>
              <StyledTableCell
                style={limitNetLength ? {} : { color: COLOR_DISABLED }}
              >
                אורך שם רשת מקסימלי
              </StyledTableCell>
              <StyledTableCell>
                <StyledInput
                  disabled={!limitNetLength}
                  value={
                    netRules.maxNetName
                      ? Number(netRules.maxNetName).toString()
                      : defaultNetRules.maxNetName
                  }
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
              <StyledTableCell colSpan={2}>
                אפשר לאוק להיות ארוך ממילה אחת
              </StyledTableCell>
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
              <StyledTableCell colSpan={2}>
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
        <Button
          onClick={() => {
            setNetRules(defaultNetRules);
            !limitNetLength && toggleLimitNetLength();
          }}
        >
          אפס
        </Button>
      </AccordionActions>
    </Accordion>
  );
}

export default NetAccordion;
