import React, { useState, useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {isMobile } from "react-device-detect";
import { IonContent, IonList, IonLabel, IonItem, IonHeader, IonPage, IonTitle, IonButton, IonButtons, IonFooter, IonMenuButton, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close, videocamOutline, people, shieldOutline, shieldCheckmarkOutline, radioButtonOnOutline, videocamOffOutline, chatboxOutline, micOutline, micOffOutline } from 'ionicons/icons';
import { useCamera } from '@ionic/react-hooks/camera';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { usePhotoGallery, Photo } from '../../hooks/usePhotoGallery';
import DataManager from '../../util/DataManager/DataManager';
import Peer from 'peerjs';
import socket from 'socket.io';

import './VideoChat.scss';

declare global {
	interface Window {
		socket: socket.Server;
	}
}

// var peer = new Peer()
const peer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: 5000,
})

const server = `ws://localhost:3002/`
let io = window.socket( 'ws://localhost:3002/', {
	// v2 서버는 cluster 모드로 동작하기 때문에 websocket으로 연결 유지(polling 사용 안함)
	transports: [ 'websocket' ],
});
// let io: socket.Server = socket(server); // server should be your http(s) server (of type http.Server or https.Server)

const propTypes = {
    // From redux store
	initializeBranches: PropTypes.func,
};

interface RTCVideoProps {
	localStream: MediaStream | ArrayBuffer;
	videoGrid: MediaStream | undefined;
	video: HTMLVideoElement | null;
}

interface stream {
	userId: string;
	roomId:  string;
	stream: object;
}

// let socket: WebSocket = undefined;
// const signaling = new SignalingChannel();
// const server = `ws://15.165.75.209/ws/chat/aaa/`

const VideoChat: React.FC = () => {
	const { deletePhoto, photos, takePhoto } = usePhotoGallery();
	const [photoToDelete, setPhotoToDelete] = useState<Photo>();
	const [dummyData, setDummyData] = useState(null);
	const { getPhoto } = useCamera();
	const [localStream, setLocalStream] = useState<MediaStream>();
	const [remoteStream, setRemoteStream] = useState<MediaStream>();
	const [roomId, setRoomId] = useState<String>();
	const videoRef = useRef(null);

	const [videoOff, setVideoOff] = useState(false);
	const [mute, setMute] = useState(false);
	const [shield, setShield] = useState(false);

	// video cam on/off
	const onClickVideoCam = useCallback((e) => {
		setVideoOff(!videoOff)
		if (!videoOff) {
			localStream.getVideoTracks()[0].enabled = false
		} else {
			localStream.getVideoTracks()[0].enabled = true
		}
	}, [localStream, videoOff]);
	// audio on/off
	const onClickMute = useCallback((e) => {
		setMute(!mute)
		if (!mute) {
			localStream.getAudioTracks()[0].enabled = false
		} else {
			localStream.getAudioTracks()[0].enabled = true
		}
	}, [localStream, mute]);
	const onClickShield = useCallback((e) => {
		setShield(!shield)
	}, [shield]);

    const getCamera = async () => {
        getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        })
    }
    const onClickEntrance = async () => {
		var peer = new Peer(undefined, {
			host: '/',
			port: 3001,
		})

		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then(stream => {
		})
	}
	const onClickHangup = async () => {

	}
    const onClickCreate = async () => {
		const response = await DataManager.createVideoChat()
		console.log('v :', response)
		const socket = new WebSocket(`ws://15.165.75.209/ws/chat/${response.roomId}/`);
		socket.onopen = function(evt: any) { 
			const status = socket.readyState
			console.log(status)
			if (localStream) socket.send(JSON.stringify({
				'room_id': response.roomId,
				// 'username': cur_user, 
				'stream': localStream,
				'text': 'hello',
			}))
			socket.addEventListener('message', function(e) {
				console.log("come in", e.data);
				// setRemoteStream(e.data.stream)
			});
		};
		setRoomId(response.roomId)
		console.log('localStream :', localStream)
	}

    const getMedia = async (constraints: any) => {
		let stream = null;
		
        try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			// stream 
            /* 스트림 사용 */
            const video = document.querySelector('video');
            const localStream = document.querySelector('#localStream');
			
			addVideoStream(localStream, stream)
			setLocalStream( stream )

			io.on('user-connected', (userId: any) => {
				console.log('socket on user-connected')
				// connectToNewUser(userId, stream)
				console.log('Somebody connected', userId)
			})
	
			// peer.on('call', (call) => {
			// 	console.log('peer on call')
			// 	call.answer(stream)
			// 	const video = document.createElement('video')
			// 	call.on('stream', (userVideoStream) => {
			// 		addVideoStream(video, userVideoStream)
			// 	})
			// })
        } catch(err) {
            /* 오류 처리 */
        }
	}

	const addVideoStream = (video:any, stream:any) => {
		video.srcObject = stream
		video.addEventListener('loadedmetadata', () => {
			video.play()
		})
	}
	
	const onStart = () => {
		const constraints = { 
			audio: false, 
			video: {
				width: '200px',
				height: '200px'
			}
		}
		getMedia(constraints);
		peer.on('open', (id) => {
			console.log('peer on open')
			// console.log('ROOM_ID : ',ROOM_ID)
			console.log('id : ',id)
			// socket.emit('join-room', ROOM_ID, id)
		})
	}

	const initialize = useCallback( async () => {
        if ( !videoRef.current ) {
            setTimeout( async () => {
                await initialize();
            }, 0 );
		} else {
			onStart()
		}
	}, []);

    useEffect( () => {
        setTimeout( () => {
            initialize();
		}, 0 );
    }, []);


  return (
    <IonPage id="video-chat-page">
        <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Photo Gallery</IonTitle>
                </IonToolbar>
            </IonHeader>
        <IonContent fullscreen={true}>
        <IonGrid>
			<IonRow>
				<IonCol size={isMobile ? "12" : "8"}>
					<div id="video-grid" ref={videoRef}>
						{!_.isEmpty(localStream) ? localStream : ''}
						{/* <Webcam /> */}
						<video id="localStream" className="localStream"/>
					</div>
					{/* <div id="video-grid" ref={videoRef}>
						{!_.isEmpty(localStream) ? localStream : ''}
						<video id="remoteStream"/>
					</div> */}
				</IonCol>
				{!isMobile && 
				<IonCol size="4">
					<IonList>
						<IonItem>
							<IonLabel>채팅</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>채팅22</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>채팅3</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>채팅4</IonLabel>
						</IonItem>
						<IonItem>
							<IonLabel>채팅5</IonLabel>
						</IonItem>
					</IonList>
				</IonCol>}
			</IonRow>
        </IonGrid>
      </IonContent>
	<IonFooter>
		<IonToolbar>
			<IonButtons slot="start">
				<IonButton id="videoBtn" onClick={onClickVideoCam}>
					<IonIcon icon={videoOff ? videocamOffOutline: videocamOutline}/>
				</IonButton>
				<IonButton id="muteBtn" onClick={onClickMute}>
					<IonIcon icon={mute ? micOffOutline : micOutline}/>
				</IonButton>
			</IonButtons>
			<IonButtons>
				<IonButton id="shieldBtn" onClick={onClickShield}>
					<IonIcon icon={shield ? shieldCheckmarkOutline : shieldOutline }/>
				</IonButton>
				<IonButton id="changeText" >
					<IonIcon icon={people}/>
				</IonButton>
				<IonButton id="changeText" >
					<IonIcon icon={chatboxOutline}/>
				</IonButton>
				<IonButton id="changeText" >
					<IonIcon icon={radioButtonOnOutline}/>
				</IonButton>
			</IonButtons>
			<IonButtons slot="end">
				<IonButton id="changeText" >
					<IonButton color="danger">종료</IonButton>
				</IonButton>
			</IonButtons>
		</IonToolbar>
	</IonFooter>
    </IonPage>
  );
};

export default VideoChat
