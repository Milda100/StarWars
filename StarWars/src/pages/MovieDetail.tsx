import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMovies } from "../store/moviesSlice";
import { useParams, Link } from "react-router-dom";
import {
  LoadingScreen,
  ErrorMessage,
  NotFound,
} from "../components/FeedbackScreens";
import { Container } from "react-bootstrap";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    if (movies.length === 0) {
      //fetches again only if movie array is empty
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  const movie = movies.find((m) => m.episode_id === Number(id));

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage />;
  if (!movie) return <NotFound />;

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
          {/* <ul className="list-unstyled">
                    {characters.map((char) => (
                    <li key={char.id}>
                        <Link to={`/character/${char.id}`}>{char.name}</Link>
                    </li>
                    ))}
                </ul> */}
        </div>
      </Container>
    </>
  );
};

export default MovieDetail;
