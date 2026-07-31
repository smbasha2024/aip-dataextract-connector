from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class ServerSettings(BaseSettings):
    client_id: str = Field(default="CLIENT001", alias="CLIENT_ID")
    server_ws: str = Field(default="ws://localhost:8000/ws", alias="SERVER_WS")
    result_api: str = Field(default="http://localhost:8000/task-result", alias="RESULT_API")
    database_url: str = Field(default="sqlite:///app/data/ric_databridge.db", alias="DATABASE_URL")
    max_parallel_agents: int = Field(default=3, alias="MAX_PARALLEL_AGENTS")
    dashboard_url: str = Field(default="http://localhost:5050", alias="DASHBOARD_URL")
    version: str = Field(default="0.1.0",alias="VERSION")
    
    model_config = SettingsConfigDict(extra="ignore", env_file=".env", env_file_encoding="utf-8")

settings = ServerSettings()