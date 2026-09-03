import { useState } from "react";

export default function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    onSearch(trimmed);
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a city — e.g. Hyderabad, Nellore, London"
        aria-label="City name"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
