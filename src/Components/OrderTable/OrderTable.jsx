import React, { useState, useEffect, useRef } from "react";
import ActionMenu from "../ActionMenu/ActionMenu";
import "./OrderTable.css";

export default function OrderTable({ orders, onAction }) {
  const [menuOpen, setMenuOpen] = useState(null);
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
  {[...new Map(orders.map(o => [o.orderId, o])).values()].map((order) => (
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
