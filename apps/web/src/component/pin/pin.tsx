import "./pin.scss";

export default function Pin({
  label,
  type = "info",
}: {
  label: string;
  type?: "info" | "success" | "recommanded" | "incoming" | "draft" | "new";
}) {
  return <div className={`extranet-pin extranet-pin-${type}`}>{label}</div>;
}
