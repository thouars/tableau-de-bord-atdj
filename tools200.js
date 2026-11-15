(function(){
"use strict";
const $=id=>document.getElementById(id);let snapshot=null,page=0,resultTarget="tools200Result";const PAGE=20,defs=[];
const groups=[
["Analyse des membres",[
["Profils actifs récemment","Membres ayant une activité récente","activeMembers","members"],
["Profils créés par semaine","Regrouper les créations par semaine","weekly","members"],
["Longueur des pseudos","Mesurer la longueur des pseudos","length","members","username"],
["Longueur des noms affichés","Mesurer les noms affichés","displayLength","members"],
["Membres avec prénom et nom","Compter les profils avec identité renseignée","completeName","members"],
["Membres avec avatar","Compter les profils possédant un champ avatar","hasAny","members","avatar_url,avatar,photo_url"],
["Membres avec identifiant","Compter les profils avec identifiant","hasAny","members","id,user_id"],
["Membres par initiale","Répartition alphabétique des prénoms","initial","members","first_name"],
["Membres avec date de mise à jour","Contrôler les dates de mise à jour","hasAny","members","updated_at"],
["Résumé des profils","Créer une synthèse des champs membres","profileSummary","members"]]],
["Analyse des sessions",[
["Sessions par jour de semaine","Répartition des sessions par jour","weekday","sessions"],
["Sessions par heure","Répartition des sessions par heure","hour","sessions"],
["Sessions par mois","Répartition mensuelle des sessions","month","sessions"],
["Sessions avec titre","Compter les sessions avec titre ou nom","hasAny","sessions","title,name"],
["Sessions avec créateur","Contrôler les créateurs renseignés","hasAny","sessions","created_by,user_id,owner_id"],
["Sessions avec statut","Répartition des statuts disponibles","distributionAny","sessions","status,state"],
["Sessions avec description","Compter les descriptions renseignées","hasAny","sessions","description"],
["Sessions par champ de jeu","Répartition selon le champ jeu disponible","distributionAny","sessions","game,game_name"],
["Sessions sans identifiant","Repérer les sessions sans identifiant","missingAny","sessions","id"],
["Résumé des sessions","Créer une synthèse des sessions","datasetSummary","sessions"]]],
["Analyse des inscriptions",[
["Inscriptions par jour de semaine","Répartition des inscriptions par jour","weekday","registrations"],
["Inscriptions par heure","Répartition horaire des inscriptions","hour","registrations"],
["Inscriptions par mois","Répartition mensuelle des inscriptions","month","registrations"],
["Inscriptions avec membre lié","Contrôler les identifiants membre","hasAny","registrations","user_id,member_id,profile_id"],
["Inscriptions avec session liée","Contrôler les identifiants session","hasAny","registrations","session_id,game_session_id"],
["Inscriptions avec statut","Répartition des statuts d’inscription","distributionAny","registrations","status,state"],
["Inscriptions sans membre","Repérer les inscriptions sans membre associé","missingAny","registrations","user_id,member_id,profile_id"],
["Inscriptions sans session","Repérer les inscriptions sans session associée","missingAny","registrations","session_id,game_session_id"],
["Inscriptions par créateur","Répartition selon le créateur disponible","distributionAny","registrations","created_by"],
["Résumé des inscriptions","Créer une synthèse des inscriptions","datasetSummary","registrations"]]],
["Analyse de l'activité",[
["Activité par jour de semaine","Répartition hebdomadaire des événements","weekday","activity"],
["Activité par heure","Répartition horaire des événements","hour","activity"],
["Activité par mois","Répartition mensuelle des événements","month","activity"],
["Types d'événements dominants","Classer les types d’événements","distributionAny","activity","type,event_type,action"],
["Événements avec utilisateur","Contrôler les utilisateurs associés","hasAny","activity","user_id,member_id,profile_id"],
["Événements avec description","Compter les descriptions disponibles","hasAny","activity","description,details,message"],
["Événements avec métadonnées","Repérer les objets de métadonnées","hasAny","activity","metadata,details"],
["Événements récents","Afficher les 20 événements les plus récents","latest20","activity"],
["Événements les plus anciens","Afficher les 20 événements les plus anciens","oldest20","activity"],
["Résumé de l'activité","Créer une synthèse des événements","datasetSummary","activity"]]],
["Qualité avancée",[
["Champs disponibles des membres","Lister les champs membres","fieldList","members"],
["Champs disponibles des sessions","Lister les champs sessions","fieldList","sessions"],
["Champs disponibles des inscriptions","Lister les champs inscriptions","fieldList","registrations"],
["Champs disponibles de l'activité","Lister les champs activité","fieldList","activity"],
["Lignes strictement identiques membres","Repérer les doublons exacts","exactDuplicates","members"],
["Lignes strictement identiques sessions","Repérer les doublons exacts","exactDuplicates","sessions"],
["Lignes strictement identiques inscriptions","Repérer les doublons exacts","exactDuplicates","registrations"],
["Valeurs vides par champ membre","Compter les valeurs vides par champ","emptyByField","members"],
["Valeurs vides par champ session","Compter les valeurs vides par champ","emptyByField","sessions"],
["Valeurs vides par champ inscription","Compter les valeurs vides par champ","emptyByField","registrations"]]],
["Analyses croisées",[
["Inscriptions par session","Compter les inscriptions par identifiant de session","crossDistribution","registrations","session_id,game_session_id"],
["Inscriptions par membre","Compter les inscriptions par membre","crossDistribution","registrations","user_id,member_id,profile_id"],
["Sessions sans inscription","Comparer sessions et inscriptions","unmatchedSessions","sessions"],
["Inscriptions orphelines","Repérer les inscriptions liées à une session absente","orphanRegistrations","registrations"],
["Membres sans inscription","Repérer les membres sans inscription","membersWithoutRegistration","members"],
["Sessions par membre créateur","Regrouper les sessions par créateur","distributionAny","sessions","created_by,user_id,owner_id"],
["Taux d'inscription par session","Calculer inscriptions / sessions","ratio","registrations"],
["Volumes des quatre jeux de données","Comparer les volumes disponibles","allCounts","all"],
["Identifiants de session uniques","Compter les sessions distinctes dans les inscriptions","uniqueAny","registrations","session_id,game_session_id"],
["Identifiants membre uniques","Compter les membres distincts dans les inscriptions","uniqueAny","registrations","user_id,member_id,profile_id"]]],
["Calendrier et tendances",[
["Activité des 7 derniers jours","Compter les événements par date sur 7 jours","daily7","activity"],
["Activité des 30 derniers jours","Compter les événements par date sur 30 jours","daily30","activity"],
["Activité des 12 derniers mois","Compter les événements par mois","monthly12","activity"],
["Sessions des 30 derniers jours","Lister les sessions récentes","recent30","sessions"],
["Inscriptions des 30 derniers jours","Lister les inscriptions récentes","recent30","registrations"],
["Membres des 30 derniers jours","Lister les membres récents","recent30","members"],
["Jours sans activité","Identifier les jours vides sur 30 jours","quietDays","activity"],
["Plus grosse journée d'activité","Trouver le pic journalier","peakDay","activity"],
["Moyenne d'événements par jour","Calculer la moyenne sur 30 jours","dailyAverage","activity"],
["Comparaison 7 jours / 7 jours précédents","Comparer deux périodes d'activité","periodCompare","activity"]]],
["Engagement",[
["Membres inscrits à plusieurs sessions","Repérer les membres multi-inscrits","multiRegistrants","registrations"],
["Top 10 des membres inscrits","Classer les membres par inscriptions","topMembers","registrations"],
["Top 10 des sessions populaires","Classer les sessions par inscriptions","topSessions","registrations"],
["Membres avec une seule inscription","Compter les membres inscrits une fois","singleRegistrants","registrations"],
["Membres avec plusieurs inscriptions","Compter les membres inscrits plusieurs fois","multiRegistrants","registrations"],
["Sessions sans participant","Repérer les sessions sans inscription","unmatchedSessions","sessions"],
["Part des membres participants","Estimer la part des membres inscrits","participationRate","members"],
["Fréquence moyenne par participant","Calculer les inscriptions moyennes","avgPerMember","registrations"],
["Membres ayant une activité liée","Repérer les membres associés à un événement","membersWithActivity","members"],
["Résumé d'engagement","Produire les indicateurs d'engagement","engagementSummary","all"]]],
["Contrôles de cohérence",[
["Dates futures des membres","Repérer les dates de création futures","futureDates","members"],
["Dates futures des sessions","Repérer les dates de session futures","futureDates","sessions"],
["Dates futures des inscriptions","Repérer les dates d'inscription futures","futureDates","registrations"],
["Dates invalides des membres","Repérer les dates non interprétables","invalidDates","members"],
["Dates invalides des sessions","Repérer les dates non interprétables","invalidDates","sessions"],
["Dates invalides des inscriptions","Repérer les dates non interprétables","invalidDates","registrations"],
["Dates de mise à jour antérieures","Repérer updated_at antérieur à created_at","dateOrder","members"],
["Identifiants vides","Contrôler les identifiants manquants","missingAny","all","id,user_id"],
["Valeurs de rôle distinctes","Lister les rôles présents","uniqueAny","members","role"],
["Contrôle global de cohérence","Synthèse des anomalies courantes","consistency","all"]]],
["Exports et synthèses",[
["Exporter membres enrichis","Exporter les profils avec colonnes calculées","exportEnriched","members"],
["Exporter sessions enrichies","Exporter les sessions avec date formatée","exportEnriched","sessions"],
["Exporter inscriptions enrichies","Exporter les inscriptions avec date formatée","exportEnriched","registrations"],
["Exporter activité enrichie","Exporter les événements avec date formatée","exportEnriched","activity"],
["Exporter anomalies de qualité","Exporter les champs vides par ligne","exportIssues","all"],
["Exporter répartition des rôles","Télécharger le résumé des rôles","exportDistribution","members","role"],
["Exporter répartition des événements","Télécharger les types d'événements","exportDistribution","activity","type,event_type,action"],
["Exporter calendrier mensuel","Exporter le volume mensuel d'activité","exportMonths","activity"],
["Exporter synthèse des volumes","Télécharger les compteurs par jeu de données","exportCounts","all"],
["Exporter tableau de bord JSON","Créer une sauvegarde JSON complète locale","exportJSON","all"]]]
];
groups.forEach(([cat,items])=>items.forEach(([title,desc,op,dataset,field])=>defs.push({category:cat,title,description:desc,op,dataset,field})));
if(defs.length!==100)throw new Error("Catalogue incomplet : "+defs.length);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const date=x=>x?.created_at??x?.updated_at??x?.date??x?.createdAt??null;
const data=()=>snapshot||{};
const ds=()=>({members:data().members||[],sessions:data().sessions||[],registrations:data().registrations||[],activity:data().activity||[]});
const choose=(row,fields)=>{for(const f of fields.split(",")){if(row?.[f]!==undefined&&row[f]!==null&&row[f]!=="")return row[f];}return null;};
const download=(name,content,type)=>{const u=URL.createObjectURL(new Blob([content],{type})),a=document.createElement("a");a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);};
const csv=(rows,name)=>{if(!rows.length){show("Aucune donnée à exporter.");return;}const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];const s="\uFEFF"+[keys,...rows.map(r=>keys.map(k=>r[k]))].map(r=>r.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");download(name,s,"text/csv;charset=utf-8");show("Export créé : "+name+" · "+rows.length+" ligne(s).");};
function show(msg,rows=[]){const target=$(resultTarget)||$("tools200Result");if(!target)return;target.innerHTML='<p class="tool-result-summary">'+esc(msg)+'</p>'+(rows.length?'<div class="table-wrap"><table><thead><tr>'+Object.keys(rows[0]).slice(0,9).map(k=>'<th>'+esc(k)+'</th>').join("")+'</tr></thead><tbody>'+rows.slice(0,60).map(r=>'<tr>'+Object.keys(rows[0]).slice(0,9).map(k=>'<td>'+esc(typeof r[k]==="object"?JSON.stringify(r[k]):r[k])+'</td>').join("")+'</tr>').join("")+'</tbody></table><p class="muted">Aperçu limité à 60 lignes.</p></div>':"");}
function run(t){if(!snapshot){show("Actualise d'abord les données du tableau de bord.");return;}const D=ds(),rows=t.dataset==="all"?Object.entries(D).flatMap(([k,v])=>v.map(r=>({...r,_dataset:k}))):(D[t.dataset]||[]);let out=rows,msg="",f=t.field||"";
const dates=rows.map(r=>date(r)).filter(Boolean);
const freq=(arr)=>{const m={};arr.forEach(v=>{const k=String(v??"Non renseigné");m[k]=(m[k]||0)+1;});return Object.entries(m).map(([val,count])=>({valeur:val,count})).sort((a,b)=>b.count-a.count);};
const dayKey=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10);};
const memberKey=r=>choose(r,"user_id,member_id,profile_id");
const sessionKey=r=>choose(r,"session_id,game_session_id");
switch(t.op){
case"activeMembers":out=D.members.filter(m=>D.activity.some(a=>memberKey(a)===String(m.id||m.user_id)));msg=out.length+" profil(s) avec activité associée (si identifiant commun disponible).";break;
case"weekly":out=freq(rows.map(r=>{const d=new Date(date(r)||0);return Number.isNaN(d.getTime())?"Date inconnue":d.getFullYear()+"-S"+String(Math.ceil((((d-new Date(d.getFullYear(),0,1))/86400000)+new Date(d.getFullYear(),0,1).getDay()+1)/7)).padStart(2,"0");}));msg="Créations regroupées par semaine.";break;
case"length":out=rows.map(r=>({id:r.id||"",valeur:r[f]||"",longueur:String(r[f]||"").length}));msg="Longueur des valeurs du champ "+f+".";break;
case"displayLength":out=rows.map(r=>({id:r.id||"",nom:[r.first_name,r.last_name,r.username].filter(Boolean).join(" "),longueur:[r.first_name,r.last_name,r.username].filter(Boolean).join(" ").length}));msg="Longueur des noms d'affichage.";break;
case"completeName":out=rows.filter(r=>r.first_name&&r.last_name);msg=out.length+" profil(s) avec prénom et nom.";break;
case"hasAny":out=rows.filter(r=>choose(r,f)!==null);msg=out.length+" ligne(s) avec au moins un champ ciblé ("+f+").";break;
case"missingAny":out=rows.filter(r=>choose(r,f)===null);msg=out.length+" ligne(s) sans champ ciblé ("+f+").";break;
case"initial":out=freq(rows.map(r=>(String(r[f]||"").trim()[0]||"#").toUpperCase()));msg="Répartition par initiale.";break;
case"profileSummary":case"datasetSummary":{const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];out=keys.map(k=>({champ:k,renseigne:rows.filter(r=>r[k]!==null&&r[k]!==undefined&&r[k]!=="").length,manquant:rows.filter(r=>r[k]===null||r[k]===undefined||r[k]==="").length}));msg="Profil des champs : "+rows.length+" ligne(s), "+keys.length+" champ(s).";break;}
case"weekday":out=freq(dates.map(v=>new Date(v).toLocaleDateString("fr-FR",{weekday:"long"})));msg="Répartition par jour de semaine.";break;
case"hour":out=freq(dates.map(v=>String(new Date(v).getHours()).padStart(2,"0")+" h"));msg="Répartition par heure locale.";break;
case"month":case"monthly12":out=freq(dates.map(v=>new Date(v).toLocaleDateString("fr-FR",{month:"long",year:"numeric"})));msg="Répartition par mois.";break;
case"distributionAny":out=freq(rows.map(r=>choose(r,f)));msg="Répartition selon le champ "+f+".";break;
case"latest20":case"oldest20":out=rows.filter(r=>date(r)).sort((a,b)=>new Date(date(a))-new Date(date(b)));if(t.op==="latest20")out.reverse();out=out.slice(0,20);msg="20 lignes triées par date.";break;
case"fieldList":out=[...new Set(rows.flatMap(r=>Object.keys(r)))].map(field=>({field}));msg=out.length+" champ(s) détecté(s).";break;
case"exactDuplicates":{const seen=new Set();out=rows.filter(r=>{const k=JSON.stringify(r,Object.keys(r).sort());if(seen.has(k))return true;seen.add(k);return false;});msg=out.length+" doublon(s) exact(s) détecté(s).";break;}
case"emptyByField":{const keys=[...new Set(rows.flatMap(r=>Object.keys(r)))];out=keys.map(k=>({champ:k,vides:rows.filter(r=>r[k]===null||r[k]===undefined||r[k]==="").length,total:rows.length})).sort((a,b)=>b.vides-a.vides);msg="Valeurs vides par champ.";break;}
case"crossDistribution":out=freq(rows.map(r=>choose(r,f)));msg="Comptage par identifiant associé.";break;
case"unmatchedSessions":{const ids=new Set(D.registrations.map(sessionKey).filter(Boolean).map(String));out=D.sessions.filter(s=>!ids.has(String(s.id||s.session_id)));msg=out.length+" session(s) sans inscription correspondante selon les identifiants disponibles.";break;}
case"orphanRegistrations":{const ids=new Set(D.sessions.map(s=>String(s.id||s.session_id)));out=D.registrations.filter(r=>{const k=sessionKey(r);return k!==null&&!ids.has(String(k));});msg=out.length+" inscription(s) dont la session liée est introuvable.";break;}
case"membersWithoutRegistration":{const ids=new Set(D.registrations.map(memberKey).filter(Boolean).map(String));out=D.members.filter(m=>!ids.has(String(m.id||m.user_id)));msg=out.length+" membre(s) sans inscription correspondante.";break;}
case"ratio":{const n=D.sessions.length;out=[{inscriptions:D.registrations.length,sessions:n,inscriptionsParSession:n?(D.registrations.length/n).toFixed(2):"n/a"}];msg="Ratio global indicatif, pas un taux de remplissage.";break;}
case"allCounts":out=Object.entries(D).map(([jeu,lignes])=>({jeu,total:lignes.length}));msg="Volumes chargés.";break;
case"uniqueAny":out=freq(rows.map(r=>choose(r,f))).filter(r=>r.valeur!=="Non renseigné");msg=out.length+" valeur(s) distincte(s).";break;
case"daily7":case"daily30":case"dailyAverage":case"daily7":{const n=t.op==="daily7"?7:30,edge=Date.now()-n*86400000,m={};for(let i=0;i<n;i++){const d=new Date(Date.now()-(n-1-i)*86400000),k=dayKey(d);m[k]=0;}rows.forEach(r=>{const k=dayKey(date(r));if(k&&m[k]!==undefined)m[k]++;});out=Object.entries(m).map(([date,count])=>({date,count}));msg="Volume quotidien sur "+n+" jours.";if(t.op==="dailyAverage")msg="Moyenne quotidienne sur 30 jours : "+(out.reduce((a,b)=>a+b.count,0)/30).toFixed(2);break;}
case"recent30":out=rows.filter(r=>date(r)&&Date.now()-new Date(date(r)).getTime()<=30*86400000).sort((a,b)=>new Date(date(b))-new Date(date(a)));msg=out.length+" ligne(s) sur 30 jours.";break;
case"quietDays":{const active=new Set(rows.map(r=>dayKey(date(r))).filter(Boolean));out=Array.from({length:30},(_,i)=>{const d=new Date(Date.now()-(29-i)*86400000),k=dayKey(d);return{date:k,evenements:active.has(k)?"Oui":"Non"};}).filter(r=>r.evenements==="Non");msg=out.length+" jour(s) sans activité sur 30 jours.";break;}
case"peakDay":{const m={};rows.forEach(r=>{const k=dayKey(date(r));if(k)m[k]=(m[k]||0)+1;});out=Object.entries(m).map(([date,count])=>({date,count})).sort((a,b)=>b.count-a.count).slice(0,1);msg=out.length?"Pic journalier : "+out[0].count+" événement(s).":"Aucune date exploitable.";break;}
case"periodCompare":{const now=Date.now(),a=rows.filter(r=>date(r)&&now-new Date(date(r)).getTime()<=7*86400000).length,b=rows.filter(r=>date(r)&&now-new Date(date(r)).getTime()>7*86400000&&now-new Date(date(r)).getTime()<=14*86400000).length;out=[{periode:"7 derniers jours",total:a},{periode:"7 jours précédents",total:b},{difference:a-b}];msg="Comparaison des volumes, pas des utilisateurs uniques.";break;}
case"multiRegistrants":case"singleRegistrants":case"topMembers":{const m={};rows.forEach(r=>{const k=memberKey(r);if(k)m[k]=(m[k]||0)+1;});out=Object.entries(m).map(([membre,inscriptions])=>({membre,inscriptions})).sort((a,b)=>b.inscriptions-a.inscriptions);if(t.op==="singleRegistrants")out=out.filter(x=>x.inscriptions===1);if(t.op==="multiRegistrants")out=out.filter(x=>x.inscriptions>1);if(t.op==="topMembers")out=out.slice(0,10);msg=out.length+" membre(s) classé(s) par inscriptions.";break;}
case"topSessions":{const m={};rows.forEach(r=>{const k=sessionKey(r);if(k)m[k]=(m[k]||0)+1;});out=Object.entries(m).map(([session,inscriptions])=>({session,inscriptions})).sort((a,b)=>b.inscriptions-a.inscriptions).slice(0,10);msg="Top 10 des sessions par inscriptions.";break;}
case"participationRate":{const ids=new Set(D.registrations.map(memberKey).filter(Boolean).map(String));out=[{membres:D.members.length,membresParticipants:ids.size,pourcentage:D.members.length?(ids.size/D.members.length*100).toFixed(1)+"%":"n/a"}];msg="Estimation à partir des identifiants présents.";break;}
case"avgPerMember":{const ids=new Set(rows.map(memberKey).filter(Boolean));out=[{inscriptions:rows.length,membresDistincts:ids.size,moyenne:ids.size?(rows.length/ids.size).toFixed(2):"n/a"}];msg="Moyenne d'inscriptions par membre identifié.";break;}
case"membersWithActivity":{const ids=new Set(D.activity.map(memberKey).filter(Boolean).map(String));out=D.members.filter(m=>ids.has(String(m.id||m.user_id)));msg=out.length+" membre(s) avec événement associé.";break;}
case"engagementSummary":{const ids=new Set(D.registrations.map(memberKey).filter(Boolean));out=[{membres:D.members.length,participants:ids.size,sessions:D.sessions.length,inscriptions:D.registrations.length,evenements:D.activity.length}];msg="Synthèse des volumes d'engagement.";break;}
case"futureDates":out=rows.filter(r=>date(r)&&new Date(date(r)).getTime()>Date.now());msg=out.length+" date(s) future(s).";break;
case"invalidDates":out=rows.filter(r=>date(r)&&Number.isNaN(new Date(date(r)).getTime()));msg=out.length+" date(s) invalides.";break;
case"dateOrder":out=rows.filter(r=>r.created_at&&r.updated_at&&new Date(r.updated_at)<new Date(r.created_at));msg=out.length+" ligne(s) avec updated_at avant created_at.";break;
case"consistency":out=[{jeu:"Membres",lignes:D.members.length,idsManquants:D.members.filter(r=>!r.id&&!r.user_id).length,datesInvalides:D.members.filter(r=>date(r)&&Number.isNaN(new Date(date(r)).getTime())).length},{jeu:"Sessions",lignes:D.sessions.length,idsManquants:D.sessions.filter(r=>!r.id&&!r.session_id).length,datesInvalides:D.sessions.filter(r=>date(r)&&Number.isNaN(new Date(date(r)).getTime())).length},{jeu:"Inscriptions",lignes:D.registrations.length,idsManquants:D.registrations.filter(r=>!r.id).length,datesInvalides:D.registrations.filter(r=>date(r)&&Number.isNaN(new Date(date(r)).getTime())).length}];msg="Contrôle indicatif fondé sur les champs disponibles.";break;
case"exportEnriched":out=rows.map(r=>({...r,_date_lisible:date(r)?new Date(date(r)).toLocaleString("fr-FR"):""}));csv(out,"atdj-"+t.dataset+"-enrichi.csv");return;
case"exportIssues":out=rows.filter(r=>Object.values(r).some(v=>v===null||v===undefined||v===""));csv(out,"atdj-anomalies.csv");return;
case"exportDistribution":out=freq(rows.map(r=>choose(r,f)));csv(out,"atdj-repartition.csv");return;
case"exportMonths":out=freq(rows.map(r=>date(r)?new Date(date(r)).toLocaleDateString("fr-FR",{month:"long",year:"numeric"}):"Date inconnue"));csv(out,"atdj-calendrier-mensuel.csv");return;
case"exportCounts":out=Object.entries(D).map(([jeu,lignes])=>({jeu,total:lignes.length}));csv(out,"atdj-volumes.csv");return;
case"exportJSON":download("atdj-control-sauvegarde-"+new Date().toISOString().slice(0,10)+".json",JSON.stringify({exported_at:new Date().toISOString(),data:snapshot},null,2),"application/json");show("Sauvegarde JSON créée.");return;
default:msg="Outil non disponible.";
}
show(msg,out);
}
function render(){const q=($("tools200Search").value||"").toLowerCase().trim(),c=$("tools200Category").value;const list=defs.filter(t=>(c==="all"||t.category===c)&&(!q||(t.title+" "+t.description+" "+t.category).toLowerCase().includes(q)));const pages=Math.max(1,Math.ceil(list.length/PAGE));page=Math.min(page,pages-1);$("tools200Count").textContent=defs.length+" outils";$("tools200Page").textContent="Page "+(page+1)+" / "+pages;$("tools200Prev").disabled=page===0;$("tools200Next").disabled=page>=pages-1;$("tools200Grid").innerHTML=list.slice(page*PAGE,(page+1)*PAGE).map(t=>'<button class="tool-card" type="button" data-tool="'+defs.indexOf(t)+'"><span class="tool-category">'+esc(t.category)+'</span><strong>'+esc(t.title)+'</strong><small>'+esc(t.description)+'</small></button>').join("")||'<p class="muted">Aucun outil correspondant.</p>';}
window.ATDJTools200={items:defs,setResultTarget(id){resultTarget=id;},runIndex(i){const tool=defs[i];if(tool)run(tool);}};\ndocument.addEventListener("DOMContentLoaded",()=>{const sel=$("tools200Category");[...new Set(defs.map(t=>t.category))].forEach(c=>{const o=document.createElement("option");o.value=c;o.textContent=c;sel.appendChild(o);});$("tools200Grid").addEventListener("click",e=>{const b=e.target.closest("[data-tool]");if(!b)return;const t=defs[Number(b.dataset.tool)];$("tools200ResultTitle").textContent=t.title;run(t);});$("tools200Search").addEventListener("input",()=>{page=0;render();});sel.addEventListener("change",()=>{page=0;render();});$("tools200Prev").addEventListener("click",()=>{page=Math.max(0,page-1);render();});$("tools200Next").addEventListener("click",()=>{page++;render();});$("tools200Clear").addEventListener("click",()=>{$("tools200ResultTitle").textContent="Choisis un outil";$("tools200Result").innerHTML='<p class="muted">Résultat effacé.</p>';});window.addEventListener("atdj:data",e=>{snapshot=e.detail;});render();});
})();