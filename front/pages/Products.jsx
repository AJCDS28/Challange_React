import Table from '../components/layout/DynamicTable'
import React, { useState, useEffect } from 'react'
import styles from '../pages/Products.module.css'
import DynamicForm from '../components/layout/DynamicForm'
import DeleteButton from '../components/layout/DeleteButton'

function Products() {
    const columns = [
        { id: 1, name: 'Code' },
        { id: 2, name: 'Product' },
        { id: 3, name: 'Category' },
        { id: 4, name: 'Amount' },
        { id: 5, name: 'Unit Price' },
        { id: 6, name: 'Delete' }
    ]
    const url = 'http://localhost:80/routers/routerProducts.php'
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [amount, setAmount] = useState('');
    const [unitPrice, setUnitPrice] = useState('');


    const fetchDataCategories = async () => {
        const response = await fetch('http://localhost:80/routers/routerCategories.php');
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const dataProducts = await response.json();
        setCategories(dataProducts);
    }
    useEffect(() => {
        fetchDataCategories();
        fetchDataProducts();
    }, []);

    async function fetchDataProducts() {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const data = await response.json();
        setProducts(data);
    }

    const handleDeleteSuccess = () => {
        fetchDataProducts(); 
    };

    const data = [];
    for (let index = 0; index < products.length; index++) {
        data[index] = {
            code: products[index].code_product,
            name: products[index].product_name,
            category: products[index].category_name,
            amount: products[index].amount,
            unitPrice: "$" + products[index].price,
            delete: <DeleteButton url={url} code={products[index].code_product} action={'deleteProduct'} onSuccess={handleDeleteSuccess}/>
        }
    }

    const handleFormSubmit = async (formData) => {
        const dataForm = new FormData();
        setProductName(formData.productName)
        dataForm.append('productName', formData.productName);
        dataForm.append('amountProduct', formData.amount);
        dataForm.append('unitPrice', formData.unitPrice);
        dataForm.append('Categoria', formData.Categories);

        if (await isNewProduct()) {
            dataForm.append('action', formData.action);
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            });
            
            if (response.ok) {
                alert('Produto inserido no carrinho com sucesso!');
                fetchDataProducts();
            }
        } else {
            const update = confirm("Produto já cadastrado, deseja atualiza-lo?");
            if (update) {
                dataForm.append('action', 'updateProduct');

                const response = await fetch(url, {
                    method: 'POST',
                    mode: 'cors',
                    body: dataForm
                })

                if (response.ok) {
                    alert('Produto atualizado com sucesso!');
                    fetchDataProducts();
                } else {
                    throw new Error('Erro ao atualizar produto');
                }
            }
        }
    };
    async function isNewProduct() {
        const datas = products;
        if (datas.length > 0) {
            for (let i = 0; i < datas.length; i++) {
                if (productName == datas[i]['product_name']) {
                    return false;
                }
            }
        }
        return true;
    }
    return (
        <>
            <main className={styles.main}>
                <article className={styles.menu_add_product}>
                    <DynamicForm
                        fields={[
                            { type: 'text', name: 'productName', placeholder: 'Product Name', required: true },
                            { type: 'number', name: 'amount', placeholder: 'Amount', step: '0', min: '1', required: true },
                            { type: 'number', name: 'unitPrice', placeholder: 'Unit price', step: '0.01', min: '0.01', required: true },
                            { type: 'select', name: 'Categories', placeholder: 'Select Category', required: true, options: categories.map(category => ({ value: category.code, label: category.name })) }
                        ]}
                        onSubmit={handleFormSubmit}
                        action={'action'}
                        options={'insertProducts'}
                    />
                </article>


                <article>
                    {<Table columns={columns} data={data} />}
                </article>
            </main>
        </>

    )

}

export default Products;