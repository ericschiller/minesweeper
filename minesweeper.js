var ms = {
  grid_size: 0,
  mine_size: 0,
  grid: [],
  create_grid : function(size){
    this.grid_size = size;
    for( i = 1; i <= size; i++){
      for( k = 1; k <= size; k++){
        this.grid.push(new Tile(k, i));
        $('#grid').append('<div class="tile" id="' + k + '_' + i + '"></div>').css('width', this.grid_size * 30);

      }
    }
    $('#grid .tile').click(function(){
      var t = $(this).attr('id').split('_');
      console.log(this);
      temp_tile = ms.tile_find(parseInt(t[0]), parseInt(t[1]));
      temp_tile.find_mines();
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
    this.checked = false;
    this.id = '#' + this.x + '_' + this.y;
    this.find_mines = function(){
      if (this.mine){
        $(this.id).css('background-color', 'red').text('☼');
      }
      else{
        $(this.id).css('background-color', '#E6E6E6');
        this.checked = true;
        var count = 0;
        var _x = [this.x, this.x + 1, this.x - 1];
        var _y = [this.y, this.y + 1, this.y - 1];
        for( i = 0; i < _x.length; i++){
          for( j = 0; j < _y.length; j++){
            var tile = ms.tile_find(_x[i], _y[j]);
            if (tile != undefined && tile != this && this.checked != true){
              tile.find_mines();
              count +=(tile.mine ? 1 : 0);
            }
          }
        }
        if (count > 0){
          $(this.id).text(count);
        }
        else{
        }
      }
    };
    this.around = function(){
      var _x = [this.x, this.x + 1, this.x - 1];
      var _y = [this.y, this.y + 1, this.y - 1];
      console.log('start ' + this.x + "  " + this.y);
      var to_check = [];
      for( k = 0; k < _x.length; k++){
        for( l = 0; l < _y.length; l++){
          console.log(_x[k] + "  " + _y[l]);
          var tile = ms.tile_find(_x[k], _y[l]);
          if (tile != undefined && tile.checked === false ) {
            to_check.push(tile);
          }
        }
      }
      $.each(to_check, function(thing){
        to_check[thing].find_mines();
      });
    }
};

ms.init(8, 10);
console.log(ms.grid);
