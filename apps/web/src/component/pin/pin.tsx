import { LucideIcon } from "lucide-react";
import "./pin.scss";

export default function Pin({
  label,
  logo: Icon,
  type = "info",
  className,
}: {
  logo?: LucideIcon;
  label: string;
  className?: string;
  type?: "info" | "success" | "recommanded" | "incoming" | "draft" | "new";
}) {
  return (
    <div className={`${className} extranet-pin extranet-pin-${type}`}>
      {Icon && <Icon size={14} />}
      {label}
    </div>
  );
}
