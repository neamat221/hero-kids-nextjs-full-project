export const ogSize = { width: 1200, height: 630 };

export const ogAlt = "Hero Kids — Toys, Games & Kids Accessories";

export function OgTemplate() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #ff7a45 0%, #ff5c8a 45%, #8b5cf6 100%)",
        padding: "72px 80px",
        color: "white",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -80,
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.16)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -140,
          left: -60,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          display: "flex",
        }}
      />

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            background: "rgba(255,255,255,0.22)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 34,
            fontWeight: 800,
          }}
        >
          HK
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
            Hero Kids
          </div>
          <div style={{ fontSize: 20, opacity: 0.85 }}>
            Toys • Games • Accessories
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Play. Learn. Grow.
        </div>
        <div style={{ fontSize: 34, opacity: 0.92, maxWidth: 860 }}>
          Safe, creative and educational toys that make every childhood moment
          special.
        </div>
      </div>

      {/* Bottom chips */}
      <div style={{ display: "flex", gap: 16 }}>
        {["Free Delivery", "100% Safe Materials", "500+ Happy Kids"].map(
          (chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "14px 26px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.2)",
                fontSize: 24,
                fontWeight: 600,
              }}
            >
              {chip}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
