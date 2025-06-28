import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchMovies } from "../store/moviesSlice";
import { Card, CardTitle, CardText, Container, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";
import { ROUTES } from "../routes/routes";

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
  <Link to={ROUTES.characters}><button className="m-2">Characters</button></Link>
  <h1 className="mt-3 mb-5">Star Wars Movies</h1>
  <Col>
    {movies.map((movie) => {
      const id = extractIdFromUrl(movie.url);
      return (
        <Container key={id} className="mb-4" style={{ width: "100%", maxWidth: "400px" }}>
          <Link to={ROUTES.movieDetail(id)} style={{ textDecoration: "none" }}>
            <Card aria-label={`Star Wars movie: ${movie.title}`}>
              <Card.Body>
                <CardTitle id="movieTitle">{movie.title}</CardTitle>
                <CardText>{movie.opening_crawl.slice(0, 128)}...</CardText>
              </Card.Body>
            </Card>
          </Link>
        </Container>
      );
    })}
  </Col>
</>

  );
};

export default MoviesList;
