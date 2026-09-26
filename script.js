const products=[
{id:"hot-shapers",name:"Hot Shapers Slimming Belt",category:"Wellness",price:899,image:"assets/hot-shapers.webp",desc:"Hot-shaper style waist belt with an adjustable shaping design."},
{id:"citrus-juicer",name:"Portable Electric Citrus Juicer",category:"Kitchen",price:4999,image:"assets/citrus-juicer.jpg",gallery:["assets/citrus-juicer-2.jpg"],desc:"Portable rechargeable-style citrus juicer for quick fresh juice."},
{id:"silver-crest",name:"Silver Crest SC-1589 Blender",category:"Kitchen",price:6499,image:"assets/silver-crest-blender.jpg",gallery:["assets/silver-crest-blender-2.jpg","assets/silver-crest-blender-3.jpg"],desc:"SC-1589 multifunction blender with jug and grinding accessories."},
{id:"raf-stove",name:"RAF 1000W Electric Stove",category:"Kitchen",price:1999,image:"assets/raf-stove.jpg",gallery:["assets/raf-stove-2.png"],desc:"RAF electric hot plate/stove for everyday cooking."},
{id:"chopper",name:"Multi-Function Vegetable Chopper",category:"Kitchen",price:2499,image:"assets/chopper.jpg",gallery:["assets/chopper-2.jpg","assets/chopper-3.jpg"],desc:"Compact kitchen chopper for vegetables, herbs and everyday prep."},
{id:"skin-care",name:"Complete Skin Care Bundle",category:"Beauty",price:1999,image:"assets/skin-care.png",gallery:["assets/skin-care-2.png"],desc:"Home beauty-care bundle presented as an everyday skincare set."},
{id:"back-support",name:"Adjustable Back Support Belt",category:"Support",price:1499,image:"assets/back-support.jpeg",gallery:["assets/back-support-2.png"],desc:"Adjustable back and posture support design for everyday use."},
{id:"waist-trainer",name:"Waist Trainer",category:"Wellness",price:1299,image:"assets/waist-trainer.jpg",desc:"Adjustable waist trainer with a supportive shaping design."}
];
const money=n=>"Rs. "+Number(n).toLocaleString("en-PK");
const grid=document.getElementById("productGrid"),searchInput=document.getElementById("searchInput"),categoryFilter=document.getElementById("categoryFilter"),noResults=document.getElementById("noResults");
const modal=document.getElementById("orderModal"),productSelect=document.getElementById("productSelect"),quantity=document.getElementById("quantity"),totalPrice=document.getElementById("totalPrice"),modalPriceText=document.getElementById("modalPriceText"),form=document.getElementById("orderForm"),statusBox=document.getElementById("formStatus");

function renderProducts(){
 const q=searchInput.value.trim().toLowerCase(),cat=categoryFilter.value;
 const filtered=products.filter(p=>(!q||`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q))&&(cat==="all"||p.category===cat));
 grid.innerHTML=filtered.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="sale-tag">${money(p.price)}</span></div><div class="product-body"><span class="category">${p.category.toUpperCase()}</span><h3>${p.name}</h3><p>${p.desc}</p><div class="card-bottom"><strong>${money(p.price)}</strong><button class="btn btn-primary small order-btn" data-id="${p.id}">Order Now</button></div></div></article>`).join("");
 noResults.style.display=filtered.length?"none":"block";
}
function populateSelect(){productSelect.innerHTML=products.map(p=>`<option value="${p.id}">${p.name} — ${money(p.price)}</option>`).join("")}
function updateTotal(){
 const p=products.find(x=>x.id===productSelect.value)||products[0],qty=Math.max(1,Number(quantity.value)||1),total=p.price*qty;
 totalPrice.textContent=money(total);modalPriceText.textContent=`${p.name} • ${money(p.price)} each`;document.getElementById("hiddenTotal").value=money(total);
}
function openOrder(id=products[0].id){productSelect.value=id;quantity.value=1;statusBox.textContent="";updateTotal();modal.classList.add("show");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeOrder(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""}
document.addEventListener("click",e=>{const b=e.target.closest(".order-btn");if(b)openOrder(b.dataset.id);if(e.target.dataset.close==="true")closeOrder()});
document.getElementById("closeModal").addEventListener("click",closeOrder);
document.getElementById("heroOrder").addEventListener("click",()=>openOrder());
document.getElementById("ctaOrder").addEventListener("click",()=>openOrder());
productSelect.addEventListener("change",updateTotal);quantity.addEventListener("input",updateTotal);searchInput.addEventListener("input",renderProducts);categoryFilter.addEventListener("change",renderProducts);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeOrder()});
form.addEventListener("submit",async e=>{
 e.preventDefault();const submit=document.getElementById("submitOrder");submit.disabled=true;submit.textContent="Sending Order...";statusBox.textContent="";
 document.getElementById("orderTime").value=new Date().toLocaleString("en-PK");updateTotal();
 try{const r=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{"Accept":"application/json"}});if(!r.ok)throw new Error("failed");
 statusBox.style.color="#16803c";statusBox.textContent="Order submitted successfully. A&R Store will process your order.";
 form.reset();productSelect.value=products[0].id;quantity.value=1;updateTotal();
 }catch(err){statusBox.style.color="#b42318";statusBox.textContent="Order submit nahi hua. Internet/FormSubmit activation check karein."}
 finally{submit.disabled=false;submit.textContent="Confirm Order"}
});
document.getElementById("menuBtn").addEventListener("click",()=>document.getElementById("navLinks").classList.toggle("open"));
document.querySelectorAll("#navLinks a").forEach(a=>a.addEventListener("click",()=>document.getElementById("navLinks").classList.remove("open")));
document.getElementById("year").textContent=new Date().getFullYear();
populateSelect();renderProducts();updateTotal();