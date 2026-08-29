from .manual_csv import ManualCsvAdapter
from .greenhouse import GreenhouseAdapter
from .lever import LeverAdapter

ADAPTERS = {"manual_csv": ManualCsvAdapter, "greenhouse": GreenhouseAdapter, "lever": LeverAdapter}
