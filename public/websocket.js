const socket = io('ws://localhost:3001');
let sayac = 0;

socket.on("recipe_favorited", function(msg){
    // console.log(msg);
    // alert(JSON.stringify(msg));
    var a =document.getElementById("fav_message");
    var b =document.getElementById("count_button");
          a.innerHTML = `${msg.eat_name} favorilendi.`;
          b.innerHTML = `${msg.fav_count}`;
          setTimeout(() => {
            a.innerHTML="";
          }, 3000);
})
