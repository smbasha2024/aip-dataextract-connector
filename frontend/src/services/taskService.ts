import axios from "axios";

import { CONFIG } from "../config/config";
import type { TaskResponse } from "../types/task";

export async function getUnfinishedTasks(): Promise<TaskResponse[]> {
    const response = await axios.get<TaskResponse[]>(
        `${CONFIG.apiUrl}/api/tasks/unfinished`
    );
    console.log(response.data);
    return response.data;
}