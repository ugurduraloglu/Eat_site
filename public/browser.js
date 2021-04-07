
axios.get("http://localhost:1234/").then((res) => {
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

axios.get("http://localhost:1234/api").then((res) => {
    for (let eats of res.data) {
      let yemekler_listesi_list = document.getElementById("yemek_list1");
      yemekler_listesi_list.innerHTML += `<li><a href="#yemekler" onclick="getEat(${eats.category_id})">${eats.category_name}</a></li>`;
    }
  }).catch((err) => {
    if (err) {
      console.log(err);
    }
  });

function getEat(id) {
  axios.get("http://localhost:1234/yemekler/" + id.toString()).then((res) => {
      let yemek_list = document.getElementById("yemek_list2");
      document.getElementById("favorileme_butonu").innerHTML = "";
      document.getElementById("eat_title").innerHTML = "";
      document.getElementById("mal_list").innerHTML = "";
      document.getElementById("picture").innerHTML = "";
      document.getElementById("recipes").innerHTML = "";
      yemek_list.innerHTML = "";
      for (let eats of res.data) {
        yemek_list.innerHTML += `<li><a href="#tarifler" onclick="getRecipe(${eats.eat_id})" ">${eats.eat_name}</a></li>`;
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
}

function getRecipe(id) {
  axios.get("http://localhost:1234/tarifler/" + id.toString()).then((res) => {

      for (let eats of res.data) {
        let yemekler_listesi_list = document.getElementById("recipes");
        yemekler_listesi_list.innerHTML = "";
        yemekler_listesi_list.innerHTML += `<li><h3>Yemek Tarifi<h3></li>`;
        
        let dizi1 = [];
        dizi1 = eats.eat_recipe.split("|");
        for (let rec of dizi1) {
          yemekler_listesi_list.innerHTML += `<li>${rec}</li><br>`;
        }
        let eat_name = document.getElementById("eat_title");
        eat_name.innerHTML = "";
        eat_name.innerHTML += `${eats.eat_name + " Recipe"}`;
        let favori_buton = document.getElementById("favorileme_butonu");
        favori_buton.innerHTML = `<button id="button" type="button" onclick="setFavorite(${eats.eat_id})">Favorile</button><button id="count_button"></button>`;
        
        let button_count = document.getElementById("count_button");
        button_count.innerHTML = `${eats.fav_count}`;

        let mal_list = document.getElementById("mal_list");
        mal_list.innerHTML = "";
        mal_list.innerHTML = `<li><h3>Malzeme Listesi</h3></li><br>`;
        let dizi2 = [];
        dizi2 = eats.eat_mal_list.split("|");
        for (let mal of dizi2) {
          mal_list.innerHTML += `<li>${mal}</li><br>`;
        }
      }
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};
function setFavorite(eat_id){
    socket.close();
    if(socket.connected){
      socket.emit("favorited", {eat_id: eat_id}); 

    }else{
      axios.post("http://localhost:1234/favorited",{eat_id: eat_id}).then((res) => {
        for (let eats of res.data) {
          var a =document.getElementById("fav_message");
          var b = document.getElementById("count_button");
          a.innerHTML=`${eats.eat_name} favorilendi.`;
          b.innerHTML = `${eats.fav_count}`;
          setTimeout(() => {
            a.innerHTML="";
          }, 2000);
        }
      }).catch((err) => {
        if (err) {
          console.log(err);
        }
      });

    }
};
document.getElementById("eat_title").onmouseover = function(){mouseOver();};
document.getElementById("eat_title").onmouseout = function(){mouseOut();};
function mouseOver(){
  document.getElementById("eat_title").style.color = "red"; 
};
function mouseOut(){
  document.getElementById("eat_title").style.color = "black"; 
};
