import {
  Avatar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import "./AboutBody.css";
import { useContext, useState } from "react";
import { ThemeContext, themeClass } from "../../App";

interface CreditAvaterProps {
  initials: string;
  name: string;
  description: string;
  logo: string;
}

function CreditAvater({
  initials,
  name,
  description,
  logo,
}: CreditAvaterProps) {
  const darkMode = useContext(ThemeContext);
  const [displayInfo, setDisplayInfo] = useState(false);
  return (
    <>
      <Button onClick={() => setDisplayInfo(true)}>
        <Avatar>{initials}</Avatar>
      </Button>
      <Dialog
        className={themeClass("credit-info", darkMode)}
        open={displayInfo}
        onClose={() => setDisplayInfo(false)}
      >
        <DialogTitle>
          {name}
          <img src={logo} />
        </DialogTitle>
        <DialogContent>
          <div>{description}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisplayInfo(false)} color="primary">
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const names: CreditAvaterProps[] = [
  {
    initials: "יק",
    name: "יובל קלנטרוף",
    description: 'ראש צוות פיתוח מעבדת קשר יש"י',
    logo: "src/assets/static/images/snakegame.gif",
  },
  {
    initials: "שע",
    name: "שיר ענבי",
    description: "ראש צוות UI/UX ומלכת הROIP",
    logo: "src/assets/static/images/capibara.gif",
  },
];

function AboutBody() {
  return (
    <Card
      className="about-card"
      sx={{ width: "80%", height: "50%", margin: "auto" }}
    >
      <h1>Pakalgo Web</h1>
      <h2>קישוריות וניהול מפתוחים חה"י</h2>
      <div>
        {names.map((name, index) => (
          <CreditAvater
            key={index}
            initials={name.initials}
            name={name.name}
            description={name.description}
            logo={name.logo}
          />
        ))}
      </div>
    </Card>
  );
}
export default AboutBody;
