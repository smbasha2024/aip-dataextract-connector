import axios from "axios";

import { CONFIG } from "../config/config";
import type { HealthResponse } from "../types/health";

export async function getHealth(): Promise<HealthResponse> {
    const response = await axios.get<HealthResponse>(
        `${CONFIG.apiUrl}/api/health`
    );
    console.log(response.data);
    return response.data;
}