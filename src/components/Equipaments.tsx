import { useState } from "react";
import positions from "../../data/equipament.json";
import { IEquipaments} from "../types/equipaments";
import MapComponent from "./mapComponent";


export default function Equipaments() {
    const [equipaments, setEquipaments] = useState<IEquipaments | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const filteredEquipaments = positions.filter((equipament: IEquipaments) =>
        equipament.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='flex justify-center items-center mt-10'>
            <div className="w-[260px] h-[400px] overflow-y-auto border border-gray-300 rounded-lg p-2">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-[180px] p-2 border border-gray-300 rounded fixed -mt-14"
                />
                <ul>
                    {filteredEquipaments.map((equipament: IEquipaments) => (
                        <li
                            key={equipament.id}
                            onClick={() => setEquipaments(equipament)}
                            className={`p-2 cursor-pointer ${equipament.id === equipaments?.id ? 'border-2 border-amber-700' : 'border border-gray-200'} rounded mb-1`}
                        >
                            <p>{equipament.name}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <MapComponent equipament={equipaments ? equipaments : ''} />
        </div>
    );
}