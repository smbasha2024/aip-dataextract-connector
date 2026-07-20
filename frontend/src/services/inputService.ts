import axios from "axios";
import { CONFIG } from "../config/config";
import type { PendingInputResponse } from "../types/input";

export async function getPendingInput(): Promise<PendingInputResponse> {
    const response =
        await axios.get<PendingInputResponse>(
            `${CONFIG.apiUrl}/api/input/pending`
        );

    return response.data;
}