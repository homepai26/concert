const get_cookie = () => {
    return document.cookie.match(/^(.*;)?\s*token\s*=\s*[^;]+(.*)?$/);
};

const get = async (url) => {
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
