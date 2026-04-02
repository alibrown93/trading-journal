const form = document.getElementById('trade-form');
const tableBody = document.getElementById('trade-table-body');
// ... other existing constants ...

function renderTable(trades) {
  tableBody.innerHTML = '';
  let totalPnL = 0;
  let wins = 0;
  let maxWin = 0;

  trades.forEach((trade, index) => {
    const pnl = parseFloat((trade.exit - trade.entry).toFixed(2));
    totalPnL += pnl;
    if (pnl > 0) wins++;
    if (pnl > maxWin) maxWin = pnl;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${trade.date}</td>
      <td style="font-weight:bold">${trade.firm || 'N/A'}</td>
      <td>${trade.ticker}</td>
      <td style="color: ${pnl >= 0 ? '#44ff44' : '#ff4444'}">${pnl}</td>
      <td>${trade.notes}</td>
      <td><button class="delete-btn" onclick="deleteTrade(${index})">🗑</button></td>
    `;
    tableBody.appendChild(row);
  });

  // Update Card Stats
  document.getElementById('winRateCard').textContent = trades.length > 0 ? ((wins / trades.length) * 100).toFixed(1) + '%' : '0%';
  document.getElementById('totalPnlCard').textContent = '$' + totalPnL.toFixed(2);
  document.getElementById('bestTradeCard').textContent = '$' + maxWin.toFixed(2);
}

form.addEventListener('submit', e => {
  e.preventDefault();

  const trade = {
    date: document.getElementById('date').value,
    ticker: document.getElementById('ticker').value.toUpperCase(),
    firm: document.getElementById('prop-firm').value, // Saved firm
    entry: parseFloat(document.getElementById('entry').value),
    exit: parseFloat(document.getElementById('exit').value),
    notes: document.getElementById('notes').value
  };

  const trades = JSON.parse(localStorage.getItem('trades')) || [];
  trades.push(trade);
  localStorage.setItem('trades', JSON.stringify(trades));
  form.reset();
  loadTrades();
});

// ... Keep existing delete, search, and theme functions ...
