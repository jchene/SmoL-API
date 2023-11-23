import { Button } from 'antd';
import React from 'react';

interface buttonProps {
	content?: string
	onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
	loading?: boolean
}

const BaseButton: React.FC<buttonProps> = ({ content, onClick, loading }) => {
	return (
		<div className={"p-8"}>
			<Button onClick={onClick} loading={loading}>
				{content}
			</Button>
		</div>
	)
}

export default BaseButton