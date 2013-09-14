var ms = {
  grid_size: 0,
  mine_size: 0,
  grid: [],
  create_grid : function(size){
    this.grid_size = size;
    for( i = 1; i <= size; i++){
      for( k = 1; k <= size; k++){
        this.grid.push(new Tile(k, i));
        $('#grid').append('<div class="tile" id="' + i + '_' + k + '"></div>').css('width', this.grid_size * 30);

      }
    }
    $('#grid .tile').click(function(){
      var t = $(this).attr('id').split('_');
      temp_tile = ms.tile_find(parseInt(t[0]), parseInt(t[1]));
      if (temp_tile.mine){
        $(this).css('background-color', 'red').text('☼');
      }
      else{
        var mine_count = temp_tile.find_mines();
        $(this).css('background-color', '#E6E6E6');
        if (mine_count > 0){
          $(this).text(mine_count);
        }
      }

    });


  },
  mine_generate : function(mines){
    this.mine_size = mines;
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
    for (i = 1; i<= mines; i++){
      var roll = getRandomInt(1, ms.grid_size * ms.grid_size - 1);
      if (ms.grid[roll].mine){
        i--;
      }
      else{
        ms.grid[roll].mine = true;
      }
    }
  },
  tile_find: function(x,y){
    var item =  ms.grid[(ms.grid_size * y - ms.grid_size + x - 1)];
    if(item != undefined && item.x === x && item.y === y){
      return item;
    }
  },
  clear: function(){
    $('.tile').remove();
    ms.grid = [];
    ms.init(ms.grid_size, ms.mine_size);
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
      var _x = [this.x, this.x + 1, this.x - 1];
      var _y = [this.y, this.y + 1, this.y - 1];
      for( i = 0; i < _x.length; i++){
        for( j = 0; j < _y.length; j++){
          var tile = ms.tile_find(_x[i], _y[j]);
          if (tile != undefined && tile != this){
            count +=(tile.mine ? 1 : 0);
          }
        }
      }
      return count;
    }
};

ms.init(8, 10);
console.log(ms.grid);
