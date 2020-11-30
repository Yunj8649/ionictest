/* eslint-disable func-names */
import _ from 'lodash';

let io;

const BROADCAST_EVENT = {
    CREATE_ROOM: 'CREATE_ROOM',
    JOIN_ROOM: 'JOIN_ROOM',

};

const socketActions = ( store ) => ({
    connectSocket: ( state ) => {
        console.log( 'store.roomId :', store.roomId );
        io = window.io( `chat/${ store.roomId }`, {
            // v2 서버는 cluster 모드로 동작하기 때문에 websocket으로 연결 유지(polling 사용 안함)
            transports: [ 'websocket' ],
        });

        const { onevent } = io;
        io.onevent = function ( packet ) {
            const args = packet.data || [];
            onevent.call( this, packet ); // original call
            packet.data = [ '*' ].concat( args );
            onevent.call( this, packet ); // additional call to catch-all
        };

        // "headoffice" 로 채널링
        /* io = window.io( `${ REALTIME_SERVER_ADDRESS }/headoffice`, {
            // v2 서버는 cluster 모드로 동작하기 때문에 websocket으로 연결 유지(polling 사용 안함)
            transports: [ 'websocket' ],
        });

        // TODO: TEST CODE. 테스트에서 모든 메시지를 확인하기 위해서 onevent 함수를 overriding
        const { onevent } = io;
        io.onevent = function ( packet ) {
            const args = packet.data || [];
            onevent.call( this, packet ); // original call
            packet.data = [ '*' ].concat( args );
            onevent.call( this, packet ); // additional call to catch-all
        };

        io.on( BROADCAST_EVENT.SCOOTERS_ALL, ( data ) => {
            console.log( '[Websocket] RECV SCOOTERS_ALL' );
            store.setUpdatedScooter( true );
            store.setState({ scooters: data && data.scooters });
        });

        io.on( BROADCAST_EVENT.SCOOTERS_UPDATE_USE, ( data ) => {
            if ( !data || !data.scooters || data.scooters.length === 0 ) return;
            console.log( '[Websocket] RECV SCOOTERS_UPDATE_USE' );
            const state = store.getState();
            if ( !state.scooters ) return;

            store.setUpdatedScooter( true );
            const scootersMap = _.keyBy( state.scooters, '_id' );
            const newScooterMap = _.chain( data.scooters ).map( 'scooters' ).flatMap().keyBy( '_id' )
                .value();
            const scooters = _.chain( scootersMap ).merge( newScooterMap ).values().value();

            store.setState({ scooters });
        });

        io.on( BROADCAST_EVENT.SCOOTERS_UPDATE_NOT_USE, ( data ) => {
            if ( !data || !data.scooters || data.scooters.length === 0 ) return;
            console.log( '[Websocket] RECV SCOOTERS_UPDATE_NOT_USE' );
            const state = store.getState();
            if ( !state.scooters ) return;

            const scootersMap = _.keyBy( state.scooters, '_id' );
            const newScooterMap = _.chain( data.scooters ).map( 'scooters' ).flatMap().keyBy( '_id' )
                .value();
            const scooters = _.chain( scootersMap ).merge( newScooterMap ).values().value();
            store.setUpdatedScooter( true );
            store.setState({ scooters });
        });

        io.on( BROADCAST_EVENT.SCOOTERS_FULL_SUMMARY, ( data ) => {
            console.log( '[Websocket] RECV SCOOTERS_FULL_SUMMARY' );
            store.setUpdatedScooter( true );
            store.setState({ scooterSummaryInfo: data });
        });

        io.on( BROADCAST_EVENT.STAFFS, ( data ) => {
            console.log( '[Websocket] RECV STAFFS' );
            store.setUpdatedStaff( true );
            store.setState({ staffs: data });
        });

        io.on( BROADCAST_EVENT.SCOOTERS_FULL_USE_STATUS, ( data ) => {
            console.log( '[Websocket] RECV SCOOTERS_FULL_USE_STATUS' );
            store.setState({ useStatusCnt: data });
        });

        io.on( BROADCAST_EVENT.BATTERY_FULL_STATUS, ( data ) => {
            console.log( '[Websocket] RECV CHANNEL_BATTERY_STATUS' );
            store.setState({ batteryStatusCnt: data });
        });

        io.on( 'connect', () => {
            // Socket이 끊겼다가 다시 연결되면 주문 목록 새로 가져옴
            if ( store.getState().socketConnected ) {
                return;
            }
            console.debug( '[Websocket] connected' );
            store.setState({ socketConnected: true });
        });
        io.on( 'disconnect', () => {
            console.debug( '[Websocket] disconnected' );
            store.setState({ socketConnected: false });
        });

        store.changeRegion = function ( regionId ) {
            if ( this.joinRegionRoom ) io.emit( 'leaveRoom', this.joinRegionRoom );
            if ( regionId ) {
                io.emit( 'joinRoom', regionId );
                this.joinRegionRoom = regionId;
            } else {
                io.emit( 'joinRoom', BROADCAST_EVENT.SCOOTERS_FULL_SUMMARY );
                this.joinRegionRoom = BROADCAST_EVENT.SCOOTERS_FULL_SUMMARY;
            }
        };

        store.visibleStaff = function ( isvisible ) {
            if ( isvisible ) io.emit( 'joinRoom', BROADCAST_EVENT.STAFFS );
            else io.emit( 'leaveRoom', BROADCAST_EVENT.STAFFS );
        };

        store.setUpdatedScooter = function ( isUpdatedScooter ) {
            this.isUpdatedScooter = isUpdatedScooter;
        };

        store.setUpdatedStaff = function ( isUpdatedStaff ) {
            this.isUpdatedStaff = isUpdatedStaff;
        };

        store.getScooterUseStatus = function ( isReady ) {
            if ( isReady ) {
                io.emit( 'joinRoom', BROADCAST_EVENT.SCOOTERS_FULL_USE_STATUS );
            } else io.emit( 'leaveRoom', BROADCAST_EVENT.SCOOTERS_FULL_USE_STATUS );
        };

        store.getBatteryStatus = function ( isReady ) {
            if ( isReady ) {
                io.emit( 'joinRoom', BROADCAST_EVENT.BATTERY_FULL_STATUS );
            } else io.emit( 'leaveRoom', BROADCAST_EVENT.BATTERY_FULL_STATUS );
        }; */
    },
});

export default socketActions;
