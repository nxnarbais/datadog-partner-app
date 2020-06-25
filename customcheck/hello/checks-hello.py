# To be located in checks.d/hello,py

# the following try/except block will make the custom check compatible with any Agent version
try:
    # first, try to import the base class from new versions of the Agent...
    from datadog_checks.base import AgentCheck
except ImportError:
    # ...if the above failed, the check is running in Agent version < 6.6.0
    from checks import AgentCheck
import random


# content of the special variable __version__ will be shown in the Agent status page
__version__ = "1.0.0"

class HelloCheck(AgentCheck):
    def check(self, instance):
        value = random.randint(0,9)
        # Explore how the app behave based on the metric type
        self.gauge('custom.request.latency', value, tags=['endpoint:x', 'status:200'])
        self.count('custom.request.count.hits', value)
        self.monotonic_count('custom.request.monotonic_count.hits', value)
