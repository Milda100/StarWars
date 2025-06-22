import { useEffect, useState} from 'react'
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

type people = {
    name: string,
	height: number,
	mass: number,
	hair_color: string,
	skin_color: string,
	eye_color: string,
	birth_year: string,
	gender: string,
}