(function() {
window.T = window.T || {};
window.T["board"] = new HoganTemplate();
window.T["board"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<div id=\"map\"></div>";b += "\n" + i;b += "<div id=\"side\">";b += "\n" + i;b += "  ";b += (_.v(_.f("name",c,p,0)));b += "\n" + i;b += "  <p>Connected Users:</p>";b += "\n" + i;b += "  <div id=\"users\"></div>";b += "\n" + i;b += "  <a class=\"exit\" href=\"#\">go to lobby</a>";b += "\n" + i;b += "  <a class=\"delete\" href=\"#\">delete game</a>";b += "\n" + i;b += "</div>";return b;;}
window.T["chat"] = new HoganTemplate();
window.T["chat"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<li>";b += "\n" + i;b += "  <p>Hi I&apos;m <a href=\"http://twitter.com/";b += (_.v(_.f("twitter",c,p,0)));b += "\">@";b += (_.v(_.f("twitter",c,p,0)));b += "</a></p>";b += "\n" + i;b += "  <p>I work for ";b += (_.v(_.f("employer",c,p,0)));b += " as a ";b += (_.v(_.f("job_title",c,p,0)));b += ".</p>";b += "\n" + i;b += "</li>";return b;;}
window.T["chatroom"] = new HoganTemplate();
window.T["chatroom"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<div class='messages'>";b += "\n" + i;b += "</div>";b += "\n" + i;b += "<form>";b += "\n" + i;b += "  <input placeholder='chat here' type='text' />";b += "\n" + i;b += "  <input type='submit' class=\"submit\"/>";b += "\n" + i;b += "</form>";return b;;}
window.T["game"] = new HoganTemplate();
window.T["game"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<a href='#' class='game-link'>";b += (_.v(_.f("name",c,p,0)));b += "</a>";return b;;}
window.T["lobby"] = new HoganTemplate();
window.T["lobby"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<p>This is the lobby.</p>";b += "\n" + i;b += "<form id=\"new-game\">";b += "\n" + i;b += "  <input id=\"new-game-input\" placeholder=\"new game name\" type=\"text\" />";b += "\n" + i;b += "  <input id=\"create-game\" type=\"submit\" />";b += "\n" + i;b += "</form>";return b;;}
window.T["map"] = new HoganTemplate();
window.T["map"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;if(_.s(_.f("units",c,p,1),c,p,0,10,61, "{{ }}")){b += _.rs(c,p,function(c,p){ var b = "";b += "<li>";b += "\n" + i;b += "  ";b += (_.v(_.f("owner",c,p,0)));b += "\n" + i;b += "  ";b += (_.v(_.f("utype",c,p,0)));b += "\n" + i;b += "  ";b += (_.v(_.f("province",c,p,0)));b += "\n" + i;b += "</li>";b += "\n";return b;});c.pop();}else{b += _.b; _.b = ""};return b;;}
window.T["message"] = new HoganTemplate();
window.T["message"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<span class='username'>";b += (_.v(_.f("username",c,p,0)));b += ": </span>";b += "\n" + i;b += "<span class='content'>";b += (_.v(_.f("content",c,p,0)));b += "</span>";return b;;}
window.T["order_submit"] = new HoganTemplate();
window.T["order_submit"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "<ul>";b += "\n" + i;if(_.s(_.f("units",c,p,1),c,p,0,15,231, "{{ }}")){b += _.rs(c,p,function(c,p){ var b = "";b += "  <li>";b += "\n" + i;b += "    ";b += (_.v(_.f("province",c,p,0)));b += "\n" + i;b += "    <select>";b += "\n" + i;b += "      <option>hold</option>";b += "\n" + i;b += "      <option>move</option>";b += "\n" + i;b += "      <option>support</option>";b += "\n" + i;b += "    </select>";b += "\n" + i;b += "\n" + i;b += "    to:";b += "\n" + i;b += "    ";b += "\n" + i;b += "    <select>";b += "\n" + i;b += "      <option>TODO</option>";b += "\n" + i;b += "    </select>";b += "\n" + i;b += "  </li>";b += "\n";return b;});c.pop();}else{b += _.b; _.b = ""};b += "</ul>";return b;;}
window.T["players"] = new HoganTemplate();
window.T["players"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "Players:";b += "\n" + i;b += "<ul>";b += "\n" + i;if(_.s(_.f("players",c,p,1),c,p,0,26,75, "{{ }}")){b += _.rs(c,p,function(c,p){ var b = "";b += "<li>";b += (_.v(_.f("power",c,p,0)));b += " (";if(_.s(_.f("user",c,p,1),c,p,0,51,59, "{{ }}")){b += _.rs(c,p,function(c,p){ var b = "";b += (_.v(_.f("name",c,p,0)));return b;});c.pop();}else{b += _.b; _.b = ""};b += ")</li>";b += "\n";return b;});c.pop();}else{b += _.b; _.b = ""};b += "</ul>";return b;;}
window.T["user"] = new HoganTemplate();
window.T["user"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += (_.v(_.f("name",c,p,0)));b += "\n" + i;b += "<img src=\"";b += (_.v(_.f("avatar",c,p,0)));b += "\"/>";return b;;}
window.T["users"] = new HoganTemplate();
window.T["users"].r = function(c,p,i){i = i || "";var b = i + "";var _ = this;b += "Users:";b += "\n" + i;b += "<ul>";b += "\n" + i;if(_.s(_.f("users",c,p,1),c,p,0,22,41, "{{ }}")){b += _.rs(c,p,function(c,p){ var b = "";b += "<li>";b += (_.v(_.f("name",c,p,0)));b += "</li>";b += "\n";return b;});c.pop();}else{b += _.b; _.b = ""};b += "</ul>";return b;;}

})();