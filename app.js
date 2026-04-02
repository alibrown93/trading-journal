function saveTrade() {
    const pairEl = document.getElementById('pair');
    const pnlEl = document.getElementById('pnl');
    const strategyEl = document.getElementById('strategy');
    const firmEl = document.getElementById('prop-firm');

    const pair = pairEl.value.toUpperCase();
    const pnl = parseFloat(pnlEl.value);
    
    if (!pair || isNaN(pnl)) return;

    const trade = {
        id: Date.now(),
        pair,
        pnl,
        strategy: strategyEl.value,
        firm: firmEl.value,
        // Using ISO date for easier grouping
        fullDate: new Date().toISOString().split('T')[0],
        displayDate: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    };

    let trades = JSON.parse(localStorage.getItem('trades')) || [];
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));

    pairEl.value = '';
    pnlEl.value = '';
    render();
}

function renderCalendar(trades) {
    const calendar = document.getElementById('activity-calendar');
    calendar.innerHTML = '';
    
    // Get last 14 days
    const days = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }

    days.forEach(dateStr => {
        const dayTrades = trades.filter(t => t.fullDate === dateStr);
        const dayPnl = dayTrades.reduce((sum, t) => sum + t.pnl, 0);
        
        let status = 'empty';
        if (dayTrades.length > 0) {
            status = dayPnl > 0 ? 'win' : (dayPnl < 0 ? 'loss' : 'breakeven');
        }

        const dot = document.createElement('div');
        dot.className = `calendar-dot ${status}`;
        dot.title = `${dateStr}: ${dayPnl >= 0 ? '+' : ''}$${dayPnl}`;
        calendar.appendChild(dot);
    });
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

    document.getElementById('win-rate').innerText = `${winRate}%`;
    document.getElementById('total-count').innerText = totalTrades;
    const pnlDisplay = document.getElementById('total-pnl');
    pnlDisplay.innerText = `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString()}`;
    pnlDisplay.className = `value ${totalPnl >= 0 ? 'pos' : 'neg'}`;

    renderCalendar(trades);

    const filteredTrades = trades.filter(t => 
        t.strategy.toLowerCase().includes(searchTerm) || 
        t.firm.toLowerCase().includes(searchTerm)
    );
    
    list.innerHTML = filteredTrades.map(t => `
        <div class="trade-card">
            <div class="trade-info">
                <span class="trade-pair">${t.pair} <small class="firm-tag">${t.firm}</small></span>
                <span class="trade-date">${t.displayDate} • ${t.strategy}</span>
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
