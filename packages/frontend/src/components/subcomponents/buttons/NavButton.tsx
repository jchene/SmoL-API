import React from 'react';
import { useNavigate } from 'react-router-dom';

interface buttonProps {
	content: string
	destination: string
	cntClass?: string
	btnClass?: string
}
function getClass(defaultClass: string, alterClass?: string){
	if (!alterClass)
		return defaultClass;
	if (!alterClass.startsWith("+ "))
		return alterClass;
	return defaultClass + alterClass;
}
const NavButton: React.FC<buttonProps> = ({ content, destination, cntClass, btnClass }) => {
	const navigate = useNavigate()
	return (
		<>
			<div className={getClass("p-8", cntClass)}>
				<button className={getClass("", btnClass)} onClick={ () => { navigate(destination) }}>
					{content}
				</button>
			</div>
		</>
	)
}

export default NavButton