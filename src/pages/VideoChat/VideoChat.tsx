import React, { useState, useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
// import Peer from 'simple-peer';
import Webcam from "react-webcam";
import axios from 'axios';
import _ from 'lodash';
import { IonContent, IonHeader, IonPage, IonTitle, IonButtons, IonMenuButton, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close } from 'ionicons/icons';
import { useCamera } from '@ionic/react-hooks/camera';
import { defineCustomElements, applyPolyfills } from '@ionic/pwa-elements/loader';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// import { PwaCamera } from '@stencil/core';
// import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { usePhotoGallery, Photo } from '../../hooks/usePhotoGallery';
import DataManager from '../../util/DataManager/DataManager';
import Peer from 'peerjs';
import { connect } from 'redux-zero/react';
import { combineActions } from 'redux-zero/utils';

const propTypes = {
    // From redux store
	initializeBranches: PropTypes.func,
};
let stream: MediaStream | MediaStreamTrack| undefined;

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
const server = `ws://15.165.75.209/ws/chat/aaa/`
// const configuration = {iceServers: [{urls: server}]};
// const rtcConnection = new RTCPeerConnection(configuration);

const VideoChat: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [dummyData, setDummyData] = useState(null);
  const { getPhoto } = useCamera();
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [roomId, setRoomId] = useState<String>();
  const videoRef = useRef(null);

    const getCamera = async () => {
        getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100
        })
    }
    const initialize = useCallback( async () => {
        if ( !videoRef.current ) {
            setTimeout( async () => {
                await initialize();
            }, 0 );
		}
	}, []);

    const onClickEntrance = async () => {
		var peer = new Peer(undefined, {
			host: '/',
			port: 3001,
		})

		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then(stream => {
			// 응답 받았을 때
			// peer.on('call', call => {
			// 	call.answer( stream )
			// 	const video = document.createElement('video')
			// 	call.on('stream', userVideoStream => {
			// 		userVideoStream.
			// 		setRemoteStream( userVideoStream )
			// 	})
			// })
		})

		let localPeerConnection;

		// localPeerConnection = new RTCPeerConnection(server);
		// localPeerConnection.addEventListener('icecandidate', handleConnection);
		// localPeerConnection.addEventListener(
		// 	'iceconnectionstatechange', handleConnectionChange);
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
		// let stream: StreamingMedia = null;
		
        try {
			stream = await navigator.mediaDevices.getUserMedia(constraints);
			// stream 
			console.log(typeof stream)
            /* 스트림 사용 */
            let video = document.querySelector('video');
            video.srcObject = stream;
			
            video.addEventListener('loadedmetadata', () => {
                video.play()
			})

			// const rtcConnection = new RTCPeerConnection(configuration);

			setLocalStream( stream )
            
        } catch(err) {
            /* 오류 처리 */
        }
	}
	
	const onStart = () => {
		const constraints = { 
			audio: false, 
			video: {
				width: {
				  min: '300px'
				},
				height: {
				  min: '300px'
				}
			}
		}
        getMedia(constraints);
	}

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
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                {/* <IonImg onClick={() => getCamera()} /> */}
                {/* <IonImg onClick={() => setPhotoToDelete(photo)} /> */}
              </IonCol>
            ))}
            <div id="video-grid" ref={videoRef}>
                {!_.isEmpty(localStream) ? localStream : ''}
                {!_.isEmpty(remoteStream) ? remoteStream : ''}
                {/* <Webcam /> */}
                <video />
                <video />
            </div>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          {/* <IonFabButton onClick={() => getCamera()}> */}
          <IonFabButton onClick={onStart}>
			  Start
          </IonFabButton>
          <IonFabButton onClick={onClickCreate}>
            Call
          </IonFabButton>
          <IonFabButton onClick={onClickEntrance}>
            {/* <IonIcon icon={camera}></IonIcon> */}
			hangup
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!photoToDelete}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            }
          }, {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }]}
          onDidDismiss={() => setPhotoToDelete(undefined)}
        />


      </IonContent>
    </IonPage>
  );
};

export default VideoChat
// VideoChat.propTypes = propTypes;
// export default connect(
//     combineActions( socketActions ),
// )( VideoChat );
