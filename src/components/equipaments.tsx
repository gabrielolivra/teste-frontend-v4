import { useState } from "react";
import positions from "../../data/equipament.json";
import { IEquipaments } from "../types/equipaments";
import MapComponent from "./map-component";
import Button from "./button";

export default function Equipaments() {
  const [equipaments, setEquipaments] = useState<IEquipaments>({} as IEquipaments);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredEquipaments = positions.filter((equipament: IEquipaments) =>
    equipament.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlerClearData = () => {
    setEquipaments({} as IEquipaments);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-2 p-2">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-black p-2 rounded w-[210px] -mb-10"
        />
        <Button label="Mais recentes" onClick={handlerClearData} className="-mb-10"/>
      </div>
      {equipaments.id && (<p className="text-center">Localizações do equipamento {equipaments.name}</p>)}
      <div className='flex justify-center items-center gap-2 mt-10'>
        <div className="w-[260px] h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-2">
          <ul>
            {filteredEquipaments.map((equipament: IEquipaments) => (
              <li
                key={equipament.id}
                onClick={() => setEquipaments(equipament)}
                className={`p-2 cursor-pointer hover:border-2 hover:border-amber-700 ${equipament.id === equipaments?.id ? 'border-2 border-amber-700' : 'border border-gray-200'} rounded mb-1`}
              >
                <p>{equipament.name}</p>
              </li>
            ))}
          </ul>
        </div>

        <MapComponent {...equipaments} />

      </div>
    </>
  );
}