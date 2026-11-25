import { ReactNode } from "react";
import { Info, LucideIcon } from "lucide-react";
import "./bubble.scss";

export default function Bubble({
  title,
  children,
  logo: Icon = Info,
  type = "neutral",
}: {
  title: string;
  children?: ReactNode;
  logo?: LucideIcon;
  type?: "neutral" | "info" | "success" | "warning";
}) {
  return (
    <div className={`extranet-bubble extranet-bubble-${type}`}>
      <h4
        className={`extranet-bubble-title ${type === "success" ? "extranet-bubble-title__success" : ""}`}
      >
        {type === "info" && Icon && <Icon size={16} color="#05688c" />}
        {title}
      </h4>
      <p className="extranet-bubble__text">{children}</p>
    </div>
  );
}
