import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import equipamentPositionHistory from "../../data/equipamentPositionHistory.json";
import EquipamentModel from "../../data/equipamentModel.json";
import { IEquipaments } from "../types/equipaments";

interface Position {
  lat: number;
  lon: number;
  date: string; 
}

export default function MapComponent(equipament: IEquipaments) {
  const [data, setData] = useState<Position[]>([]);
  const [latestDate, setLatestDate] = useState<string | null>(null);

  useEffect(() => {
    let latestDateFound: string | null = null;

    if (equipament.id) {
      const dataObject = equipamentPositionHistory
        .filter((equipamentPosition) => equipamentPosition.equipmentId == equipament.id)
        .flatMap((equipamentPosition) => equipamentPosition.positions)
        .map((position) => ({ lat: position.lat, lon: position.lon, date: position.date }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setData(dataObject);

      if (dataObject.length > 0) {
        latestDateFound = dataObject[0].date;
      }
    } else {
      const groupedData = Object.values(
        equipamentPositionHistory.reduce((acc, equipamentPosition) => {
          if (!acc[equipamentPosition.equipmentId]) {
            const sortedPositions = equipamentPosition.positions.sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            acc[equipamentPosition.equipmentId] = sortedPositions[0];
          }
          return acc;
        }, {} as Record<string, Position>)
      );
      setData(groupedData.map((position) => ({ lat: position.lat, lon: position.lon, date: position.date })));

      if (groupedData.length > 0) {
        latestDateFound = groupedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date;
      }
    }
    setLatestDate(latestDateFound);
  }, [equipament]);

  if (data.length === 0) {
    return <div className="w-full flex items-center justify-center"></div>;
  }

  const descriptionEquipament = equipament.id
    ? EquipamentModel.find((equipamentModel) => equipamentModel.id == equipament.equipmentModelId)
    : null;

  return (
    <>
      <MapContainer
        center={[data[0].lat, data[0].lon]}
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((position, index) => (
          <Marker key={index} position={[position.lat, position.lon]}>
            <Popup>
              {descriptionEquipament
                ? descriptionEquipament.name
                : `Equipamento ${index + 1}`} <br />
              {latestDate && <strong>Última atualização: {latestDate}</strong>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
