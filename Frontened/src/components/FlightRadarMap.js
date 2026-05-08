import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function markerHtml(flight, selected) {
  return `
    <div class="fr24-marker ${selected ? "fr24-marker-selected" : ""}" style="transform: rotate(${flight.heading || 0}deg)">
      <span></span>
    </div>
  `;
}

export default function FlightRadarMap({ flights, selectedFlight, onSelectFlight }) {
  const mapRef = useRef(null);
  const mapElementRef = useRef(null);
  const markerLayerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current && mapElementRef.current) {
      mapRef.current = L.map(mapElementRef.current, {
        zoomControl: true,
        attributionControl: true
      }).setView([21.1, 76.8], 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 12,
        attribution: "&copy; OpenStreetMap contributors"
      }).addTo(mapRef.current);

      markerLayerRef.current = L.layerGroup().addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerLayerRef.current) {
      return;
    }

    markerLayerRef.current.clearLayers();

    const validFlights = flights.filter((flight) => flight.latitude && flight.longitude);

    validFlights.forEach((flight) => {
      const selected = selectedFlight && selectedFlight.flightNumber === flight.flightNumber;
      const icon = L.divIcon({
        className: "fr24-div-icon",
        html: markerHtml(flight, selected),
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker([flight.latitude, flight.longitude], { icon })
        .bindPopup(
          `<strong>${flight.flightNumber || "Flight"}</strong><br>${flight.airline || ""}<br>${flight.altitude || "N/A"} ft`
        )
        .on("click", () => onSelectFlight(flight));

      markerLayerRef.current.addLayer(marker);
    });

    if (validFlights.length > 0) {
      const bounds = L.latLngBounds(validFlights.map((flight) => [flight.latitude, flight.longitude]));
      mapRef.current.fitBounds(bounds.pad(0.35), { animate: true });
    }
  }, [flights, selectedFlight, onSelectFlight]);

  return <div className="leaflet-radar-map" ref={mapElementRef} />;
}
