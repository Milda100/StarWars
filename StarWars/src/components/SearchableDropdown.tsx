import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchSearchCharacters, clearResults } from "../store/searchSlice";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import React from "react";
import { useNavigate } from "react-router-dom";
import { extractIdFromUrl } from "../utils/helper";
import { ROUTES } from "../routes/routes";
import type { People } from "../store/charactersSlice";


interface CharacterType {
  name: string;
  url: string;
  // any other fields you fetch
}

interface Props {
  onSelect: (result: People) => void;
}

const SearchableDropdown: React.FC<Props> = ({ onSelect }) => {
  const dispatch: AppDispatch = useDispatch();
  const { searchResults, loading, error } = useSelector((state: RootState) => state.search);

  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query, 1000); // 1s debounce


  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      dispatch(fetchSearchCharacters(debouncedQuery));
    } else {
      dispatch(clearResults());
    }
  }, [debouncedQuery, dispatch]);

  // onSelect handler passes full character, not just name
  const handleSelect = (result: CharacterType) => {
    onSelect(result);
    setQuery("");
    setHighlightIndex(-1);
    dispatch(clearResults());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev <= 0 ? searchResults.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelect(searchResults[highlightIndex]);
    }
  };

  return (
    <div
      style={{ position: "relative", width: "300px" }}
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={searchResults.length > 0}
    >
      <input
        type="text"
        aria-label="Character search input"
        value={query}
        placeholder="Search characters..."
        onChange={(e) => {
          const value = e.target.value;
          setQuery(value);
          setHighlightIndex(-1);
          if (value.trim() === "") {
            dispatch(clearResults());
          }
        }}
        onKeyDown={handleKeyDown}
        aria-controls="search-dropdown"
        aria-autocomplete="list"
        style={{ width: "100%", padding: "8px" }}
      />
      {loading && <div>Loading...</div>}

      {!loading && query && searchResults.length === 0 && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "white",
            padding: "8px",
            border: "1px solid #ccc",
            width: "100%",
            zIndex: 1000,
          }}
        >
          No results found
        </div>
      )}

      {searchResults.length > 0 && (
        <ul
          id="search-dropdown"
          role="listbox"
          style={{
            position: "absolute",
            width: "100%",
            margin: 0,
            padding: 0,
            listStyle: "none",
            border: "1px solid #ccc",
            backgroundColor: "white",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {searchResults.map((result, idx) => (
            <li
              key={result.url}
              role="option"
              aria-selected={highlightIndex === idx}
              onClick={() => handleSelect(result)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
                backgroundColor: highlightIndex === idx ? "#f0f0f0" : "white",
              }}
            >
              {result.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
