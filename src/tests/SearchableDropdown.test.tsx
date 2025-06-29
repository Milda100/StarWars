import * as reactRedux from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchableDropdown from "../components/SearchableDropdown";
import { describe, it, expect, vi, beforeEach } from "vitest";
import '@testing-library/jest-dom';

// Mock useDispatch once globally so that we can track dispatch calls
const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  // Import the actual react-redux module so we only override useDispatch
  const actual = await vi.importActual<typeof reactRedux>("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch, // Override useDispatch to return our mock
  };
});

describe("SearchableDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test to avoid leak between tests
  });

    it("renders input and calls clearResults when input is cleared", async () => {
        // Mock useSelector to return empty search results and no error/loading state
        vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: { searchResults: [], loading: false, error: null },
        }),
        );

        const user = userEvent.setup(); // Setup userEvent for simulating user interactions
        const mockOnSelect = vi.fn(); // Mock callback for when an item is selected

        render(<SearchableDropdown onSelect={mockOnSelect} />); // Render component

        const input = screen.getByPlaceholderText(/search characters/i); // Grab input by placeholder

        await user.type(input, "luke"); // Type something in input
        await user.clear(input); // Clear the input, triggering clearResults dispatch

        expect(mockDispatch).toHaveBeenCalled(); // Verify dispatch was called on clearing input
        expect(mockOnSelect).not.toHaveBeenCalled(); // Ensure onSelect was NOT called
    });

    it("highlights first item with ArrowDown", async () => {
    vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: {
            searchResults: [
                { id: 1, name: "Luke Skywalker" },
                { id: 2, name: "Leia Organa" },
            ],
            loading: false,
            error: null,
            },
        }),
        );

        const user = userEvent.setup();
        const mockOnSelect = vi.fn();

        render(<SearchableDropdown onSelect={mockOnSelect} />);

        const input = screen.getByPlaceholderText(/search characters/i);
        await user.type(input, "l");
        await user.keyboard("{ArrowDown}");
        expect(input).toHaveAttribute("aria-activedescendant", "search-result-0");
    });

    it("selects highlighted item with Enter", async () => {
    vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: {
            searchResults: [
                { id: 1, name: "Luke Skywalker" },
                { id: 2, name: "Leia Organa" },
            ],
            loading: false,
            error: null,
            },
        }),
        );

        const user = userEvent.setup();
        const mockOnSelect = vi.fn();

        render(<SearchableDropdown onSelect={mockOnSelect} />);

        const input = screen.getByPlaceholderText(/search characters/i);
        await user.type(input, "l");
        await user.keyboard("{ArrowDown}");
        await user.keyboard("{Enter}");
        expect(mockOnSelect).toHaveBeenCalledWith({ id: 1, name: "Luke Skywalker" });
    });

    it("selects item on click", async () => {
        // Mock useSelector to return some search results
        vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: {
            searchResults: [
                { id: 1, name: "Luke Skywalker" },
                { id: 2, name: "Leia Organa" },
            ],
            loading: false,
            error: null,
            },
        }),
        );
    
        const user = userEvent.setup();
        const mockOnSelect = vi.fn();
    
        render(<SearchableDropdown onSelect={mockOnSelect} />);
    
        // Click the first result
        const firstResult = screen.getByText("Luke Skywalker");
        await user.click(firstResult);
    
        expect(mockOnSelect).toHaveBeenCalledWith({ id: 1, name: "Luke Skywalker" });
    });

    it("displays error message when error exists in state", () => {
        // Mock useSelector to simulate a search error state
        vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: {
            searchResults: [],
            loading: false,
            error: "Network error",
            },
        }),
        );

        const mockOnSelect = vi.fn();

        render(<SearchableDropdown onSelect={mockOnSelect} />);

        // Check that the error message is rendered in the DOM
        expect(screen.getByText("Network error")).toBeInTheDocument();
    });

    it("shows loading state when search is in progress", () => {
        // Mock useSelector to simulate loading state
        vi.spyOn(reactRedux, "useSelector").mockImplementation((selectorFn) =>
        selectorFn({
            search: {
            searchResults: [],
            loading: true,
            error: null,
            },
        }),
        );

        const mockOnSelect = vi.fn();

        render(<SearchableDropdown onSelect={mockOnSelect} />);

        // Check that the loading indicator is rendered
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        
    });    
});
