import { createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { ApiError } from "./rejector";

export const createFrameActionAsyncThunk = (type, payloadCreator, options) => {
    const newPayloadCreator = async (...args) => {
        const result = await payloadCreator(...args);
        if (window.sessionStorage.getItem("frameId")) {
            if (isRejectedWithValue(result)) {
                const { payload } = result
                    ? result
                    : {
                          payload: new ApiError(
                              "Unknown error",
                              500,
                              { error_message: "Error generated on undefined thunk result", data: result },
                              "Error generated on undefined thunk result"
                          ),
                      };
                window.parent.postMessage(
                    {
                        type: "action",
                        event: type,
                        data: {
                            is_error: true,
                            event: type,
                            args: args[0] !== undefined ? JSON.parse(JSON.stringify(args[0])) : undefined,
                            result: payload !== undefined ? JSON.parse(JSON.stringify(payload)) : undefined,
                        },
                        frameId: window.sessionStorage.getItem("frameId"),
                    },
                    "*"
                );
            }

            window.parent.postMessage(
                {
                    type: "action",
                    event: type,
                    data: {
                        is_error: false,
                        event: type,
                        args: args[0] !== undefined ? JSON.parse(JSON.stringify(args[0])) : undefined,
                        result: result !== undefined ? JSON.parse(JSON.stringify(result)) : undefined,
                    },
                    frameId: window.sessionStorage.getItem("frameId"),
                },
                "*"
            );
        }
        return result;
    };

    return createAsyncThunk(type, newPayloadCreator, options);
};
