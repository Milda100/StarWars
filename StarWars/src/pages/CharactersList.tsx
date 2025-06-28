import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { Card, CardTitle, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LoadingScreen, ErrorMessage } from "../components/FeedbackScreens";
import { extractIdFromUrl } from "../utils/helper";
import SearchableDropdown from "../components/SearchableDropdown";
import { ROUTES } from "../routes/routes";


const CharactersList = () => {
  const dispatch: AppDispatch = useDispatch();

  const { characters, page, hasMore, loading, error, fetchedPages } =
    useSelector((state: RootState) => state.characters);

  const navigate = useNavigate();
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleCharacterSelect = (result: { name: string; url: string }) => {
    const characterId = extractIdFromUrl(result.url);
    navigate(ROUTES.characterDetail(characterId));
  };

  useEffect(() => {
    if (characters.length === 0) {
      dispatch(fetchCharacters(1));
    }
  }, [dispatch, characters.length]);

  useEffect(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    if (fetchedPages.includes(nextPage)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          dispatch(fetchCharacters(page + 1));
        }
      },
      { threshold: 0 }
    );
    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => observer.disconnect();
  }, [dispatch, page, hasMore, loading, fetchedPages]);

  if (loading && characters.length === 0) return <LoadingScreen />;
  if (error) return <ErrorMessage />;

  return (
    <>
    <Row className="m-2">
      <Col xs="auto">
        <Link to={ROUTES.movies}><button>Movies</button></Link>
      </Col>
      <Col xs="auto">
        <SearchableDropdown onSelect={handleCharacterSelect} />
      </Col>
    </Row>
      <h1 className="mt-3 mb-5">Star Wars Characters</h1>
      <Col>
        {characters.map((character) => {
          const characterId = extractIdFromUrl(character.url);
          return (
            <Container key={character.url} className="mb-4" style={{ width: "100%", maxWidth: "400px" }}>
              <Link to={ROUTES.characterDetail(characterId)} style={{ textDecoration: "none" }}>
                <Card aria-label={`Star Wars character: ${character.name}`}>
                  <Card.Body>
                    <CardTitle>{character.name}</CardTitle>
                  </Card.Body>
                </Card>
              </Link>
            </Container>
          );
        })}
        {hasMore && <div ref={loaderRef} style={{ height: "1px" }} />}
      </Col>
    </>
  );
};

export default CharactersList;
