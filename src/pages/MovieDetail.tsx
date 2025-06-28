import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMovies } from "../store/moviesSlice";
import { useParams, Link, useNavigate } from "react-router-dom";
import {LoadingScreen, ErrorMessage, NotFound,} from "../components/FeedbackScreens";
import { Col, Container, Row } from "react-bootstrap";
import { extractIdFromUrl } from '../utils/helper';
import { ROUTES } from "../routes/routes";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  
  const { movies, loading: moviesLoading, error: moviesError } = useSelector(
    (state: RootState) => state.movies
  );

  //movie characters
  const [movieCharacters, setMovieCharacters] = useState<{ name: string; url: string }[]>([]);
  const [charLoading, setCharLoading] = useState(true);
  const [charError, setCharError] = useState<string | null>(null);
 
  const movie = movies.find((m) => extractIdFromUrl(m.url) === id); 

  //movie info
  useEffect(() => {
    if (movies.length === 0) { //fetches again only if movie array is empty
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  //movies characters
  useEffect(() => {
    if (!movie || !movie.characters?.length) {
      setMovieCharacters([]);
      setCharLoading(false);
      return;
    }

    const fetchMovieCharacters = async () => {
      try {
        setCharLoading(true);
        const responses = await Promise.all(movie.characters.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        setMovieCharacters(data);
      } catch (error) {
        setCharError("Failed to load movie characters.");
      } finally {
        setCharLoading(false);
      }
    };

    fetchMovieCharacters();
  }, [movie]);

  if (moviesLoading || charLoading) return <LoadingScreen />;
  if (moviesError || charError) {
  return <ErrorMessage message={moviesError || charError || undefined} />;}
  if (!movie) return <NotFound message="Movie not found" />;

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
        <h1 className="m-4">{movie.title}</h1>
        <p><strong>Movie ID:</strong> {movie.episode_id}</p>
        <p><strong>Opening Crawl:</strong></p>
        <p>{movie.opening_crawl}</p>
        <p><strong>Director:</strong> {movie.director}</p>
        <p><strong>Producer:</strong> {movie.producer}</p>
        <p><strong>Release Date:</strong> {movie.release_date}</p>
        <div className="mt-4">
          <h4>Characters</h4>
          {movieCharacters.length === 0 ? (
            <p>No characters found.</p>
          ) : (
          <ul className="list-unstyled link-list">
            {movieCharacters.map((character) => (
              <li key={character.url}>
                <Link to={ROUTES.characterDetail(extractIdFromUrl(character.url))}>
                  {character.name}
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

export default MovieDetail;
