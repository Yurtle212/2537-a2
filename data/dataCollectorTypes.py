import requests
import json

response = requests.get("https://pokeapi.co/api/v2/type?limit=100000");
final = {}

i = 0

for thing in response.json()["results"]:
    if (i < 100000):
        tmp = requests.get(thing["url"]).json()
        final[tmp["name"]] = {}
        final[tmp["name"]]["id"] = tmp["id"];
        final[tmp["name"]]["name"] = tmp["name"];
        final[tmp["name"]]["pokemon"] = tmp["pokemon"]
        #print(tmp["abilities"])
        #print("\n")
    i += 1
    print(i)

with open('type.json', 'w') as file:
    file.write(json.dumps(final, indent=4, sort_keys=False).replace("https://pokeapi.co/api/v2/", "/api/"))