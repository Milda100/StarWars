import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { Card, CardTitle } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";

const CharactersList = () => {
    const dispatch: AppDispatch = useDispatch();
    const { characters, page, hasMore, loading, error } = useSelector(
        (state: RootState) => state.characters
    );

    const loaderRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      if (page === 0 && characters.length === 0) {
        dispatch(fetchCharacters(1));
      }
    }, [dispatch, characters.length, page]);

    useEffect(() => {
      if (!hasMore || loading) return;

      const observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            dispatch(fetchCharacters(page + 1));
          }
        },
        { threshold: 1.0 }
      );

    const current = loaderRef.current;
      if (current) observer.observe(current);

      return () =>  observer.disconnect();

    }, [dispatch, page, hasMore, loading]);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorMessage />;

    return (
        <>
      <h1 className="text-center m-4">Star Wars Characters</h1>
      <div className="row">
        {characters.map((character) => {
          const characterId = extractIdFromUrl(character.url);
          return (
            <div key={character.url} className="col-md-4 mb-4">
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
        {hasMore && <div ref={loaderRef} style={{ height: '1px' }} />}
      </div>
    </>
  );
};

export default CharactersList;