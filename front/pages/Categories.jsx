import styles from '../pages/Categories.module.css'
import Table from '../components/layout/DynamicTable'
import React, { useState, useEffect } from 'react'
import DynamicForm from '../components/layout/DynamicForm'
import DeleteButton from '../components/layout/DeleteButton'

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [tax, setTax] = useState('');
    const url = 'http://localhost:80/routers/routerCategories.php'

    const handleDeleteSuccess = () => {
        fetchData(); 
    };
    
    const fetchData = async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao ler dados do servidor');
        }
        const dataProducts = await response.json();
        setCategories(dataProducts);
    }
    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { id: 1, name: 'Code' },
        { id: 2, name: 'Category' },
        { id: 3, name: 'Tax' },
        { id: 4, name: 'Delete' }
    ]

    const data = [];
    for (let index = 0; index < categories.length; index++) {
        data[index] = {
            code: categories[index].code,
            name: categories[index].name,
            tax: categories[index].tax + "%",
            delete: <DeleteButton url={url} code={categories[index].code} action={'deleteCategory'} onSuccess={handleDeleteSuccess}/>
        }
    }
    
    const handleFormSubmit = async (formData) => {
        console.log(formData)
        const dataForm = new FormData();
        dataForm.append('action', formData.action);
        dataForm.append('categoryName', formData.categoryName);
        dataForm.append('taxCategory', formData.tax);

        try {
            const response = await fetch(url, {
                method: 'POST',
                mode: 'cors',
                body: dataForm
            });
            if (response.ok) {
                setCategoryName('');
                setTax('');
                alert('Categoria adicionada com sucesso!');
                 fetchData();
            } else {  
                throw new Error('Erro ao adicionar categoria');
            }
        } catch (error) {
            console.error(error);
            alert('Erro ao adicionar categoria');
        }
    };

    return (
        <main className={styles.main}>
            <article className={styles.menu_add_category}>
            <DynamicForm
                    fields={[
                        { type: 'text', name: 'categoryName', placeholder: 'Category name', required: true },
                        { type: 'number', name: 'tax',  placeholder: 'Tax', step: '0.01', min: '0.01', required: true }
                    ]}
                    onSubmit={handleFormSubmit}
                    action={'action'}
                    options={'addCategory'}
                />

            </article>

            <article>
                {<Table columns={columns} data={data} />}

            </article>
        </main>

    )

}

export default Categories;