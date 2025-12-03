
const productForm = document.getElementById('productForm');
const stockTableBody = document.querySelector('#stockTable tbody');
const totalValueDisplay = document.getElementById('totalValue');
const saveBtn = document.getElementById('saveBtn');

let products = JSON.parse(localStorage.getItem('products')) || [];

function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// 2. Format Currency
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
});

// 3. Render Table
function renderTable() {
    stockTableBody.innerHTML = '';
    let totalInventoryValue = 0;

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        
        // Calculate total value
        totalInventoryValue += product.price * product.qty;

        row.innerHTML = `
            <td>#${index + 1}</td>
            <td>${product.name}</td>
            <td><span style="padding: 4px 8px; background: #e2e8f0; border-radius: 4px; font-size: 0.85rem;">${product.category}</span></td>
            <td>${product.qty}</td>
            <td>${formatter.format(product.price)}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editProduct(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete-btn" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        stockTableBody.appendChild(row);
    });

    totalValueDisplay.textContent = formatter.format(totalInventoryValue);
}

// 4. Add or Update Product
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const qty = parseInt(document.getElementById('productQty').value);
    const price = parseFloat(document.getElementById('productPrice').value);
    const id = document.getElementById('productId').value;

    if (id) {
        // Edit existing
        products[id] = { name, category, qty, price };
        saveBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
        document.getElementById('productId').value = ''; // Clear ID
    } else {
        // Add new
        products.push({ name, category, qty, price });
    }

    saveToLocalStorage();
    renderTable();
    productForm.reset();
});

// 5. Edit Product (Load data into form)
window.editProduct = (index) => {
    const product = products[index];
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productQty').value = product.qty;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productId').value = index;

    saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Update Item';
};

// 6. Delete Product
window.deleteProduct = (index) => {
    if (confirm('Are you sure you want to delete this item?')) {
        products.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    }
};

// 7. Clear All
window.clearAll = () => {
    if (confirm('Delete all inventory data?')) {
        products = [];
        saveToLocalStorage();
        renderTable();
    }
};

// Initial Render
renderTable();