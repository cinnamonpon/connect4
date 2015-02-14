<script>         
          var columns = [[], [], [], [], [], [], []];
            var tokens = 0;
            var playing = true;
            var started = false;
            var maxHeight = 6;

            var dropLength = function(index) {
                var len = columns[index].length-1;
                return (maxHeight + (0.15-(len*0.03)) - columns[index].length) * 65;
            };

            var locate = function(type, x, y) {
                if((x < 0) || (x > 6)) return false;
                if((y < 0) || (y > maxHeight - 1)) return false;
                if(columns[x].length < (y + 1)) return false;
                return (columns[x][y] === type);
            };

            var winner = function(type, x, y) {
                if(!locate(type, x, y)) return false;
                var direct = [[1,0], [1,1], [0,1], [1,-1]];
                var matches = 0;
                for(var i = 0; i < 4; i++) {
                    for(var j = 1; ; j++)
                        if(locate(type, x+j*direct[i][0], y+j*direct[i][1]))
                            matches++;
                        else break;
                    for(var j = 1; ; j++)
                        if(locate(type, x-j*direct[i][0], y-j*direct[i][1]))
                            matches++;
                        else break;
                    if(matches >= 3) return true;
                    matches = 0;
                }
                return false;
            };

            var checkForDraw = function() {
                for(var i = 0; i < columns.length; i++)
                    if(columns[i].length < maxHeight)
                        return;
                $(".displaydiv h2").text("Draw!");
                $(".win").show();
                playing = false;
            };

            var updateGame = function(index) {
                if(!playing) return false;
                var colLength = columns[index].length;
                if(colLength >= maxHeight) return false;
                tokens++;
                var type = tokens % 2;
                columns[index].push(type);
                if(winner(type, index, colLength)) {
                    $(".win").show();
                    playing = false;
                }
                if(playing && columns[index].length === maxHeight)
                    checkForDraw();
                return true;
            };

            var switchPlayer = function() {
                if(started) return;
                tokens++;
                updateDisplayToken();
            };

            var updateDisplayToken = function() {
                $(".displaydiv .token").addClass("todelete");
                if($("html").hasClass("ie"))
                    $(".todelete").remove();
                else
                    $(".todelete").effect("explode", function()
                        {$(".todelete").remove();});
                var p = tokens%2 ? "player1" : "player2";
                var newToken = "<div style=\"display:none\" class=\"token "
                    + p + "\"></div>";
                $(".displaydiv > div").prepend($(newToken));
                if(!$("html").hasClass("ie"))
                    $(".displaydiv .token")
                        .css("position", "absolute");
                $(".displaydiv .token").show("slide");
                $(".displaydiv .token").click(switchPlayer);
                var newToken = "<span class=\"mouseovertoken " + p + "\"></span>";
                $(".column span").replaceWith(newToken);
                
            };

            $(document).ready(function() {
                if(!$("html").hasClass("ie"))
                    $(".displaydiv .token")
                        .css("position", "absolute");
                $(".columndiv .column").click(function() {
                    var index = $(this).parent().index();
                    console.log($(this).parent());
                    if(!updateGame(index)) return;
                    started = true;
                    var p = (tokens%2) ? "player2" : "player1";
                    var newToken = "<div class=\"token " + p + "\"></div>";
                    $(this).prepend(newToken);
                    var t = $(this)
                        .children(".token:first-child").position().top;
                    $(this)
                        .children(".token:first-child").css("top", t);
                    if($("html").hasClass("ie"))
                        $(this).children(".token:first-child")
                            .css("top", 100);
                    $(this).children(".token:first-child")
                        .animate({top:"+="+dropLength(index)+"px"}, 500);
                    if(!playing) return;
                    updateDisplayToken();
                });
                $(".restart").click(function() {
                    $(".gamediv .token").fadeOut(function()
                        {$(this).remove();});
                    for(var i = 0; i < columns.length; i++) columns[i] = [];
                    $(".win").hide();
                    $(".displaydiv h2").text("Winner!");
                    playing = true;
                    started = false;
                    updateDisplayToken();
                });
                
                $(".displaydiv .token").click(switchPlayer);
                
                $(".column").mouseenter(function() {
                    var index = $(this).parent().index();
                    var p = (tokens-1)%2 ? "player2" : "player1";
                    var newToken = "<span class=\"mouseovertoken " + p + "\"></span>";
                    if(playing && columns[index].length < 6)
                        $(this).prepend(newToken);
                });
                
                $(".column").mouseleave(function() {
                    $(".column span").remove();
                });
            });
</script>