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

function formatDate(dateString) {
    var date = new Date(dateString);
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

function loadReports() {
    checkAuth();
    
    var bills = JSON.parse(localStorage.getItem('bills')) || [];
    
    var todayTotal = 0;
    var monthTotal = 0;
    var totalRevenue = 0;
    var totalProducts = 0;
    
    var today = new Date();
    var todayStr = today.toISOString().split('T')[0];
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();
    
    var productWise = {};
    
    for (var i = 0; i < bills.length; i++) {
        var bill = bills[i];
        var billDate = new Date(bill.date);
        var billDateStr = billDate.toISOString().split('T')[0];
        
        totalRevenue += bill.total;
        totalProducts += bill.items;
        
        if (billDateStr === todayStr) {
            todayTotal += bill.total;
        }
        
        if (billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear) {
            monthTotal += bill.total;
        }
        
        if (bill.cart) {
            for (var j = 0; j < bill.cart.length; j++) {
                var item = bill.cart[j];
                if (productWise[item.name]) {
                    productWise[item.name].qty += item.qty;
                    productWise[item.name].revenue += item.price * item.qty;
                } else {
                    productWise[item.name] = {
                        qty: item.qty,
                        revenue: item.price * item.qty
                    };
                }
            }
        }
    }
    
    document.getElementById('todaySales').textContent = '₹' + todayTotal.toFixed(0);
    document.getElementById('monthlySales').textContent = '₹' + monthTotal.toFixed(0);
    document.getElementById('totalRevenue').textContent = '₹' + totalRevenue.toFixed(0);
    document.getElementById('productsSold').textContent = totalProducts;
    
    var tbody = document.getElementById('dailySalesTable');
    if (bills.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">No sales records</td></tr>';
    } else {
        var html = '';
        for (var i = bills.length - 1; i >= Math.max(0, bills.length - 10); i--) {
            var bill = bills[i];
            html += '<tr>';
            html += '<td>' + formatDate(bill.date) + '</td>';
            html += '<td>' + bill.billNo + '</td>';
            html += '<td>' + bill.items + '</td>';
            html += '<td>₹' + bill.total.toFixed(2) + '</td>';
            html += '<td>' + bill.paymentMode + '</td>';
            html += '</tr>';
        }
        tbody.innerHTML = html;
    }
    
    var productTbody = document.getElementById('productWiseTable');
    var productNames = Object.keys(productWise);
    
    if (productNames.length === 0) {
        productTbody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #999;">No product data</td></tr>';
    } else {
        var html = '';
        for (var i = 0; i < productNames.length; i++) {
            var name = productNames[i];
            var data = productWise[name];
            html += '<tr>';
            html += '<td>' + name + '</td>';
            html += '<td>' + data.qty + '</td>';
            html += '<td>₹' + data.revenue.toFixed(2) + '</td>';
            html += '</tr>';
        }
        productTbody.innerHTML = html;
    }
}

loadReports();
