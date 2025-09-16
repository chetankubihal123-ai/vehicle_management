import React from 'react';
import { Car, MapPin, DollarSign, AlertTriangle, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../contexts/AuthContext';
import { format, subDays, isAfter, parseISO } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const { vehicles, trips, expenses } = useVehicles();

  // Calculate metrics
  const totalVehicles = vehicles.length;
  const totalTrips = trips.length;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;

  // Upcoming reminders (next 30 days)
  const upcomingReminders = vehicles.filter(v => {
    const insuranceExpiry = parseISO(v.insurance_expiry);
    const serviceDate = parseISO(v.service_due_date);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return isAfter(thirtyDaysFromNow, insuranceExpiry) || isAfter(thirtyDaysFromNow, serviceDate);
  });

  // Monthly expense data
  const monthlyExpenses = Array.from({ length: 6 }, (_, i) => {
    const date = subDays(new Date(), (5 - i) * 30);
    const monthExpenses = expenses.filter(exp => 
      new Date(exp.expense_date).getMonth() === date.getMonth()
    );
    return {
      month: format(date, 'MMM'),
      amount: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    };
  });

  // Expense breakdown
  const expenseBreakdown = [
    { name: 'Fuel', value: expenses.filter(e => e.category === 'fuel').reduce((sum, e) => sum + e.amount, 0), color: '#3B82F6' },
    { name: 'Maintenance', value: expenses.filter(e => e.category === 'maintenance').reduce((sum, e) => sum + e.amount, 0), color: '#10B981' },
    { name: 'Insurance', value: expenses.filter(e => e.category === 'insurance').reduce((sum, e) => sum + e.amount, 0), color: '#F59E0B' },
    { name: 'Other', value: expenses.filter(e => !['fuel', 'maintenance', 'insurance'].includes(e.category)).reduce((sum, e) => sum + e.amount, 0), color: '#EF4444' },
  ].filter(item => item.value > 0);

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehicles"
          value={totalVehicles}
          icon={Car}
          color="bg-blue-500"
          subtitle={`${activeVehicles} active`}
        />
        <StatCard
          title="Total Trips"
          value={totalTrips}
          icon={MapPin}
          color="bg-green-500"
          subtitle="This month"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-500"
          subtitle="This month"
        />
        <StatCard
          title="Pending Reminders"
          value={upcomingReminders.length}
          icon={AlertTriangle}
          color="bg-red-500"
          subtitle="Next 30 days"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Expenses Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trips */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Trips</h3>
          <div className="space-y-4">
            {trips.slice(0, 3).map((trip) => {
              const vehicle = vehicles.find(v => v.id === trip.vehicle_id);
              return (
                <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{trip.start_location} → {trip.end_location}</p>
                    <p className="text-sm text-gray-500">{vehicle?.vehicle_number} • {format(new Date(trip.trip_date), 'MMM dd')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{trip.end_mileage - trip.start_mileage} km</p>
                    {trip.fuel_consumed && (
                      <p className="text-sm text-gray-500">{trip.fuel_consumed}L fuel</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Reminders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Reminders</h3>
          <div className="space-y-4">
            {upcomingReminders.slice(0, 3).map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{vehicle.vehicle_number}</p>
                  <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-yellow-800">Service Due</p>
                  <p className="text-sm text-yellow-600">{format(parseISO(vehicle.service_due_date), 'MMM dd, yyyy')}</p>
                </div>
              </div>
            ))}
            {upcomingReminders.length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming reminders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}