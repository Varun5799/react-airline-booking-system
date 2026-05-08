const airlineStyles = {
  "Air India": { code: "AI", color: "#d82f2f" },
  AI: { code: "AI", color: "#d82f2f" },
  IndiGo: { code: "6E", color: "#143f8f" },
  "6E": { code: "6E", color: "#143f8f" },
  Vistara: { code: "UK", color: "#4b286d" },
  "UK": { code: "UK", color: "#4b286d" },
  "SpiceJet": { code: "SG", color: "#eb8d00" },
  SG: { code: "SG", color: "#eb8d00" },
  "Akasa Air": { code: "QP", color: "#0b7285" },
  Akasa: { code: "QP", color: "#0b7285" },
  QP: { code: "QP", color: "#0b7285" },
  Emirates: { code: "EK", color: "#d51007" },
  EK: { code: "EK", color: "#d51007" },
  "AirAsia": { code: "I5", color: "#f44336" },
  "Air Asia": { code: "I5", color: "#f44336" },
  I5: { code: "I5", color: "#f44336" },
  "Jet Airways": { code: "9W", color: "#1d4ed8" },
  "9W": { code: "9W", color: "#1d4ed8" },
  "Air India Express": { code: "IX", color: "#c8102e" },
  IX: { code: "IX", color: "#c8102e" },
  "Air Arabia": { code: "G9", color: "#e62521" },
  G9: { code: "G9", color: "#e62521" },
  "Qatar Airways": { code: "QR", color: "#5e5e5e" },
  QR: { code: "QR", color: "#5e5e5e" },
  "Demo Airways": { code: "DA", color: "#0f766e" },
  DA: { code: "DA", color: "#0f766e" }
};

const normalizedStyles = Object.fromEntries(
  Object.entries(airlineStyles).map(([key, value]) => [key.toLowerCase(), value])
);

function getLogoKey(airline, code) {
  if (code) {
    return code.toString().trim().toLowerCase();
  }

  return airline ? airline.toString().trim().toLowerCase() : "";
}

export default function AirlineLogo({ airline = "", code = "" }) {
  const key = getLogoKey(airline, code);
  const logo = normalizedStyles[key] || {
    code: key ? key.slice(0, 2).toUpperCase() : "AL",
    color: "#0b4b78"
  };

  return (
    <span className="airline-logo" style={{ backgroundColor: logo.color }} title={airline || code}>
      {logo.code}
    </span>
  );
}
