// Netlify Function - Proxy for Biki API
// No uses "export default", usa "export const handler"

export const handler = async (event, context) => {
    // 1. Preparamos los headers de respuesta (CORS)
    const responseHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-auth-token',
        'Content-Type': 'application/json'
    };

    // 2. Manejo de Preflight (OPTIONS)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: responseHeaders,
            body: ''
        };
    }

    // 3. Obtener Query Parameters (Nota el cambio de req.query a event.queryStringParameters)
    const params = event.queryStringParameters || {};
    const { endpoint, auth, base } = params;

    if (!endpoint) {
        return {
            statusCode: 400,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Missing endpoint parameter' })
        };
    }

    // Configuración de la API externa
    const API_BASES = {
        'mobile': 'https://valladolid.publicbikesystem.net/ube/mobile',
        'customer': 'https://valladolid.publicbikesystem.net/customer'
    };

    const API_BASE = API_BASES[base] || API_BASES['mobile'];
    const API_KEY = 'QopJK73RwNkwj5hfFk1cInN8BDM0pcaVC9hWYXqU';
    const DEVICE_ID = 'ec968fbf0cb2ceef';

    const reqHeaders = {
        'accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'accept-language': 'en',
        'Connection': 'Keep-Alive',
        'device-id': DEVICE_ID,
        'Host': 'valladolid.publicbikesystem.net',
        'x-api-key': API_KEY,
        'user-agent': 'biki/5.35.0.8 Mozilla/5.0 (Linux; Android 12; sdk_gphone64_x86_64)'
    };

    // Auth headers
    if (auth) reqHeaders['authorization'] = `Basic ${auth}`;

    // Auth token (Nota el cambio de req.headers a event.headers)
    // Netlify pone los headers en minúsculas a veces, buscamos con cuidado
    const incomingToken = event.headers['x-auth-token'] || event.headers['X-Auth-Token'];
    if (incomingToken) reqHeaders['x-auth-token'] = incomingToken;

    try {
        const fullUrl = `${API_BASE}${endpoint}`;
        console.log('Proxying request to:', fullUrl);

        // Add Content-Type for POST requests (Critical Fix)
        if (event.httpMethod === 'POST') {
            reqHeaders['Content-Type'] = 'application/json';
        }

        // Preparar el body para la petición externa
        let bodyPayload = undefined;
        if (event.httpMethod === 'POST' && event.body) {
            // En Netlify, event.body es un STRING, no un objeto JSON. Hay que parsearlo si lo necesitas
            // pero si lo vas a reenviar tal cual, puedes mandarlo directo o parsearlo para asegurar validez.
            bodyPayload = event.body;
        }

        const response = await fetch(fullUrl, {
            method: event.httpMethod,
            headers: reqHeaders,
            body: bodyPayload
        });

        // Parsear respuesta
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
            // Si es texto, intentamos envolverlo en JSON o devolverlo como string
            try { data = JSON.parse(data) } catch (e) { }
        }

        // RETORNO FINAL (Sintaxis Netlify)
        return {
            statusCode: response.status,
            headers: responseHeaders,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: responseHeaders,
            body: JSON.stringify({ error: 'Proxy request failed', message: error.message })
        };
    }
};
