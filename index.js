import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Función para generar los rangos de edad en intervalos de 5 años
const generateAgeGroups = () => {
  const groups = [];
  // Definimos el primer grupo: 0-5, el siguiente 6-10, etc.
  let start = 0;
  while (start < 100) {
    const end = start + 5;
    groups.push(`${start}-${end}`);
    // El siguiente grupo inicia en end+1 (por ejemplo: 0-5, luego 6-10)
    start = end + 1;
  }
  return groups;
};

const ageGroups = generateAgeGroups();

// Función que simula los datos para un año dado
const simulateYearData = (year) => {
  return ageGroups.map((ageRange) => {
    // Usamos el valor inicial del rango para dar algo de variación a los números
    const base = parseInt(ageRange.split("-")[0], 10);
    // Generamos valores aleatorios:
    // Para hombres: valores negativos para que se dibujen a la izquierda
    const men = -Math.floor(Math.random() * 5000 + base * 10);
    // Para mujeres: valores positivos
    const women = Math.floor(Math.random() * 5000 + base * 10);
    return { age: ageRange, men, women };
  });
};

// Los años para los cuales se simulan los datos
const availableYears = [2020, 2025, 2030];

// Objeto que contiene los datos simulados para cada año
const simulatedData = {};
availableYears.forEach((year) => {
  simulatedData[year] = simulateYearData(year);
});

// Componente personalizado para el tooltip que muestra valores absolutos
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{`Grupo de edad: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {Math.abs(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export default function HomePage() {
  // Estado para controlar el año seleccionado
  const [year, setYear] = useState(availableYears[0]);
  const data = simulatedData[year];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Pirámide Poblacional {year}</h1>
      <select
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="mb-4 p-2 border rounded"
      >
        {availableYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <div className="w-full max-w-4xl bg-white p-4 shadow rounded">
        <ResponsiveContainer width="100%" height={500}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {/* El eje X muestra los valores en absoluto */}
            <XAxis
              type="number"
              tickFormatter={(value) => Math.abs(value)}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis dataKey="age" type="category" width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {/* Se agregan las barras para hombres y mujeres */}
            <Bar dataKey="men" fill="#3b82f6" name="Hombres" />
            <Bar dataKey="women" fill="#f87171" name="Mujeres" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
