var ms = {
  grid: [],
  create_grid : function(size){
    for( i = 1; i <= size; i++){
      for( k = 1; k <= size; k++){
        this.grid.push(new Tile(i, k));
      }
    }
  },
  mine_generate : function(mines){
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    for (i = 1; i<= mines; i++){
      this.grid[getRandomInt(1, ms.grid_size * ms.grid_size - 1)].mine = true;
    }
  },
  tile_find: function(x,y){
    var item =  ms.grid[(ms.grid_size * x - ms.grid_size + y - 1)];
    if(item != undefined){
      return item;
    }
  },
  init: function(size, mines){
    ms.create_grid(size);
    ms.mine_generate(mines);
  }

}

var Tile = function(x, y) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.find_mines = function(){
      var count = 0;
      var _x = [x, x + 1, x - 1];
      var _y = [y, y + 1, x - 1];
      for( i = 0; i < _x.length; i++){
        for( j = 0; j < _y.length; j++){
          var tile = ms.tile_find(_x[i], _y[j]);
          if(tile != undefined){
            count +=(tile.mine ? 1 : 0);
          }
        }
      }
      return count;
    }
};

ms.init(8, 10);


console.log(ms.tile_find(5,4).find_mines());

