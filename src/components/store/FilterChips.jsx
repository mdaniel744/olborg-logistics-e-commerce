import React from "react";
import { X } from "lucide-react";
import { useLang } from "@/lib/i18n";

function Chip({ active, onClick, children, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-mono font-semibold border transition-colors inline-flex items-center gap-1 ${
        active
          ? "bg-[#1A1C1E] text-white border-[#1A1C1E]"
          : "bg-white text-[#3A3E42] border-[#E0E2E5] hover:border-[#1A1C1E]"
      } ${disabled ? "opacity-50 cursor-default" : ""}`}
    >
      {children}
      {active && !disabled && <X className="w-3 h-3" />}
    </button>
  );
}

export default function FilterChips({ size, setSize, type, setType, condition, setCondition, locked }) {
  const { t } = useLang();
  const toggle = (val, cur, set) => set(cur === val ? null : val);

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filters">
      {["10ft", "20ft", "40ft"].map((s) => (
        <Chip key={s} active={size === s} disabled={!!locked.size} onClick={() => toggle(s, size, setSize)}>
          {s}
        </Chip>
      ))}
      <span className="w-px bg-[#E0E2E5] mx-1" aria-hidden="true" />
      {["standard", "high_cube", "open_side"].map((ty) => (
        <Chip key={ty} active={type === ty} disabled={!!locked.type} onClick={() => toggle(ty, type, setType)}>
          {t(`common.${ty}`)}
        </Chip>
      ))}
      <span className="w-px bg-[#E0E2E5] mx-1" aria-hidden="true" />
      {["new", "used"].map((c) => (
        <Chip key={c} active={condition === c} disabled={!!locked.condition} onClick={() => toggle(c, condition, setCondition)}>
          {t(`common.${c}`)}
        </Chip>
      ))}
    </div>
  );
}