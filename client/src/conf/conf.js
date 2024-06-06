import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const apiUrl = import.meta.env.VITE_API_URL;
export const socketServer = import.meta.env.VITE_SOCKET_SERVER
export const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Slide,
};
