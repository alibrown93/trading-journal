function saveTrade() {
    const pairEl = document.getElementById('pair');
    const pnlEl = document.getElementById('pnl');
    const strategyEl = document.getElementById('strategy');

    const pair = pairEl.value.toUpperCase();
    const pnl = parseFloat(pnlEl.value);
    const strategy = strategyEl.value;

    if (!pair || isNaN(pnl)) return;

    const trade = {
        id: Date.now(),
        pair,
        pnl,
        strategy,
        date: new Date().toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })
    };

    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));

    pairEl.value = '';
    pnlEl.value = '';
    render();
}

function render() {
    const list = document.getElementById('journalList');
    const searchTerm = document.getElementById('search').value.toLowerCase();
    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    
    // Stats
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.pnl > 0).length;
    const winRate = totalTrades > 0 ? Math.round((wins / totalTrades) * 100) : 0;
    const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);

    // Update UI Stats
    document.getElementById('win-rate').innerText = `${winRate}%`;
    document.getElementById('total-count').innerText = totalTrades;
    document.getElementById('win-progress').style.width = `${winRate}%`;
    
    const pnlDisplay = document.getElementById('total-pnl');
    pnlDisplay.innerText = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString()}`;
    pnlDisplay.className = `value ${totalPnl >= 0 ? 'pos' : 'neg'}`;

    // Filter and Render List
    const filteredTrades = trades.filter(t => t.strategy.toLowerCase().includes(searchTerm));
    
    list.innerHTML = filteredTrades.map(t => `
        <div class="trade-card">
            <div class="trade-info">
                <span class="trade-pair">${t.pair}</span>
                <span class="trade-date">${t.date} • ${t.strategy}</span>
            </div>
            <div class="trade-amount ${t.pnl >= 0 ? 'pos' : 'neg'}">
                ${t.pnl >= 0 ? '+$' : '-$'}${Math.abs(t.pnl)}
            </div>
        </div>
    `).reverse().join('');
}

function clearJournal() {
    if(confirm("Wipe journal history?")) {
        localStorage.removeItem('trades');
        render();
    }
}

render();
