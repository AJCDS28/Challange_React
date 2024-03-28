import React from 'react';
import styles from '../layout/DeleteButton.module.css'


const DeleteButton = ({ url, code, action, onSuccess }) => {

  const handleDelete = async () => {
    const response = confirm('Deseja mesmo excluir?');
    if (response) {
      try {
        const formData = new FormData();
        formData.append('action', action)
        formData.append('code', code)
        const deleteResponse = await fetch(url, {
          method: 'POST',
          body: formData
        });
        const response = await deleteResponse.json();
        if (response!=false) {
          onSuccess();
        } else {
          throw new Error('Erro ao excluir.');
        }
      } catch (error) {
        console.error(error);
        alert("Não foi possivel remover, existe relação com outros");
      }
    }
  };

  return (
    <button onClick={handleDelete} className={styles.size}>Excluir</button>
  );
};

export default DeleteButton;
