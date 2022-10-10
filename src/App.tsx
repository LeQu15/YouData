import React, { useEffect } from 'react';
import { useState } from 'react';
import logo from './img/logo.png';
import Video from './components/video';
const x = process.env.REACT_APP_MY_API_KEY;

function App() {
	const [loaded, changeLoaded] = useState(false);
	const [stringValue, changeStringVal] = useState('');
	const [finalVal, changeFinalVal] = useState('');
	const [sort, doSort] = useState(0);
	const [remove, doRemove] = useState(0);
	const [style, updateStyle] = useState(false);

	function loadClient() {
		gapi.client.setApiKey(x!);
		return gapi.client
			.load(
				'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
				'v3'
			)
			.then(
				function () {
					changeLoaded(true);
				},
				function (err) {
					console.error('Error loading GAPI client for API', err);
				}
			);
	}

	useEffect(() => {
		setTimeout(() => {
			loadClient();
		}, 50);
	}, []);

	const changeVal = (e: React.FormEvent<HTMLInputElement>) => {
		changeStringVal(e.currentTarget.value);
	};

	const addToArray = () => {
		changeFinalVal(stringValue);
		changeStringVal('');
	};

	useEffect(() => {
		if (finalVal !== '') {
			changeFinalVal('');
		}
	}, [finalVal]);

	const changeStyle = () => {
		if (!style) {
			document.querySelector('.video')?.classList.add('alternate');
			updateStyle(true);
		} else {
			document.querySelector('.video')?.classList.remove('alternate');
			updateStyle(false);
		}
	};

	return (
		<>
			{loaded && (
				<div className='container'>
					<header>
						<img src={logo} alt='logo' />
					</header>
					<nav>
						<div className='add'>
							<input
								placeholder='Paste id or url'
								onChange={changeVal}
								value={stringValue}
							></input>
							<button onClick={addToArray}>+</button>
						</div>
						<button
							onClick={() => {
								doSort((prev) => prev + 1);
							}}
						>
							{sort % 2 === 0 ? (
								<i className='fa-solid fa-arrow-down-1-9'></i>
							) : (
								<i className='fa-solid fa-arrow-up-1-9'></i>
							)}
						</button>
						<button onClick={changeStyle}>
							{!style ? (
								<i className='fa-solid fa-list'></i>
							) : (
								<i className='fa-solid fa-square'></i>
							)}
						</button>
						<button
							onClick={() => {
								doRemove((prev) => prev + 1);
							}}
						>
							<i className='fa-solid fa-trash'></i>
						</button>
					</nav>
					<main>
						<Video videoArray={finalVal} sort={sort} remove={remove} />
					</main>
					<footer>
						<a
							href='https://github.com/LeQu15'
							target='_blank'
							rel='noreferrer'
						>
							<i className='fa-brands fa-github'></i>
						</a>
					</footer>
				</div>
			)}
		</>
	);
}

export default App;
