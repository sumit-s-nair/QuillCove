import React from "react";
import { Star, Tag, Archive } from "lucide-react";

interface FilterTabsProps {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  availableLabels: string[];
  noteCount: number;
  starredCount: number;
}

const FilterTabs = React.memo<FilterTabsProps>(({
  activeFilter,
  setActiveFilter,
  availableLabels,
  noteCount,
  starredCount,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
      <button
        onClick={() => setActiveFilter("All Notes")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
          activeFilter === "All Notes"
            ? "bg-white text-gray-900"
            : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
        }`}
      >
        All Notes <span className="ml-1 text-xs opacity-70">{noteCount}</span>
      </button>
      
      <button
        onClick={() => setActiveFilter("Starred")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
          activeFilter === "Starred"
            ? "bg-yellow-400 text-gray-900"
            : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
        }`}
      >
        <Star size={14} />
        Starred <span className="ml-1 text-xs opacity-70">{starredCount}</span>
      </button>

      {availableLabels.map((label) => (
        <button
          key={label}
          onClick={() => setActiveFilter(label)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeFilter === label
              ? "bg-purple-500 text-white"
              : "bg-gray-800/40 text-gray-300 hover:bg-gray-700/40"
          }`}
        >
          <Tag size={14} />
          {label}
        </button>
      ))}
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";

export default FilterTabs;
