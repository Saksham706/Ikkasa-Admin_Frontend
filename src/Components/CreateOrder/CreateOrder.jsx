import React from 'react';
import './CreateOrder.css';

const CreateOrder = ({ onClick }) => {
  return (
    <div className='new-order'>
      <button className='btn' onClick={onClick}>+ Create Order</button>
    </div>
  );
};

export default CreateOrder;
