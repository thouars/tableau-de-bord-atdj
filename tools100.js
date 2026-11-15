(() => {
"use strict";
const $=id=>document.getElementById(id);
let snapshot=null,page=0,resultTarget="tools100Result";
const PAGE_SIZE=20;
const definitions=[];
const add=(category,dataset,items)=>items.forEach(item=>definitions.push({category,dataset,title:item[0],description:item[1],op:item[2],field:item[3]||""}));
add("Vue générale","all",[
["Compter toutes les données","Nombre total de lignes disponibles.","count"],
["Compter les membres","Nombre de profils chargés.","count","members"],
["Compter les sessions","Nombre de sessions chargées.","count","sessions"],
["Compter les inscriptions","Nombre d’inscriptions chargées.","count","registrations"],
["Compter les événements","Nombre d’événements reconstruits.","count","activity"],
["Événements des 7 derniers jours","Filtrer les événements récents.","recent7"],
["Événements des 30 derniers jours","Filtrer les événements du mois.","recent30"],
["Événements des 90 derniers jours","Filtrer les événements du trimestre.","recent90"],
["Événement le plus récent","Afficher l’événement le plus récent.","latest"],
["Exporter le résumé global","Télécharger les indicateurs de synthèse.","summaryExport"]
]);
add("Membres","members",[
["Nombre de membres","Compter tous les profils.","count"],
["Nouveaux membres sur 7 jours","Profils créés récemment.","recent7"],
["Nouveaux membres sur 30 jours","Profils créés ce mois-ci.","recent30"],
["Nouveaux membres sur 90 jours","Profils créés ce trimestre.","recent90"],
["Membres sans pseudo","Repérer les profils sans pseudo renseigné.","missing","username"],
["Membres sans e-mail associé","Repérer les profils sans e-mail disponible.","missing","email"],
["E-mails en double","Détecter les adresses répétées dans les données chargées.","duplicates","email"],
["Répartition des rôles","Compter les profils par rôle.","distribution","role"],
["Plus ancien profil","Afficher le profil dont la date est la plus ancienne.","earliest"],
["Exporter tous les membres","Télécharger les profils au format CSV.","exportCSV"]
]);
add("Sessions","sessions",[
["Nombre de sessions","Compter les sessions chargées.","count"],
["Sessions sur 7 jours","Filtrer les sessions récentes.","recent7"],
["Sessions sur 30 jours","Filtrer les sessions du mois.","recent30"],
["Sessions sur 90 jours","Filtrer les sessions du trimestre.","recent90"],
["Sessions sans date","Repérer les lignes sans date exploitable.","noDate"],
["Dates de session répétées","Repérer les dates identiques (contrôle indicatif).","duplicates","created_at"],
["Session la plus récente","Afficher la session la plus récente.","latest"],
["Session la plus ancienne","Afficher la session la plus ancienne.","earliest"],
["Répartition par créateur","Regrouper par created_by si ce champ existe.","distribution","created_by"],
["Exporter les sessions","Télécharger les sessions au format CSV.","exportCSV"]
]);
add("Inscriptions","registrations",[
["Nombre d’inscriptions","Compter les participations chargées.","count"],
["Inscriptions sur 7 jours","Filtrer les inscriptions récentes.","recent7"],
["Inscriptions sur 30 jours","Filtrer les inscriptions du mois.","recent30"],
["Inscriptions sur 90 jours","Filtrer les inscriptions du trimestre.","recent90"],
["Inscriptions sans date","Repérer les lignes sans date exploitable.","noDate"],
["Dates d’inscription répétées","Repérer les dates identiques (contrôle indicatif).","duplicates","created_at"],
["Inscription la plus récente","Afficher l’inscription la plus récente.","latest"],
["Inscription la plus ancienne","Afficher l’inscription la plus ancienne.","earliest"],
["Répartition par session","Regrouper par session_id si ce champ existe.","distribution","session_id"],
["Exporter les inscriptions","Télécharger les inscriptions au format CSV.","exportCSV"]
]);
add("Activité","activity",[
["Nombre d’événements","Compter les événements disponibles.","count"],
["Activité sur 24 heures","Filtrer les événements des dernières 24 heures.","recent1"],
["Activité sur 7 jours","Filtrer les événements de la semaine.","recent7"],
["Activité sur 30 jours","Filtrer les événements du mois.","recent30"],
["Activité sur 90 jours","Filtrer les événements du trimestre.","recent90"],
["Événements sans détail","Repérer les descriptions vides.","missing","description"],
["Événements sans date","Repérer les dates absentes.","noDate"],
["Répartition par type","Compter les événements par type.","distribution","type"],
["Premier événement connu","Afficher l’événement le plus ancien.","earliest"],
["Exporter l’historique","Télécharger l’activité au format CSV.","exportCSV"]
]);
add("Qualité des données","members",[
["Profils sans prénom","Repérer les prénoms non renseignés.","missing","first_name"],
["Profils sans nom","Repérer les noms non renseignés.","missing","last_name"],
["Profils sans pseudo","Repérer les pseudos non renseignés.","missing","username"],
["Profils sans e-mail","Repérer les e-mails non disponibles.","missing","email"],
["Profils sans rôle","Repérer les rôles absents.","missing","role"],
["Profils sans date","Repérer les dates de création absentes.","noDate"],
["Identifiants répétés","Contrôler les identifiants présents en double.","duplicates","id"],
["Noms d’affichage incomplets","Repérer les profils sans prénom, nom ni pseudo.","missingDisplay"],
["Pseudos répétés","Détecter les pseudos répétés.","duplicates","username"],
["Exporter les profils incomplets","Exporter les profils présentant au moins un champ vide.","incompleteExport"]
]);
add("Rôles et comptes","members",[
["Nombre de membres simples","Compter les rôles member.","roleCount","member"],
["Nombre d’administrateurs","Compter les rôles admin.","roleCount","admin"],
["Nombre de super-administrateurs","Compter les rôles super_admin.","roleCount","super_admin"],
["Rôles non reconnus","Repérer les valeurs hors rôles connus.","unknownRoles"],
["Profils avec rôle renseigné","Compter les profils dont le rôle est présent.","hasField","role"],
["Profils sans rôle renseigné","Compter les profils sans rôle.","missing","role"],
["Répartition complète des rôles","Afficher le tableau des rôles.","distribution","role"],
["E-mails associés aux profils","Compter les profils avec e-mail disponible.","hasField","email"],
["Comptes sans e-mail","Compter les profils sans e-mail disponible.","missing","email"],
["Exporter la liste par rôle","Exporter les profils avec leur rôle.","exportCSV"]
]);
add("Dates et tendances","activity",[
["Événements aujourd’hui","Compter les événements du jour local.","today"],
["Événements hier","Compter les événements de la veille.","yesterday"],
["Événements cette semaine","Compter les événements depuis lundi.","thisWeek"],
["Événements ce mois-ci","Compter les événements du mois actuel.","thisMonth"],
["Événements cette année","Compter les événements de l’année actuelle.","thisYear"],
["Répartition par mois","Regrouper les événements par mois.","monthDistribution"],
["Répartition par jour","Regrouper les événements par date.","dayDistribution"],
["Date la plus ancienne","Afficher la première date disponible.","earliest"],
["Date la plus récente","Afficher la dernière date disponible.","latest"],
["Éléments sans date","Compter les éléments sans date exploitable.","noDate"]
]);
add("Exports et sauvegardes","all",[
["Exporter les membres en CSV","Créer un fichier CSV des membres.","exportMembers"],
["Exporter les sessions en CSV","Créer un fichier CSV des sessions.","exportSessions"],
["Exporter les inscriptions en CSV","Créer un fichier CSV des inscriptions.","exportRegistrations"],
["Exporter l’activité en CSV","Créer un fichier CSV de l’activité.","exportActivity"],
["Exporter les données en JSON","Créer une sauvegarde JSON des données chargées.","exportJSON"],
["Exporter les nouveaux membres","Exporter les profils des 30 derniers jours.","exportRecentMembers"],
["Exporter les sessions récentes","Exporter les sessions des 30 derniers jours.","exportRecentSessions"],
["Exporter les inscriptions récentes","Exporter les inscriptions des 30 derniers jours.","exportRecentRegistrations"],
["Exporter les indicateurs","Créer un CSV de synthèse des compteurs.","summaryExport"],
["Exporter les profils incomplets","Créer un CSV des profils à vérifier.","incompleteExport"]
]);
add("Contrôles locaux","members",[
["Contrôle de présence des e-mails","Compter les e-mails présents sans les afficher.","hasField","email"],
["Contrôle des e-mails manquants","Compter les profils sans e-mail.","missing","email"],
["Contrôle des e-mails en double","Repérer les valeurs d’e-mail répétées.","duplicates","email"],
["Contrôle des pseudos manquants","Compter les pseudos absents.","missing","username"],
["Contrôle des pseudos en double","Repérer les pseudos répétés.","duplicates","username"],
["Contrôle des rôles manquants","Compter les rôles absents.","missing","role"],
["Contrôle des dates manquantes","Compter les dates de profil absentes.","noDate"],
["Contrôle des champs visibles","Lister les noms de champs renvoyés par la fonction.","fields"],
["Contrôle des données chargées","Afficher l’heure de synchronisation et les volumes.","loadedStatus"],
["Exporter le bilan de contrôle","Télécharger les compteurs de qualité des profils.","qualityExport"]
]);
if(definitions.length!==100) throw new Error("Le catalogue doit contenir exactement 100 outils, obtenu : "+definitions.length);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=v=>{if(!v)return"Date inconnue";const d=new Date(v);return Number.isNaN(d.getTime())?"Date inconnue":d.toLocaleString("fr-FR",{dateStyle:"short",timeStyle:"short"});};
function datasets(){if(!snapshot)return{};return{members:snapshot.members||[],sessions:snapshot.sessions||[],registrations:snapshot.registrations||[],activity:snapshot.activity||[],all:[...(snapshot.members||[]).map(x=>({...x,_source:"Membre"})),...(snapshot.sessions||[]).map(x=>({...x,_source:"Session"})),...(snapshot.registrations||[]).map(x=>({...x,_source:"Inscription"})),...(snapshot.activity||[]).map(x=>({...x,_source:"Activité"}))]};}
function dateValue(x){return x.created_at||x.updated_at||x.date||x.createdAt||null;}
function recent(rows,days){const edge=Date.now()-days*86400000;return rows.filter(x=>{const d=new Date(dateValue(x)||0).getTime();return Number.isFinite(d)&&d>=edge;});}
function countLabel(n){return n.toLocaleString("fr-FR")+" élément(s)";}
function download(name,content,type){const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function csv(rows,name){if(!rows.length){show("Aucune ligne à exporter.");return;}const keys=[...new Set(rows.flatMap(x=>Object.keys(x)))];const content="\uFEFF"+[keys,...rows.map(r=>keys.map(k=>r[k]))].map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r
");download(name,content,"text/csv;charset=utf-8");show("Export créé : "+name+" · "+countLabel(rows.length));}
function show(message,rows){const target=$(resultTarget)||$("tools100Result");if(!target)return;target.innerHTML='<div class="tool-result-summary">'+esc(message)+'</div>'+(rows?.length?'<div class="table-wrap"><table><thead><tr>'+Object.keys(rows[0]).slice(0,8).map(k=>'<th>'+esc(k)+'</th>').join("")+'</tr></thead><tbody>'+rows.slice(0,50).map(r=>'<tr>'+Object.keys(rows[0]).slice(0,8).map(k=>'<td>'+esc(typeof r[k]==="object"?JSON.stringify(r[k]):r[k])+'</td>').join("")+'</tr>').join("")+'</tbody></table><p class="muted">Affichage limité à 50 lignes.</p></div>':"");}
function run(tool){if(!snapshot){show("Charge d’abord les données en cliquant sur Actualiser.");return;}const ds=datasets(),rows=ds[tool.dataset]||[],field=tool.field;let result=rows,message="",subset=rows;
const now=new Date(),startWeek=new Date(now);startWeek.setHours(0,0,0,0);startWeek.setDate(startWeek.getDate()-(startWeek.getDay()+6)%7);
switch(tool.op){
case"count":message=countLabel(rows.length);break;
case"recent1":case"recent7":case"recent30":case"recent90":{const days=Number(tool.op.slice(6))||1;subset=recent(rows,days);message=countLabel(subset.length)+" sur les "+days+" derniers jours.";break;}
case"missing":subset=rows.filter(x=>x[field]===null||x[field]===undefined||String(x[field]).trim()==="");message=countLabel(subset.length)+" sans le champ « "+field+" ».";break;
case"hasField":subset=rows.filter(x=>x[field]!==null&&x[field]!==undefined&&String(x[field]).trim()!=="");message=countLabel(subset.length)+" avec le champ « "+field+" » renseigné.";break;
case"noDate":subset=rows.filter(x=>!dateValue(x)||Number.isNaN(new Date(dateValue(x)).getTime()));message=countLabel(subset.length)+" sans date exploitable.";break;
case"earliest":case"latest":subset=rows.filter(x=>dateValue(x)&&!Number.isNaN(new Date(dateValue(x)).getTime())).sort((a,b)=>new Date(dateValue(a))-new Date(dateValue(b)));subset=tool.op==="earliest"?subset.slice(0,1):subset.slice(-1);message=subset.length?(tool.op==="earliest"?"Élément le plus ancien : ":"Élément le plus récent : ")+fmt(dateValue(subset[0])):"Aucune date exploitable.";break;
case"duplicates":{const key=field||"created_at",seen=new Set(),dupes=[];rows.forEach(x=>{const v=x[key];if(v!==undefined&&v!==null&&v!=="" ){const k=String(v).toLowerCase();if(seen.has(k))dupes.push(x);else seen.add(k);}});subset=dupes;message=countLabel(dupes.length)+" appartenant à une valeur répétée pour « "+key+" ».";break;}
case"distribution":{const map={};rows.forEach(x=>{const k=String(x[field]??"Non renseigné");map[k]=(map[k]||0)+1;});subset=Object.entries(map).map(([value,count])=>({[field]:value,count})).sort((a,b)=>b.count-a.count);message="Répartition par "+field+" ("+subset.length+" catégorie(s)).";break;}
case"missingDisplay":subset=rows.filter(x=>![x.first_name,x.last_name,x.username].some(v=>String(v||"").trim()));message=countLabel(subset.length)+" sans prénom, nom ni pseudo.";break;
case"roleCount":subset=rows.filter(x=>x.role===field);message=countLabel(subset.length)+" avec le rôle "+field+".";break;
case"unknownRoles":subset=rows.filter(x=>x.role&&!["member","admin","super_admin"].includes(x.role));message=countLabel(subset.length)+" avec un rôle hors liste connue.";break;
case"today":subset=rows.filter(x=>dateValue(x)&&new Date(dateValue(x)).toDateString()===now.toDateString());message=countLabel(subset.length)+" aujourd’hui.";break;
case"yesterday":{const d=new Date(now);d.setDate(d.getDate()-1);subset=rows.filter(x=>dateValue(x)&&new Date(dateValue(x)).toDateString()===d.toDateString());message=countLabel(subset.length)+" hier.";break;}
case"thisWeek":subset=rows.filter(x=>dateValue(x)&&new Date(dateValue(x))>=startWeek);message=countLabel(subset.length)+" depuis le début de la semaine.";break;
case"thisMonth":subset=rows.filter(x=>dateValue(x)&&new Date(dateValue(x)).getMonth()===now.getMonth()&&new Date(dateValue(x)).getFullYear()===now.getFullYear());message=countLabel(subset.length)+" ce mois-ci.";break;
case"thisYear":subset=rows.filter(x=>dateValue(x)&&new Date(dateValue(x)).getFullYear()===now.getFullYear());message=countLabel(subset.length)+" cette année.";break;
case"monthDistribution":case"dayDistribution":{const map={};rows.forEach(x=>{if(dateValue(x)){const d=new Date(dateValue(x));if(!Number.isNaN(d.getTime())){const k=tool.op==="monthDistribution"?d.toLocaleDateString("fr-FR",{month:"long",year:"numeric"}):d.toLocaleDateString("fr-FR");map[k]=(map[k]||0)+1;}}});subset=Object.entries(map).map(([period,count])=>({period,count}));message="Répartition chronologique sur "+subset.length+" période(s).";break;}
case"fields":subset=Object.keys(rows[0]||{}).map(field=>({field}));message="Champs présents dans le jeu de données : "+subset.length+".";break;
case"loadedStatus":subset=[{synchronisation:fmt(snapshot.generated_at),membres:ds.members.length,sessions:ds.sessions.length,inscriptions:ds.registrations.length,activite:ds.activity.length}];message="État des données actuellement en mémoire.";break;
case"summaryExport":subset=[{indicateur:"Membres",valeur:ds.members.length},{indicateur:"Sessions",valeur:ds.sessions.length},{indicateur:"Inscriptions",valeur:ds.registrations.length},{indicateur:"Activité",valeur:ds.activity.length},{indicateur:"Synchronisation",valeur:snapshot.generated_at||""}];csv(subset,"atdj-resume.csv");return;
case"exportCSV":csv(rows,"atdj-"+tool.dataset+".csv");return;
case"exportMembers":csv(ds.members,"atdj-membres.csv");return;
case"exportSessions":csv(ds.sessions,"atdj-sessions.csv");return;
case"exportRegistrations":csv(ds.registrations,"atdj-inscriptions.csv");return;
case"exportActivity":csv(ds.activity,"atdj-activite.csv");return;
case"exportJSON":download("atdj-sauvegarde-"+new Date().toISOString().slice(0,10)+".json",JSON.stringify({exported_at:new Date().toISOString(),data:snapshot},null,2),"application/json");show("Sauvegarde JSON créée.");return;
case"exportRecentMembers":csv(recent(ds.members,30),"atdj-membres-30-jours.csv");return;
case"exportRecentSessions":csv(recent(ds.sessions,30),"atdj-sessions-30-jours.csv");return;
case"exportRecentRegistrations":csv(recent(ds.registrations,30),"atdj-inscriptions-30-jours.csv");return;
case"incompleteExport":subset=ds.members.filter(x=>["first_name","last_name","username","email","role","created_at"].some(k=>x[k]===null||x[k]===undefined||String(x[k]).trim()===""));csv(subset,"atdj-profils-incomplets.csv");return;
case"qualityExport":{const fields=["first_name","last_name","username","email","role","created_at"];subset=fields.map(k=>({champ:k,manquants:ds.members.filter(x=>x[k]===null||x[k]===undefined||String(x[k]).trim()==="").length,total:ds.members.length}));csv(subset,"atdj-controle-qualite.csv");return;}
default:message="Action non disponible.";subset=[];
}
show(message,subset);
}
function render(){const search=($("tools100Search")?.value||"").toLowerCase().trim(),category=$("tools100Category")?.value||"all";const list=definitions.filter(x=>(category==="all"||x.category===category)&&(!search||(x.title+" "+x.description+" "+x.category).toLowerCase().includes(search)));const pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));page=Math.min(page,pages-1);$("tools100Count").textContent=definitions.length+" outils";$("tools100Page").textContent="Page "+(page+1)+" / "+pages;$("tools100Prev").disabled=page===0;$("tools100Next").disabled=page>=pages-1;$("tools100Grid").innerHTML=list.slice(page*PAGE_SIZE,(page+1)*PAGE_SIZE).map(x=>'<button class="tool-card" type="button" data-tool="'+definitions.indexOf(x)+'"><span class="tool-category">'+esc(x.category)+'</span><strong>'+esc(x.title)+'</strong><small>'+esc(x.description)+'</small></button>').join("")||'<p class="muted">Aucun outil correspondant.</p>';}
window.ATDJTools100={items:definitions,setResultTarget(id){resultTarget=id;},runIndex(i){const tool=definitions[i];if(tool)run(tool);}};
document.addEventListener("DOMContentLoaded",()=>{const select=$("tools100Category");if(select){[...new Set(definitions.map(x=>x.category))].forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;select.appendChild(o);});} $("tools100Grid")?.addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(!b)return;const tool=definitions[Number(b.dataset.tool)];if(!tool)return;$("tools100ResultTitle").textContent=tool.title;run(tool);});$("tools100Search")?.addEventListener("input",()=>{page=0;render();});$("tools100Category")?.addEventListener("change",()=>{page=0;render();});$("tools100Prev")?.addEventListener("click",()=>{page=Math.max(0,page-1);render();});$("tools100Next")?.addEventListener("click",()=>{page++;render();});$("tools100Clear")?.addEventListener("click",()=>{$("tools100ResultTitle").textContent="Choisis un outil";$("tools100Result").innerHTML='<p class="muted">Résultat effacé.</p>';});window.addEventListener("atdj:data",e=>{snapshot=e.detail;});render();});
})();