const P={
  name:"Migi Santos",age:31,blood:"O+",updated:"24 Oct 2026",
  contact:{name:"Ana Santos",rel:{en:"sister",fil:"kapatid"},phone:"09170000000",shown:"0917 000 0000"},
  allergies:[{en:"Penicillin",fil:"Penicillin",
    note:{en:"Do not give penicillin-type antibiotics.",fil:"Huwag magbigay ng antibiotic na uri ng penicillin."}}],
  conditions:[{en:"Asthma",fil:"Hika",
    note:{en:"May need a rescue inhaler. Check the bag.",fil:"Maaaring kailanganin ang inhaler. Tingnan ang bag."}}],
  meds:[{en:"Rescue inhaler (salbutamol), as needed",fil:"Rescue inhaler (salbutamol), kung kinakailangan"}]
};
const T={
 en:{tagline:"Emergency profile",alerts:"Medical alerts",allergic:"Allergic to",has:"Has",
  call:"Call",call911:"Call 911",sendLoc:"Text my location to contact",hospital:"Nearest hospital",speak:"Read aloud",
  guideH:"What to do",q1:"Is the person awake and breathing?",q2:"Are they wheezing or struggling to breathe?",
  yes:"Yes",no:"No",again:"Start over",
  r911:"Call 911 now and follow the dispatcher's instructions.",
  rInh:"Help them sit upright and stay calm. Find the rescue inhaler in their bag and help them use it. If there is no relief in a few minutes, call 911.",
  rStay:"Stay with them. Show this screen to medical staff when help arrives.",
  sample:"Sample steps. A doctor or the Red Cross must verify them before real use.",
  age:"years old",blood:"Blood type",meds:"Medications",updated:"Last updated",
  more:"More hotlines",h911:"Emergency: police, fire, medical",demo:"Demo profile with fictional data.",
  alertMsg:"Aidly alert: the bracelet was scanned and this person may need help."},
 fil:{tagline:"Impormasyong pang-emerhensiya",alerts:"Mga babala sa kalusugan",allergic:"May allergy sa",has:"May",
  call:"Tawagan si",call911:"Tawagan ang 911",sendLoc:"I-text ang lokasyon ko sa contact",hospital:"Pinakamalapit na ospital",speak:"Basahin nang malakas",
  guideH:"Ano ang gagawin",q1:"Gising ba at humihinga ang tao?",q2:"Humihingal ba o nahihirapang huminga?",
  yes:"Oo",no:"Hindi",again:"Ulitin",
  r911:"Tumawag agad sa 911 at sundin ang mga tagubilin ng dispatcher.",
  rInh:"Paupuin nang tuwid at pakalmahin. Hanapin ang inhaler sa bag at tulungan silang gamitin ito. Kung walang ginhawa sa loob ng ilang minuto, tumawag sa 911.",
  rStay:"Samahan sila. Ipakita ang screen na ito sa medical staff kapag dumating ang tulong.",
  sample:"Sample na hakbang. Dapat i-verify ng doktor o ng Red Cross bago gamitin.",
  age:"taong gulang",blood:"Uri ng dugo",meds:"Mga gamot",updated:"Huling na-update",
  more:"Iba pang hotline",h911:"Emerhensiya: pulis, bumbero, medikal",demo:"Demo na profile. Kathang-isip ang datos.",
  alertMsg:"Aidly alert: na-scan ang bracelet at maaaring kailangan ng tulong ng taong ito."}
};
const G={q1:{q:"q1",yes:"q2",no:"r911"},q2:{q:"q2",yes:"rInh",no:"rStay"}};
let lang="en",step="q1",spoken="";
const $=s=>document.querySelector(s), t=k=>T[lang][k];

function render(){
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(e=>e.textContent=t(e.dataset.i18n));
  document.querySelectorAll("[data-lang]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.lang===lang));

  $("#name").textContent=P.name;
  $("#meta").textContent=`${P.age} ${t("age")}. ${t("blood")} ${P.blood}`;
  const cond=P.conditions.map(c=>c[lang]).join(", "), alg=P.allergies.map(a=>a[lang]).join(", ");
  const summary=`${cond}. ${t("allergic")} ${alg}.`;
  $("#summary").textContent=summary;

  const items=[...P.allergies.map(a=>({h:`${t("allergic")} ${a[lang]}`,n:a.note[lang]})),
               ...P.conditions.map(c=>({h:`${t("has")} ${c[lang]}`,n:c.note[lang]}))];
  $("#alertList").innerHTML=items.map(i=>`<div class="alert"><strong>${i.h}</strong>${i.n}</div>`).join("");

  const c=P.contact;
  const b=$("#callContact");
  b.href="tel:"+c.phone;
  b.innerHTML=`${t("call")} ${c.name} (${c.rel[lang]})<span>${c.shown}</span>`;

  $("#details").innerHTML=`<dt>${t("meds")}</dt><dd>${P.meds.map(m=>m[lang]).join(", ")}</dd><dt>${t("updated")}</dt><dd>${P.updated}</dd>`;
  spoken=`${P.name}. ${summary} ${items.map(i=>i.h+". "+i.n).join(" ")}`;
  guide();
}

function guide(){
  const n=G[step], el=$("#guide");
  el.innerHTML=n
    ? `<p class="q">${t(n.q)}</p><div class="row"><button class="btn" data-go="${n.yes}">${t("yes")}</button><button class="btn" data-go="${n.no}">${t("no")}</button></div>`
    : `<p class="res${step==="r911"?" urgent":""}">${t(step)}</p>`
      +(step==="r911"?`<a class="btn sos" href="tel:911" style="margin-bottom:.75rem">${t("call911")}</a>`:"")
      +`<button class="btn quiet" data-go="q1">${t("again")}</button>`;
}

document.addEventListener("click",e=>{
  const g=e.target.closest("[data-go]"); if(g){step=g.dataset.go;guide();return;}
  const l=e.target.closest("[data-lang]"); if(l){lang=l.dataset.lang;render();}
});

$("#speak").addEventListener("click",()=>{
  if(!("speechSynthesis" in window))return;
  if(speechSynthesis.speaking){speechSynthesis.cancel();return;}
  const u=new SpeechSynthesisUtterance(spoken);
  u.lang=lang==="fil"?"fil-PH":"en-PH";
  speechSynthesis.speak(u);
});

$("#loc").addEventListener("click",()=>{
  const send=link=>{
    const body=encodeURIComponent(`${t("alertMsg")} (${P.name})`+(link?` Location: ${link}`:""));
    location.href=`sms:${P.contact.phone}?&body=${body}`;
  };
  if(!navigator.geolocation)return send("");
  navigator.geolocation.getCurrentPosition(
    p=>send(`https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`),
    ()=>send(""),{timeout:6000});
});

render();
