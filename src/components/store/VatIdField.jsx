import React, { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLang } from "@/lib/i18n";

// Inline VIES validation. onResult({ validated, valid, vat_id, company_name, checked_at, reference })
export default function VatIdField({ value, onChange, onResult }) {
  const { t } = useLang();
  const [state, setState] = useState("idle"); // idle | loading | valid | invalid

  const validate = async () => {
    if (!value) return;
    setState("loading");
    try {
      const res = await base44.functions.invoke("validateVatId", { vat_id: value });
      const data = res.data;
      if (data.valid) {
        setState("valid");
        onResult({ validated: true, valid: true, vat_id: data.vat_id, company_name: data.company_name, checked_at: data.checked_at, reference: data.reference });
      } else {
        setState("invalid");
        onResult({ validated: data.available === true, valid: false, vat_id: data.vat_id || value });
      }
    } catch {
      setState("invalid");
      onResult({ validated: false, valid: false, vat_id: value });
    }
  };

  return (
    <div>
      <Label htmlFor="vat-id" className="text-xs font-mono text-[#6B7075]">{t("checkout.vatId")} *</Label>
      <div className="flex gap-2 mt-1">
        <Input
          id="vat-id"
          value={value}
          onChange={(e) => { onChange(e.target.value); setState("idle"); onResult(null); }}
          placeholder="DE123456789"
          className="rounded-none font-mono"
        />
        <Button type="button" onClick={validate} disabled={state === "loading" || !value} className="bg-[#1A1C1E] hover:bg-black rounded-none shrink-0">
          {state === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : t("checkout.validateVat")}
        </Button>
      </div>
      {state === "loading" && <p className="text-xs text-[#6B7075] mt-1.5 font-mono">{t("checkout.vatValidating")}</p>}
      {state === "valid" && (
        <p className="text-xs text-[#2E7D32] mt-1.5 flex items-start gap-1.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {t("checkout.vatValid")}
        </p>
      )}
      {state === "invalid" && (
        <div className="text-xs mt-1.5">
          <p className="text-red-600 flex items-start gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> {t("checkout.vatInvalid")}</p>
          <p className="text-[#6B7075] mt-1">{t("checkout.vatInvalidHint")}</p>
        </div>
      )}
    </div>
  );
}