

addCategory();

function addCategory() {
    const form = document.querySelector('form');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const formData = new FormData(form);
        formData.set('categoryName', (document.getElementById('categoryName').value).replace(/</g, "").replace(/>/g, ""))
        formData.append('action', 'addCategory');
        try {
            const response = await fetch('../routers/routerCategories.php', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                form.reset();
                updateTable(); 
                alert("Categoria cadastrada com sucesso!");
            } else {
                throw new Error('Erro ao cadastrar categoria');
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao cadastrar categoria");
        }
    });
}

async function removeLine(code) {
    const response = confirm(`Deseja excluir mesmo a categoria ${code}?`);
    if (response) {
        const formData = new FormData();
        formData.append('action', 'deleteCategory');
        formData.append('code', code);
        try {
            const deleteResponse = await fetch('../routers/routerCategories.php', {
                method: 'POST',
                body: formData
            });
            const response = await deleteResponse.json();
            if (response!=false) {
                updateTable(); 
                alert("Categoria excluída com sucesso!");
            } else {
                throw new Error('Erro ao excluir categoria');
            }
        } catch (error) {
            alert("Existe produtos cadastrados com essa categoria. Não foi possivel removê-la");
        }
    }
}

async function updateTable() {
    const category = await readDb();
    clearTable();
    for (const { code, name, tax } of category) {
        creatRow(code, name, tax);
    }
}

async function readDb() {
    try {
        const response = await fetch('../routers/routerCategories.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        alert("Erro ao carregar dados");
        return false;
    }
}

function clearTable() {
    const tbody = document.querySelector('.table_category > tbody');
    tbody.innerHTML = '';
}

function creatRow(code, name, tax) {
    const tbody = document.querySelector('.table_category > tbody');
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${code}</td>
        <td>${name}</td>
        <td>${tax+ "%"}</td>
        <td><button type='button' onclick="removeLine(${code})"> X </button></td>
        `;
    tbody.appendChild(newRow);
}

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

updateTable();

