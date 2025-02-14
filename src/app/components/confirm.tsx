"use client";
import React from "react";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{message}</h2>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-500">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
