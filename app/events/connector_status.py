from enum import Enum

class ConnectorStatus(str, Enum):
    STARTING = "STARTING"
    CONNECTED = "CONNECTED"
    DISCONNECTED = "DISCONNECTED"
    IDLE = "IDLE"
    BUSY = "BUSY"
    RECOVERING = "RECOVERING"
    SHUTTING_DOWN = "SHUTTING_DOWN"