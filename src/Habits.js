import './css/App.css';
import { initializeApp } from "firebase/app";
import { httpsCallable, getFunctions } from "firebase/functions"; // Import for callable functions

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
// const functions = require("firebase-functions");


function Habits() {
    return (
        <div className="App">
            <header className="App-header" >
                <div className="WallPaper">
                    <form onSubmit={handleSubmit} id="habits-form">
                        <label for="username">Username</label>
                        <br />
                        <input
                            type="text"
                            id="username"
                            name="username"
                        />
                        <br />

                        <label for="happiness">How happy were you today?</label>
                        <br />
                        <input
                            type="number"
                            id="happiness"
                            name="happiness"
                            min="0"
                            max="5"
                        />
                        <br />

                        <label for="drinks">How much did you drink yesterday?</label>
                        <br />
                        <input
                            type="number"
                            id="drinks"
                            name="drinks"
                            min="0"
                            max="12"
                        />
                        <br />

                        <label for="work">How many hours did you work?</label>
                        <br />
                        <input
                            type="number"
                            id="work"
                            name="work"
                            min="0"
                            max="20"
                        />
                        <br />

                        <label for="social">How many hours of social time?</label>
                        <br />
                        <input
                            type="number"
                            id="social"
                            name="social"
                            min="0"
                            max="24"
                        />
                        <br />
                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </header>
        </div>
    );
}

const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
        const username = document.getElementById("username").value;
        const happiness = document.getElementById("happiness").value;
        const drinks = document.getElementById("drinks").value;
        const work = document.getElementById("work").value;
        const social = document.getElementById("social").value;

        // Call the Cloud Function
        const addHabit = httpsCallable(functions, "addHabit"); // Get callable function
        const data = {
            username: username,
            happiness: happiness,
            drinks: drinks,
            work: work,
            social: social
        };
        console.log("Inserting data: " + JSON.stringify(data));
        const result = await addHabit(data);

        if (result.data.success) {
            // Clear form
            document.getElementById("habits-form").reset();
        } else {
            // Handle error (e.g., display an error message)
            console.error("Error adding habit:", result.data.error);
        }
    } catch (error) {
        console.error("Error calling Cloud Function:", error);
        // Handle errors (e.g., display an error message)
    }
};

const ADD_HABIT_FUNCTION_URL = "https://addhabit-elo5gihcwa-uc.a.run.app";
const deprecatedSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
        const username = document.getElementById("username").value;
        const happiness = document.getElementById("happiness").value;
        const drinks = document.getElementById("drinks").value;
        const work = document.getElementById("work").value;
        const social = document.getElementById("social").value;

        // Call the Cloud Function
        const data = {
            username: username,
            happiness: happiness,
            drinks: drinks,
            work: work,
            social: social
        };
        console.log("Inserting data: " + JSON.stringify(data));
        const response = await fetch(ADD_HABIT_FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        // const result = await addHabit(data);

        if (response.ok) {
            // Clear form
            document.getElementById("habits-form").reset();
        } else {
            // Handle error (e.g., display an error message)
            console.error("Error adding habit:", response.text);
        }
    } catch (error) {
        console.error("Error calling Cloud Function:", error);
        // Handle errors (e.g., display an error message)
    }
};

export default Habits;
