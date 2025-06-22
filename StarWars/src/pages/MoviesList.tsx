import { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';


// type Film = {
//     title: string,
//     episode_id: number,
//     opening_crawl: string,
// };

const MoviesList = () => {
    // const [movies, setMovies] = useState<Film[]>([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState<string | null>(null);


    useEffect(() => {
    const fetchMovies = async () => {
        try {
            // setLoading(true);
            // const res = await fetch("https://swapi.info/api/films");
            // const data: Film[] = await res.json();
            // console.log("Fetched data:", data);
            
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Artificial delay of 2 seconds

            setMovies(data);
        } catch (err) {
            setError('Ups... Something went wrong');
        } finally {
            // setLoading(false);
        }
    };

    fetchMovies();
}, []);

    

    if (loading) {
    return (
        <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '100vh' }}
        >
        <img
            className="img-fluid"
            srcSet="https://mir-s3-cdn-cf.behance.net/project_modules/disp/82fbbf68040289.5b4f2400147bc.gif 600w, https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/82fbbf68040289.5b4f2400147bc.gif 628w"
            sizes="(max-width: 200px) 100vw, 628px"
            alt="darth vader"
            style={{ width: '150px', height: '150px' }}
        />
        <p className="mt-3">Loading movies...</p>
        </div>
    );
    }


    if (error) return <p>{error}</p>; //style error message

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