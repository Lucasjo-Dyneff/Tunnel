"use client";

import { CSSProperties } from "react";
import { Check } from "lucide-react";
import "./stepNav.scss";

export default function StepNav({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number;
  onStepClick?: (step: number) => void;
}) {
  const total = steps.length;
  const active = Math.min(Math.max(current, 1), total);
  const progress = total > 1 ? (active - 1) / (total - 1) : 0;
  const greenStop = active > 1 ? ((active - 2) / (active - 1)) * 100 : 0;

  // const steps = ["Votre logement", "Les offres", "Vos informations", "Signature"];
  // const [current, setCurrent] = useState(3);
  // <StepNav steps={steps} current={current} onStepClick={setCurrent} />
  // pour passer à l'étape suivante : onClick={() => setCurrent((s) => Math.min(s + 1, steps.length))}

  return (
    <nav className="extranet-stepNav" aria-label="Étapes">
      <ol
        className="extranet-stepNav-list"
        style={
          {
            "--step-count": total,
            "--step-progress": progress,
            "--step-green-stop": `${greenStop}%`,
          } as CSSProperties
        }
      >
        {steps.map((label, index) => {
          const step = index + 1;
          const state =
            step < active ? "done" : step === active ? "active" : "todo";
          const clickable = state === "done" && !!onStepClick;

          const content = (
            <>
              <span className="extranet-stepNav-node">
                {state === "done" ? (
                  <Check size="55%" strokeWidth={3} aria-hidden />
                ) : (
                  step
                )}
              </span>
              <span className="extranet-stepNav-label">{label}</span>
            </>
          );

          return (
            <li
              key={label}
              className={`extranet-stepNav-step extranet-stepNav-step__${state}`}
              aria-current={state === "active" ? "step" : undefined}
            >
              {clickable ? (
                <button
                  type="button"
                  className="extranet-stepNav-button"
                  onClick={() => onStepClick(step)}
                  aria-label={`Revenir à l'étape ${step} : ${label}`}
                >
                  {content}
                </button>
              ) : (
                <div className="extranet-stepNav-button">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
