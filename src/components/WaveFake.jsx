export default function WaveFake() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", color: "rgba(77,163,255,0.9)" }}>
      {Array.from({ length: 42 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4,
            height: 14 + ((i * 17) % 60),
            borderRadius: 999,
            background: "currentColor",
            opacity: 0.55
          }}
        />
      ))}
    </div>
  );
}
