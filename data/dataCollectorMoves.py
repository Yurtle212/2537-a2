import requests
import json

response = requests.get("https://pokeapi.co/api/v2/move?limit=100000");
final = {}

i = 0

for thing in response.json()["results"]:
    if (i < 100000):
        tmp = requests.get(thing["url"]).json()
        final[tmp["name"]] = {}
        final[tmp["name"]]["type"] = tmp["type"];
        final[tmp["name"]]["learned_by_pokemon"] = tmp["learned_by_pokemon"]
        #print(tmp["abilities"])
        #print("\n")
    i += 1
    print(i)

with open('move.json', 'w') as file:
    file.write(json.dumps(final, indent=4, sort_keys=True).replace("https://pokeapi.co/api/v2/", "/api/"))