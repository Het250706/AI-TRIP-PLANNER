import axios from 'axios';

const testLogin = async () => {
    try {
        const response = await axios.post('http://localhost:5555/users/login', {
            email: 'phet6433@gmail.com',
            password: '12345678'
        });
        console.log("Login Success:", response.data);
    } catch (error) {
        console.error("Login Failed:", error.response ? error.response.status : error.message);
        console.error("Error Data:", error.response ? error.response.data : "No response data");
    }
};

testLogin();
