var ms = {
  grid_size: 0,
  mine_size: 0,
  grid: [],
  create_grid : function(size){
    this.grid_size = size;
    for(var i = 1; i <= size; i++){
      for(var k = 1; k <= size; k++){
        this.grid.push(new Tile(k, i));
        $('#grid').append('<div class="tile" id="' + k + '_' + i + '"></div>').css('width', this.grid_size * 30);

      }
    }
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
    if(item !== undefined && item.x === x && item.y === y){
      return item;
    }
  },
  clear: function(){
    $('.tile').remove();
    ms.grid = [];
    ms.init(ms.grid_size, ms.mine_size);
  },
  init: function(size, mines){
    document.oncontextmenu = function() {return false;};
    ms.create_grid(size);
    ms.mine_generate(mines);
    $('#grid .tile').mousedown(function(e){
      var t = $(this).attr('id').split('_');
      temp_tile = ms.tile_find(parseInt(t[0]), parseInt(t[1]));
      if( e.button === 0 ) { 
        temp_tile.find_mines();
      }
      else if( e.button === 2 && temp_tile.checked === false) {
        if (temp_tile.flagged === false){
          temp_tile.flagged = true;
          $(this).css('background-color', 'deepskyblue').text('⚑');
        }
        else{
          temp_tile.flagged = false;
          $(this).css('background-color', '#A4A4A4').text('');
        }
      } 
    });
  }
};
var Tile = function(x, y) {
    this.x = x;
    this.y = y;
    this.mine = false;
    this.checked = false;
    this.flagged = false;
    this.id = '#' + this.x + '_' + this.y;
    this.count = 0;
    this.find_mines = function(){
      if(this.mine && this.flagged === false){
        $(this.id).css('background-color', 'red').text('☼');
      }
      else if (this.checked === false && this.flagged === false){
        $(this.id).css('background-color', '#E6E6E6');
        var _x = [this.x, this.x + 1, this.x - 1];
        var _y = [this.y, this.y + 1, this.y - 1];
        var hit = [];
        for(var i = 0; i < _x.length; i++){
          for(var j = 0; j < _y.length; j++){
            var tile = ms.tile_find(_x[i], _y[j]);
            if (tile !==undefined && tile !==this && tile.checked === false){
              this.count +=(tile.mine ? 1 : 0);
              this.checked = true;
              if(tile.mine === false){
                hit.push(tile);
              }
            }
          }
        }
        if (this.count > 0){
          $(this.id).text(this.count);
        }
        else{
          $.each(hit, function(tile){
            hit[tile].find_mines();
          });
        }
      }
    };
};

$(document).ready(function(){ 
  ms.init(8, 10);
});
