"use client";

import Image from "next/image";
import { useState } from "react";
import StepNav from "../stepNav/stepNav";
import Button from "../button/button";
import { Phone } from "lucide-react";
import "./header.scss";

const steps = ["Votre logement", "Les offres", "Vos informations", "Signature"];

export default function Header() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="extranet-header">
      <Image src="/logo.png" width={120} height={55} alt="logo" />
      <StepNav steps={steps} current={current} onStepClick={setCurrent} />
      <Button label="Être rappelé" variant="usefulness" logo={Phone} />
    </div>
  );
}
