function checkAuth() {
    var user = localStorage.getItem('loggedInUser');
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return JSON.parse(user);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
    }
}

function openAddModal() {
    document.getElementById('addModal').style.display = 'block';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addTransactionForm').reset();
}

function formatDate(dateString) {
    var date = new Date(dateString);
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

document.getElementById('addTransactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var transaction = {
        date: new Date().toISOString(),
        type: document.getElementById('transType').value,
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        mode: document.getElementById('mode').value
    };
    
    var ledger = JSON.parse(localStorage.getItem('ledger')) || [];
    ledger.push(transaction);
    localStorage.setItem('ledger', JSON.stringify(ledger));
    
    closeAddModal();
    loadLedger();
    alert('Transaction added successfully!');
});

function loadLedger() {
    checkAuth();
    
    var ledger = JSON.parse(localStorage.getItem('ledger')) || [];
    
    var totalCashIn = 0;
    var totalCashOut = 0;
    
    for (var i = 0; i < ledger.length; i++) {
        if (ledger[i].type === 'Cash In') {
            totalCashIn += ledger[i].amount;
        } else {
            totalCashOut += ledger[i].amount;
        }
    }
    
    var balance = totalCashIn - totalCashOut;
    
    document.getElementById('totalCashIn').textContent = '₹' + totalCashIn.toFixed(2);
    document.getElementById('totalCashOut').textContent = '₹' + totalCashOut.toFixed(2);
    document.getElementById('currentBalance').textContent = '₹' + balance.toFixed(2);
    
    var tbody = document.getElementById('ledgerTableBody');
    
    if (ledger.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No transactions</td></tr>';
    } else {
        var html = '';
        for (var i = ledger.length - 1; i >= 0; i--) {
            var t = ledger[i];
            var typeClass = t.type === 'Cash In' ? 'type-in' : 'type-out';
            html += '<tr>';
            html += '<td>' + formatDate(t.date) + '</td>';
            html += '<td><span class="' + typeClass + '">' + t.type + '</span></td>';
            html += '<td>' + t.description + '</td>';
            html += '<td>₹' + t.amount.toFixed(2) + '</td>';
            html += '<td>' + t.mode + '</td>';
            html += '</tr>';
        }
        tbody.innerHTML = html;
    }
}

window.onclick = function(event) {
    var modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeAddModal();
    }
};

loadLedger();
