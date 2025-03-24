import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import equipamentPositionHistory from "../../data/equipamentPositionHistory.json";
import EquipamentModel from "../../data/equipamentModel.json";

interface Position {
  lat: number;
  lon: number;
}

export default function MapComponent(equipament: any) {
  const [data, setData] = useState<Position[]>([]);
  console.log(equipament.equipament)

  useEffect(() => {
    const dataObject = equipamentPositionHistory
      .filter((equipamentPosition) => equipamentPosition.equipmentId == equipament.equipament.id)
      .flatMap((equipamentPosition) => equipamentPosition.positions)
      .map((position) => ({ lat: position.lat, lon: position.lon }));

    setData(dataObject);
    console.log(dataObject);
  }, [equipament]);

  if (data.length === 0) {
    return <div>Loading...</div>;

  }
  console.log(equipament)

  const dt = EquipamentModel.find((equipamentModel) => equipamentModel.id == equipament.equipament.equipmentModelId);
  if (!dt) {
    return <div>Equipamento não encontrado</div>;
  }

  return (
    <MapContainer center={[-19.03822, -45.856232]} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((position, index) => (
        <Marker key={index} position={[position.lat, position.lon]}>
          <Popup>
           {dt.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
