// Source Code

/**
 * File Description
 */

// Function
export const generateAuthUrl = (providerConfig) => {
    const {client_id, redirect_uri, scope, auth_url} = providerConfig;
    const url = new URL(auth_url);

    url.searchParams.append("client_id", client_id);
    url.searchParams.append("redirect_uri", redirect_uri);
    url.searchParams.append("scope", scope);

    return url.toString();
};

// Function
export const getAccessToken = async (providerConfig, code) => {
    const {client_id, client_secret, token_url} = providerConfig;

    const response = await fetch(token_url, {
        method: "POST",

        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: new URLSearchParams({
            client_id: client_id,
            client_secret: client_secret,
            code: code
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`Error fetching token: ${data.error_description || response.statusText}`);
    }

    return data.access_token;
};




