import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState, AppDispatch } from '../store/store'
import { fetchMovies } from '../store/movieSlice'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LoadingScreen, ErrorMessage } from '../components/FeedbackScreens';


const MoviesList = () => {
    const dispatch: AppDispatch = useDispatch();
    const { movies, loading, error } = useSelector((state: RootState) => state.movies);

    useEffect(() => {
        dispatch(fetchMovies())
}, [dispatch]);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorMessage />; //style error message

    return (
        <>
        <h1 className="text-center m-4">Star Wars Movies</h1>
        <div className="row">
            {movies.map((movie) => (
            <div key={movie.episode_id} className="col-md-4 mb-4">
                <Link to={`/movie/${movie.episode_id}`} style={{ textDecoration:'none'}}>
                    <Card aria-label={`Star Wars movie: ${movie.title}`}>
                    <Card.Body className="d-flex flex-column text-center">
                        <h5 className="card-title">{movie.title}</h5>
                        <p className="card-text">{movie.opening_crawl.slice(0, 128)}...</p>
                    </Card.Body>
                    </Card>
                </Link>
            </div>
            ))}
        </div>
        </>
    );
}

export default MoviesList