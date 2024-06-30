import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  Paper,
  Skeleton,
  Tooltip,
  styled,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { Bookmark } from "@mui/icons-material";
import DeleteDialog from "./DeleteDialog/DeleteDialog";
import { ThemeContext, UserContext, api, themeClass } from "../../App";
import PopupMenu from "../PopupMenu/PopupMenu";
import "./HistoryBody.css";
import { Pakal, SnackbarItem } from "../DataDisplay/Interfaces";
import PopupSnackbar from "../Snackbars/PopupSnackbar";
import { CUSTOM_CODES } from "../../Api";

interface FileInfo {
  creator: string | null;
  sites: number;
  units: number;
  nets: number;
  marks: number;
}

interface HistoryRecord {
  datetime: string;
  fileInfo: FileInfo;
}

interface HistoryItemProps {
  record: HistoryRecord;
  handleDelete: (index: number) => void;
  handlePullPakal: (index: number) => void;
  index: number;
}

interface HistoryMenuItemProps {
  title: string;
  text: string;
  icon: React.ReactNode;
}

const MenuDiv = styled("div")({
  display: "flex",
  fontSize: "1.2em",
  width: "100%",
  alignItems: "center",
});

const InnerMenuDiv = styled("div")({ marginLeft: "5%" });

function HistoryMenuItem({ title, icon, text }: HistoryMenuItemProps) {
  return (
    <Tooltip
      title={title}
      arrow
      style={{ fontFamily: "heeboFont", paddingBottom: "10px" }}
    >
      <MenuDiv>
        {icon}
        <InnerMenuDiv>{text}</InnerMenuDiv>
      </MenuDiv>
    </Tooltip>
  );
}

function HistoryItem({
  record,
  handleDelete,
  handlePullPakal,
  index,
}: HistoryItemProps) {
  const userProfile = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Paper
      style={{
        margin: "10px",
        width: "100%",
      }}
    >
      {userProfile.deleteHistory && (
        <Button style={{ color: "black" }} onClick={() => handleDelete(index)}>
          <DeleteIcon />
        </Button>
      )}
      <Button style={{ width: "70%", fontSize: "2em" }}>
        <Link to={record.datetime}>{record.datetime}</Link>
      </Button>
      <Button
        onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(!!userProfile.permissionName ? event.currentTarget : null)
        }
      >
        <MoreVertIcon fontSize="large" />
      </Button>
      <PopupMenu
        anchorEl={anchorEl}
        handleClose={handleCloseMenu}
        open={Boolean(anchorEl)}
      >
        <HistoryMenuItem
          title="יוצר"
          text={record.fileInfo.creator || "לא מוגדר"}
          icon={<AccountCircleIcon />}
        />
        <HistoryMenuItem
          title="אתרים"
          text={record.fileInfo.sites.toString()}
          icon={<LocationOnIcon />}
        />
        <HistoryMenuItem
          title="מכשירים"
          text={record.fileInfo.units.toString()}
          icon={<PodcastsIcon />}
        />
        <HistoryMenuItem
          title="רשתות"
          text={record.fileInfo.nets.toString()}
          icon={<LeakAddIcon />}
        />
        <HistoryMenuItem
          title="סימונים"
          text={record.fileInfo.marks.toString()}
          icon={<Bookmark />}
        />
        <MenuItem
          disabled={
            !userProfile.adminPermission &&
            !userProfile.rules.pakalRules.enablePullPakal
          }
          onClick={() => handlePullPakal(index)}
        >
          משוך פק"ל
        </MenuItem>
      </PopupMenu>
    </Paper>
  );
}

function HistoryItemSkeleton() {
  const userProfile = useContext(UserContext);
  return (
    <Paper
      style={{
        margin: "10px",
        width: "100%",
      }}
    >
      {userProfile.deleteHistory && (
        <Button disabled style={{ color: "black" }}>
          <DeleteIcon />
        </Button>
      )}
      <Button style={{ width: "70%", fontSize: "2em" }}>
        <Skeleton width="100%" />
      </Button>
      <Button disabled>
        <MoreVertIcon fontSize="large" />
      </Button>
    </Paper>
  );
}

function HistoryBody() {
  const userProfile = useContext(UserContext);
  const darkMode = useContext(ThemeContext);
  const [haveData, setHaveData] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackBar, setSnackBar] = useState<SnackbarItem | null>(null);

  const loadHistory = () => {
    setHaveData(false);
    api.getHistory((data) => {
      setHistory(data);
      setHaveData(true);
    });
  };

  const handlePullPakal = (index: number) => {
    api.getRecord(
      false,
      history[index].datetime,
      (data: Pakal) =>
        api.setPakal(
          data,
          () => {
            setHaveData(false);
            setSnackBar({ text: 'פק"ל נשמר', severity: "success" });
          },
          (statusCode: number) => {
            if (statusCode === CUSTOM_CODES.NoChange)
              setSnackBar({ text: 'לא קיים שינוי בפק"ל', severity: "warning" });
          }
        ),
      () => {}
    );
  };

  const handleRemoveRecord = (index: number) => {
    api.removeRecord(history[index].datetime, () =>
      setHistory((h) => {
        const newhistory = [...h];
        newhistory.splice(index, 1);
        return newhistory;
      })
    );
  };

  const handleRemoveTimeRange = (hours: number) => {
    api.removeTimeRange(hours, () => {
      loadHistory();
    });
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const submitDeleteDialog = (hours: number) => {
    handleRemoveTimeRange(hours);
    closeDeleteDialog();
  };

  useEffect(() => {
    if (!haveData) loadHistory();
  }, [haveData]);

  const handleDelete = (index: number) => {
    if (confirm("Are you sure you want to permanently delete this pakal?"))
      handleRemoveRecord(index);
  };

  return (
    <>
      <h1 className="history-title">היסטוריית פק"ל</h1>
      <h2 className="history-subtitle">לחץ לפתיחת הפק"ל הרלוונטי</h2>
      <div className={themeClass("history-record", darkMode)}>
        {haveData
          ? history.map((record, index) => (
              <HistoryItem
                key={index}
                record={record}
                index={index}
                handleDelete={handleDelete}
                handlePullPakal={handlePullPakal}
              />
            ))
          : Array(20)
              .fill(0)
              .map((_v, index) => <HistoryItemSkeleton key={index} />)}
      </div>
      {userProfile.deleteHistory && (
        <Button
          className="delete-button"
          variant="contained"
          onClick={() => setDeleteDialogOpen(true)}
        >
          מחק...
        </Button>
      )}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onSubmit={submitDeleteDialog}
      />
      {snackBar && (
        <PopupSnackbar
          open={snackBar !== null}
          onClose={() => setSnackBar(null)}
          severity={snackBar.severity}
        >
          {snackBar.text}
        </PopupSnackbar>
      )}
    </>
  );
}

export default HistoryBody;
