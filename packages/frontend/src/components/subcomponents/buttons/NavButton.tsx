import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseButton from './BaseButton';

interface buttonProps {
	content: string
	destination: string
}
const NavButton: React.FC<buttonProps> = ({ content, destination }) => {
	const navigate = useNavigate()
	return (
		<BaseButton
			content={content}
			onClick={() => { navigate(destination); }}
		/>
	)
}

export default NavButton