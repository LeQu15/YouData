import React, { useCallback } from 'react';
import { useEffect, useState } from 'react';

interface videoProps {
	videoArray: string;
	sort: number;
	remove: number;
}

function Video(props: videoProps) {
	const [videos, changeVideos] = useState<
		Array<{
			viewCount: string;
			likeCount: string;
			title: string;
			date: string;
			thumbnail: string;
			id: string;
		}>
	>([]);
	const modalRef = React.createRef<HTMLDivElement>();
	const [videoId, changeVideoId] = useState('');
	const [loaded, changeLoaded] = useState(false);

	useEffect(() => {
		const array = videos;
		if (props.sort % 2 === 0) {
			array.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
		} else {
			array.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
		}
		changeVideos(array);
	}, [props.sort, videos]);

	useEffect(() => {
		if (props.remove !== 0) {
			changeVideos([]);
			localStorage.setItem('video', JSON.stringify([]));
		}
	}, [props.remove]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				let test = props.videoArray;
				if (props.videoArray.startsWith('https://www.youtube.com/watch?v=')) {
					test = test.replace('https://www.youtube.com/watch?v=', '');
				} else if (props.videoArray.startsWith('https://youtu.be/')) {
					test = test.replace('https://youtu.be/', '');
				}
				if (!loaded) {
					let e = JSON.parse(localStorage.getItem('video') || '[]');
					if (e.length > 0) {
						e = e.map((a: any) => a.id);
						test = e.join('&id=');
						changeLoaded(true);
					}
				}
				const response = await fetch(
					`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics%2Cid&id=${test}&list=RDQzw6A2WC5Qo&key=AIzaSyC_yOrkddLwYWwAMDJqZt26e8Vqk-eqUH4`
				);
				const json = await response.json();
				if (!response.ok) {
					throw Error(response.statusText);
				} else {
					if (json.items.length > 0) {
						const array = [...videos];

						for (let i = 0; i < json.items.length; i++) {
							const start = new Date(2012, 0, 1);
							const end = new Date();
							const date = new Date(
								start.getTime() +
									Math.random() * (end.getTime() - start.getTime())
							)
								.toJSON()
								.slice(0, 10)
								.replace(/-/g, '/');
							array.push({
								viewCount: json.items[i].statistics.viewCount.replace(
									/\B(?=(\d{3})+(?!\d))/g,
									' '
								),
								likeCount: json.items[i].statistics.likeCount.replace(
									/\B(?=(\d{3})+(?!\d))/g,
									' '
								),
								title: json.items[i].snippet.title,
								date: loaded
									? date
									: JSON.parse(localStorage.getItem('video') || '[]')?.length >
									  0
									? [...JSON.parse(localStorage.getItem('video') || '[]')][i]
											.date
									: date,
								thumbnail: json.items[i].snippet.thumbnails.high.url,
								id: json.items[i].id,
							});
						}
						changeVideos((video) => array);
					}
				}
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, [props.videoArray, loaded, videos]);

	const openModal = useCallback(
		(e: React.MouseEvent) => {
			modalRef.current?.classList.add('active');
			const x = e.currentTarget
				.closest('div[data-id]')
				?.getAttribute('data-id');
			if (x != null) {
				changeVideoId(x);
			}
		},
		[modalRef]
	);

	const closeModal = () => {
		modalRef.current?.classList.remove('active');
		changeVideoId('');
	};

	const remove = useCallback(
		(e: React.MouseEvent) => {
			const array = [...videos];
			array.splice(
				Number(
					e.currentTarget.parentElement?.parentElement?.getAttribute(
						'data-index'
					)
				),
				1
			);
			changeVideos(array);
			localStorage.setItem('video', JSON.stringify(array));
		},
		[videos]
	);

	const removeAll = () => {
		localStorage.setItem('video', JSON.stringify([]));
		changeVideos([]);
	};

	useEffect(() => {
		let array: object[];
		if (videos.length !== 0) {
			array = [...videos];
			localStorage.setItem('video', JSON.stringify(array));
		}
	}, [videos]);

	const show = () => {
		let x;
		if (props.sort % 2 === 0) {
			x = videos.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
		} else {
			x = videos.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
		}
		x = x.map((element, i) => {
			return (
				<div key={i} data-id={element.id} data-index={i}>
					<p className='thumbnail' onClick={openModal}>
						<img src={element.thumbnail} alt='thumbnail' />
					</p>
					<h3>{element.title}</h3>
					<p>
						<i className='fa-solid fa-eye'></i>
						{' ' + element.viewCount}
					</p>
					<p>
						<i className='fa-solid fa-thumbs-up'></i>
						{' ' + element.likeCount}
					</p>
					<p>
						<i className='fa-solid fa-calendar'></i>
						{' ' + element.date}
					</p>
					<div className='actions'>
						<i className='fa-solid fa-eye' onClick={openModal}></i>
						<i className='fa-solid fa-trash' onClick={remove}></i>
						<i className='fa-solid fa-star' onClick={removeAll}></i>
					</div>
				</div>
			);
		});
		return x;
	};

	return (
		<>
			<div className='modal' ref={modalRef}>
				<div className='closeModal' onClick={closeModal}>
					X
				</div>
				<iframe
					title='video'
					width='100%'
					height='95%'
					src={'https://www.youtube.com/embed/' + videoId}
				></iframe>
			</div>
			<div className='video'>{show()}</div>
		</>
	);
}

export default Video;
