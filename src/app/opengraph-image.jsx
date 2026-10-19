import { ImageResponse } from "next/og";
import { OgTemplate, ogSize, ogAlt } from "@/components/seo/og";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(<OgTemplate />, { ...ogSize });
}
