import { API_BASE_URL } from "./api"

export const updateUserProgress = async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/v1/progress/me/complete-part`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${token}`
        },
    });

    const body = await response.json();

    if(!response.ok){
        throw new Error(`Server error: ${response.status}`);
    }

    return body;
}