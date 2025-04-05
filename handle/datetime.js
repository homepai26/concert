// var test = "2018-03-03T11:00:00Z";
// test = test.Replace("T", " ").Replace("Z", " ");
// console.log(new Date().toUTCString());

get_gnu_local_datetime = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const dateLocal = new Date(now.getTime() - offsetMs);
    return dateLocal.getUTCFullYear() + "/" +
	("0" + (dateLocal.getUTCMonth()+1)).slice(-2) + "/" +
	("0" + dateLocal.getUTCDate()).slice(-2) + " " +
	("0" + dateLocal.getUTCHours()).slice(-2) + ":" +
	("0" + dateLocal.getUTCMinutes()).slice(-2) + ":" +
	("0" + dateLocal.getUTCSeconds()).slice(-2);
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

module.exports.get_gnu_local_datetime = get_gnu_local_datetime;
module.exports.get_gnu_datetime = get_gnu_datetime;

//console.log(this.get_gnu_datetime('2025-02-02T03:00:00.000Z'));
