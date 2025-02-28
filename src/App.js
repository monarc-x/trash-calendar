import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

const people = [
  { name: "Carlos", color: "bg-red-200" },
  { name: "Jorge", color: "bg-green-200" },
  { name: "Renato", color: "bg-blue-200" }
];

const referenceDate = dayjs("2024-09-16");

function App() {
  const [shifts, setShifts] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs());

  useEffect(() => {
    generateShifts(currentMonth);
  }, [currentMonth]);

  const generateShifts = (month) => {
    const daysInMonth = month.daysInMonth();
    const firstDayOfMonth = month.startOf('month').day();
    const newShift = [];

    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < adjustedFirstDay; i++) {
      newShift.push({ day: '', person: '' });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = month.date(day);
      const dayDifference = dayDate.diff(referenceDate, 'day');
      const personIndex = (dayDifference % people.length + people.length) % people.length;
      newShift.push({
        day,
        person: people[personIndex]
      });
    }

    const extraDays = 7 - (newShift.length % 7);
    if (extraDays < 7 && extraDays > 0) {
      for (let i = 0; i < extraDays; i++) {
        newShift.push({ day: '', person: '' });
      }
    }

    setShifts(newShift);
  };

  const previousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calendario de Basura</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md mb-4">
        <button
          onClick={previousMonth}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          Mes Anterior
        </button>
        <h2 className="text-xl font-semibold my-2 sm:my-0 text-center">
          {currentMonth.format("MMMM YYYY")}
        </h2>
        <button
          onClick={nextMonth}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          Mes Siguiente
        </button>
      </div>

      <table className="w-full max-w-md bg-white border rounded shadow-md">
        <thead>
          <tr>
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(dia => (
              <th key={dia} className="p-1 sm:p-2 border-b text-sm sm:text-base">{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {shifts.reduce((rows, { day, person }, index) => {
            if (index % 7 === 0) rows.push([]);
            rows[rows.length - 1].push({ day, person });
            return rows;
          }, []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(({ day, person }, cellIndex) => (
                <td key={cellIndex} className="p-1 sm:p-2 border-t border-l text-center">
                  <div className={`text-center ${person ? person.color : ''}`}>
                    <div className={`font-bold ${day ? "text-sm sm:text-base" : ""}`}>{day || ''}</div>
                    <div className="text-xs sm:text-sm">{person ? person.name : ''}</div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;