

async function creatRow(history) {
    const newRow = document.createElement("tr");
    const tax = history['tax'], total = history['total'];
    newRow.innerHTML = `
        <td>${history.code}</td>
        <td>${formatCurrency(parseFloat(tax))}</td>
        <td>${formatCurrency(parseFloat(total))}</td>
        <td><button onclick='creatRowModal(${JSON.stringify(history.code)})'><a href="#openModal">View</a></td>
        `;
    document.querySelector(".table-history > tbody").appendChild(newRow);
};

async function creatRowModal(history) {
    clearModal();
    const productsItens = await readOrdersItensHistory(history);
    productsItens.forEach(buy => {
        const amount = parseFloat(buy.amount);
        const price = parseFloat(buy.price);
        const tax = parseFloat(buy.tax);
        const total = amount * price;
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${(buy.name_product)}</td>
            <td>${buy.name_category}</td>
            <td>${formatCurrency(price)}</td>
            <td>${buy.amount}</td>
            <td>${formatCurrency(tax)}</td>
            <td>${formatCurrency(total)}</td>
            `;
        document.querySelector(".table-modal > tbody").appendChild(newRow);
    })
};

updateTable();
async function updateTable() {
    const ordersHistory = await readOrdersHistory();
    clearTable();
    ordersHistory.forEach((buy) => {
        creatRow(buy);
    });
};

async function readOrdersHistory() {
    const data = await fetch('../routers/routerHistory.php', {
        method: 'GET'
    })
    const products = await data.json();
    return products;
}
async function readOrdersItensHistory(code) {
    const dataForm = new FormData();
    dataForm.append('action', 'readItens');
    dataForm.append('code', code);
    const data = await fetch('../routers/routerHistory.php', {
        method: 'POST',
        body: dataForm
    });
    const products = await data.json();
    return products;
}
function formatCurrency(value) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

function closeModal() {
    document.querySelector('.table-modal > tbody').innerHTML = '';
}

const clearTable = () => {
    document.querySelector('.table-history > tbody').innerHTML = '';
};

const clearModal = () => {
    document.querySelector('.table-modal > tbody').innerHTML = '';
};