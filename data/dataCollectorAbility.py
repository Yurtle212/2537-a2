import requests
import json

response = requests.get("https://pokeapi.co/api/v2/ability?limit=100000");
final = {}

i = 0

for thing in response.json()["results"]:
    if (i < 100000):
        tmp = requests.get(thing["url"]).json()
        final[tmp["name"]] = {}
        
        for ft in tmp["flavor_text_entries"]:
            if (ft["language"]["name"] == "en"):
                final[tmp["name"]]["flavor_text_entries"] = ft
        final[tmp["name"]]["pokemon"] = tmp["pokemon"]
        
        #print(tmp["abilities"])
        #print("\n")
    i += 1
    print(i)

with open('ability.json', 'w') as file:
    file.write(json.dumps(final, indent=4, sort_keys=True).replace("https://pokeapi.co/api/v2/", "/api/"))