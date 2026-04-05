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
    document.getElementById('addProductForm').reset();
}

function generateProductId() {
    var products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) return 'P001';
    
    var lastId = products[products.length - 1].id;
    var num = parseInt(lastId.substring(1)) + 1;
    return 'P' + String(num).padStart(3, '0');
}

document.getElementById('addProductForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var product = {
        id: generateProductId(),
        name: document.getElementById('productName').value,
        stock: parseInt(document.getElementById('stock').value),
        unit: document.getElementById('unit').value,
        minStock: parseInt(document.getElementById('minStock').value),
        traderName: document.getElementById('traderName').value,
        traderCode: document.getElementById('traderCode').value
    };
    
    var products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    
    closeAddModal();
    loadInventory();
    alert('Product added successfully!');
});

function getStatus(stock, minStock) {
    if (stock === 0) return 'Not Available';
    if (stock <= minStock) return 'Low Stock';
    return 'Available';
}

function getStatusClass(stock, minStock) {
    if (stock === 0) return 'status-critical';
    if (stock <= minStock) return 'status-low';
    return 'status-available';
}

function sortProducts(products) {
    var notAvailable = [];
    var lowStock = [];
    var available = [];
    
    for (var i = 0; i < products.length; i++) {
        if (products[i].stock === 0) {
            notAvailable.push(products[i]);
        } else if (products[i].stock <= products[i].minStock) {
            lowStock.push(products[i]);
        } else {
            available.push(products[i]);
        }
    }
    
    return notAvailable.concat(lowStock).concat(available);
}

function goToRefill(productId) {
    window.location.href = 'refill-page.html?id=' + productId;
}

function loadInventory() {
    checkAuth();
    
    var products = JSON.parse(localStorage.getItem('products')) || [];
    
    var totalProducts = products.length;
    var availableProducts = 0;
    var lowStockProducts = 0;
    var notAvailableProducts = 0;
    
    for (var i = 0; i < products.length; i++) {
        if (products[i].stock === 0) {
            notAvailableProducts++;
        } else if (products[i].stock <= products[i].minStock) {
            lowStockProducts++;
        } else {
            availableProducts++;
        }
    }
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('availableProducts').textContent = availableProducts;
    document.getElementById('lowStockProducts').textContent = lowStockProducts;
    document.getElementById('notAvailableProducts').textContent = notAvailableProducts;
    
    var sortedProducts = sortProducts(products);
    var tbody = document.getElementById('inventoryTableBody');
    
    if (sortedProducts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #999;">No products available</td></tr>';
    } else {
        var html = '';
        for (var i = 0; i < sortedProducts.length; i++) {
            var p = sortedProducts[i];
            var status = getStatus(p.stock, p.minStock);
            var statusClass = getStatusClass(p.stock, p.minStock);
            
            html += '<tr>';
            html += '<td>' + p.id + '</td>';
            html += '<td>' + p.name + '</td>';
            html += '<td>' + p.stock + '</td>';
            html += '<td>' + p.unit + '</td>';
            html += '<td>' + p.minStock + '</td>';
            html += '<td>' + p.traderName + '</td>';
            html += '<td>' + p.traderCode + '</td>';
            html += '<td><span class="' + statusClass + '">' + status + '</span></td>';
            html += '<td><button class="btn-refill" onclick="goToRefill(\'' + p.id + '\')">Refill</button></td>';
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

loadInventory();
