import react from 'react'
import { showMessage } from "react-native-flash-message"

const flashNotification = (title, message, backgroundColor, color) => {
    showMessage({
        message: title,
        description: message,
        type: "info",
        duration: 3500,
        statusBarHeight: 20,
        backgroundColor: backgroundColor,
        color: color
    });
}

export default flashNotification