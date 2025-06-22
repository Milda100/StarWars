import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMovies } from "../store/moviesSlice";
import { Card, Button, CardTitle, CardText } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";

const MoviesList = () => {
  const dispatch: AppDispatch = useDispatch();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorMessage />;

  return (
    <>
    <Link to={`/characters`}><Button>Characters</Button></Link>
      <h1 className="text-center m-4">Star Wars Movies</h1>
      <div className="row">
        {movies.map((movie) => (
          <div key={movie.episode_id} className="col-md-4 mb-4">
            <Link to={`/movies/${movie.episode_id}`} style={{ textDecoration: "none" }}>
              <Card aria-label={`Star Wars movie: ${movie.title}`}>
                <Card.Body className="d-flex flex-column text-center">
                  <CardTitle>{movie.title}</CardTitle>
                  <CardText>{movie.opening_crawl.slice(0, 128)}...</CardText>
                </Card.Body>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default MoviesList;
