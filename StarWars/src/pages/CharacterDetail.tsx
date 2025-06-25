import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { useParams, Link } from "react-router-dom";
import { LoadingScreen, ErrorMessage, NotFound } from "../components/FeedbackScreens";
import { Container, Table } from "react-bootstrap";
import { extractIdFromUrl } from "../utils/helper";
import { fetchCharacterById } from "../store/characterDetailSlice";

// Define movie type explicitly
type Movie = {
  title: string;
  url: string;
};

const CharacterDetail = () => {
  const { id } = useParams<{ id: string }>();
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
  const characterId = characters.find((c) => extractIdFromUrl(c.url) === id);

  // Fallback: fetch single character and store it in Redux
  const characterDetail = useSelector((state: RootState) => state.characterDetail.character); // or use selector
  const character= characterId || characterDetail;

  useEffect(() => {
    if (!character && id) {
      dispatch(fetchCharacterById(id));
    }
  }, [dispatch, character, id]);

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

  if (loading || charMovieLoading) return <LoadingScreen />;
  if (error || charMovieError) return <ErrorMessage />;
  if (!character) return <NotFound message="Character not found" />;

  return (
    <Container className="my-4">
      <h1 className="mb-4">{character.name}</h1>

      <Table striped bordered hover>
        <tbody>
          <tr><td><strong>Height</strong></td><td>{character.height} cm</td></tr>
          <tr><td><strong>Mass</strong></td><td>{character.mass} kg</td></tr>
          <tr><td><strong>Hair Color</strong></td><td>{character.hair_color}</td></tr>
          <tr><td><strong>Skin Color</strong></td><td>{character.skin_color}</td></tr>
          <tr><td><strong>Eye Color</strong></td><td>{character.eye_color}</td></tr>
          <tr><td><strong>Birth Year</strong></td><td>{character.birth_year}</td></tr>
          <tr><td><strong>Gender</strong></td><td>{character.gender}</td></tr>
        </tbody>
      </Table>

      <div className="mt-4">
        <h4>Related Movies</h4>
        {charMovies.length === 0 ? (
          <p>No related movies found.</p>
        ) : (
          <ul>
            {charMovies.map((movie) => (
              <li key={movie.url}>
                <Link to={`/movies/${extractIdFromUrl(movie.url)}`}>
                  {movie.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Container>
  );
};

export default CharacterDetail;
