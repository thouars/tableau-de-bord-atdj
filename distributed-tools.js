(()=>{"use strict";
const maps={
overview:{tabs:["Vue générale"],target:"overview"},
members:{tabs:["Membres","Analyse des membres","Rôles et comptes"],target:"members"},
activity:{tabs:["Sessions","Inscriptions","Activité","Analyse des sessions","Analyse des inscriptions","Analyse de l'activité"],target:"activity"},
reports:{tabs:["Exports et sauvegardes","Exports et synthèses"],target:"reports"},
monitoring:{tabs:["Qualité des données","Contrôles locaux","Qualité avancée","Contrôles de cohérence"],target:"monitoring"},
analytics:{tabs:["Dates et tendances","Analyses croisées","Calendrier et tendances","Engagement"],target:"analytics"}
};
function card(engine,index,item){return '<button type="button" class="tool-card distributed-tool-card" data-engine="'+engine+'" data-index="'+index+'"><span class="tool-category">'+item.category.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))+'</span><strong>'+item.title+'</strong><small>'+item.description+'</small></button>';}
function draw(){const engines=[["100",window.ATDJTools100],["200",window.ATDJTools200]];if(engines.some(x=>!x[1]))return false;
for(const [key,map] of Object.entries(maps)){const host=document.getElementById("distributed-tools-"+key);if(!host)continue;let html="",n=0;
for(const [engine,api] of engines)api.items.forEach((item,index)=>{if(map.tabs.includes(item.category)){html+=card(engine,index,item);n++;}});
host.innerHTML=html||'<p class="muted">Aucun outil dans cette rubrique.</p>';const count=document.getElementById("count-"+key);if(count)count.textContent=n+" outils";
}
return true;}
document.addEventListener("click",e=>{const b=e.target.closest(".distributed-tool-card");if(!b)return;const tab=b.closest(".distributed-tools-panel")?.querySelector(".distributed-result");const key=tab?.id;if(!key)return;const engine=b.dataset.engine==="100"?window.ATDJTools100:window.ATDJTools200;engine.setResultTarget(key);engine.runIndex(Number(b.dataset.index));});
document.addEventListener("DOMContentLoaded",()=>{if(!draw())window.addEventListener("load",draw);});
})();