"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import StepNav from "../stepNav/stepNav";
import Button from "../button/button";
import { Phone } from "lucide-react";
import "./header.scss";

const steps = [
  { label: "Votre logement", path: "/" },
  { label: "Les offres", path: "/offres" },
  { label: "Vos informations", path: "/informations" },
  { label: "Signature", path: "/signature" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const index = steps.findIndex((s) => s.path === pathname);
  const current = index === -1 ? 1 : index + 1;

  return (
    <div className="extranet-header">
      <Image src="/logo.png" width={120} height={55} alt="logo" />
      <StepNav
        steps={steps.map((s) => s.label)}
        current={current}
        onStepClick={(step) => router.push(steps[step - 1].path)}
      />
      <Button label="Être rappelé" variant="usefulness" logo={Phone} />
    </div>
  );
}
