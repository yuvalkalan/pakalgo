import { useEffect, useState } from "react";
import NetTable from "./NetTable/NetTable";
import { Mark, Pakal, Site, NetViewCell, NetViewEntry } from "../Interfaces";
import SkeletonTable from "../Skeletons/SkeletonTable/SkeletonTable";
import { api } from "../../../App";

function convertSiteToNet({ entries, nets, marks, sites }: Pakal) {
  const emptyCell: NetViewCell = { value: "", hasChanged: false, markId: null };
  const netEntries: NetViewEntry[] = nets.map((n) => {
    return {
      net: { ...n },
      cells: [
        ...Array.from({ length: sites.length }, () => {
          return { ...emptyCell };
        }),
      ],
    };
  });
  entries.forEach((cell) => {
    const siteIndex = sites.findIndex((site) => site.id === cell.siteId);
    const currentEntry = netEntries.find(
      (entry) => entry.net.id === cell.netId
    );
    if (!currentEntry || siteIndex === -1) {
      return undefined;
    }
    const currentCell = currentEntry.cells[siteIndex];
    currentEntry.cells[siteIndex] = {
      value: currentCell.value
        ? currentCell.value + ", " + cell.name
        : cell.name,
      hasChanged: cell.hasChanged || currentCell.hasChanged,
      markId: cell.markId ? cell.markId : currentCell.markId,
    };
  });
  return {
    sites: sites,
    entries: netEntries.filter((netEntry) =>
      netEntry.cells.some((cell) => cell.value !== "")
    ),
    marks: marks,
  };
}

function NetViewBody() {
  const [haveData, setHaveData] = useState(false);
  const [entries, setEntries] = useState<NetViewEntry[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [newOnly, setNewOnly] = useState<boolean>(false);

  const loadPakal = () => {
    setHaveData(false);
    api.getPakal(newOnly, (data) => {
      const netData = convertSiteToNet(data);
      setEntries(netData.entries);
      setMarks(netData.marks);
      setSites(netData.sites);
      setHaveData(true);
    });
  };

  useEffect(() => {
    if (!haveData) {
      loadPakal();
    }
  }, [haveData]);

  return haveData ? (
    <NetTable
      entries={entries}
      marks={marks}
      sites={sites}
      newOnly={newOnly}
      handleNewOnly={() => {
        setNewOnly((v) => !v);
        setHaveData(false);
      }}
    />
  ) : (
    <SkeletonTable rows={20} />
  );
}
export default NetViewBody;
