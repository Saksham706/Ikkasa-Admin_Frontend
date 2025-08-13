import React from "react";
import "./ActionMenu.css";

export default function ActionMenu({ order, onAction }) {
  return (
    <div className="action-menu">
      <div onClick={() => onAction("forwardShip", order)}>Forward Ship</div>
      <div onClick={() => onAction("reverseShip", order)}>Reverse Ship</div>
      <div onClick={() => onAction("editOrder", order)}>Edit Order</div>
      <div onClick={() => onAction("addTag", order)}>Add Tag</div>
      <div onClick={() => onAction("cloneOrder", order)}>Clone Order</div>
    </div>
  );
}
