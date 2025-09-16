import React from "react";
import { Car, Settings } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  number: string;
  type: string;
  imageUrl: string;
}

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Toyota Innova",
    number: "KA 25 AB 1234",
    type: "Car",
    imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600", // replace with DB/Cloud URL
  },
  {
    id: "2",
    name: "Ashok Leyland Truck",
    number: "KA 25 XY 9876",
    type: "Truck",
    imageUrl: "https://images.unsplash.com/photo-1616788071659-4a2f8d6db5b8?w=600",
  },
];

export default function VehiclesPage() {
  return (
    <div className="p-6 grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="relative h-40">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
              {vehicle.type}
            </span>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500" />
              {vehicle.name}
            </h2>
            <p className="text-sm text-gray-500">{vehicle.number}</p>

            <div className="mt-4 flex justify-between items-center">
              <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg shadow hover:opacity-90 transition">
                View Details
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Settings className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}