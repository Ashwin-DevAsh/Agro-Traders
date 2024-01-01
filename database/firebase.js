import * as firebaseApp from 'firebase'



var firebaseConfig = {
    apiKey: "AIzaSyA9mmIDWGdvawYZMl7ULy31R1LXnq6P63o",
    authDomain: "r-m-traders.firebaseapp.com",
    databaseURL: "https://r-m-traders.firebaseio.com",
    projectId: "r-m-traders",
    storageBucket: "r-m-traders.appspot.com",
    messagingSenderId: "836158158173",
    appId: "1:836158158173:web:98d45dcf5450306930e4b4",
    measurementId: "G-85QV3G2Z51"
};


firebaseApp.initializeApp(firebaseConfig);

export const firebase = firebaseApp
export const database = firebaseApp.database()
export const auth = firebaseApp.auth()
export const storage = firebaseApp.storage()