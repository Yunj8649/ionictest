import React, { useState, useCallback, useEffect, useRef} from 'react';
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

interface StreamingMediaProps {
    streamingMedia: typeof StreamingMedia;
  }

  interface RTCVideoProps {
    mediaStream: MediaStream | undefined;
    videoGrid: MediaStream | undefined;
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
            <div id="video-grid" ref={videoRef}>
                {!_.isEmpty(localStream) ? localStream : ''}
                {/* <video
                    autoPlay={true}
                    controls={true}
                    playsInline={true}
                    width={300}
                    height={300}
                    // data-account={this.props.accountId}
                    // data-player={this.props.playerId}
                    // data-embed={hasEmbedId ? this.props.embedId : 'default'}
                    // data-video-id={hasVideoId}
                    // ref={(node: HTMLVideoElement) => this.videoNode = node}
                    className="video-js"
                /> */}
                <Webcam
                
                />
            </div>
          </IonRow>
        </IonGrid>

        {/* <RTCVideo
            mediaStream = {localStream}
        /> */}
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
