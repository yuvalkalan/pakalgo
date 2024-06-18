import { useContext } from "react";
import { ThemeContext, themeClass } from "../../../App";

function RuleTab() {
  const darkMode = useContext(ThemeContext);
  return (
    <div
      style={{ display: "block" }}
      className={themeClass("main-table-container", darkMode)}
    >
      <div>{"דרישות סיסמה"}</div>
      <div>{"הגדר סיסמת ברירת מחדל"}</div>
      <div>{"אפשר משיכת פקל ל-כולם  אדמין בלבד"}</div>
      <div>{"אפשר לאוק להיות ארוך ממילה אחת"}</div>
      <div>{"אפשר כפילות בשם הרשת"}</div>
      <div>{"הגבל אורך שם רשת להיות:"}</div>
      <div>{'אפשר הכנסת תדרים שאינם בתחום התג"מ'}</div>
    </div>
  );
}

export default RuleTab;
