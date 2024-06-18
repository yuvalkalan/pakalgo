import "./EncSwitch.css"; // Import CSS file for styling

interface Props {
  value: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function EncSwitch({ value, onClick, disabled }: Props) {
  return (
    <div
      className={`toggle-button ${disabled ? "disable" : value ? "on" : "off"}`}
      onClick={() => (disabled ? null : onClick())}
    >
      {value ? "מוצפן" : "גלוי"}
    </div>
  );
}

EncSwitch.defaultProps = {
  disabled: false,
};

export default EncSwitch;
