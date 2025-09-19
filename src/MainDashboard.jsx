import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Components/Navbar/Navbar";
import OrderForm from "./Components/OrderForm/OrderForm";
import OrderTable from "./Components/OrderTable/OrderTable";
import UploadCSV from "./Components/UploadCSV/UploadCSV";
import CreateOrder from "./Components/CreateOrder/CreateOrder";
import SearchBar from "./Components/SearchBar/SearchBar";
import StatusTabs from "./Components/StatusTabs/StatusTabs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [orders, setOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [editOrderData, setEditOrderData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("New");

  // Fetch all orders in MongoDB, including return shipment statuses
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/shopify/orders`);
      const localOrders = Array.isArray(res.data?.data) ? res.data.data : [];
      setOrders(localOrders);
      console.log("✅ Orders from DB:", localOrders);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      toast.error("Failed to fetch orders");
    }
  };

  // Manually trigger Shopify sync and refetch orders afterward
  const handleSyncOrders = async () => {
    try {
      await axios.get(`${API_URL}/api/shopify/sync-orders`);
      fetchOrders();
      toast.success("Shopify sync completed");
    } catch (err) {
      console.error("❌ Error syncing orders:", err);
      toast.error("Shopify sync failed");
    }
  };

  // Refresh orders after CSV upload
  const handleCSVUploaded = () => {
    fetchOrders();
    toast.success("File uploaded and orders refreshed");
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Save or update an order
  const handleSaveOrder = async (order) => {
    try {
      if (editOrderData) {
        const res = await axios.put(`${API_URL}/api/orders/${editOrderData._id}`, order);
        setOrders(orders.map((o) => (o._id === editOrderData._id ? res.data.data : o)));
      } else {
        const res = await axios.post(`${API_URL}/api/orders`, order);
        setOrders([res.data.data, ...orders]);
      }
      setShowOrderForm(false);
      setEditOrderData(null);
      toast.success("Order saved successfully");
    } catch (err) {
      console.error("❌ Error saving order:", err);
      toast.error("Failed to save order");
    }
  };

  // Handle action menu events like edit, clone, delete
  const handleAction = async (action, order) => {
    try {
      if (action === "editOrder") {
        setEditOrderData(order);
        setShowOrderForm(true);
      } else if (action === "forwardShip") {
        alert(`Forward shipping order ${order.orderId || order._id}`);
      } else if (action === "reverseShip") {
        alert(`Reverse shipping order ${order.orderId || order._id}`);
      } else if (action === "addTag") {
        const tag = prompt("Enter tag:");
        if (tag) {
          const updated = { ...order, tag };
          const res = await axios.put(`${API_URL}/api/orders/${order._id}`, updated);
          setOrders(orders.map((o) => (o._id === order._id ? res.data.data : o)));
          toast.success(`Tag '${tag}' added`);
        }
      } else if (action === "cloneOrder") {
        const clonedOrder = {
          ...order,
          orderId: (order.orderId || order._id) + "-CLONE",
        };
        delete clonedOrder._id;
        const res = await axios.post(`${API_URL}/api/orders`, clonedOrder);
        setOrders([res.data.data, ...orders]);
        toast.success("Order cloned");
      } else if (action === "deleteOrder") {
        if (window.confirm("Are you sure you want to delete this order?")) {
          await axios.delete(`${API_URL}/api/orders/${order._id}`);
          setOrders(orders.filter((o) => o._id !== order._id));
          toast.success("Order deleted");
        }
      }
    } catch (err) {
      console.error("❌ Error in action:", err);
      toast.error("Action failed");
    }
  };

  // Filter orders by search term and selected status tab
  const filteredOrders = orders.filter((order) => {
    const orderString = JSON.stringify(order).toLowerCase();
    const matchesStatus = selectedStatus ? (order.status || "New") === selectedStatus : true;
    return orderString.includes(searchTerm.toLowerCase()) && matchesStatus;
  });

  return (
    <>
      <Navbar />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StatusTabs selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />

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
            <button className="sync-btn" onClick={handleSyncOrders} style={{ marginLeft: 12 }}>
              Sync Shopify Orders
            </button>
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
