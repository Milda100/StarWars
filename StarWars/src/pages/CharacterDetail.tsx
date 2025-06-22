import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { fetchCharacters } from "../store/charactersSlice";
import { useParams, Link } from "react-router-dom";
import {LoadingScreen, ErrorMessage, NotFound,} from "../components/FeedbackScreens";
import { Container } from "react-bootstrap";
import { extractIdFromUrl } from '../utils/helper';


const CharacterDetail = () => {
	const { id } = useParams<{ id: string }>();
	const dispatch: AppDispatch = useDispatch();

};

export default CharacterDetail