function saveTrade() {
    const pairEl = document.getElementById('pair');
    const pnlEl = document.getElementById('pnl');
    const strategyEl = document.getElementById('strategy');

    const pair = pairEl.value.toUpperCase();
    const pnl = parseFloat(pnlEl.value);
    const strategy = strategyEl.value;

    if (!pair || isNaN(pnl)) {
        alert("Please enter both Asset and P&L");
        return;
    }

    const trade = {
        id: Date.now(),
        pair,
        pnl,
        strategy,
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };

    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));

    // Clear inputs
    pairEl.value = '';
    pnlEl.value = '';

    render();
}

function render() {
    const list = document.getElementById('journalList');
    const trades = JSON.parse(localStorage.getItem('trades')) || [];
    
    // Stats Calculations
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);

    // Update UI Stats
    document.getElementById('win-rate').innerText = `${winRate}%`;
    const pnlDisplay = document.getElementById('total-pnl');
    pnlDisplay.innerText = `$${totalPnl.toLocaleString()}`;
    pnlDisplay.style.color = totalPnl >= 0 ? '#4ade80' : '#fb7185';

    // Update List
    list.innerHTML = trades.map(t => `
        <div class="trade-card" style="border-left-color: ${t.pnl >= 0 ? 'var(--success)' : 'var(--danger)'}">
            <div>
                <span style="font-weight: 600; display: block;">${t.pair}</span>
                <span class="strategy-tag">${t.strategy}</span>
            </div>
            <div style="text-align: right">
                <span style="color: ${t.pnl >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: 600;">
                    ${t.pnl >= 0 ? '+' : ''}$${t.pnl}
                </span>
                <div style="font-size: 0.7rem; opacity: 0.5; margin-top: 4px;">${t.date}</div>
            </div>
        </div>
    `).reverse().join('');
}

function clearJournal() {
    if(confirm("Delete all trades? This cannot be undone.")) {
        localStorage.removeItem('trades');
        render();
    }
}

// Run on load
render();