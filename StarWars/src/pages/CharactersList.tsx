import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { Card, CardTitle, Row } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";
import SearchableDropdown from "../components/SearchableDropdown";
import { ROUTES } from "../routes/routes";
import { fetchCharacterById } from "../store/characterDetailSlice";

const CharactersList = () => {
  const dispatch: AppDispatch = useDispatch();

  const { characters, page, hasMore, loading, error, fetchedPages } =
    useSelector((state: RootState) => state.characters);

  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleCharacterSelect = (result: { name: string; url: string }) => {
    const characterId = extractIdFromUrl(result.url);
    navigate(ROUTES.characterDetail(characterId));
  };

  useEffect(() => {
    if (characters.length === 0) {
      dispatch(fetchCharacters(1));
    }
  }, [dispatch, characters.length]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    if (fetchedPages.includes(nextPage)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchCharacters(page + 1));
        }
      },
      { threshold: 0 }
    );
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [dispatch, page, hasMore, loading, fetchedPages]);

  if (loading && characters.length === 0) return <LoadingScreen />;
  if (error) return <ErrorMessage />;

  return (
    <>
      <h1 className="text-center m-4">Star Wars Characters</h1>
      <SearchableDropdown onSelect={handleCharacterSelect} />
      <Row>
        {characters.map((character) => {
          const characterId = extractIdFromUrl(character.url);
          return (
            <div key={character.url} className="mb-4">
              <Link
                to={ROUTES.characterDetail(characterId)}
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
        {hasMore && <div ref={loaderRef} style={{ height: "1px" }} />}
      </Row>
    </>
  );
};

export default CharactersList;
