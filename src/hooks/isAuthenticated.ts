import Cookies from "js-cookie";

export default function isAuthenticated(): boolean {
    const token = Cookies.get('accessToken')
    if (!token || token === undefined || token === "") {
        return false;
    }
    return true
}