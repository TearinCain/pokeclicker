/**
 * Created by dennis on 26-06-17.
 */
class dataPokemon implements pokemonInterface {
    id: number;
    name: string;
    catchRate: number;
    evolution: string;
    evoLevel: number;
    type1: gameConstants.PokemonType;
    type2: gameConstants.PokemonType;
    attack: number;
    levelType: gameConstants.LevelType;
    exp: number;
    eggCycles: number;
    shiny: boolean;
}