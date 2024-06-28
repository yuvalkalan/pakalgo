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
  PakalRules,
  StyledTable,
  StyledTableCell,
  defaultPakalRules,
} from "../RuleTab";

interface PakalAccordionProps {
  pakalRules: PakalRules;
  setPakalRules: React.Dispatch<React.SetStateAction<PakalRules>>;
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

export default PakalAccordion;
