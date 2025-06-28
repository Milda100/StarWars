import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import {LoadingScreen, ErrorMessage, NotFound,} from "../components/FeedbackScreens";
import { Col, Container, Row } from "react-bootstrap";
import { extractIdFromUrl } from "../utils/helper";
import { fetchCharacterById } from "../store/characterDetailSlice";
import { ROUTES } from "../routes/routes";

// Define movie type explicitly
type Movie = {
  title: string;
  id: string;
  url: string;
};

const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { characters, loading, error } = useSelector(
    (state: RootState) => state.characters
  );

  const [charMovies, setCharMovies] = useState<Movie[]>([]);
  const [charMovieLoading, setCharMovieLoading] = useState<boolean>(false);
  const [charMovieError, setCharMovieError] = useState<string | null>(null);

  // Fetch characters if not already loaded
  useEffect(() => {
    if (characters.length === 0) {
      dispatch(fetchCharacters(1));
    }
  }, [dispatch, characters.length]);

  // Find character by ID
  const characterFromList = characters.find((c) => extractIdFromUrl(c.url) === id);

  // Fallback: fetch single character and store it in Redux
  const characterDetail = useSelector(
    (state: RootState) => state.characterDetail.character
  ); // or use selector
  const character = characterFromList || characterDetail;

  useEffect(() => {
    if (id && !characterFromList) {
      dispatch(fetchCharacterById(id));
    }
  }, [dispatch, id, characterFromList]);

  // Fetch related movies
  useEffect(() => {
    if (!character?.films?.length) {
      setCharMovies([]);
      return;
    }

    const fetchCharMovies = async () => {
      setCharMovieLoading(true);
      setCharMovieError(null);
      try {
        const responses = await Promise.all(
          character.films.map((url) => fetch(url))
        );
        const data: Movie[] = await Promise.all(
          responses.map((res) => {
            if (!res.ok) throw new Error("Failed to fetch a movie");
            return res.json();
          })
        );
        setCharMovies(data);
      } catch {
        setCharMovieError("Failed to load related movies.");
      } finally {
        setCharMovieLoading(false);
      }
    };

    fetchCharMovies();
  }, [character]);

  if (loading) return <LoadingScreen message="Loading character..." />;
if (charMovieLoading) return <LoadingScreen message="Loading related movies..." />;
  if (error || charMovieError) return <ErrorMessage message={error || charMovieError || "Unknown error"} />;
  if (!character) return <NotFound message="Character not found" />;

  return (
    <>
        <Row className="m-2">
          <Col xs="auto">
            <button onClick={() => navigate(ROUTES.movies)}>Movies</button>
          </Col>
          <Col xs="auto">
            <button onClick={() => navigate(ROUTES.characters)}>Characters</button>
          </Col>
        </Row>
        <Container className="details-container text-center">
          <h1 className="mb-4">{character.name}</h1>
          <p><strong>Height:</strong> {character.height} cm</p>
          <p><strong>Mass:</strong> {character.mass} kg</p>
          <p><strong>Hair Color:</strong> {character.hair_color}</p>
          <p><strong>Skin Color:</strong> {character.skin_color}</p>
          <p><strong>Eye Color:</strong> {character.eye_color}</p>
          <p><strong>Birth Year:</strong> {character.birth_year}</p>
          <p><strong>Gender:</strong> {character.gender}</p>
          <div className="mt-4">
            <h4>Related Movies</h4>
            {charMovies.length === 0 ? (
              <p className="">No related movies found.</p>
            ) : (
              <ul className="list-unstyled link-list">
                {charMovies.map((movie) => (
                  <li key={extractIdFromUrl(movie.url)}>
                    <Link to={ROUTES.movieDetail(extractIdFromUrl(movie.url))}>
                      {movie.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
    </>
  );
};

export default CharacterDetail;
