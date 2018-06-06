import requests
from threading import Thread
import time

b_num = int(input("Input Batch num\n"))
request_per_batch = int(input("Input request_per_batch\n"))

url = "https://rapi.link"


def check(url, batch_index, request_index):
    try:
        start_t = time.time()
        response = requests.get(url, timeout=12).text
        if len(response) > 30 and "Artrix" in response:
            print("[" + str(int((time.time() - start_t) * 100) / 100) + "s]batch" + str(batch_index) + "-" + str(
                request_index) + ":OK")
        else:
            print("##[" + str(int((time.time() - start_t) * 100) / 100) + "s]batch" + str(batch_index) + "-" + str(
                request_index) + ":BAD##")
    except requests.exceptions.ReadTimeout:
        print("##[" + str(int((time.time() - start_t) * 100) / 100) + "s]batch" + str(batch_index) + "-" + str(
            request_index) + ":Timeout##")


for batch in range(b_num):
    for i in range(request_per_batch):
        t = Thread(target=check, args=(url, batch, i,))
        t.start()
        time.sleep(0.02)
    print("------NextBatch-----")
    time.sleep(2.5)
