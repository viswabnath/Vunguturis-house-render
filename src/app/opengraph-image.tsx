import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Link preview (WhatsApp, iMessage, Slack, social). Generated once at build time.
export const alt = "Vunguturi Residence: design options and the build in 3D, by OneMarK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const dir = join(process.cwd(), "src/app/_og");
  const [house, logo] = await Promise.all([readFile(join(dir, "house.png")), readFile(join(dir, "logo-dark.png"))]);
  const src = (buf: Buffer) => `data:image/png;base64,${buf.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f5f6", padding: "64px 56px 56px 80px" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#16191d", lineHeight: 1.02, letterSpacing: -2 }}>Vunguturi</div>
            <div style={{ fontSize: 76, fontWeight: 700, color: "#16191d", lineHeight: 1.02, letterSpacing: -2 }}>Residence</div>
            <div style={{ fontSize: 30, color: "#464d58", marginTop: 28, lineHeight: 1.35, maxWidth: 520 }}>
              Design options and the build, stage by stage, in 3D.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ fontSize: 22, color: "#636b77" }}>Site and 3D models by</div>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={src(logo)} width={160} height={56} />
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img src={src(house)} width={473} height={519} style={{ alignSelf: "center" }} />
      </div>
    ),
    size
  );
}
