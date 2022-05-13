import requests
import json

response = requests.get("https://pokeapi.co/api/v2/pokemon?limit=100000");
final = {}

i = 0

for thing in response.json()["results"]:
    if (i < 9999):
        final[i] = {}
        tmp = requests.get(thing["url"]).json()
        final[i]["abilities"] = tmp["abilities"];

        final[i]["moves"] = [];
        for move in tmp["moves"]:
            final[i]["moves"].append({"move": move["move"]})
        
        final[i]["name"] = tmp["name"];

        final[i]["sprites"] = {"other": {"official-artwork": {}}};
        final[i]["sprites"]["other"]["official-artwork"]["front_default"] = tmp["sprites"]["other"]["official-artwork"]["front_default"]

        final[i]["stats"] = tmp["stats"];
        final[i]["types"] = tmp["types"];
        #print(tmp["abilities"])
        #print("\n")
    i += 1
    print(i)

with open('pokemon.json', 'w') as file:
    file.write(json.dumps(final, indent=4, sort_keys=True).replace("https://pokeapi.co/api/v2/", "/api/"))