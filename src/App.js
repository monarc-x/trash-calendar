import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; 

const personas = [
  { nombre: "Carlos", color: "bg-red-200" },
  { nombre: "Jorge", color: "bg-green-200" },
  { nombre: "Renato", color: "bg-blue-200" }
];

const fechaReferencia = dayjs("2024-09-15"); 

function App() {
  const [turnos, setTurnos] = useState([]);
  const [mesActual, setMesActual] = useState(dayjs());

  useEffect(() => {
    generarTurnos(mesActual);
  }, [mesActual]);

  const generarTurnos = (mes) => {
    const diasEnMes = mes.daysInMonth();
    const primerDiaDelMes = mes.startOf('month').day();
    const nuevoTurno = [];
    
    for (let i = 0; i < primerDiaDelMes; i++) {
      nuevoTurno.push({ dia: '', persona: '' });
    }

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fechaDia = mes.date(dia);
      const diferenciaDias = fechaDia.diff(fechaReferencia, 'day');
      const personaIndex = (diferenciaDias % personas.length + personas.length) % personas.length;
      nuevoTurno.push({
        dia,
        persona: personas[personaIndex]
      });
    }

    const diasExtras = 7 - (nuevoTurno.length % 7);
    if (diasExtras < 7 && diasExtras > 0) {
      for (let i = 0; i < diasExtras; i++) {
        nuevoTurno.push({ dia: '', persona: '' });
      }
    }

    setTurnos(nuevoTurno);
  };

  const mesAnterior = () => {
    setMesActual(mesActual.subtract(1, 'month'));
  };

  const mesSiguiente = () => {
    setMesActual(mesActual.add(1, 'month'));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calendario de Basura</h1>

      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-md mb-4">
        <button
          onClick={mesAnterior}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
        >
          Mes Anterior
        </button>
        <h2 className="text-xl font-semibold my-2 sm:my-0">
          {mesActual.format("MMMM YYYY")}
        </h2>
        <button
          onClick={mesSiguiente}
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
          {turnos.reduce((rows, { dia, persona }, index) => {
            if (index % 7 === 0) rows.push([]);
            rows[rows.length - 1].push({ dia, persona });
            return rows;
          }, []).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map(({ dia, persona }, cellIndex) => (
                <td key={cellIndex} className="p-1 sm:p-2 border-t border-l text-center">
                  <div className={`text-center ${persona ? persona.color : ''}`}>
                    <div className={`font-bold ${dia ? "text-sm sm:text-base" : ""}`}>{dia || ''}</div>
                    <div className="text-xs sm:text-sm">{persona ? persona.nombre : ''}</div>
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
