import { useState, useEffect } from "react";
import { Vehicle, Trip, Expense } from "../types";
import { useAuth } from "../contexts/AuthContext";

// Mock data
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    owner_id: "1",
    vehicle_number: "MH12AB1234",
    vehicle_type: "truck",
    make: "Tata",
    model: "LPT 407",
    year: 2022,
    fuel_type: "diesel",
    current_mileage: 45000,
    insurance_expiry: "2024-12-15",
    service_due_date: "2024-06-15",
    permit_expiry: "2024-08-30",
    assigned_driver_id: "2",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    owner_id: "3",
    vehicle_number: "MH14CD5678",
    vehicle_type: "car",
    make: "Honda",
    model: "City",
    year: 2023,
    fuel_type: "petrol",
    current_mileage: 12000,
    insurance_expiry: "2024-11-20",
    service_due_date: "2024-07-10",
    status: "active",
    created_at: "2024-01-15T00:00:00Z",
  },
];

const mockTrips: Trip[] = [
  {
    id: "1",
    vehicle_id: "1",
    driver_id: "2",
    start_mileage: 44500,
    end_mileage: 45000,
    start_location: "Mumbai",
    end_location: "Pune",
    trip_date: "2024-05-20",
    fuel_consumed: 35,
    goods_carried: "Electronics",
    trip_purpose: "Delivery",
    created_at: "2024-05-20T00:00:00Z",
  },
  {
    id: "2",
    vehicle_id: "2",
    driver_id: "3",
    start_mileage: 11800,
    end_mileage: 12000,
    start_location: "Home",
    end_location: "Office",
    trip_date: "2024-05-21",
    fuel_consumed: 12,
    trip_purpose: "Commute",
    created_at: "2024-05-21T00:00:00Z",
  },
];

const mockExpenses: Expense[] = [
  {
    id: "1",
    vehicle_id: "1",
    user_id: "2",
    category: "fuel",
    amount: 3500,
    description: "Fuel refill at Highway Petrol Pump",
    expense_date: "2024-05-20",
    created_at: "2024-05-20T00:00:00Z",
  },
  {
    id: "2",
    vehicle_id: "2",
    user_id: "3",
    category: "maintenance",
    amount: 1500,
    description: "Oil change and filter replacement",
    expense_date: "2024-05-15",
    created_at: "2024-05-15T00:00:00Z",
  },
];

export function useVehicles() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      let userVehicles = mockVehicles;
      let userTrips = mockTrips;
      let userExpenses = mockExpenses;

      if (user.role === "personal") {
        userVehicles = mockVehicles.filter((v) => v.owner_id === user.id);
        userTrips = mockTrips.filter((t) =>
          userVehicles.some((v) => v.id === t.vehicle_id)
        );
        userExpenses = mockExpenses.filter((e) =>
          userVehicles.some((v) => v.id === e.vehicle_id)
        );
      } else if (user.role === "driver") {
        userVehicles = mockVehicles.filter(
          (v) => v.assigned_driver_id === user.id
        );
        userTrips = mockTrips.filter((t) => t.driver_id === user.id);
        userExpenses = mockExpenses.filter((e) => e.user_id === user.id);
      }

      setVehicles(userVehicles);
      setTrips(userTrips);
      setExpenses(userExpenses);
    }
    setLoading(false);
  }, [user]);

  const addVehicle = (vehicle: Omit<Vehicle, "id" | "created_at">) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  const editVehicle = (updatedVehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
  };

  const addTrip = (trip: Omit<Trip, "id" | "created_at">) => {
    const newTrip: Trip = {
      ...trip,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setTrips((prev) => [...prev, newTrip]);

    setVehicles((prev) =>
      prev.map((v) =>
        v.id === trip.vehicle_id ? { ...v, current_mileage: trip.end_mileage } : v
      )
    );
  };

  const addExpense = (expense: Omit<Expense, "id" | "created_at">) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  return {
    vehicles,
    trips,
    expenses,
    loading,
    addVehicle,
    editVehicle,
    addTrip,
    addExpense,
  };
}
