var q = require('q')
var request = require('request-promise')
var _ = require('underscore')

var api = "http://pokeapi.co/api/v1/pokemon/"

var pokemons = []

request(api)
  .then(function(data) {
    var numPokes = JSON.parse(data).meta.total_count
    console.log('Gotta GET them all!', numPokes, 'commence pokerap')
    pokemons = new Array(numPokes)

    var promises = _.range(numPokes).map(function(value, index, array) {
      return request({
        uri: api+(index+1).toString(),
        timeout: 10000,
        method: "GET"
      })
      .then(function(data) {
        pokemon = JSON.parse(data).name
        process.stdout.write(pokemon+'!')
        pokemons[index] = pokemon
      })
      .catch(function(error){
        // pokeapi doesn't have them all
        // missing 719-721
        // total_count reports incorrectly as well (778?)
        pokemons[index] = 'no pokemon'
      })
    })

    q.all(promises).then(function(){
      console.log("timeout!")
      var pokes_caught = 0
      pokemons.forEach(function(pokemon){
        if (pokemon !== 'no pokemon') {
          pokes_caught = pokes_caught + 1
        }
      })
      console.log(pokes_caught + " pokemon caught!")
    })

  })
