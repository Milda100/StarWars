import { useState, useEffect } from "react";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

type Props = {
  options: string[]; // list of suggestions
  onSearch: (term: string) => void;
  onSelect: (selected: string) => void;
};

const SearchableDropdown = ({ options, onSelect }: Props) => {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const debouncedInput = useDebouncedValue(input, 1000);

  useEffect(() => {
    if (debouncedInput.trim() === "") {
      setFiltered([]);
      setShowDropdown(false);
    } else {
      const match = options.filter((opt) =>
        opt.toLowerCase().includes(debouncedInput.toLowerCase())
      );
      setFiltered(match);
      setShowDropdown(true);
    }
  }, [debouncedInput, options]);

  const handleSelect = (value: string) => {
    setInput(value);
    onSelect(value);
    setShowDropdown(false);
  };

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <input
        type="text"
        placeholder="Start typing..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", padding: "8px" }}
      />
      {showDropdown && filtered.length > 0 && (
        <ul
          style={{
            position: "absolute",
            width: "100%",
            margin: 0,
            padding: "0",
            listStyle: "none",
            border: "1px solid #ccc",
            backgroundColor: "white",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          {filtered.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
