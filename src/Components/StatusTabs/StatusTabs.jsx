import React from "react";
import "./StatusTabs.css";

export default function StatusTabs({ selectedStatus, setSelectedStatus }) {
  const statuses = [
    "New",
    "InfoReceived",
    "OutForPickup",
    "PickUpFromSeller",
    "InTransit",
    "Received at Facility",
    "Out for Delivery",
    "AttemptFail",
    "Delivered",
    "Available for Pickup",
    "Exception",
    "Expired",
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
