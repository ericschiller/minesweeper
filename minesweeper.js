var ms = {
  grid_size: 0,
  mine_size: 0,
  grid: [],
  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
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
    
    for (var i = 1; i<= mines; i++){
      var roll = this.getRandomInt(1, ms.grid_size * ms.grid_size - 1);
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
  cheat: function(){
    for (var t = 0; t <= ms.grid_size * ms.grid_size; t++){
      if (ms.grid[t] === undefined){
        alert("That's all the mines cheater!");
        ms.new_game();
        break;
      }
      else if(ms.grid[t].mine && ms.grid[t].flagged === false){
        ms.grid[t].flag();
        break;
      }
    }
  },
  new_game: function(){
    $('.tile').remove();
    ms.grid = [];
    ms.init(ms.grid_size, ms.mine_size);
  },
  score: function(){
    var winning = false;
    for (var t = 0; t <= ms.grid_size * ms.grid_size - 1; t++){
      if(ms.grid[t].mine && ms.grid[t].flagged){
        winning = true;
      }
      else {winning = false};
    }
    if(winning){alert("You've won!"); ms.new_game();}
    else { alert("Sorry, try again.")};
  },
  init: function(size, mines){
    document.oncontextmenu = function() {return false;};
    ms.create_grid(size);
    ms.mine_generate(mines);
    $('#cheat').unbind().click(function(){
      ms.cheat();
    });
    $('#new').unbind().click(function(){
      ms.new_game();
    });
    $('#score').unbind().click(function(){
      ms.score();
    });
    $('#grid .tile').mousedown(function(e){
      var t = $(this).attr('id').split('_');
      var temp_tile = ms.tile_find(parseInt(t[0]), parseInt(t[1]));
      if( e.button === 0 ) { 
        temp_tile.find_mines();
      }
      else if( e.button === 2 && temp_tile.checked === false) {
        temp_tile.flag();
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
    this.flag = function(){
      if (this.flagged === false){
        this.flagged = true;
        $(this.id).css('background-color', 'deepskyblue').text('⚑');
        }
        else{
          this.flagged = false;
          $(this.id).css('background-color', '#A4A4A4').text('');
        }
    };
    this.find_mines = function(){
      if(this.mine && this.flagged === false){
        $(this.id).css('background-color', 'red').text('☼');
        alert('Game over man.  Press "OK" to start a new game.');
        ms.new_game();
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

