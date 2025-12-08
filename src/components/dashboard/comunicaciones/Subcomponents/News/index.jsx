import React, { useState } from "react";
import NewsList from "./NewsList";
import CategoryList from "./CategoryList";

/**
 * Main News Management Component
 * This is the entry point for the News management section
 * Includes tabs for News and Categories management
 */
export default function News() {
  const [activeTab, setActiveTab] = useState("news");

  const tabs = [
    { id: "news", label: "Noticias", component: NewsList },
    { id: "categories", label: "Categorías", component: CategoryList },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || NewsList;

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <ActiveComponent />
    </div>
  );
}
