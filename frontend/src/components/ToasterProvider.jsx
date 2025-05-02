import { useEffect, useState } from 'react'
import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {

    const [toastPosition, setToastPosition] = useState("top-right");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setToastPosition("bottom-center");
            } else {
                setToastPosition("top-right");
            }
        };

        // İlk yüklemede kontrol et
        handleResize();

        // Pencere boyutu değiştiğinde kontrol et
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (<Toaster position={toastPosition} reverseOrder={false} />)
}

export default ToasterProvider