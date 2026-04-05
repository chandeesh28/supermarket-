<!DOCTYPE html>
                    paymentMode: 'Cash',
                    shopName: 'SuperMart Express',
                    cart: [
                        {barcode: 'P001', name: 'Basmati Rice', price: 150, qty: 2},
                        {barcode: 'P002', name: 'Sunflower Oil', price: 180, qty: 1}
                    ]
                },
                {
                    billNo: 'B0002',
                    date: new Date(Date.now() - 86400000).toISOString(),
                    items: 2,
                    subtotal: 300,
                    gst: 15,
                    total: 315,
                    paymentMode: 'UPI',
                    shopName: 'SuperMart Express',
                    cart: [
                        {barcode: 'P004', name: 'Toor Dal', price: 120, qty: 1},
                        {barcode: 'P006', name: 'Tea Powder', price: 180, qty: 1}
                    ]
                },
                {
                    billNo: 'B0003',
                    date: new Date(Date.now() - 172800000).toISOString(),
                    items: 4,
                    subtotal: 520,
                    gst: 26,
                    total: 546,
                    paymentMode: 'Card',
                    shopName: 'SuperMart Express',
                    cart: [
                        {barcode: 'P008', name: 'Milk', price: 60, qty: 2},
                        {barcode: 'P009', name: 'Bread', price: 40, qty: 3},
                        {barcode: 'P010', name: 'Eggs', price: 180, qty: 1}
                    ]
                }
            ];
            localStorage.setItem('bills', JSON.stringify(bills));
            
            // Demo Ledger
            var ledger = [
                {
                    date: new Date().toISOString(),
                    type: 'Cash In',
                    description: 'Sales Income - Bill B0001',
                    amount: 472.5,
                    mode: 'Cash'
                },
                {
                    date: new Date(Date.now() - 86400000).toISOString(),
                    type: 'Cash In',
                    description: 'Sales Income - Bill B0002',
                    amount: 315,
                    mode: 'UPI'
                },
                {
                    date: new Date(Date.now() - 172800000).toISOString(),
                    type: 'Cash Out',
                    description: 'Supplier Payment - Rice Suppliers Co',
                    amount: 5000,
                    mode: 'Bank Transfer'
                },
                {
                    date: new Date(Date.now() - 259200000).toISOString(),
                    type: 'Cash In',
                    description: 'Sales Income - Bill B0003',
                    amount: 546,
                    mode: 'Card'
                },
                {
                    date: new Date(Date.now() - 345600000).toISOString(),
                    type: 'Cash Out',
                    description: 'Electricity Bill',
                    amount: 1500,
                    mode: 'Cash'
                }
            ];
            localStorage.setItem('ledger', JSON.stringify(ledger));
            
            alert('✅ Demo data loaded successfully!\n\nLogin with:\nUsername: demo\nPassword: demo123');
            window.location.href = 'index.html';
        }
        
        function startFresh() {
            localStorage.clear();
            alert('✅ All data cleared! You can now start fresh.');
            window.location.href = 'index.html';
        }
    </script>
</body>
</html>
