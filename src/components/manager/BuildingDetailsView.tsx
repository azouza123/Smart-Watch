import React from 'react';
import { Building2, MapPin, Users, Radio, TrendingDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function BuildingDetailsView() {
  const buildingData = {
    name: 'Campus A',
    address: '123 Rue de la République, Paris 75001',
    zones: 4,
    units: 450,
    sensors: 68,
    occupancy: 98,
    consumption: {
      current: 12500,
      previous: 14200,
      savings: 12
    }
  };

  const zonesData = [
    { zone: 'Bâtiment Nord', consumption: 3800, units: 120, efficiency: 92 },
    { zone: 'Bâtiment Sud', consumption: 3200, units: 110, efficiency: 88 },
    { zone: 'Bâtiment Est', consumption: 2900, units: 105, efficiency: 85 },
    { zone: 'Bâtiment Ouest', consumption: 2600, units: 115, efficiency: 90 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">{buildingData.name}</h1>
        <p className="text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {buildingData.address}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-2xl text-gray-900">{buildingData.zones}</span>
          </div>
          <p className="text-sm text-gray-600">Zones</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-gray-900">{buildingData.units}</span>
          </div>
          <p className="text-sm text-gray-600">Logements</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Radio className="w-8 h-8 text-purple-600" />
            <span className="text-2xl text-gray-900">{buildingData.sensors}</span>
          </div>
          <p className="text-sm text-gray-600">Capteurs</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-green-600" />
            <span className="text-2xl text-green-900">-{buildingData.consumption.savings}%</span>
          </div>
          <p className="text-sm text-green-700">Économie (vs mois dernier)</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-gray-900 mb-4">Consommation par zone</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={zonesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="zone" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Bar dataKey="consumption" fill="#3b82f6" radius={[8, 8, 0, 0]} name="Consommation (L)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Détails des zones</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Zone</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Logements</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Consommation</th>
                <th className="text-left py-3 px-6 text-sm text-gray-600">Efficacité</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {zonesData.map((zone, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-900">{zone.zone}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{zone.units}</td>
                  <td className="py-4 px-6 text-sm text-gray-900">{zone.consumption.toLocaleString()} L</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${zone.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{zone.efficiency}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
