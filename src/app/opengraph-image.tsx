import { ImageResponse } from "next/og";
import { currentRole, profile } from "@/lib/content";

export const dynamic = "force-static";
export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0c0e",
          color: "#e8e6e1",
          padding: "72px 80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#6b7079" }}>
          <span style={{ color: "#7fd4a6" }}>~/khubaib</span>&nbsp;$ whoami
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -2, fontFamily: "sans-serif" }}>{profile.name}</div>
          <div style={{ display: "flex", marginTop: 20, fontSize: 32, color: "#9a9fa8" }}>
            {`${profile.role} · ${profile.focus.slice(0, 4).join(" · ")}`}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6b7079", borderTop: "1px solid #2a2e34", paddingTop: 28 }}>
          <span>{currentRole ? `${currentRole.title} · ${currentRole.company}` : profile.role}</span>
          <span style={{ color: "#7fd4a6" }}>● all systems nominal</span>
        </div>
      </div>
    ),
    size,
  );
}
