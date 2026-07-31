from app.agents.direct_tax_agent import DirectTaxAgent
from app.agents.pf_agent import PFAgent
from app.agents.tds_agent import TDSAgent

AGENTS = {
    "tds": TDSAgent,
    "dt": DirectTaxAgent,
    "pf": PFAgent
}