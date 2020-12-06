import React, { useState, useCallback, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import Webcam from "react-webcam";
import axios from 'axios';
import _ from 'lodash';
import { IonContent, IonHeader, IonPage, IonTitle, IonButtons, IonMenuButton, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close } from 'ionicons/icons';
import { useCamera } from '@ionic/react-hooks/camera';
import { defineCustomElements, applyPolyfills } from '@ionic/pwa-elements/loader';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// import { PwaCamera } from '@stencil/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { CameraResultType, CameraSource, CameraPhoto, Capacitor, FilesystemDirectory } from "@capacitor/core";
import { usePhotoGallery, Photo } from '../../hooks/usePhotoGallery';
import DataManager from '../../util/DataManager/DataManager';
import Peer from 'peerjs';
import { connect } from 'redux-zero/react';
import { combineActions } from 'redux-zero/utils';
// import socketActions from '../../actions/socket';

const propTypes = {
    // From redux store
    initializeBranches: PropTypes.func,
};
interface StreamingMediaProps {
    streamingMedia: typeof StreamingMedia;
  }

  interface RTCVideoProps {
    mediaStream: MediaStream | undefined;
    videoGrid: MediaStream | undefined;
    video: HTMLVideoElement | null;
  }
interface stream {
	userId: string;
	roomId:  string;
}

  const VideoChat: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [dummyData, setDummyData] = useState(null);
  const { getPhoto } = useCamera();
  const [localStream, setLocalStream] = useState<HTMLElement>();
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
		const roomId = '36afca9a313211ebb84eacde48001122'
		// await DataManager.entranceVideoChat({ roomId })
		const socket = new WebSocket(`ws://15.164.220.31/ws/chat/${roomId}/`);
		console.log('socket :' ,socket)
		console.log('socket :' , typeof socket)
		// var socket = new WebSocket(`ws://127.0.0.1:6379/ws/chat/${roomId}/`);
		// var socket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomId}/`);
		socket.onmessage = function(e){ console.log(e.data); };
		socket.onopen = () => socket.send('hello');
		// socket.send(JSON.stringify({
		// 	'message': 'aaa'
		// }));
		socket.onmessage = (e) => {
            var data = JSON.parse(e.data);
			var message = {text: data.message, date: data.utc_time};
			console.log('message :' ,message)
	    	// message.date = moment(message.date).local().format('YYYY-MM-DD HH:mm:ss');
	    
            // let updated_messages = [...this.state.messages];
            // updated_messages.push(message);
            // this.setState({messages: updated_messages});
        };
		// socket.onopen('message', { roomId, userId: 'yunj' });
		// io.emit('join-room', roomId, 'yunj')
		// socket.onopen = () => socket.send('aa')
		// socket.onopen = function(e) {
		// 	console.log("[open] 커넥션이 만들어졌습니다.");
		// 	console.log("데이터를 서버에 전송해봅시다.");
		// 	socket.send("My name is John");
		// };
		// // socket.send(JSON.stringify({
        // //     'message': 'aa'
        // // }));

		// socket.onmessage = function(event) {
		// 	alert(`[message] 서버로부터 전송받은 데이터: ${event.data}`);
		// };
		
		// socket.onclose = function(event) {
		// 	if (event.wasClean) {
		// 		alert(`[close] 커넥션이 정상적으로 종료되었습니다(code=${event.code} reason=${event.reason})`);
		// 	} else {
		// 		// 예시: 프로세스가 죽거나 네트워크에 장애가 있는 경우
		// 		// event.code가 1006이 됩니다.
		// 		alert('[close] 커넥션이 죽었습니다.');
		// 	}
		// };
		
		// socket.onerror = function(error) {
		// 	// alert(`[error] ${error.message}`);
		// };
		
    }
    const onClickCreate = async () => {
		const response = await DataManager.createVideoChat()
		console.log('v :', response)
		const socket = new WebSocket(`ws://15.164.220.31/ws/chat/${response.roomId}/`);
		socket.onopen = function(evt) { console.log('open') ;};
    }

    const getMedia = async (constraints: any) => {
        let stream = null;

        try {
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            /* 스트림 사용 */
            let video = document.querySelector('video');
            console.log('v :',video)
            video.srcObject = stream;
            // video.onloadedmetadata = function(e) {
            //     video.play();
            // };

            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
            
        } catch(err) {
            /* 오류 처리 */
        }
    }

    useEffect( () => {
        const constraints = { audio: false, video: true }
        getMedia(constraints);
        setTimeout( () => {
            initialize();
        }, 0 );
    }, []);

    // const getMedia = async (constraints: any) => {
    


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
                {/* <Webcam /> */}
                <video />
                <video />
            </div>
          </IonRow>
        </IonGrid>
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          {/* <IonFabButton onClick={() => getCamera()}> */}
          <IonFabButton onClick={() => onClickCreate()}>
            <IonIcon icon={camera}></IonIcon>
          </IonFabButton>
          <IonFabButton onClick={() => onClickEntrance()}>
            <IonIcon icon={camera}></IonIcon>
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
