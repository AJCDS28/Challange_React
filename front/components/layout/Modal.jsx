import React, { useState } from 'react'
import styles from './Modal.module.css'
import DynamicTable from './DynamicTable'

export default function Modal({ modal, setModal, selectedOrderDetails }) {

    const columnsDetails = [
        { id: 'name_product', name: 'Product' },
        { id: 'name_category', name: 'Category' },
        { id: 'price', name: 'Price' },
        { id: 'amount', name: 'Amount' },
        { id: 'tax', name: 'Tax' },
        { id: 'total', name: 'Total' }
    ];

    function closeModal() {
        setModal(!modal)
    }

    if (modal) {
        return (
            <div className={styles.modalDialog}>
                <div >
                    <button className={styles.close} onClick={() => closeModal()}>X</button>
                    <h2>Informations</h2>
                    <DynamicTable className={styles.table_modal}
                        columns={columnsDetails}
                        data={selectedOrderDetails}

                    />
                </div>

            </div>

        )
    }else{
        return null
    }
    

}
