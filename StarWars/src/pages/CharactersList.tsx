import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { Card, CardTitle } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";

const CharactersList = () => {
    const dispatch: AppDispatch = useDispatch();
    const { characters, loading, error } = useSelector(
        (state: RootState) => state.characters
    );

    useEffect(() => {
        dispatch(fetchCharacters());
      }, [dispatch]);

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
      </div>
    </>
  );
};

export default CharactersList;