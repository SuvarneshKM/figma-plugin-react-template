import * as React from 'react';
import axios from 'axios';
import '../styles/ui.css';

const App = ({}) => {
    const getPosts = async () => {
        try {
            const userPosts = await axios.get('http://localhost:8000/api/commands');
            console.log(userPosts.data);
            // setPosts(userPosts.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    // const cleanDb = async () => {
    //     await axios.get('http://localhost:8000/api/commands/clean');
    // };

    React.useEffect(() => {
        getPosts();
        const interval = setInterval(() => {
            getPosts();
        }, 3000);

        return () => clearInterval(interval);
    }, []); // includes empty dependency array

    const onCancel = () => {
        parent.postMessage({pluginMessage: {type: 'cancel'}}, '*');
    };

    React.useEffect(() => {
        // This is how we read messages sent from the plugin controller
        window.onmessage = async (event) => {
            if (event.data.pluginMessage.type === 'networkRequest') {
                const interval = setInterval(async () => {
                    const userPosts = await axios.get('http://localhost:8000/api/commands');
                    console.log(userPosts.data);
                    window.parent.postMessage({pluginMessage: userPosts.data}, '*');
                }, 3000);

                return () => clearInterval(interval);
            }
        };
    }, []);

    return (
        <div>
            <h2>Figma Vox</h2>
            <button>Go to Audio</button>

            <button onClick={onCancel}>Cancel</button>
        </div>
    );
};

export default App;
