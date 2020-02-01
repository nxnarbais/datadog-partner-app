import os
import time
import json
import uuid
import random
import requests
import datetime

DD_API_KEY = os.environ.get('DD_API_KEY')
if not DD_API_KEY:
	print('Must have DD_API_KEY set')
	exit()

DD_SOURCE = "myapp"

dd_url = "https://http-intake.logs.datadoghq.com/v1/input/{DD_API_KEY}".format(DD_API_KEY=DD_API_KEY)
HEADERS = {'Content-Type': 'text/plain'}

LOG_COUNT = 100
WORDS = ["condonable","unmortise","nonprolifically","chardonnet","fluxionary","palmitic","unsoiling","comical","arcanum","bulrush","outled","unsportsmanlike","ferial","intercessional","dialectologic","crestfishes","unbalanceable","meliorist","invigorated","danios","glossies","dann","knottiness","relived","semisecrecy","antofagasta","uninterchangeable","isospondylous","desecration","multivolume","improvably","peloric","thieveries","guacin","outgrinning","lawyerlike","potos","mythic","irreclaimably","unruminant","sponson","intumescence","outtravel","outsang","haematozoic","inefficiently","polymastus","wizard","subflora","gorger","procrustes","miscounsel","ballonet","hyperromantically","discoverer","assertiveness","nonparalytic","braguette","devilkin","gossaert","obligate","strangulation","psoas","belgic","kawasaki","preeruption","thalassographic","unvirulent","nonfruition","beauteously","pseudodramatically","bawdiest","switchback","viareggio","hygienist","liturgism","risible","cagey","cosmist","elastoplast","luckie","assertively","jct","undermeasuring","backdoor","alpenstock","mudfish","valiantness","keratoma","chuckleheadedness","accentuator","sonantal","emulsibility","byssuses","gummy","grubstaker","hypoalonemia","cheeriness","expropriation"]

# log example
# [Fri, 29 Mar 2019 12:00:57 -0700] Some text here that isn't JSON. [Message Begins] {"key": "value", "another_key": "another_value", "measure_one": 9, "status": "INFO", "url": "https://testsite.com/geocyclic?page=38#axillar"} [user2]

log_string = "[{date}] Some text here that isn't JSON. [Message Begins] {json_string} [{username}]"
json_string = {
	"key": "value",
	"another_key": "another_value",
	"measure_one": "",
	"status": "",
	"url": "https://testsite.com/{path}?page={page_num}#{fragment}"
}

def get_random_item_from_list(list_of_choices):
	upper_bound = (len(list_of_choices) - 1)
	idx = random.randint(1, upper_bound)
	return list_of_choices[idx]

def generate_timestamp():
	d = datetime.datetime.now(datetime.timezone.utc).astimezone()
	ts = d.strftime("%a, %d %b %Y %H:%M:%S %z")
	return ts

def generate_json_string():
	r1 = random.randint(1,100)
	status = generate_status()
	word1 = get_random_item_from_list(WORDS)
	r2 = random.randint(1,50)
	word2 = get_random_item_from_list(WORDS)
	json_string["measure_one"] = r1
	json_string["status"] = status
	url = json_string["url"].format(path=word1, page_num=r2, fragment=word2)
	json_string["url"] = url
	return json_string

def generate_status():
	i = random.randint(1,100)
	if (i > 90):
		status = 'ERROR'
	elif (i > 80):
		status = 'WARNING'
	elif (i > 30):
		status = 'INFO'
	else:
		status = 'DEBUG'
	return status

def generate_log():
	ts = generate_timestamp()
	json_string = json.dumps(generate_json_string())
	username = "user{0}".format(random.randint(1,15))
	# import pdb; pdb.set_trace()
	return log_string.format(date=ts, json_string=json_string, username=username)

print(generate_log())

def send_log(log, source):
	print('Sending log: %s' % log)
	url = dd_url + "?ddsource={source}".format(source=source)
	r = requests.post(url, data=log, headers=HEADERS)

for i in range(LOG_COUNT):
	l = generate_log()
	send_log(l, DD_SOURCE)
	x = random.uniform(1, 2.3)
	time.sleep(x)