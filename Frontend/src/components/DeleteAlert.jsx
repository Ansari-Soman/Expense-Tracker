import React from "react";

const DeleteAlert = ({ content, onDelete, onClose }) => {
  return (
    <div className="">
      <p className="text-sm text-gray-700">{content}</p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-4 py-2 text-xs md:text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-250/80 rounded-lg cursor-pointer transition-all duration-200"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 text-xs md:text-sm font-medium text-white bg-red-500 hover:bg-red-650 rounded-lg cursor-pointer transition-all duration-200"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
