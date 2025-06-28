import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchSearchCharacters, clearResults } from "../store/searchSlice";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import React from "react";
import type { People } from "../store/charactersSlice";


interface Props {
  onSelect: (result: People) => void;
}

const SearchableDropdown: React.FC<Props> = ({ onSelect }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch: AppDispatch = useDispatch();
  const { searchResults, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  
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
  const handleSelect = (result: People) => {
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
    } else if (e.key === "Escape") {
      setQuery("");
      setHighlightIndex(-1);
      dispatch(clearResults());
      (e.target as HTMLInputElement).blur();
    }
  };

    useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setQuery("");
        setHighlightIndex(-1);
        dispatch(clearResults());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div
      ref={dropdownRef}
      className="search-dropdown"
      role="combobox"
      aria-haspopup="listbox"
      aria-expanded={searchResults.length > 0 && !error}
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
      />

      {/* Loading */}
      {loading && <div className="loading">Loading...</div>}

      {/* Error (non-blocking) */}
      {!loading && error && (
        <div className="dropdown-error" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {/* No results */}
      {!loading && query && searchResults.length === 0 && !error && (
        <div className="no-results">No results found</div>
      )}

      {/* Results */}
      {!loading && !error && searchResults.length > 0 && (
        <ul id="search-dropdown" role="listbox">
          {searchResults.map((result, idx) => (
            <li
              key={result.url}
              role="option"
              aria-selected={highlightIndex === idx}
              onClick={() => handleSelect(result)}
              tabIndex={0}
            >
              {result.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchableDropdown;
