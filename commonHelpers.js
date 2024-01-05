import{S as w,i as n,a as p}from"./assets/vendor-906f2679.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&s(u)}).observe(document,{childList:!0,subtree:!0});function a(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(e){if(e.ep)return;e.ep=!0;const o=a(e);fetch(e.href,o)}})();const f="41511602-ac1f0d864a13fd01c911f294b",E=document.querySelector(".search-form"),g=document.querySelector(".gallery"),h=document.querySelector(".search-input"),y=new w(".gallery a",{captionsData:"alt",captionDelay:250}),m=document.querySelector(".loader"),d=document.querySelector(".load-more");let c=1;m.style.display="none";d.classList.remove("visible");E.addEventListener("submit",I);d.addEventListener("click",x);async function I(r){r.preventDefault();const t=h.value.trim();if(!t){n.warning({title:"Warning!",message:"Please enter image name!",position:"topRight"});return}q(),L(),i();try{const a=await p.get("https://pixabay.com/api/",{params:{key:f,q:t,image_type:"photo",orientation:"horizontal",safesearch:!0,page:c,per_page:40}});l();const s=a.data;if(s.hits.length===0){n.error({message:"Sorry, there are no images matching your search query. Please try again!",position:"topRight"});return}b(s.hits),y.refresh(),c*40>=s.totalHits?(i(),n.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):v()}catch(a){console.error("Error fetching images:",a),l(),n.error({message:"Failed to fetch images. Please try again later.",position:"topRight"})}}function b(r){const t=document.createDocumentFragment();r.forEach(a=>{const s=S(a);t.appendChild(s)}),g.appendChild(t),c++}function S(r){const t=document.createElement("div");return t.classList.add("card"),t.innerHTML=`
    <a class="gallery-link" href="${r.largeImageURL}">
        <img class="card-image" src="${r.webformatURL}" alt="${r.tags}" loading="lazy">
      </a>
      <div class="card-info">
        <p class="card-text"><b>Likes:</b> ${r.likes}</p>
        <p class="card-text"><b>Views:</b> ${r.views}</p>
        <p class="card-text"><b>Comments:</b> ${r.comments}</p>
        <p class="card-text"><b>Downloads:</b> ${r.downloads}</p>
      </div>
    `,t}function q(){g.innerHTML="",c=1,i()}async function x(){const r=h.value.trim();if(r){L(),i();try{const t=await p.get("https://pixabay.com/api/",{params:{key:f,q:r,image_type:"photo",orientation:"horizontal",safesearch:!0,page:c,per_page:40}});l();const a=t.data;if(a.hits.length===0){i();return}b(a.hits),y.refresh(),c*40>=a.totalHits?(i(),n.info({message:"We're sorry, but you've reached the end of search results.",position:"topRight"})):v();const s=document.querySelectorAll(".card"),e=Array.from(s).slice(-40);e.length>0&&e[0].scrollIntoView({behavior:"smooth",block:"start"})}catch(t){console.error("Error fetching more images:",t),l(),n.error({message:"Failed to fetch more images. Please try again later.",position:"topRight"})}}}function L(){m.style.display="block"}function l(){m.style.display="none"}function v(){d.style.display="block"}function i(){d.style.display="none"}
//# sourceMappingURL=commonHelpers.js.map
