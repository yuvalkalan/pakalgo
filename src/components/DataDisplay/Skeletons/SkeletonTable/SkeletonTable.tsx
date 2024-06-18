import { Skeleton } from "@mui/material";

interface Props {
  rows: number;
}

function SkeletonTable({ rows }: Props) {
  return (
    <div style={{ display: "block" }} className="main-table-container">
      {Array(rows)
        .fill(0)
        .map((_v, index) => (
          <Skeleton
            key={index}
            style={{
              width: "100%",
              fontSize: "2em",
            }}
          />
        ))}
    </div>
  );
}

export default SkeletonTable;
