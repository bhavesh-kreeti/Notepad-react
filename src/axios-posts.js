import axios from 'axios'

    const instance = axios.create({
        baseURL: 'https://kreeti-react-notepad.firebaseio.com/'
    })

export default instance;
