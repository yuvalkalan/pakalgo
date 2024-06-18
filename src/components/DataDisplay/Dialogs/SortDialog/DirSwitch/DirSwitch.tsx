import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./DirSwitch.css";

interface Props {
  onClick: () => void;
  startState: boolean;
}

function toggle() {
  const upClass = "toggle-up";
  const downClass = "toggle-down";

  const div = document.querySelector(".square");
  if (div) {
    if (~div.className.indexOf(downClass)) {
      div.className = div.className.replace(downClass, upClass);
    } else {
      div.className = div.className.replace(upClass, downClass);
    }
  }
}

function DirSwitch({ onClick, startState }: Props) {
  return (
    <div
      className={startState ? "square toggle-up" : "square toggle-down"}
      onClick={() => {
        onClick(), toggle();
      }}
    >
      <ArrowDownwardIcon className="arrow" style={{ fontSize: "1.2em" }} />
    </div>
  );
}

export default DirSwitch;
