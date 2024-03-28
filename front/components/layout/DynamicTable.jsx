import React from 'react';

const DynamicTable = ({ columns, data }) => {

  const Row = ({ record, index }) => {
    const values = Object.values(record);
    return (
      <tr key={index}>
        {values.map((value, idx) => <td key={idx}>{value}</td>)}
      </tr>
    );
  };

  return (
    
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.id}>{column.name}</th>
          ))
          }
          
        </tr>
      </thead>
      <tbody>  
        
       {data.map((record, index) => <Row key={index} index={index} record={record} />)}
        
      </tbody>
    </table>
  );
};

export default DynamicTable;