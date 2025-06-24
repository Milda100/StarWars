import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { Card, CardTitle, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";
import SearchableDropdown from "../components/SearchableDropdown";

const CharactersList = () => {
    const dispatch: AppDispatch = useDispatch();
    const { characters, page, hasMore, loading, error, fetchedPages } = useSelector(
        (state: RootState) => state.characters
    );
    
    
console.log("useEffect: page =", page, "fetchedPages =", fetchedPages, "loading =", loading, "hasMore =", hasMore);

const nextPage = page + 1;

if (fetchedPages.includes(nextPage)) {
  console.log(`Page ${nextPage} already fetched. No dispatch.`);
  return;
}

    const [searchTerm, setSearchTerm] = useState("");
    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (characters.length === 0) {
        dispatch(fetchCharacters(1));
      }
    }, [dispatch, characters.length]);

    useEffect(() => {
    if (searchTerm.trim() !== "") return; // Disable infinite scroll during search
     if (loading || !hasMore) return;

      const nextPage = page + 1;
      if (fetchedPages.includes(nextPage)) return;

      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            dispatch(fetchCharacters(page + 1));
          }
        },
        { threshold: 0 }
      );

    const current = loaderRef.current;
      if (current) observer.observe(current);

      return () =>  observer.disconnect();
    }, [dispatch, page, hasMore, loading, searchTerm, fetchedPages]);

    const filteredCharacters = characters.filter(character =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const navigate = useNavigate();

    const handleSelect = (selectedName: string) => {
      const matched = characters.find((c) =>
        c.name.toLowerCase() === selectedName.toLowerCase()
      );

      if (matched) {
        const characterId = extractIdFromUrl(matched.url);
        navigate(`/character/${characterId}`);
      }
    };

    if (loading && characters.length === 0) return <LoadingScreen />;
    if (error) return <ErrorMessage />;

    return (
        <>
      <h1 className="text-center m-4">Star Wars Characters</h1>
      <SearchableDropdown options={characters.map(c => c.name)} onSearch={(term) => setSearchTerm(term)} onSelect={handleSelect}/>
      <Row>
        {filteredCharacters.map((character) => {
          const characterId = extractIdFromUrl(character.url);
          return (
            <div key={character.url} className="mb-4">
              <Link
                to={`/character/${characterId}`}
                style={{ textDecoration: "none" }}
              >
                <Card aria-label={`Star Wars character: ${character.name}`}>
                  <Card.Body className="d-flex flex-column text-center">
                    <CardTitle>{character.name}</CardTitle>
                  </Card.Body>
                </Card>
              </Link>
            </div>
          );
        })}
        {searchTerm.trim() === "" && hasMore && (
          <div ref={loaderRef} style={{ height: '1px' }} />
        )}
      </Row>
    </>
  );
};

export default CharactersList;
