import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import equipamentPositionHistory from "../../data/equipamentPositionHistory.json";
import EquipamentModel from "../../data/equipamentModel.json";
import { IEquipaments } from "../types/equipaments";
import dataEquipaments from "../../data/equipament.json";
import { customIcons, defaultIcon } from "../../contracts/icons";
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

  const routeCoordinates = data.map((position) => [position.lat, position.lon]);
  return (
    <>
      <MapContainer
        center={[data[0].lat, data[0].lon]}
        zoom={11}
        scrollWheelZoom={true}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((position, index) => {
          const equipamentName = descriptionEquipament
            ? descriptionEquipament.name
            : `Equipamento ${index + 1} - ${dataEquipaments[index]?.name}`;

          // Escolha o ícone com base no nome do equipamento
          const markerIcon = customIcons[equipamentName] || defaultIcon;
           console.log(equipamentName)
          return (
            <Marker key={index} position={[position.lat, position.lon]} icon={markerIcon}>
              <Popup>
                <div className="p-4 bg-white rounded text-gray-800">
                  <h3 className="text-lg font-bold text-blue-600">{equipamentName}</h3>
                  {latestDate && equipament && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Última atualização:</strong> {latestDate.replace("T01:00:00.000Z", "")}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mt-2">
                    <strong>Coordenadas:</strong> {position.lat.toFixed(5)}, {position.lon.toFixed(5)}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {equipament.id && <Polyline positions={routeCoordinates} />}
      </MapContainer>
    </>
  );
}