import React from "react";
import './SearchBar.css'

function SearchBar({ searchText, onSearchChange }) {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search code by name..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-bar"
      />
      {searchText && (
        <button className="clear-btn" onClick={() => onSearchChange("")}>✖</button>
      )}
    </div>
  );
}

export default SearchBar;
