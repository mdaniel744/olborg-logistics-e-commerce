import React from "react";
import { X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { useLang } from "@/lib/i18n";

function Chip({ active, onClick, children, disabled, eyebrow, image }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`relative box-border inline-flex min-h-[112px] w-[104px] snap-start shrink-0 flex-col items-center justify-end border-b-[3px] px-2 pb-2 pt-1 text-center transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:z-10 hover:scale-[1.035] hover:shadow-[0_10px_24px_rgba(26,28,30,0.12)] motion-reduce:transform-none sm:min-h-[124px] sm:w-[138px] sm:border-b-4 sm:px-3 sm:pb-3 sm:pt-2 lg:min-h-[132px] lg:w-[156px] ${
        active
          ? "border-[#F5A623] bg-[#FFF0D2] text-[#1A1C1E]"
          : "border-transparent bg-transparent text-[#1A1C1E] hover:border-[#E0A12D] hover:bg-[#FFF8EA]"
      } ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      <span className="relative h-14 w-[88px] shrink-0 sm:h-16 sm:w-28 lg:h-20 lg:w-32" aria-hidden="true">
        <Image
          src={image}
          alt=""
          width={256}
          height={160}
          sizes="(min-width: 1024px) 128px, (min-width: 640px) 112px, 96px"
          className="h-full w-full object-contain drop-shadow-[0_5px_5px_rgba(26,28,30,0.22)]"
        />
      </span>
      <span className="mt-0.5 min-w-0 sm:mt-1">
        <span className={`block font-mono text-[8px] uppercase tracking-[0.13em] sm:text-[9px] sm:tracking-[0.16em] ${active ? "text-[#9A6200]" : "text-[#7A6A4C]"}`}>
          {eyebrow}
        </span>
        <span className="mt-1 block whitespace-nowrap text-xs font-bold leading-none sm:text-sm">{children}</span>
      </span>
      {active && !disabled && <X className="absolute right-1.5 top-1.5 h-3.5 w-3.5 text-[#9A6200] sm:right-2 sm:top-2 sm:h-4 sm:w-4" />}
    </button>
  );
}

export default function FilterChips({ size, setSize, type, setType, condition, setCondition, locked }) {
  const { t } = useLang();
  const toggle = (val, cur, set) => set(cur === val ? null : val);
  const sizeImages = {
    "10ft": "/images/filters/filter-container-10ft.png",
    "20ft": "/images/filters/filter-container-20ft.png",
    "40ft": "/images/filters/filter-container-40ft.png",
  };
  const typeImages = {
    standard: "/images/filters/filter-container-20ft.png",
    high_cube: "/images/filters/filter-container-high-cube.png",
    open_side: "/images/filters/filter-container-open-side.png",
  };
  const conditionImages = {
    new: "/images/filters/filter-container-20ft.png",
    used: "/images/filters/filter-container-used.png",
  };

  return (
    <div className="flex w-max flex-nowrap items-stretch gap-1.5 sm:gap-2" role="group" aria-label="Filters">
      {["10ft", "20ft", "40ft"].map((s) => (
        <Chip
          key={s}
          active={size === s}
          disabled={!!locked.size}
          onClick={() => toggle(s, size, setSize)}
          eyebrow={t("common.size")}
          image={sizeImages[s]}
        >
          {s}
        </Chip>
      ))}
      <span className="mx-1 w-px shrink-0 self-stretch bg-[#E0E2E5] sm:mx-2" aria-hidden="true" />
      {["standard", "high_cube", "open_side"].map((ty) => (
        <Chip
          key={ty}
          active={type === ty}
          disabled={!!locked.type}
          onClick={() => toggle(ty, type, setType)}
          eyebrow={t("common.type")}
          image={typeImages[ty]}
        >
          {t(`common.${ty}`)}
        </Chip>
      ))}
      <span className="mx-1 w-px shrink-0 self-stretch bg-[#E0E2E5] sm:mx-2" aria-hidden="true" />
      {["new", "used"].map((c) => (
        <Chip
          key={c}
          active={condition === c}
          disabled={!!locked.condition}
          onClick={() => toggle(c, condition, setCondition)}
          eyebrow={t("common.condition")}
          image={conditionImages[c]}
        >
          {t(`common.${c}`)}
        </Chip>
      ))}
    </div>
  );
}
