import { NextResponse } from "next/server";
import { CATEGORY_OVERLAYS } from "@/src/prompts/index";

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "saas-landing": "Value prop, pricing, free trial CTA, social proof",
  healthcare: "Trust, accessibility, calming design, compliance",
  ecommerce: "Product display, cart flow, trust signals, urgency",
  portfolio: "Work showcase, case studies, personal brand",
  startup: "Problem/solution clarity, traction signals, waitlist",
  agency: "Capability demonstration, process, case studies",
};

export async function GET() {
  const categories = Object.keys(CATEGORY_OVERLAYS).map((key) => ({
    id: key,
    label: key
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    description: CATEGORY_DESCRIPTIONS[key] || "",
  }));

  return NextResponse.json(categories);
}
