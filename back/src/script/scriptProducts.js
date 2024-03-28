const readDbProducts = async () => {
    const data = await fetch('../routers/routerProducts.php', {
        method: 'GET'
    });
    const datas = await data.json();
    return datas;
}

const situacao = document.getElementById("selectCategory");

if (situacao) {
    readDb();
}

async function readDb() {
    const dbCategory = await fetch('../routers/routerCategories.php', {
        method: 'GET'
    });
    const categories = await dbCategory.json();
    console.log(categories);
    for (let index = 0; index < categories.length; index++) {
        situacao.innerHTML = situacao.innerHTML + '<option value="' + categories[index]['code'] + '"> ' + categories[index]['name'] + '</options>';
    }
}

addProduct();

async function addProduct() {
    const form = document.getElementById('form');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        if (await isNewProduct()) {
            const dataForm = new FormData(form);
            const name = document.getElementById('productName').value;
            dataForm.set('productName', name.replace(/</g, "").replace(/>/g, ""));
            dataForm.append('action', 'insertProducts');
            try{
                const data = await fetch('../routers/routerProducts.php', {
                    method: 'POST',
                    mode: 'cors',
                    body: dataForm
                })
                const response = await data.json();
                if (response!=false) {
                    document.getElementById("productName").value = "";
                    document.getElementById("amountProduct").value = "";
                    document.getElementById("unitPrice").value = "";
                    document.getElementById("selectCategory").value = "";
                    await updateTable();
                    alert("Produto cadastrado sucesso!");
                }else {
                    throw new Error('Erro ao inserir o produto');
                }
            }catch (error) {
                console.error(error);
                alert("Não foi possivel inserir o produto");
            }
            
        } else {
            const update = confirm("Produto já cadastrado, deseja atualiza-lo?");
            if (update) {
                const dataForm = new FormData(form);
                dataForm.append('action', 'updateProduct');
                const response = await fetch('../routers/routerProducts.php', {
                    method: 'POST',
                    mode: 'cors',
                    body: dataForm
                })
                if (response.ok) {
                    updateTable();
                } else {
                    throw new Error('Erro ao atualizar produto');
                }
            }
        }
    });
}

async function isNewProduct() {
    const nameProduct = document.getElementById("productName").value;
    const datas = await readDbProducts();
    if (datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
            if (nameProduct === datas[i]['product_name']) {
                return false;
            }
        }
    }
    return true;
}

function creatRow(code, name, amount, category_code, price) {
    const newRow = document.createElement("tr");
    const unitPrice = parseFloat(price);
    newRow.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${category_code}</td>
        <td>${amount}</td>
        <td>${formatCurrency(unitPrice)}</td>
        <td><button type ='button' onclick="removeLine(${code})"> X </button></td>
        `;
    document.querySelector(".table_products>tbody").appendChild(newRow);
}

async function removeLine(code) {
    const response = confirm("Deseja mesmo excluir o produto?");
    if(response){
        const dataForm = new FormData(form);
        dataForm.append('action', 'deleteProduct');
        dataForm.append('code', code);
        try{
            const data = await fetch('../routers/routerProducts.php', {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            });
            const response = await data.json();
            if (response!=false) {
                updateTable();
                alert("Produto excluído com sucesso!");
            } else {
                throw new Error('Erro ao excluir o produto');
            }
        }catch (error) {
            alert("Existe produtos comprados. Não foi possivel removê-lo");
        }
    }
}

async function updateTable() {
    const product = await readDbProducts();
    clearTable();
    for (let index = 0; index < product.length; index++) {
        const code = product[index]['code_product'];
        const name = product[index]['product_name'];
        const amount = product[index]['amount'];
        const category_code = product[index]['category_name'];
        const price = product[index]['price'];
        creatRow(code, name, amount, category_code, price);
    }
}
const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const clearTable = () => {
    document.querySelector('.table_products>tbody').innerHTML = '';
}

updateTable();