import React from "react";
import NewsList from "./NewsList";

/**
 * Main News Management Component
 * This is the entry point for the News management section
 * Includes tabs for News and Categories management
 */
export default function News() {
  return (
    <div className="w-full">
      <NewsList />
    </div>
  );
}

