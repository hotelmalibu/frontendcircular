import React from "react";
import CategoryList from "./Subcomponents/News/CategoryList";

/**
 * Categories Component - Wrapper for Category management
 * This allows Categorías to be top-level in the Communications dashboard
 */
export default function Categories() {
    return (
        <div className="w-full">
            <CategoryList />
        </div>
    );
}
