import { createContext, useContext, useEffect, useState } from "react"
import { useAxios } from "./AxiosProvider";
import { useNavigate } from "react-router";

const userContext = createContext({
    user: undefined,
    handleLogin: (data) => null,
    profileImage: undefined,
    profileImageUpdate: (file) => null,
    handleLogout: () => null
});

const UserProvider = ({ children }) => {
    const [ user, setUser ] = useState();
    const [ profileImage, setProfileImage ] = useState('');
    const myaxios = useAxios();
    const navigate = useNavigate();

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('user'))); //il localstorage puo contenere solo string e quindi dato che user è un oggetto lo trasformiamo in stirnga
    }, []);

    const getProfileImage = async () => {
        try {
            const res = await myaxios.get('/profile/image', {
                responseType: 'blob'
            });
            setProfileImage(URL.createObjectURL(res.data)); //crea un url temporaneo per l'immagine
        } catch (error) {
            
        }
    }

    useEffect(() => {
        if(user) {
            getProfileImage();
        }
    }, [user]);

    const profileImageUpdate = async (file) => {
        const formData = new FormData();
        formData.append('image', file); //il primo parametro è il nome del campo che il server si aspetta, il secondo è il file che voglio caricare
        const res = await myaxios.post(
            '/profile/image', 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob'
            });
            setProfileImage(URL.createObjectURL(res.data)); //crea un url temporaneo per l'immagine
    }

    const handleLogin = async (data) => {
        try {
            const result = await myaxios.post('/login', data);
            localStorage.setItem('token', result.data.jwt); /* qui solo result perchè il token è una stringa */
            localStorage.setItem('user', JSON.stringify(result.data.user));
            setUser(result.data.user);
        } catch (error) {
            console.log(error);
            return error.response.data.message;
        }
        
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(undefined);
        setProfileImage(undefined);
        navigate('/login');
    }

    return (
        <userContext.Provider value={{
            user,
            handleLogin,
            profileImage,
            profileImageUpdate,
            handleLogout
        }}>
            { children }
        </userContext.Provider>
    )
}

export default UserProvider;

export function useUser() {
    return useContext(userContext);
}