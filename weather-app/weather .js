let lat,long;
let message=document.getElementById('message');
let wind=document.getElementById('wind');
let search=document.getElementById('location');
let pr_mes=document.getElementById('pre-mes');
let hourcard=document.querySelectorAll('.hour-card');
let video=document.getElementById('video');
let next_pre=document.querySelectorAll('.pre-card');

async function getlocation() {
    let city=search.value;
    let loc_url=`https://geocoding-api.open-meteo.com/v1/search?name=${city}&country=PK`
try{
  let response=await fetch(loc_url);
      let data= await response.json();
      lat=data.results[0].latitude;
      long=data.results[0].longitude;
     await getweather();
     await getprecp();
  }
  catch(error){
    console.log('city not found');
  }
};
async function getweather(){
    let url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m`
     console.log("Fetching URL:", url);
     try{
    let response= await fetch(url);
    if(!response.ok){
        throw new Error('city not found');
    }
    let data=await response.json();
    console.log(data);
     let temp=data.current.temperature_2m;
     let win=data.current.wind_speed_10m;
     message.innerText=temp+"°C";
     wind.innerText="wind"+" "+win+"km/h";
    }
catch(error){
    message.innerText=error.message;
}
}
async function getprecp(){
    let url=`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,wind_speed_10m,precipitation&hourly=temperature_2m,precipitation,relative_humidity_2m,wind_speed_10m&daily=precipitation_sum,weathercode`
   let respose= await fetch(url);
   let data=await respose.json();
    let now=new Date();
    let hours=now.getHours();
for(let i=0;i<hourcard.length;i++){
    let houridx=(hours+i)%24;
        let temp = data.hourly.temperature_2m[houridx];
    let prec = data.hourly.precipitation[houridx];
    let time=hourcard[i].querySelector('.hour-time');
let img=hourcard[i].querySelector('.hour-icon');
    time.innerText=`${houridx}:00`;
    if(prec>0){
   img.src='images/rainy-day.png';
    }
    else{
        img.src='images/sun.png';
    }
}

for(let i=0;i<next_pre.length;i++){
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     if(!data.daily.time[i]) break;
    let date=new Date(data.daily.time[i]);
    let dayname=days[date.getDay()];
    let weather=data.daily.precipitation_sum[i];
    let pre_icon=next_pre[i].querySelector(".pre-icon");
    let pre_day=next_pre[i].querySelector('.pre-time');
    pre_day.innerText=dayname;
    if(weather>0){
        pre_icon.src=`images/rainy-day.png`;
    }else{
        pre_icon.src=`images/sun.png`
    }
}
let vi_pre=data.current.precipitation;
if(vi_pre==0){
    video.src="video/sunny sky.mp4";
    video.load();
    video.play();
}
if(vi_pre>0&&vi_pre<5){
    video.src="video/rainy.mp4"
    video.load();
    video.play();
}
if(vi_pre>5){
    video.src="video/full rainy.mp4"
     video.load();
    video.play();
}
}
search.addEventListener('keydown',(evt)=>{
    if(evt.key==='Enter'){
        evt.preventDefault();
    getlocation();
    }
    }
);