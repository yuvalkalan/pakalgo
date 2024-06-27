import { useContext, useEffect, useState } from "react";
import SiteTable from "./SiteTable/SiteTable";
import {
  Mark,
  MarkDialogEntry,
  Net,
  NetDialogEntry,
  PakalError,
  Site,
  SiteDialogEntry,
  SiteViewEntry,
  SnackbarItem,
} from "../Interfaces";
import { ChangedContext, api } from "../../../App";
import { stringCmp } from "../NetViewBody/NetTable/NetTable";
import SkeletonTable from "../Skeletons/SkeletonTable/SkeletonTable";
import { CUSTOM_CODES } from "../../../Api";
import PopupSnackbar from "../../Snackbars/PopupSnackbar";

interface Props {
  changeHasChanged: (newValue: boolean) => void;
}

function SiteViewBody({ changeHasChanged }: Props) {
  const hasChanged = useContext(ChangedContext);
  const [haveData, setHaveData] = useState(false);
  const [entries, setEntries] = useState<SiteViewEntry[]>([]);
  const [nets, setNets] = useState<Net[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [reCreate, setReCreate] = useState(true);
  const [snackBar, setSnackBar] = useState<SnackbarItem | null>(null);

  const loadPakal = () => {
    setHaveData(false);
    api.getPakal(newOnly, (data) => {
      setEntries(data.entries);
      setMarks(data.marks);
      setNets(data.nets);
      setSites(data.sites);
      setReCreate(false);
      setHaveData(true);
    });
  };

  const handleSavePakal = () => {
    api.setPakal(
      { entries: entries, sites: sites, marks: marks, nets: nets },
      () => {
        setHaveData(false);
        changeHasChanged(false);
        setSnackBar({ text: 'פק"ל נשמר', severity: "success" });
      },
      (statusCode: number, data: PakalError[] | null) => {
        console.log(data);
        if (statusCode === CUSTOM_CODES.NoChange) {
          setSnackBar({ text: 'לא קיים שינוי בפק"ל', severity: "warning" });
          changeHasChanged(false);
        } else if (statusCode === CUSTOM_CODES.InvalidPakal)
          if (data)
            setSnackBar({
              text: `זוהו שגיאות בפק"ל (${data.length}) -> ${data[0].error} ${data[0].value}`,
              severity: "error",
            });
          else setSnackBar({ text: "שגיאה לא ידועה", severity: "error" });
      }
    );
  };

  const handleEditSites = (siteEntries: SiteDialogEntry[]) => {
    const newSites = siteEntries.filter(
      (siteEntry) => !sites.map((site) => site.id).includes(siteEntry.site.id)
    );
    const newEntries = entries
      .filter(
        // filter removed sites
        (entry) =>
          siteEntries
            .map((siteEntry) => siteEntry.site.id)
            .includes(entry.siteId)
      )
      .filter(
        // filter removed units
        (entry) =>
          siteEntries
            .find((siteEntry) => entry.siteId === siteEntry.site.id)
            ?.units.includes(entry.name)
      );
    sites.forEach((site) => {
      const siteEntry = siteEntries.find(
        (siteEntry) => site.id === siteEntry.site.id
      );
      siteEntry?.units.forEach((unit) => {
        if (
          !newEntries.find(
            (entry) => entry.name === unit && entry.siteId === siteEntry.site.id
          )
        )
          newEntries.push({
            siteId: siteEntry.site.id,
            name: unit,
            netId: null,
            markId: null,
            notes: "",
            hasChanged: true,
            canEdit: true,
          });
      });
    });
    newSites.forEach((siteEntry) =>
      siteEntry.units.forEach((unit) =>
        newEntries.push({
          siteId: siteEntry.site.id,
          name: unit,
          netId: null,
          markId: null,
          notes: "",
          hasChanged: true,
          canEdit: true,
        })
      )
    );

    setEntries(
      newEntries.sort((a, b) => {
        const a_site =
          siteEntries.find((siteEntry) => siteEntry.site.id === a.siteId)?.site
            .name || "";
        const b_site =
          siteEntries.find((siteEntry) => siteEntry.site.id === b.siteId)?.site
            .name || "";
        return stringCmp(a_site, b_site) + stringCmp(a.name, b.name) * 0.1;
      })
    );
    setSites(siteEntries.map((siteEntry) => siteEntry.site));
    setReCreate(false);
  };

  const handleEditNets = (netEntries: NetDialogEntry[]) => {
    // remove deleted nets from unit.netId
    const deletedNetsIds = nets
      .filter(
        (net) => !netEntries.map((netEntry) => netEntry.id).includes(net.id)
      )
      .map((net) => net.id);
    setEntries((entries) =>
      entries.map((entry) => {
        if (entry.netId && deletedNetsIds.includes(entry.netId))
          return { ...entry, netId: null };
        return entry;
      })
    );
    // add all new nets
    const newNets: Net[] = netEntries
      .filter((netEntry) => !nets.find((net) => net.id === netEntry.id))
      .map((netEntry) => ({
        id: netEntry.id,
        name: netEntry.name,
        encryption: netEntry.encryption,
        ok: netEntry.ok,
        frequency: netEntry.frequency,
        group: netEntry.group,
        hasChanged: true,
      }));
    // if edit net => add as hasChaged=True. else don't changed
    nets.forEach((net) => {
      const newNet = netEntries.find((netEntry) => net.id === netEntry.id);
      if (!newNet) return null;
      if (
        newNet.name === net.name &&
        newNet.encryption === net.encryption &&
        newNet.ok === net.ok &&
        newNet.frequency === net.frequency &&
        newNet.group === net.group
      )
        newNets.push({ ...net });
      else
        newNets.push({
          id: newNet.id,
          name: newNet.name,
          encryption: newNet.encryption,
          ok: newNet.ok,
          frequency: newNet.frequency,
          group: newNet.group,
          hasChanged: true,
        });
    });
    setNets(newNets.sort((a, b) => stringCmp(a.name, b.name)));
  };

  const handleEditMarks = (markEntries: MarkDialogEntry[]) => {
    // remove deleted marks from unit.markId
    const deletedMarksIds = marks
      .filter(
        (mark) =>
          !markEntries.map((markEntry) => markEntry.id).includes(mark.id)
      )
      .map((net) => net.id);
    setEntries((entries) =>
      entries.map((entry) => {
        if (entry.markId && deletedMarksIds.includes(entry.markId))
          return { ...entry, markId: null };
        return entry;
      })
    );
    setMarks(
      markEntries.map((markEntry) => ({
        id: markEntry.id,
        name: markEntry.name,
        color: markEntry.color,
      }))
    );
  };

  const handleUndo = () => {
    changeHasChanged(false);
    setHaveData((v) => !v);
    setReCreate((v) => !v);
  };

  const handleChange = () => {
    changeHasChanged(true);
  };

  const handleNewOnly = () => {
    const isConfirmed =
      !hasChanged ||
      window.confirm(
        "Changes you made may not be saved.\nAre you sure you want to proceed?"
      );
    if (isConfirmed) {
      setNewOnly((v) => !v);
      handleUndo();
    }
  };

  useEffect(() => {
    if (!haveData) {
      loadPakal();
    }
  }, [haveData]);

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasChanged) event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanged]);

  return (
    <>
      {reCreate &&
        (haveData ? (
          <SiteTable
            entries={entries}
            marks={marks}
            nets={nets}
            sites={sites}
            newOnly={newOnly}
            handleEditSites={handleEditSites}
            handleEditNets={handleEditNets}
            handleEditMarks={handleEditMarks}
            handleSavePakal={handleSavePakal}
            handleUndo={handleUndo}
            handleChange={handleChange}
            handleNewOnly={handleNewOnly}
          />
        ) : (
          <SkeletonTable rows={20} />
        ))}
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

export default SiteViewBody;
