define(['scripts/client/bootstrap.js'], function(){

  window.PreGameView = Backbone.View.extend({
    template: T['pregame'],
    className: 'pregame',
    events: {
      "click .goToLobby": "goToLobby",
      "click .startGame": "startGame"
    },
    initialize: function(options){
      this.game = options.game;
      this.parentView = options.parentView;

      if($("#diplomacy .pregame").length === 0)
        $('#diplomacy').append(this.el);
      else
        $('#diplomacy .pregame').replaceWith(this.el);

      $(this.el).html(this.template.r({}));

      new PlayerList({game:this.game, target: $(this.el).find('.player-list')});
      new PowerList({game:this.game, target: $(this.el).find('.power-list')});
      new BotList({game:this.game, target: $(this.el).find('.bot-list')});

    },
    goToLobby: function(){
      $(this.el).hide();
      $(".lobby").show();
    },
    selectPower: function(ev){
      //user_selected, other_selected, selectable
      var power = $(ev.target).attr('class').split(' ').filter(function(element){return ($.inArray(element,PLAYERS)!=-1);})[0];
      console.log('player select: ', power);
      var player_list = this.game.get('players');

      var choosing_player = this.game.get('players').find(function(player){return player.get('user').id == window.user.id; });
      choosing_player.set({'power':power});
      choosing_player.save();

    },
    startGame: function(ev){
      $(this.el).remove();

      this.game.set({status:"active"});

      //generate chatrooms

      /*
      _.each(this.game.get('players').permutations(), function(pair){
        this.game.get('chatrooms').create({players: [pair[0].id, pair[1].id]})
      }, this);

      */
      this.game.save();

      new BoardView(this.game);
    }
  });

  var PlayerList = Backbone.View.extend({
    template: T['players_pregame'],
    events: {
      "click .boot": "bootPlayer"
    },
    initialize: function(options){
      this.game = options.game;

      options.target.append(this.el);

      this.game.get('players').bind("remove", this.render, this);
      this.game.get('players').bind("add", this.render, this);
      this.game.get('players').bind("change", this.render, this);

      this.render();
    },
    render: function(){
      $(this.el).html("");
      this.game.get('players').each(function(player){this.addOne(player); }, this);
    },
    addOne: function(player){
      $(this.el).append(this.template.r({player:player.toData(),player_id:player.id}));
    },
    bootPlayer: function(e){
      var boot_id = $(e.currentTarget).attr("data-id");

      players = this.game.get('players');
      players.remove(players.get(boot_id));
    }
  });

  var BotList = Backbone.View.extend({
    template: T['bots_pregame'],
    events: {
      "click .power": "selectPower"
    },
    initialize: function(options){
      this.game = options.game;

      options.target.append(this.el);

      this.game.get('players').bind("remove", this.render, this);
      this.game.get('players').bind("add", this.render, this);
      this.game.get('players').bind("change", this.render, this);

      this.render();
    },
    render: function() {
      available_powers = _.difference(
        PLAYERS,
        this.game.get('players').map(function(player) { return player.get('power'); }));
      console.log('Rendering: Available powers are ', available_powers);

      data = {powers: available_powers.map(function(p){ return {name: p}; })};
      $(this.el).html(this.template.r(data));
    },
    selectPower: function(ev){
      var power = $(ev.currentTarget).attr('data-power');

      // if power available
      if (undefined == this.game.get('players').find(function(player){return player.get('power') == power; })) {
        // Add bot to the game
        console.log('Adding bot as ', power);
        window.socket.emit('game:addbot', this.game.id, power);
      }
      this.render();
    }
  });

  var PowerList = Backbone.View.extend({
    template: T['powers_pregame'],
    events: {
      "click .power": "selectPower"
    },
    initialize: function(options){
      this.game = options.game;

      options.target.append(this.el);

      this.game.get('players').bind("remove", this.render, this);
      this.game.get('players').bind("add", this.render, this);
      this.game.get('players').bind("change", this.render, this);

      this.render();
    },
    render: function(players){
      //assemble power dict for template
      available_powers = _.difference(
        PLAYERS,
        this.game.get('players').map(function(player){ return player.get('power'); }));

      data = {powers:available_powers.map(function(p){return {name:p}; })};

      $(this.el).html(this.template.r(data));
    },
    selectPower: function(ev){
      //user_selected, other_selected, selectable
      var power = $(ev.currentTarget).attr('data-power');

      // if power available
      if(undefined == this.game.get('players').find(function(player){return player.get('power') == power; })   ){
        // assign it to current user

        choosing_player = this.game.get('players').ownedBy(window.user);

        if(choosing_player != undefined){
          choosing_player.set({'power':power});
          choosing_player.save();
        } else {
          // if user not part of game, add user to game
          this.game.get('players').create({power: power, user: window.user});
        }
      }

      this.render();
    }
  });

});
