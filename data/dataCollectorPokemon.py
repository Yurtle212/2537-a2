import requests
import json

response = requests.get("https://pokeapi.co/api/v2/pokemon?limit=100000");
final = {}

i = 0

for thing in response.json()["results"]:
    if (i < 100000):
        tmp = requests.get(thing["url"]).json()
        final[tmp["name"]] = {}
        final[tmp["name"]]["abilities"] = tmp["abilities"];
        final[tmp["name"]]["id"] = tmp["id"]

        final[tmp["name"]]["moves"] = [];
        for move in tmp["moves"]:
            final[tmp["name"]]["moves"].append({"move": move["move"]})
        
        final[tmp["name"]]["name"] = tmp["name"];

        final[tmp["name"]]["sprites"] = {"other": {"official-artwork": {}}};
        final[tmp["name"]]["sprites"]["other"]["official-artwork"]["front_default"] = tmp["sprites"]["other"]["official-artwork"]["front_default"]

        final[tmp["name"]]["stats"] = tmp["stats"];
        final[tmp["name"]]["types"] = tmp["types"];
        final[tmp["name"]]["forms"] = tmp["forms"];
        #print(tmp["abilities"])
        #print("\n")
    i += 1
    print(i)

with open('pokemon.json', 'w') as file:
    file.write(json.dumps(final, indent=4, sort_keys=False).replace("https://pokeapi.co/api/v2/", "/api/"))