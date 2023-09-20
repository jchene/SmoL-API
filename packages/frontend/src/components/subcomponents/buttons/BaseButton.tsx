import React from 'react';

interface buttonProps {
	content: string
	onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
	alterContainer?: string
	alterButton?: string
}

function getClass(defaultClass: string, alterClass?: string) {
	if (!alterClass)
		return defaultClass;
	if (!alterClass.startsWith("+ "))
		return alterClass;
	return defaultClass + alterClass;
}

const BaseButton: React.FC<buttonProps> = ({ content, onClick, alterContainer, alterButton }) => {
	return (
		<div className={getClass("p-8", alterContainer)}>
			<button className={getClass("", alterButton)} onClick={onClick}>
				{content}
			</button>
		</div>
	)
}

export default BaseButton