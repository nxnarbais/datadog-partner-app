from datadog import initialize, statsd
import time
import random
import os

options = {
    'statsd_host': os.getenv("STATSD_HOST"),
    'statsd_port': os.getenv("STATSD_PORT")
}

initialize(**options)

ENV = "demo"

def generateHistogram():
  print("Generate histogram")
  statsd.histogram('demo.python_statsd.histogram', random.randint(0, 20), tags=["env:"+ENV])

def generateEvent():
  print("Generate event")
  statsd.event('Hello world!', 'An event from my dummy app', alert_type='info', tags=['env:'+ENV])

def incrementCounter():
  print("Generate counter")
  statsd.increment('demo.python_statsd.increment', tags=["env:"+ENV])

while(1):
  print("Looping through again dogs!")
  generateHistogram()
  if(random.uniform(0, 1) > 0.7):
    incrementCounter()
  if(random.uniform(0, 1) > 0.9):
    generateEvent()
  time.sleep(2)