import React, { useEffect, useState } from 'react';
import PokemonButton from '../subcomponents/buttons/PokemonButton';
import TopBanner from '../subcomponents/banners/TopBanner';

interface Pokemon {
	name: string
	sprite: string
}

function getPokemonPage(pageSize: number, pageNumber: number, setList: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
	for (let i = pageSize * pageNumber; i < pageSize * pageNumber + pageSize; i++) {
		getPokemonInfo(i + 1).then((pokemon) => {
			setList(list => {
				list[i % pageSize] = (
					<div className='flex flex-col text-black border border-solid border-[#7932bd] rounded-[10px] items-center mx-[20px] mb-[20px]'>
						<img className='max-h-[96px] max-w-[96px]' src={pokemon.sprite} />
						<p className='border-t border-solid border-[#7932bd] w-[100%] rounded-b-[8px] text-white bg-[#7932bd] font-semibold'>
							{"#" + String(i + 1) + " " + pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
						</p>
					</div>
				);
				return [...list];
			})
		})
	}
}

async function getPokemonInfo(pokemonId: number): Promise<Pokemon> {
	fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
	const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
	const json = await response.json()
	const sprite = String(json.sprites.front_default)
	const name = String(json.name);
	return { sprite, name }
}

function Pokemon() {

	const [pageNumber, setPageNumber] = useState<number>(0);
	const [pokemonList, setPokemonList] = useState<JSX.Element[]>([])

	useEffect(() => {
		getPokemonPage(60, pageNumber, setPokemonList)
	}, [])
	
	return (
		<>
			<TopBanner content='Pokédex' />
			<div className="relative flex justify-between items-end">
				<div className="p-8">
					<button className={pageNumber ? "" : "hidden"} onClick={async () => {
						getPokemonPage(60, pageNumber - 1, setPokemonList);
						setPageNumber(pageNumber - 1);
					}}>
						Previous
					</button>
				</div>
				<div className="p-8">
					<button onClick={async () => {
						getPokemonPage(60, pageNumber + 1, setPokemonList);
						setPageNumber(pageNumber + 1);
					}}>
						Next
					</button>
				</div>
			</div>
			<div className={'text-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}>
				{...pokemonList}
			</div>
			<PokemonButton destination='/' />
		</>
	)
}

export default Pokemon