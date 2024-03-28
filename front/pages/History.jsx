import React, { useEffect, useState } from 'react'
import DynamicTable from '../components/layout/DynamicTable'
import styles from './History.module.css'
import Modal from '../components/layout/Modal';

const History = () => {
    const [ordersHistory, setOrdersHistory] = useState([]);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
    const [modal, setModal] = useState(false);
    const [orderCode, setOrderCode] = useState();

    useEffect(() => {
        updateTable();
    }, []);

    const viewOrderDetails = async (code) => {
        const productsItens = await readOrdersItensHistory(code);
        setSelectedOrderDetails(productsItens);
    };

    const updateTable = async () => {
        const ordersHistoryData = await readOrdersHistory();
        setOrdersHistory(ordersHistoryData);
    };

    const readOrdersHistory = async () => {
        const response = await fetch('http://localhost:80/routers/routerHistory.php', {
            method: 'GET'
        });
        const data = await response.json();
        return data;
    };

    const readOrdersItensHistory = async (code) => {
        const dataForm = new FormData();
        dataForm.append('action', 'readItens');
        dataForm.append('code', code);
        const response = await fetch('http://localhost:80/routers/routerHistory.php', {
            method: 'POST',
            body: dataForm
        });
        const data = await response.json();
        return data;
    };

    const columnsHistory = [
        { id: 'code', name: 'Code' },
        { id: 'tax', name: 'Tax' },
        { id: 'total', name: 'Total' },
        { id: 'details', name: 'Details' }
    ];

    function viewModal(code){
        setOrderCode(code);
        setModal(true);
        viewOrderDetails(code);
    }
    const data = [];
    for (let index = 0; index < ordersHistory.length; index++) {
        data[index] = {
            code: ordersHistory[index].code,
            tax: "$" + ordersHistory[index].tax,
            total: "$" + ordersHistory[index].total,
            view: <button onClick={ () => viewModal(ordersHistory[index].code)} value={orderCode} >View</button>
        }
    }
    const dataDetails = [];
    for (let index = 0; index < selectedOrderDetails.length; index++) {
        dataDetails[index] = {
            name: selectedOrderDetails[index].name_product,
            category: selectedOrderDetails[index].name_category,
            price: "$" + selectedOrderDetails[index].price,
            amount: selectedOrderDetails[index].amount,
            tax: "$" + selectedOrderDetails[index].tax,
            total: "$" + selectedOrderDetails[index].total
        }
    }
    return (
        <>
            <main className={styles.main}>
            <Modal 
                    modal={modal}
                    setModal={setModal}
                    selectedOrderDetails={dataDetails}
                />
                <article className={styles.menu_history}>
                    <DynamicTable
                        columns={columnsHistory}
                        data={data}
                    />
                </article>
            </main>
        </>
    );
};

export default History;
