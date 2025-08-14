import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar/Navbar";
import OrderForm from "./Components/OrderForm/OrderForm";
import OrderTable from "./Components/OrderTable/OrderTable";
import UploadCSV from "./Components/UploadCSV/UploadCSV";
import CreateOrder from "./Components/CreateOrder/CreateOrder";
import SearchBar from "./Components/SearchBar/SearchBar";
import StatusTabs from "./Components/StatusTabs/StatusTabs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

// ✅ Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editOrderData, setEditOrderData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("New");

  // Fetch from both sources
 const fetchOrders = async () => {
  try {
    const syncRes = await axios.get(`${API_URL}/api/shopify/sync-orders`);
    const localRes = await axios.get(`${API_URL}/api/orders`);
    
    const allOrders = [...localRes.data, ...syncRes.data.data];
    const sortedOrders = allOrders.sort(
      (a, b) =>
        new Date(b.orderDate || b.createdAt) -
        new Date(a.orderDate || a.createdAt)
    );
    setOrders(sortedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
};

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSaveOrder = async (order) => {
    try {
      if (editOrderData) {
        const res = await axios.put(
          `${API_URL}/api/orders/${editOrderData._id}`,
          order
        );
        setOrders(
          orders.map((o) => (o._id === editOrderData._id ? res.data : o))
        );
      } else {
        const res = await axios.post(`${API_URL}/api/orders`, order);
        setOrders([res.data, ...orders]);
      }
      setShowOrderForm(false);
      setEditOrderData(null);
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  const handleAction = async (action, order) => {
    try {
      if (action === "editOrder") {
        setEditOrderData(order);
        setShowOrderForm(true);
      } else if (action === "forwardShip") {
        alert(`Forward shipping order ${order.orderId}`);
      } else if (action === "reverseShip") {
        alert(`Reverse shipping order ${order.orderId}`);
      } else if (action === "addTag") {
        const tag = prompt("Enter tag:");
        if (tag) {
          const updated = { ...order, tag };
          const res = await axios.put(
            `${API_URL}/api/orders/${order._id}`,
            updated
          );
          setOrders(
            orders.map((o) => (o._id === order._id ? res.data : o))
          );
        }
      } else if (action === "cloneOrder") {
        const clonedOrder = { ...order, orderId: order.orderId + "-CLONE" };
        delete clonedOrder._id;
        const res = await axios.post(`${API_URL}/api/orders`, clonedOrder);
        setOrders([res.data, ...orders]);
      } else if (action === "deleteOrder") {
        if (window.confirm("Are you sure you want to delete this order?")) {
          await axios.delete(`${API_URL}/api/orders/${order._id}`);
          setOrders(orders.filter((o) => o._id !== order._id));
        }
      }
    } catch (err) {
      console.error("Error in action:", err);
    }
  };

  const handleCSVUploaded = () => {
    fetchOrders(); // refresh after CSV upload
  };

  const filteredOrders = orders.filter((order) => {
    const orderString = JSON.stringify(order).toLowerCase();
    return orderString.includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <Navbar />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StatusTabs
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {selectedStatus === "New" && (
        <>
          <div className="order-actions">
            <CreateOrder
              onClick={() => {
                setEditOrderData(null);
                setShowOrderForm(true);
              }}
            />
            <UploadCSV onUploaded={handleCSVUploaded} />
          </div>
          <OrderTable orders={filteredOrders} onAction={handleAction} />
        </>
      )}

      {showOrderForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <OrderForm
              onSave={handleSaveOrder}
              onClose={() => setShowOrderForm(false)}
              editData={editOrderData}
            />
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
}
