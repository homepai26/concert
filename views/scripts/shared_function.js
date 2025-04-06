export const get_cookie = (cookie) => {
    return document.cookie.match(`/^(.*;)?\s*${cookie}\s*=\s*[^;]+(.*)?$/`);
};

export const get = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }
    return null;
};
