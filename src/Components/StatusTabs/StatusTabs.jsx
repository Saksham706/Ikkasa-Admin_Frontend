import React from "react";
import "./StatusTabs.css";

export default function StatusTabs({ selectedStatus, setSelectedStatus }) {
  const statuses = [
    "New",
    "Scheduled",
    "Picked up & In Transit",
    "Out for Delivery",
    "Delivered"
  ];

  return (
    <div className="status-tabs">
      {statuses.map((status) => (
        <button
          key={status}
          className={selectedStatus === status ? "active" : ""}
          onClick={() => setSelectedStatus(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
