// OrderTable.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import ActionMenu from "../ActionMenu/ActionMenu";
import "./OrderTable.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function OrderTable({ orders, onAction }) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [loadingReturnId, setLoadingReturnId] = useState(null);
  const [localOrders, setLocalOrders] = useState([...orders]);
  const menuRef = useRef(null);

  // Sync localOrders if props.orders change
  useEffect(() => {
    setLocalOrders([...orders]);
  }, [orders]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(null);
      }
    }
    function handleEsc(e) {
      if (e.key === "Escape") setMenuOpen(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "";

  // Pagination Logic
  const totalPages = Math.ceil(localOrders.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedOrders = localOrders.slice(startIdx, startIdx + pageSize);

  // Handle Return API call
 const handleReturnClick = async (order) => {
  setLoadingReturnId(order._id);

  try {
    // Provide default vendorName if missing
    const vendorName = order.vendorName || "Ekart";

    const payload = {
      shopifyId: order.shopifyId,
      orderId: order.orderId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      customerAddress: order.customerAddress,
      city: order.city,
      state: order.state,
      pincode: order.pincode,
      products: order.products,
      deadWeight: order.deadWeight,
      length: order.length,
      breadth: order.breadth,
      height: order.height,
      volumetricWeight: order.volumetricWeight,
      amount: order.amount,
      paymentMode: order.paymentMode,
      vendorName,  // use default if missing
      pickupAddress: order.pickupAddress,
      pickupCity: order.pickupCity,
      pickupState: order.pickupState,
      pickupPincode: order.pickupPincode,
      gstin: order.gstinNumber || "",
      hsn: order.hsnCode || order.hsn || "",
      invoiceId: order.invoiceReference || order.invoiceId || "",
    };

    const response = await axios.post(
      `${API_URL}http://localhost:4000/api/ekart/return`,
      payload
    );

    if (response.data.success) {
      setLocalOrders((prev) =>
        prev.map((o) =>
          o._id === order._id ? { ...o, status: "RETURN_REQUESTED" } : o
        )
      );
      toast.success(`Return requested successfully for order ${order.orderId}`);
    } else {
      toast.error(response.data.message || "Failed to create return");
    }
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
        err.message ||
        "Error calling Ekart API"
    );
  } finally {
    setLoadingReturnId(null);
  }
};

  return (
    <>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>AWB</th>
              <th>Order Number</th>
              <th>Date</th>
              <th>Customer Details</th>
              <th>Product Details</th>
              <th>Package Details</th>
              <th>Payment</th>
              <th>Payment Method</th>
              <th>Pickup Address</th>
              <th>Pickup City</th>
              <th>Pickup State</th>
              <th>Pickup Pincode</th>
              <th>GSTIN Number</th>
              <th>HSN Code</th>
              <th>Invoice Reference</th>
              <th>Return Label 1</th>
              <th>Return Label 2</th>
              <th>Service Tier</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...new Map(paginatedOrders.map((o) => [o.orderId, o])).values()].map(
              (order) => (
                <tr key={order._id}>
                  <td>{order.awb || ""}</td>
                  <td>#{order.orderId}</td>
                  <td>{formatDate(order.orderDate)}</td>
                  <td>
                    <div>{order.customerName}</div>
                    <div>{order.customerPhone}</div>
                    <div>{order.customerEmail}</div>
                    <div>{order.customerAddress}</div>
                  </td>
                  <td>
                    {order.products?.map((p, i) => (
                      <div key={i}>
                        {p.productName} (Qty: {p.quantity})
                      </div>
                    ))}
                  </td>
                  <td>
                    <div>Dead Weight: {order.deadWeight} kg</div>
                    <div>
                      Dimensions: {order.length} x {order.breadth} x {order.height} cm
                    </div>
                    <div>Vol. Weight: {order.volumetricWeight} kg</div>
                  </td>
                  <td>₹{order.amount}</td>
                  <td>{order.paymentMode}</td>
                  <td>
                    <div>{order.vendorName}</div>
                    <div>{order.pickupAddress}</div>
                  </td>
                  <td>{order.pickupCity || ""}</td>
                  <td>{order.pickupState || ""}</td>
                  <td>{order.pickupPincode || ""}</td>
                  <td>{order.gstinNumber || ""}</td>
                  <td>{order.hsnCode || order.hsn || ""}</td>
                  <td>{order.invoiceReference || order.invoiceId || ""}</td>
                  <td>{order.returnLabel1 || ""}</td>
                  <td>{order.returnLabel2 || ""}</td>
                  <td>{order.serviceTier || ""}</td>
                  <td>{order.category || ""}</td>
                  <td>{order.unitPrice ? `₹${order.unitPrice}` : ""}</td>
                  <td>{order.status}</td>
                  <td className="action-cell">
                    <button
                      className="btn"
                      onClick={() => handleReturnClick(order)}
                      disabled={loadingReturnId === order._id}
                      aria-busy={loadingReturnId === order._id}
                    >
                      {loadingReturnId === order._id ? "Processing..." : "Return"}
                    </button>
                    <span
                      className="three-dots"
                      onClick={(e) => {
                        const rect = e.target.getBoundingClientRect();
                        setMenuOpen({
                          id: order._id,
                          top: rect.bottom,
                          left: rect.left,
                        });
                      }}
                    >
                      ⋮
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
        >
          ⏮ First
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next ▶
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
        >
          Last ⏭
        </button>

        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          aria-label="Select page size"
        >
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={250}>250</option>
          <option value={500}>500</option>
          <option value={1000}>1000</option>
        </select>
      </div>

      {/* Render menu OUTSIDE table */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "fixed",
            top: menuOpen.top,
            left: menuOpen.left,
            zIndex: 2000,
          }}
        >
          <ActionMenu
            order={localOrders.find((o) => o._id === menuOpen.id)}
            onAction={onAction}
          />
        </div>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
