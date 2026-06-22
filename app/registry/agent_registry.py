from agents.direct_tax_agent import DirectTaxAgent
from agents.pf_agent import PFAgent
from agents.tds_agent import TDSAgent

AGENTS = {
    "tds": TDSAgent,
    "dt": DirectTaxAgent,
    "pf": PFAgent
}