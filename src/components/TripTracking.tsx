import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Car } from 'lucide-react';
import { useVehicles } from '../hooks/useVehicles';
import { Trip } from '../types';
import { format, parseISO } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

export default function TripTracking() {
  const { user } = useAuth();
  const { vehicles, trips, addTrip } = useVehicles();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_id: '',
    start_location: '',
    end_location: '',
    start_mileage: 0,
    end_mileage: 0,
    trip_date: format(new Date(), 'yyyy-MM-dd'),
    fuel_consumed: 0,
    goods_carried: '',
    trip_purpose: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addTrip({
      ...formData,
      driver_id: user.id,
    });

    setShowAddModal(false);
    setFormData({
      vehicle_id: '',
      start_location: '',
      end_location: '',
      start_mileage: 0,
      end_mileage: 0,
      trip_date: format(new Date(), 'yyyy-MM-dd'),
      fuel_consumed: 0,
      goods_carried: '',
      trip_purpose: '',
    });
  };

  const TripCard = ({ trip }: { trip: Trip }) => {
    const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
    const distance = trip.end_mileage - trip.start_mileage;
    const efficiency = trip.fuel_consumed ? (distance / trip.fuel_consumed).toFixed(1) : null;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {trip.start_location} → {trip.end_location}
              </h3>
              <p className="text-gray-600">{vehicle?.vehicle_number} • {format(parseISO(trip.trip_date), 'MMM dd, yyyy')}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {distance} km
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Start Mileage</p>
            <p className="font-medium text-gray-900">{trip.start_mileage.toLocaleString()} km</p>
          </div>
          <div>
            <p className="text-gray-500">End Mileage</p>
            <p className="font-medium text-gray-900">{trip.end_mileage.toLocaleString()} km</p>
          </div>
          {trip.fuel_consumed && (
            <div>
              <p className="text-gray-500">Fuel Used</p>
              <p className="font-medium text-gray-900">{trip.fuel_consumed}L</p>
            </div>
          )}
          {efficiency && (
            <div>
              <p className="text-gray-500">Efficiency</p>
              <p className="font-medium text-gray-900">{efficiency} km/L</p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {trip.trip_purpose && (
              <div>
                <p className="text-gray-500">Purpose</p>
                <p className="font-medium text-gray-900">{trip.trip_purpose}</p>
              </div>
            )}
            {trip.goods_carried && (
              <div>
                <p className="text-gray-500">Goods Carried</p>
                <p className="font-medium text-gray-900">{trip.goods_carried}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trip Tracking</h1>
          <p className="text-gray-600 mt-1">Track and manage vehicle trips</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          <span>Log Trip</span>
        </button>
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Trips</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{trips.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <MapPin className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Distance</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {trips.reduce((sum, trip) => sum + (trip.end_mileage - trip.start_mileage), 0).toLocaleString()} km
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Fuel Consumed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {trips.reduce((sum, trip) => sum + (trip.fuel_consumed || 0), 0)}L
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Avg. Efficiency</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {trips.length > 0 ? (
                  trips.reduce((sum, trip) => sum + (trip.end_mileage - trip.start_mileage), 0) /
                  trips.reduce((sum, trip) => sum + (trip.fuel_consumed || 1), 0)
                ).toFixed(1) : '0'} km/L
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Trip List */}
      <div className="space-y-4">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
        {trips.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No trips logged yet</p>
            <p className="text-gray-400">Click "Log Trip" to get started</p>
          </div>
        )}
      </div>

      {/* Add Trip Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Log New Trip</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle
                  </label>
                  <select
                    required
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.vehicle_number} - {vehicle.make} {vehicle.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.start_location}
                    onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Location
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.end_location}
                    onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Pune"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Mileage (km)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.start_mileage}
                    onChange={(e) => setFormData({ ...formData, start_mileage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Mileage (km)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.end_mileage}
                    onChange={(e) => setFormData({ ...formData, end_mileage: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.trip_date}
                    onChange={(e) => setFormData({ ...formData, trip_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Consumed (L)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.fuel_consumed}
                    onChange={(e) => setFormData({ ...formData, fuel_consumed: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Purpose
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.trip_purpose}
                    onChange={(e) => setFormData({ ...formData, trip_purpose: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Delivery, Commute"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goods Carried (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.goods_carried}
                    onChange={(e) => setFormData({ ...formData, goods_carried: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="e.g., Electronics, Documents"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Log Trip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}