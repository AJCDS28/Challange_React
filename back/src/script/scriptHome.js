
const select = document.getElementById("selectProduct");
const inputTax = document.getElementById("taxProduct");
const inputPrice = document.getElementById("priceProduct");
let arrayProducts;
readDb();
async function readDb() {
    const dataForm = new FormData();
    dataForm.append('action', '');
    const data = await fetch('../routers/routerProducts.php', {
        method: 'GET'
    });
    const products = await data.json();
    for (let index = 0; index < products.length; index++) {
        select.innerHTML = select.innerHTML + '<option value=" ' + products[index]['code_product'] + '"> ' + products[index]['product_name'] + '</options>';
    }
    arrayProducts = products;
}
async function productSelect() {
    const name = select.options[select.selectedIndex].text;
    for (let index = 0; index < arrayProducts.length; index++) {
        if (name == arrayProducts[index]['product_name']) {
            inputTax.value = arrayProducts[index]['tax'];
            inputPrice.value = arrayProducts[index]['price'];
        }
    }
};

addProductCar();
async function addProductCar() {
    const form = document.getElementById('form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (await isNewProduct()) {
            const dataForm = new FormData(form);
            dataForm.append("Products", select.options[select.selectedIndex].text);
            dataForm.append("code_product", select.options[select.selectedIndex].value);
            dataForm.append('action', 'addProductCar');

            const data = await fetch('../routers/routerHome.php', {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            });
            if(data.ok){
                document.getElementById("selectProduct").value = "";
                document.getElementById("amountProduct").value = "";
                document.getElementById("taxProduct").value = "";
                document.getElementById("priceProduct").value = "";
                updateTable();
                return alert("Produto inseirdo no carrinho com sucesso!");
            }
        } else {
            const form = document.getElementById('form');
            const dataForm = new FormData(form);
            dataForm.append("Products", select.options[select.selectedIndex].text);
            dataForm.append("action", 'updateProductCar');

            const response = await fetch('../routers/routerHome.php', {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            })
            if (response.ok) {
                document.getElementById("selectProduct").value = "";
                document.getElementById("amountProduct").value = "";
                document.getElementById("taxProduct").value = "";
                document.getElementById("priceProduct").value = "";
                updateTable();
                return alert("Produto atualizado no carrinho com sucesso!");

            } else {
                throw new Error('Erro ao atualizar produto');
            }
        }
    })
    await updateTable();
}

async function isNewProduct() {
    const nameProduct = select.options[select.selectedIndex].text;
    const datas = await readDbProductsCar();
    if (datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
            if (nameProduct === datas[i]['name_product']) {
                return false;
            }
        }
    }
    return true;
}
async function readDbProductsCar() {
    let datas;
    const data = await fetch('../routers/routerHome.php')
        .then(function (response) {
            return response.json();
        })
        .then(function (result) {
            datas = result;
        })
    return datas;
}
function creatRow(code, name, amount, total, price) {
    const totalBuy = parseFloat(total);
    const uniPrice = parseFloat(price);
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>${name}</td>
    <td>${amount}</td>
    <td>${formatCurrency(uniPrice)}</td>
    <td>${formatCurrency(totalBuy)}</td>
    <td><button type ='button' onclick="removeLine(${code})"> X </button></td>
    `;
    document.querySelector(".table_products>tbody").appendChild(newRow);
}

async function sumValues() {
    const productsCar = await readDbProductsCar();
    let sumTax = 0, sumTotal = 0;
    productsCar.forEach((product, index) => {
        const taxAmount = productsCar[index]['tax'];
        sumTax += parseFloat((taxAmount / 100) * productsCar[index]['price'] * productsCar[index]['amount']);
        sumTotal += (productsCar[index]['price'] * productsCar[index]['amount']);
    });
    document.querySelector('.buttonTax').innerHTML = `<p>Tax: ${formatCurrency(sumTax)}</p>`;
    document.querySelector('.buttonTotal').innerHTML = `<p>Total: ${formatCurrency(sumTotal)}</p>`;
}

async function removeLine(codeProduct) {
    const productCar = await readDbProductsCar();
    for (let index = 0; index < productCar.length; index++) {
        if (productCar[index].code === codeProduct) {
            const nameProduct = productCar[index].name_product;
            const response = confirm(`Deseja mesmo excluir o produto ${nameProduct}?`);
            if (response) {
                deleteProductCar(codeProduct);
                updateTable();
            };
        }
    }
};

async function deleteProductCar(code) {
    const dataForm = new FormData(form);
    dataForm.append('action', 'deleteProductCar');
    dataForm.append('code', code);
    const response = await fetch('../routers/routerHome.php', {
        method: 'POST',
        mode: 'cors',
        body: dataForm
    });
    if (response.ok) {
        updateTable();
    } else {
        console.error('Erro ao excluir produto.');
    }
}
const cancelBuy = document.getElementById("buttonCancel");
cancelBuy.addEventListener("click", async function (event) {
    event.preventDefault();
    const products = await readDbProductsCar();
    if(products.length!=0){
    const response = confirm('Deseja mesmo excluir os produtos do carrinho?');
    if (response) {
        for (let index = 0; index < products.length; index++) {
            await deleteProductCar(products[index].code);
        }
    }
        updateTable();
    }else{
        alert("Carrinho já se encontra vazio!");
    }
});

const buttonFinish = document.getElementById("buttonFinish");
buttonFinish.addEventListener("click", async function (event) {
    event.preventDefault();
    const response = confirm('Deseja mesmo finalizar a compra?');
    if (response) {
        const productCar = await readDbProductsCar();
        let product;
        var arrayProductsCar = new Array();
        let verifyBuy;
        for (let index = 0; index < productCar.length; index++) {
            product = {
                code: productCar[index].code,
                code_product: productCar[index].product_code,
                amount: productCar[index].amount,
                price: productCar[index].price,
                tax: productCar[index].tax
            }
            verifyBuy =  await updateStock(productCar[index].product_code, productCar[index].amount);
            if(!verifyBuy){
                break;
            }
            arrayProductsCar.push(product);

        }
        if(verifyBuy){
            const dataForm = new FormData();
            dataForm.append('action', 'finishBuy');
            const data = await fetch('../routers/routerHome.php', {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            })
            const datas = await data.json();
            if (data.ok) {
                    for (let index = 0; index < arrayProductsCar.length; index++) {
                        await deleteProductCar(arrayProductsCar[index].code);
                }
            }
        }
    }
    await updateTable();

})
async function updateStock(code_product, newAmount) {
    const products = await readDbProductsCar();
    console.log(products);
    const productToUpdate = products.find(product => product.product_code === code_product);
    console.log(productToUpdate['name_product']);
    try{
        if (productToUpdate) {
            for (let index = 0; index < arrayProducts.length; index++) {
                if (productToUpdate['name_product'] == arrayProducts[index]['product_name']) {
                    var amount = arrayProducts[index]['amount'];
                }
            }
            const currentAmount = parseInt(amount);
            const newAmounts = parseInt(newAmount);
            const updateAmount = currentAmount - newAmounts;
            if(updateAmount >= 0){
                const formData = new FormData();
                formData.append('code_product', code_product);
                formData.append('newAmount', updateAmount);
                formData.append('action', 'updateStock');
                const response = await fetch('../routers/routerProducts.php', {
                    method: 'POST',
                    mode: 'cors',
                    body: formData
                });
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    console.error('Erro ao atualizar o estoque do produto.');
                }
                return true;
            }else{
                alert("Produto "+ productToUpdate.name_product+" indisponivel no estoque");
                return false;
            }
            
        } else {
            console.error('Produto não encontrado.');
            return false;
        }
    }catch(error){
        console.log(error);
        return false;
    }
}

async function updateTable() {
    const product = await readDbProductsCar();
    clearTable();
    for (let index = 0; index < product.length; index++) {
        const code = product[index]['code'];
        const name = product[index]['name_product'];
        const amount = product[index]['amount'];
        const price = product[index]['price'];
        const total = amount * price;
        creatRow(code, name, amount, total.toFixed(2), price);
    }
    sumValues();
}
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const clearTable = () => {
    document.querySelector('.table_products>tbody').innerHTML = '';
}
updateTable();