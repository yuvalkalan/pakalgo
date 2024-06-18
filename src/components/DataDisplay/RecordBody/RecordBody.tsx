import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mark, Net, Pakal, Site, SiteViewEntry } from "../Interfaces";
import RecordTable from "./RecordTable";
import HistoryNotFound from "./RecordNotFound";
import { api } from "../../../App";
import SkeletonTable from "../Skeletons/SkeletonTable/SkeletonTable";

function RecordBody() {
  const { datetime } = useParams();
  const [notFound, setNotFound] = useState(false);
  const [entries, setEntries] = useState<SiteViewEntry[]>([]);
  const [nets, setNets] = useState<Net[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [newOnly, setNewOnly] = useState(false);
  const [haveData, setHaveData] = useState(false);
  const [reCreate, setReCreate] = useState(true);

  const loadPakal = () => {
    setHaveData(false);
    api.getRecord(
      newOnly,
      datetime,
      (data: Pakal) => {
        setEntries(data.entries);
        setNets(data.nets);
        setMarks(data.marks);
        setSites(data.sites);
        setReCreate(false);
        setHaveData(true);
      },
      (_statusCode: number) => {
        setNotFound(true);
        setHaveData(true);
      }
    );
  };

  useEffect(() => {
    if (!haveData) loadPakal();
  }, [haveData]);

  useEffect(() => {
    if (!reCreate) setReCreate(true);
  }, [reCreate]);

  return (
    reCreate &&
    (notFound ? (
      <HistoryNotFound />
    ) : haveData ? (
      <RecordTable
        entries={entries}
        marks={marks}
        nets={nets}
        sites={sites}
        newOnly={newOnly}
        handleNewOnly={() => {
          setNewOnly((v) => !v);
          setHaveData(false);
          setReCreate(true);
        }}
      />
    ) : (
      <SkeletonTable rows={20} />
    ))
  );
}

export default RecordBody;
