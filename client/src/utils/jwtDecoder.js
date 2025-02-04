export function decodeJwt(token){
    const parts = token.split(".");
    const payload = atob(parts[1]);
    const parsedPayload = JSON.parse(payload);
    return parsedPayload;
}