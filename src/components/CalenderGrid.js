import React from 'react';
import "../App.css";

function CalendarGrid(day) {
  var numDays = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate(); // Get the number of days in the current month
  var fillValue = 1;
  const rows = [];

  for (let r = 0; r < 7; r++) {
    const cols = [];
    for (let c = 0; c < 5; c++) 
    {
      if (fillValue <= numDays) 
      {
        cols.push(<td key={c}>{fillValue}</td>);
        fillValue++;
      }
    }
    rows.push(<tr key={r}>{cols}</tr>);
  } 

  return (
    <div className="calendarContainer">
      <table className="calendar">
        {rows}
      </table>
    </div>
  );
}

export default CalendarGrid;
