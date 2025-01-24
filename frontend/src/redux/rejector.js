export class ApiError extends Error {
    data = null;
    responseText = null;
    status = null;

    constructor(message, status, data, responseText) {
        super(message);
        this.status = status;
        this.data = data;
        this.responseText = responseText;
    }
}

export const rejector = async (response, rejectWithValue) => {
    const text = await response.text();
    try {
        const json = await response.json();
        if (!json.error_message) {
            return rejectWithValue(new ApiError("Unknown error", response.status, json, text));
        }

        return rejectWithValue(new ApiError(json.error_message, response.status, json, text));
    } catch (error) {
        return rejectWithValue(new ApiError("Unknown error", response.status, error, text));
    }
};
