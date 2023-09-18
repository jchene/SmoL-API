export interface dbUser {
	id: string
	name?: string
	team?: string
}

export interface buttonProps {
	className: string
	onClick: () => any
}