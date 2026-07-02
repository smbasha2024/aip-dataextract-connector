# base_agent.py

class BaseAgent:
    async def execute(self, task):
        raise NotImplementedError()