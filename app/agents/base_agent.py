# base_agent.py

class BaseAgent:
    async def execute(self, payload: dict):
        raise NotImplementedError()