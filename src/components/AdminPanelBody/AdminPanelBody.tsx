import { Box, styled } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import PermissionTab from "./PermissionTab/PermissionTab";
import UserTab from "./UserTab/UserTab";
import RuleTab from "./RuleTab/RuleTab";

const AdminTabPanel = styled(TabPanel)({
  height: "90%",
  width: "95%",
  padding: "0px",
  margin: "auto",
});

function AdminPanelBody() {
  const [value, setValue] = useState("1");
  return (
    <TabContext value={value}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: "98%",
          margin: "auto",
        }}
      >
        <TabList
          onChange={(_event: React.SyntheticEvent, newValue: string) =>
            setValue(newValue)
          }
          aria-label="lab API tabs example"
        >
          <Tab label="משתמשים" value="1" />
          <Tab label="הרשאות" value="2" />
          <Tab label="חוקים" value="3" />
        </TabList>
      </Box>
      <AdminTabPanel value="1">
        <UserTab />
      </AdminTabPanel>
      <AdminTabPanel value="2">
        <PermissionTab />
      </AdminTabPanel>
      <AdminTabPanel value="3">
        <RuleTab />
      </AdminTabPanel>
    </TabContext>
  );
}

export default AdminPanelBody;
