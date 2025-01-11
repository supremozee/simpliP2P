import Cookies from "js-cookie";

export default function isAuthenticated(): boolean {
    return Cookies.get('simpliToken') !== undefined;
}