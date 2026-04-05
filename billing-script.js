var cart = [];
var billNumber = 1;

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

function scanBarcode() {
    var barcode = document.getElementById('barcodeInput').value.trim();
    
    if (!barcode) {
        alert('Please enter a barcode!');
        return;
    }
    
    var products = JSON.parse(localStorage.getItem('products')) || [];
    var found = null;
    
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === barcode || products[i].traderCode === barcode) {
            found = products[i];
            break;
        }
    }
    
    if (found) {
        if (found.stock === 0) {
            alert('Product is out of stock!');
            return;
        }
        
        var price = 50;
        addToCart(found.id, found.name, price, 1);
        document.getElementById('barcodeInput').value = '';
        document.getElementById('barcodeInput').focus();
    } else {
        alert('Product not found!');
    }
}

document.getElementById('barcodeInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        scanBarcode();
    }
});

document.getElementById('manualForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var name = document.getElementById('manualName').value;
    var price = parseFloat(document.getElementById('manualPrice').value);
    var qty = parseInt(document.getElementById('manualQty').value);
    
    addToCart('MANUAL', name, price, qty);
    
    document.getElementById('manualForm').reset();
    document.getElementById('manualQty').value = 1;
});

function addToCart(barcode, name, price, qty) {
    var existingIndex = -1;
    
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].barcode === barcode && cart[i].name === name) {
            existingIndex = i;
            break;
        }
    }
    
    if (existingIndex !== -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            barcode: barcode,
            name: name,
            price: price,
            qty: qty
        });
    }
    
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function renderCart() {
    var tbody = document.getElementById('billTableBody');
    
    if (cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No items in cart</td></tr>';
    } else {
        var html = '';
        for (var i = 0; i < cart.length; i++) {
            var item = cart[i];
            var total = item.price * item.qty;
            html += '<tr>';
            html += '<td>' + item.barcode + '</td>';
            html += '<td>' + item.name + '</td>';
            html += '<td>₹' + item.price.toFixed(2) + '</td>';
            html += '<td>' + item.qty + '</td>';
            html += '<td>₹' + total.toFixed(2) + '</td>';
            html += '<td><button class="btn-remove" onclick="removeFromCart(' + i + ')">Remove</button></td>';
            html += '</tr>';
        }
        tbody.innerHTML = html;
    }
    
    calculateTotals();
}

function calculateTotals() {
    var subtotal = 0;
    
    for (var i = 0; i < cart.length; i++) {
        subtotal += cart[i].price * cart[i].qty;
    }
    
    var gst = subtotal * 0.05;
    var discount = 0;
    var finalTotal = subtotal + gst - discount;
    
    document.getElementById('subtotal').textContent = '₹' + subtotal.toFixed(2);
    document.getElementById('gst').textContent = '₹' + gst.toFixed(2);
    document.getElementById('discount').textContent = '₹' + discount.toFixed(2);
    document.getElementById('finalTotal').textContent = '₹' + finalTotal.toFixed(2);
}

function generateBill() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    var paymentMode = document.getElementById('paymentMode').value;
    var user = JSON.parse(localStorage.getItem('loggedInUser'));
    
    var subtotal = parseFloat(document.getElementById('subtotal').textContent.replace('₹', ''));
    var gst = parseFloat(document.getElementById('gst').textContent.replace('₹', ''));
    var finalTotal = parseFloat(document.getElementById('finalTotal').textContent.replace('₹', ''));
    
    var bill = {
        billNo: 'B' + String(billNumber).padStart(4, '0'),
        date: new Date().toISOString(),
        items: cart.length,
        subtotal: subtotal,
        gst: gst,
        total: finalTotal,
        paymentMode: paymentMode,
        shopName: user.shopName,
        cart: cart
    };
    
    var bills = JSON.parse(localStorage.getItem('bills')) || [];
    bills.push(bill);
    localStorage.setItem('bills', JSON.stringify(bills));
    
    var ledger = JSON.parse(localStorage.getItem('ledger')) || [];
    ledger.push({
        date: new Date().toISOString(),
        type: 'Cash In',
        description: 'Sales Income - Bill ' + bill.billNo,
        amount: finalTotal,
        mode: paymentMode
    });
    localStorage.setItem('ledger', JSON.stringify(ledger));
    
    billNumber++;
    
    alert('Bill generated successfully!\nBill No: ' + bill.billNo + '\nTotal: ₹' + finalTotal.toFixed(2));
    
    cart = [];
    renderCart();
    document.getElementById('paymentMode').value = 'Cash';
}

checkAuth();
