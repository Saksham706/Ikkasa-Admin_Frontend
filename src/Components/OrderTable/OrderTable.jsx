import React, { useState, useEffect, useRef } from "react";
import ActionMenu from "../ActionMenu/ActionMenu";
import "./OrderTable.css";

export default function OrderTable({ orders, onAction }) {
  const [menuOpen, setMenuOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100); // Change this to 250, 500, 1000 if needed
  const menuRef = useRef(null);

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
  const totalPages = Math.ceil(orders.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const paginatedOrders = orders.slice(startIdx, startIdx + pageSize);

  return (
    <>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Date</th>
              <th>Customer Details</th>
              <th>Product Details</th>
              <th>Package Details</th>
              <th>Payment</th>
              <th>Payment Method</th>
              <th>Pickup Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[...new Map(paginatedOrders.map(o => [o.orderId, o])).values()].map((order) => (
              <tr key={order._id}>
                <td>
                  <div>#{order.orderId}</div>
                </td>
                <td>
                  <div>{formatDate(order.orderDate)}</div>
                </td>
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
                <td>
                  <div>₹{order.amount}</div>
                </td>
                <td>
                  <div>{order.paymentMode}</div>
                </td>
                <td>
                  <div>{order.vendorName}</div>
                  <div>{order.pickupAddress}</div>
                </td>
                <td>{order.status}</td>
                <td className="action-cell">
                  <button className="btn">Return</button>
                  <span
                    className="three-dots"
                    onClick={(e) => {
                      const rect = e.target.getBoundingClientRect();
                      setMenuOpen({
                        id: order._id,
                        top: rect.bottom,
                        left: rect.left
                      });
                    }}
                  >
                    ⋮
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>⏮ First</button>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>◀ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next ▶</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)}>Last ⏭</button>

        <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
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
            zIndex: 2000
          }}
        >
          <ActionMenu
            order={orders.find((o) => o._id === menuOpen.id)}
            onAction={onAction}
          />
        </div>
      )}
    </>
  );
}
