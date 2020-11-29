import React, { useState, useCallback, useEffect, useRef} from 'react';
import axios from 'axios';
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

interface StreamingMediaProps {
    streamingMedia: typeof StreamingMedia;
  }

  interface RTCVideoProps {
    mediaStream: MediaStream | undefined;
  }

const VideoChat: React.FC = () => {
  const { deletePhoto, photos, takePhoto } = usePhotoGallery();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const [dummyData, setDummyData] = useState(null);
  const { getPhoto } = useCamera();
  const [localStream, setLocalStream] = useState<MediaStream>();

  const RTCVideo = ({ mediaStream }: RTCVideoProps) => {
    const viewRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      if (!viewRef.current)
          return;
      viewRef.current.srcObject = mediaStream ? mediaStream : null;
    }, [mediaStream]);
  
    return <video ref={viewRef} controls></video>;
  };

  // https://ionicframework.com/docs/cli/commands/start 

  /* const doMediaCapture = async () => {
    let options: VideoCapturePlusOptions = { 
        limit: 1, duration: 30 
    };
    let capture:any = await VideoCapturePlus.captureVideo(options);
    console.log((capture[0] as MediaFile).fullPath)
  }; */

  const getCamera = async () => {
      getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 100
  })
  getPhoto({
    resultType: CameraResultType.Uri,
    source: CameraSource.Camera,
    quality: 100
  })
  // find the video devices (font/back cameras etc)
/* navigator.mediaDevices.enumerateDevices().then(function (devices) {
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices
    devices.forEach(function (device) {
        if (device.kind === 'videoinput') {
            cameraDeviceIds.push(device.deviceId)
        }
    })
})


// attach camera output to video tag
navigator.mediaDevices.getUserMedia({
    video: { deviceId: { exact: cameraDeviceIds[currentCameraIndex] } }
}).then(function (stream) {
    const cameraDiv = document.getElementById("cameraPlayer")
    if (cameraDiv) cameraDiv['srcObject'] = stream
}) */
};


   /*  var constraints = { audio: true, video: { width: 1280, height: 720 } }; 

    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream) {
    var video = document.getElementById('cameraPlayer');
    
    if (video) {
        video.srcObject = mediaStream;
        video.onloadedmetadata = function(e) {
        if (video) video.play();
    };
    }
    
    }) */

const options: StreamingVideoOptions = {
  successCallback: () => { console.log('Video played') },
//   errorCallback: (e) => { console.log('Error streaming') },
  orientation: 'landscape',
  shouldAutoClose: true,
  controls: false
};

const openScanner = async () => {
    const data = await BarcodeScanner.scan();
    console.log(`Barcode data: ${data.text}`);
  };

  useEffect(() => {
    var constraints = { audio: true, video: { width: 1280, height: 720 } }; 

    navigator.mediaDevices.getUserMedia(constraints)
    .then(stream=>{
      setLocalStream(stream);
    })
  })


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
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent> */}
     {/*  <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader> */}
        <IonContent fullscreen={true}>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                {/* <IonImg onClick={() => getCamera()} /> */}
                {/* <IonImg onClick={() => setPhotoToDelete(photo)} /> */}
              </IonCol>
            ))}
            <video src={'https://youtu.be/ASlCNLqHPiA'} />
            <video id="cameraPlayer"></video>
          </IonRow>
        </IonGrid>

        <RTCVideo
            mediaStream = {localStream}
        />
        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          {/* <IonFabButton onClick={() => openScanner()}> */}
          
          <IonFabButton onClick={() => getCamera()}>
          {/* <IonFabButton onClick={() => takePhoto()}> */}
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

export default VideoChat;
