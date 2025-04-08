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

get_gnu_datetime = (datetime_string) => {
    //datetime_string = datetime_string.replace("T", " ").replace("Z", " ");
    const date = new Date(datetime_string);
    return date.getUTCFullYear() + "/" +
	("0" + (date.getUTCMonth()+1)).slice(-2) + "/" +
	("0" + date.getUTCDate()).slice(-2) + " " +
	("0" + date.getUTCHours()).slice(-2) + ":" +
	("0" + date.getUTCMinutes()).slice(-2) + ":" +
	("0" + date.getUTCSeconds()).slice(-2);
};
