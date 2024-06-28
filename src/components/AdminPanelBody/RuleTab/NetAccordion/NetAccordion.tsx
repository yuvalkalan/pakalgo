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
  StyledTable,
  StyledTableCell,
  StyledInput,
  defaultNetRules,
  NetRules,
} from "../RuleTab";

interface NetAccordionProps {
  netRules: NetRules;
  setNetRules: React.Dispatch<React.SetStateAction<NetRules>>;
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

export default NetAccordion;
