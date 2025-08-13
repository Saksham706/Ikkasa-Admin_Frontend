import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import "./OrderForm.css";

export default function OrderForm({ onSave, onClose, editData }) {
  const [order, setOrder] = useState({
    orderId: "",
    orderDate: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    products: [{ productName: "", quantity: 1 }],
    deadWeight: "",
    length: "",
    breadth: "",
    height: "",
    amount: "",
    paymentMode: "",
    vendorName: "",
    pickupAddress: "",
    status: "PENDING",
  });

  useEffect(() => {
    if (editData) setOrder(editData);
  }, [editData]);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleProductChange = (i, field, value) => {
    const newProducts = [...order.products];
    newProducts[i][field] = value;
    setOrder({ ...order, products: newProducts });
  };

  const addProduct = () => {
    setOrder({
      ...order,
      products: [...order.products, { productName: "", quantity: 1 }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order);

    if (editData) {
      toast.success("✅ Order updated successfully!");
    } else {
      toast.success("✅ Order saved successfully!");
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <button type="button" className="close-btn" onClick={onClose}>
        x
      </button>
      <h2>{editData ? "Edit Order" : "New Order"}</h2>

      <div className="form-grid">
        <div>
          <label>Order ID:</label>
          <input
            name="orderId"
            value={order.orderId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Order Date:</label>
          <input
            type="date"
            name="orderDate"
            value={order.orderDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Customer Name:</label>
          <input
            name="customerName"
            value={order.customerName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            name="customerPhone"
            value={order.customerPhone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="customerEmail"
            value={order.customerEmail}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            name="customerAddress"
            value={order.customerAddress}
            onChange={handleChange}
            rows="2"
          />
        </div>
      </div>

      <h3>Products</h3>
      {order.products.map((p, i) => (
        <div key={i} className="product-row">
          <input
            placeholder="Product Name"
            value={p.productName}
            onChange={(e) =>
              handleProductChange(i, "productName", e.target.value)
            }
          />
          <input
            type="number"
            placeholder="Qty"
            value={p.quantity}
            onChange={(e) =>
              handleProductChange(i, "quantity", e.target.value)
            }
          />
          {order.products.length > 1 && (
            <button
              type="button"
              className="delete-btn"
              onClick={() => {
                const newProducts = order.products.filter(
                  (_, index) => index !== i
                );
                setOrder({ ...order, products: newProducts });
              }}
            >
              <MdDelete />
            </button>
          )}
        </div>
      ))}
      <button className="btn" type="button" onClick={addProduct}>
        Add Product
      </button>

      <div className="form-grid">
        <div>
          <label>Dead Weight (Kg):</label>
          <input
            name="deadWeight"
            type="number"
            value={order.deadWeight}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Length (cm):</label>
          <input
            name="length"
            type="number"
            value={order.length}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Breadth (cm):</label>
          <input
            name="breadth"
            type="number"
            value={order.breadth}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Height (cm):</label>
          <input
            name="height"
            type="number"
            value={order.height}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={order.amount}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Payment Mode:</label>
          <select
            name="paymentMode"
            value={order.paymentMode}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="COD">COD</option>
            <option value="Prepaid">Prepaid</option>
          </select>
        </div>
        <div>
          <label>Vendor Name:</label>
          <input
            name="vendorName"
            value={order.vendorName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Pickup Address:</label>
          <textarea
            name="pickupAddress"
            value={order.pickupAddress}
            onChange={handleChange}
            rows="2"
          />
        </div>
      </div>

      <button className="btn" type="submit">
        {editData ? "Update Order" : "Save Order"}
      </button>
    </form>
  );
}
