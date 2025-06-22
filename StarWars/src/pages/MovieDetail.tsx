import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMovies } from "../store/moviesSlice";
import { useParams, Link } from "react-router-dom";
import {LoadingScreen, ErrorMessage, NotFound,} from "../components/FeedbackScreens";
import { Container } from "react-bootstrap";
import { extractIdFromUrl } from '../utils/helper';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  
  const { movies, loading: moviesLoading, error: moviesError } = useSelector(
    (state: RootState) => state.movies
  );

  //movie characters
  const [movieCharacters, setMovieCharacters] = useState<{ name: string; url: string }[]>([]);
  const [charLoading, setCharLoading] = useState(true);
  const [charError, setCharError] = useState<string | null>(null);

  //movie info
  useEffect(() => {
    if (movies.length === 0) { //fetches again only if movie array is empty
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  const movie = movies.find((m) => m.episode_id === Number(id));

  //movies characters
  useEffect(() => {
    if (!movie) return;

    const fetchCharacters = async () => {
      try {
        setCharLoading(true);
        const responses = await Promise.all(movie.characters.map((url) => fetch(url)));
        const data = await Promise.all(responses.map((res) => res.json()));
        setMovieCharacters(data);
      } catch (error) {
        setCharError("Failed to load characters.");
      } finally {
        setCharLoading(false);
      }
    };

    fetchCharacters();
  }, [movie]);

  if (moviesLoading || charLoading) return <LoadingScreen />;
  if (moviesError || charError) return <ErrorMessage />;
  if (!movie) return <NotFound message="Movie not found" />;

  return (
    <>
      <Container className="text-center">
        <h1 className="m-4">{movie.title}</h1>
        <p>
          <strong>Episode:</strong> {movie.episode_id}
        </p>
        <p>
          <strong>Opening Crawl:</strong>
        </p>
        <p style={{ whiteSpace: "pre-wrap" }}>{movie.opening_crawl}</p>
        <p>
          <strong>Director:</strong> {movie.director}
        </p>
        <p>
          <strong>Producer:</strong> {movie.producer}
        </p>
        <p>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <div className="mt-4">
          <h4>Characters</h4>
          <ul className="list-unstyled">
                    {movieCharacters.map((character) => (
                    <li key={character.url}>
                        <Link to={`/character/${extractIdFromUrl(character.url)}`} style={{ textDecoration: "none" }}>{character.name}</Link>
                    </li>
                    ))}
                </ul>
        </div>
      </Container>
    </>
  );
};

export default MovieDetail;
