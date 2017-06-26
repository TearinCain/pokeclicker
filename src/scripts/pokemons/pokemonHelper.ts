///<reference path="pokemonList.ts"/>

class PokemonHelper {

    public static findPokemonByName(name:string){
        return pokemonMap[name];
    }

    public static typeStringToId(id:string){
        return gameConstants.PokemonType[id];
    }

    public static typeIdToString(id:number){
        return gameConstants.PokemonType[id];
    }

}