import axios from 'axios';
// import moment from 'moment';

function getCookie( name ) {
    let cookieValue = null;
    if ( document.cookie && document.cookie !== '' ) {
        const cookies = document.cookie.split( ';' );
        for ( let i = 0; i < cookies.length; i++ ) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if ( cookie.substring( 0, name.length + 1 ) === ( `${ name }=` ) ) {
                cookieValue = decodeURIComponent( cookie.substring( name.length + 1 ) );
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie( 'csrftoken' );
const END_POINT = 'http://15.165.75.209';

export default class DataManager {
    static async getMenus() {
        const response = await axios({
            method: 'GET',
            withCredentials: true,
            url: `${ END_POINT }/home/menus/`,
            headers: {
                'X-CSRFToken': csrftoken,
                // csrftoken:'vryigUTVKWfHZNcRGo7f3rW8jWZQTKCBnmu1Vt1lp3QvpeZIC4FH0qHx7O5SmaE4'
            },
        });
        return response.data;
    }

    static async entranceVideoChat({ roomId }) {
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${ END_POINT }/chat/${ roomId }/`,
            headers: {
                'X-CSRFToken': csrftoken,
                // csrftoken:'vryigUTVKWfHZNcRGo7f3rW8jWZQTKCBnmu1Vt1lp3QvpeZIC4FH0qHx7O5SmaE4'
            },
        });
        return response.data;
    }

    static async createVideoChat() {
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${ END_POINT }/chat/create/`,
            headers: {
                'X-CSRFToken': csrftoken,
                // csrftoken:'vryigUTVKWfHZNcRGo7f3rW8jWZQTKCBnmu1Vt1lp3QvpeZIC4FH0qHx7O5SmaE4'
            },
        });
        return response.data;
    }

    static async signup( signupProps ) {
        // alert(csrftoken);
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${ END_POINT }/user/signup`,
            headers: {
                'X-CSRFToken': csrftoken,
                // csrftoken:'vryigUTVKWfHZNcRGo7f3rW8jWZQTKCBnmu1Vt1lp3QvpeZIC4FH0qHx7O5SmaE4'
            },
            data: signupProps,
        });
        return response.data;
    }

    static async login( username, password ) {
        // alert(csrftoken);
        const data = {
            username,
            password,
        };
        const response = await axios({
            method: 'POST',
            withCredentials: true,
            url: `${ END_POINT }/user/login`,
            headers: {
                'X-CSRFToken': csrftoken,
                // csrftoken:'vryigUTVKWfHZNcRGo7f3rW8jWZQTKCBnmu1Vt1lp3QvpeZIC4FH0qHx7O5SmaE4'
            },
            data,
        });
        return response.data;
    }
}
