/*
 * Why Axios Instead of Fetch?
 * 
 * 1. Simpler Syntax: 
 *    - Axios uses cleaner and more readable code for making requests compared to Fetch.
 *    - Fetch requires manual handling of JSON data using `.json()`, while Axios does this automatically.
 * 
 * 2. Error Handling: 
 *    - Fetch does not throw errors for HTTP errors (e.g., 404 or 500). 
 *    - You must manually check response statuses, whereas Axios automatically handles these errors.
 * 
 * 3. Interceptors: 
 *    - Axios allows request and response interceptors for tasks such as adding headers, logging, or transforming data.
 *    - This makes handling authentication tokens and retries easier.
 * 
 * 4. Timeout Handling:
 *    - Axios supports request timeouts directly.
 *    - Fetch requires a custom solution for timeouts.
 * 
 * 5. Cross-Browser Support:
 *    - Axios includes better support for older browsers and edge cases compared to Fetch.
 */

import axios from 'axios';

const axiosInstance = axios.create({

    baseURL: import.meta.mode === 'development' ? 'http://localhost:5000/api' : '/api',
    withCredentials: true, // send cookies with the request
});

export default axiosInstance;