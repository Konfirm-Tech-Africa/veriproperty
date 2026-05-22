"use client";
import React from "react";

interface ScrollableCheckboxListProps {
  options: string[];
  selected: string[];
  onSelect: (value: string) => void;
  className?: string;
}

export default function ScrollableCheckboxList({
  options,
  selected,
  onSelect,
  className = "",
}: ScrollableCheckboxListProps) {
  const handleSelectAll = () => {
    if (options.every((opt) => selected.includes(opt))) {
      // deselect all
      options.forEach((opt) => onSelect(opt));
    } else {
      // select all
      options.forEach((opt) => {
        if (!selected.includes(opt)) onSelect(opt);
      });
    }
  };

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pr-3 ${className}`}>
      {options.map((opt, idx) => (
        <label
          key={`${opt}-${idx}`}
          className="flex items-center space-x-3 text-gray-700 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => {
              if (opt === "Select All") {
                handleSelectAll();
              } else {
                onSelect(opt);
              }
            }}
            className="w-5 h-5 lg:w-6 lg:h-6 accent-green-600 rounded border-gray-300 focus:ring-green-500"
          />
          <span className="text-sm lg:text-base">{opt}</span>
        </label>
      ))}
    </div>
  );
}