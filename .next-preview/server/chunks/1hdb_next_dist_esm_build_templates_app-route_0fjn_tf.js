module.exports=[16266,e=>{"use strict";var t=e.i(57881),a=e.i(42355),n=e.i(27744),o=e.i(27098),i=e.i(12444),r=e.i(38333),s=e.i(498),l=e.i(43068),d=e.i(18480),c=e.i(58604),p=e.i(71547),u=e.i(95196),h=e.i(35439),m=e.i(7777),g=e.i(58831),f=e.i(93695);e.i(50386);var v=e.i(27031),x=e.i(73763),b=e.i(43793),R=e.i(91180),w=e.i(34468),y=e.i(61745),A=e.i(63931),$=e.i(4370);let N=["Accommodation as per the confirmed itinerary","Daily breakfast at all hotels","All transfers and sightseeing by private air-conditioned vehicle","Driver allowance, toll, parking and state permits","All applicable taxes on the above services"],C=["Airfare / train fare unless explicitly stated","Lunch, dinner and any meals not mentioned above","Monument entry fees, camera charges and optional activities","Personal expenses — laundry, tips, telephone, minibar","Anything not listed under Inclusions"],D=["Please carry a printed or digital copy of this voucher along with a valid photo ID for every traveller.","Standard hotel check-in is 2:00 PM and check-out is 11:00 AM unless otherwise confirmed.","Rooms, vehicles and activities are confirmed as per the itinerary; substitutions of similar category may be made in case of unforeseen unavailability.","Cancellation and refunds are governed by the terms shared with your quotation."];function B(e,t){return`
    <td class="cell">
      <span class="cell-label">${(0,A.escapeHtml)(e)}</span>
      <span class="cell-value">${(0,A.escapeHtml)(t)}</span>
    </td>`}function k(e){let t=[];for(let a=0;a<e.length;a+=2){let n=B(e[a][0],e[a][1]),o=e[a+1]?B(e[a+1][0],e[a+1][1]):'<td class="cell"></td>';t.push(`<tr>${n}${o}</tr>`)}return`<table class="grid">${t.join("")}</table>`}function P(e){return`<ul class="bullets">${e.map(e=>`<li>${(0,A.escapeHtml)(e)}</li>`).join("")}</ul>`}var E=e.i(41705);async function T(e,{params:t}){var a;if(!(0,b.isDbConfigured)())return x.NextResponse.json({ok:!1,error:"Not available."},{status:503});let{id:n}=await t,o=await (0,y.getBookingById)(n);if(!o)return x.NextResponse.json({ok:!1,error:"Booking not found."},{status:404});let i=await (0,R.getSessionUserId)(),r=await (0,w.getActor)(e);if(!(i&&o.user_id===i)&&!r)return x.NextResponse.json({ok:!1,error:"Not authorized."},{status:403});if(!["confirmed","completed"].includes(o.status)&&!r)return x.NextResponse.json({ok:!1,error:"This booking is not confirmed yet."},{status:409});let s=new URL(e.url),l=function(e,t={}){return{bookingCode:e.booking_code,packageTitle:e.package_title||e.destination||"Your Trip with Bandhan Tours",destination:e.destination,travelDate:e.travel_date,travellersCount:e.travellers_count,travellerNames:e.traveller_names,customerName:e.contact_name,customerEmail:e.contact_email,customerPhone:e.contact_phone,status:e.status,priceAmount:e.price_amount,paymentStatus:e.payment_status,specialRequirements:e.special_requirements,...t}}(o);if("html"===s.searchParams.get("format")){let e=function(e){let{bookingCode:t,packageTitle:a,destination:n,travelDate:o,durationLabel:i,travellersCount:r,travellerNames:s,customerName:l,customerEmail:d,customerPhone:c,status:p="confirmed",priceAmount:u,amountPaid:h,balanceDue:m,paymentStatus:g="pending",paymentDueNote:f,specialRequirements:v,inclusions:x,exclusions:b,notes:R,agentName:w,issuedAt:y=new Date,autoPrint:B=!1}=e,E=s?s.split(/[\n,]+/).map(e=>e.trim()).filter(Boolean):[],T=`Booking Confirmation — ${t} — ${A.COMPANY.name}`,H=[];n&&H.push(["Destination",n]),o&&H.push(["Travel Dates",o]),i&&H.push(["Duration",i]),null!=r&&H.push(["Travellers",String(r)]),H.push(["Booking Reference",t]),H.push(["Status",$.BOOKING_STATUS_LABELS[p]]);let O=[["Lead Traveller",l],["Email",d],["Phone",c]];w&&O.push(["Travel Consultant",w]);let S=[];return u&&S.push(`<tr><td>Total Package Cost</td><td class="amount">${(0,A.escapeHtml)(u)}</td></tr>`),h&&S.push(`<tr><td>Advance Received</td><td class="amount">${(0,A.escapeHtml)(h)}</td></tr>`),m&&S.push(`<tr class="due"><td>Balance Due${f?` <span class="due-note">${(0,A.escapeHtml)(f)}</span>`:""}</td><td class="amount">${(0,A.escapeHtml)(m)}</td></tr>`),S.push(`<tr><td>Payment Status</td><td class="amount">${"received"===g?"Received":"Pending"}</td></tr>`),`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${(0,A.escapeHtml)(T)}</title>
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${A.BRAND.sandBg};
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    color: ${A.BRAND.foreground};
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 16px auto;
    background: ${A.BRAND.white};
    border: 1px solid ${A.BRAND.border};
    display: flex;
    flex-direction: column;
  }
  .header {
    background: ${A.BRAND.primary};
    color: ${A.BRAND.white};
    padding: 22px 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .brand { font-size: 20px; font-weight: 800; letter-spacing: .3px; }
  .tagline {
    font-size: 10px; font-weight: 600; letter-spacing: 1.4px;
    text-transform: uppercase; color: ${A.BRAND.gold}; margin-top: 4px;
  }
  .doc-meta { text-align: right; font-size: 11px; line-height: 1.7; color: #AEBACB; }
  .doc-type {
    font-size: 13px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${A.BRAND.white};
  }
  .doc-code { font-size: 15px; font-weight: 800; color: ${A.BRAND.gold}; }
  .rule { height: 4px; background: ${A.BRAND.gold}; }
  .content { padding: 26px 28px 0 28px; flex: 1; }

  .banner {
    border: 1px solid ${A.BRAND.border};
    background: ${A.BRAND.sand};
    border-left: 4px solid ${A.BRAND.accent};
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 22px;
  }
  .banner h1 {
    margin: 0 0 4px 0; font-size: 19px; line-height: 1.25;
    font-weight: 800; color: ${A.BRAND.primary};
  }
  .banner p { margin: 0; font-size: 12.5px; line-height: 1.6; color: ${A.BRAND.muted}; }

  h2.section {
    margin: 0 0 8px 0; font-size: 11px; font-weight: 800; letter-spacing: 1.2px;
    text-transform: uppercase; color: ${A.BRAND.muted};
    border-bottom: 1px solid ${A.BRAND.border}; padding-bottom: 5px;
  }
  section { margin-bottom: 20px; break-inside: avoid; }

  table.grid { width: 100%; border-collapse: collapse; }
  table.grid td.cell { width: 50%; padding: 8px 10px 8px 0; vertical-align: top; }
  .cell-label {
    display: block; font-size: 10.5px; letter-spacing: .4px;
    text-transform: uppercase; color: ${A.BRAND.light}; margin-bottom: 2px;
  }
  .cell-value { display: block; font-size: 13.5px; font-weight: 700; color: ${A.BRAND.foreground}; }

  table.payment { width: 100%; border-collapse: collapse; font-size: 13px; }
  table.payment td { padding: 9px 0; border-bottom: 1px solid ${A.BRAND.border}; color: ${A.BRAND.muted}; }
  table.payment td.amount { text-align: right; font-weight: 700; color: ${A.BRAND.foreground}; }
  table.payment tr.due td { color: ${A.BRAND.accentDark}; font-weight: 700; }
  table.payment tr.due td.amount { color: ${A.BRAND.accentDark}; }
  .due-note { font-weight: 500; font-size: 11px; color: ${A.BRAND.muted}; }

  .names { display: flex; flex-wrap: wrap; gap: 6px; }
  .name-chip {
    font-size: 12px; font-weight: 600; color: ${A.BRAND.primary};
    background: ${A.BRAND.sand}; border: 1px solid ${A.BRAND.border};
    border-radius: 999px; padding: 4px 12px;
  }

  .two-col { display: flex; gap: 24px; }
  .two-col > div { flex: 1; }
  ul.bullets { margin: 0; padding-left: 16px; }
  ul.bullets li { font-size: 12px; line-height: 1.7; color: ${A.BRAND.foreground}; }
  p.body { margin: 0; font-size: 12.5px; line-height: 1.7; color: ${A.BRAND.foreground}; }

  .footer {
    background: ${A.BRAND.primary}; color: #AEBACB;
    padding: 18px 28px; font-size: 11px; line-height: 1.65; margin-top: 24px;
  }
  .footer strong { color: ${A.BRAND.white}; font-size: 12.5px; }
  .footer a { color: ${A.BRAND.gold}; text-decoration: none; }
  .footer .fine { color: #6E7F94; font-size: 10px; margin-top: 8px; }

  .toolbar { text-align: center; padding: 12px; }
  .toolbar button {
    font-family: inherit; font-size: 13px; font-weight: 700; color: ${A.BRAND.white};
    background: ${A.BRAND.primary}; border: 0; border-radius: 999px;
    padding: 11px 26px; cursor: pointer;
  }
  @media print {
    body { background: ${A.BRAND.white}; }
    .sheet { margin: 0; width: auto; min-height: 0; border: 0; }
    .toolbar { display: none; }
  }
</style>
</head>
<body>
  <div class="toolbar"><button type="button" onclick="window.print()">Download / Print PDF</button></div>

  <div class="sheet">
    <div class="header">
      <div>
        <div class="brand">${(0,A.escapeHtml)(A.COMPANY.name)}</div>
        <div class="tagline">${(0,A.escapeHtml)(A.COMPANY.tagline)}</div>
      </div>
      <div class="doc-meta">
        <div class="doc-type">Booking Confirmation</div>
        <div class="doc-code">${(0,A.escapeHtml)(t)}</div>
        <div>Issued ${(0,A.escapeHtml)(y.toLocaleString("en-IN",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}))}</div>
      </div>
    </div>
    <div class="rule"></div>

    <div class="content">
      <div class="banner">
        <h1>${(0,A.escapeHtml)(a)}</h1>
        <p>Your booking is confirmed. Please keep this voucher with you for the duration of your trip — our team and on-ground partners will use the reference above for all assistance.</p>
      </div>

      <section>
        <h2 class="section">Trip Details</h2>
        ${k(H)}
      </section>

      <section>
        <h2 class="section">Traveller &amp; Contact</h2>
        ${k(O)}
        ${E.length?`<div style="margin-top:10px;">
                 <span class="cell-label">Travelling Party</span>
                 <div class="names">${E.map(e=>`<span class="name-chip">${(0,A.escapeHtml)(e)}</span>`).join("")}</div>
               </div>`:""}
      </section>

      <section>
        <h2 class="section">Payment Summary</h2>
        <table class="payment">${S.join("")}</table>
      </section>

      <section>
        <h2 class="section">Inclusions &amp; Exclusions</h2>
        <div class="two-col">
          <div>
            <span class="cell-label">Included</span>
            ${P(x?.length?x:N)}
          </div>
          <div>
            <span class="cell-label">Not Included</span>
            ${P(b?.length?b:C)}
          </div>
        </div>
      </section>

      ${v?`<section>
               <h2 class="section">Special Requirements</h2>
               <p class="body">${(0,A.escapeHtml)(v)}</p>
             </section>`:""}

      <section>
        <h2 class="section">Important Information</h2>
        ${P(R?.length?R:D)}
      </section>
    </div>

    <div class="footer">
      <p style="margin:0 0 6px 0;"><strong>${(0,A.escapeHtml)(A.COMPANY.name)}</strong></p>
      <p style="margin:0 0 4px 0;">${(0,A.escapeHtml)(A.COMPANY.address)}</p>
      <p style="margin:0;">
        <a href="${A.COMPANY.phoneHref}">${(0,A.escapeHtml)(A.COMPANY.phoneLabel)}</a> \xb7
        <a href="mailto:${A.COMPANY.email}">${(0,A.escapeHtml)(A.COMPANY.email)}</a> \xb7
        <a href="${A.COMPANY.whatsappHref}">WhatsApp</a> \xb7
        ${(0,A.escapeHtml)(A.COMPANY.website)}
      </p>
      <p class="fine">
        24\xd77 travel assistance on the numbers above. Office hours: ${(0,A.escapeHtml)(A.COMPANY.hours)}.
        This is a computer-generated document and is valid without a signature.
      </p>
    </div>
  </div>
${B?`  <script>window.addEventListener("load", function () { window.print(); });</script>
`:""}</body>
</html>`}({...l,autoPrint:"1"===s.searchParams.get("print")});return new x.NextResponse(e,{headers:{"Content-Type":"text/html; charset=utf-8","Cache-Control":"no-store"}})}let d=await (0,E.renderBookingConfirmationPdf)(l),c=(a=o.booking_code,`Bandhan-Tours-Booking-Confirmation-${a}.pdf`),p="1"===s.searchParams.get("download")?"attachment":"inline";return new x.NextResponse(d,{headers:{"Content-Type":"application/pdf","Content-Disposition":`${p}; filename="${c}"`,"Content-Length":String(d.byteLength),"Cache-Control":"no-store"}})}e.s(["GET",0,T,"runtime",0,"nodejs"],56447);var H=e.i(56447);let O=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/bookings/[id]/confirmation/route",pathname:"/api/bookings/[id]/confirmation",filename:"route",bundlePath:""},distDir:".next-preview",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/bookings/[id]/confirmation/route.ts",nextConfigOutput:"",userland:H,...{}}),{workAsyncStorage:S,workUnitAsyncStorage:_,serverHooks:M}=O;async function I(e,t,n){n.requestMeta&&(0,o.setRequestMeta)(e,n.requestMeta),O.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let x="/api/bookings/[id]/confirmation/route";x=x.replace(/\/index$/,"")||"/";let b=await O.prepare(e,t,{srcPage:x,multiZoneDraftMode:!1});if(!b)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:R,deploymentId:w,params:y,nextConfig:A,parsedUrl:$,isDraftMode:N,prerenderManifest:C,routerServerContext:D,isOnDemandRevalidate:B,revalidateOnlyGenerated:k,resolvedPathname:P,clientReferenceManifest:E,serverActionsManifest:T}=b,H=(0,s.normalizeAppPath)(x),S=!!(C.dynamicRoutes[H]||C.routes[P]),_=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,$,!1):t.end("This page could not be found"),null);if(S&&!N){let e=!!C.routes[P],t=C.dynamicRoutes[H];if(t&&!1===t.fallback&&!e){if(A.adapterPath)return await _();throw new f.NoFallbackError}}let M=null;!S||O.isDev||N||(M="/index"===(M=P)?"/":M);let I=!0===O.isDev||!S,z=S&&!I;T&&E&&(0,r.setManifestsSingleton)({page:x,clientReferenceManifest:E,serverActionsManifest:T});let q=e.method||"GET",U=(0,i.getTracer)(),j=U.getActiveScopeSpan(),L=!!(null==D?void 0:D.isWrappedByNextServer),Y=!!(0,o.getRequestMeta)(e,"minimalMode"),F=(0,o.getRequestMeta)(e,"incrementalCache")||await O.getIncrementalCache(e,A,C,Y);null==F||F.resetRequestCache(),globalThis.__incrementalCache=F;let K={params:y,previewProps:C.preview,renderOpts:{experimental:{authInterrupts:!!A.experimental.authInterrupts},cacheComponents:!!A.cacheComponents,supportsDynamicResponse:I,incrementalCache:F,cacheLifeProfiles:A.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,o)=>O.onRequestError(e,t,n,o,D)},sharedContext:{buildId:R,deploymentId:w}},G=new l.NodeNextRequest(e),W=new l.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(G,(0,d.signalFromNodeResponse)(t));try{let o,r=async e=>O.handle(V,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=U.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==c.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${q} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",n),o.updateName(t))}else e.updateName(`${q} ${x}`)}),s=async o=>{var i,s;let l=async({previousCacheEntry:a})=>{try{if(!Y&&B&&k&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await r(o);e.fetchMetrics=K.renderOpts.fetchMetrics;let s=K.renderOpts.pendingWaitUntil;s&&n.waitUntil&&(n.waitUntil(s),s=void 0);let l=K.renderOpts.collectedTags;if(!S)return await (0,u.sendResponse)(G,W,i,K.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[g.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=g.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,n=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=g.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await O.onRequestError(e,t,{routerKind:"App Router",routePath:x,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:B})},!1,D),t}},d=await O.handleResponse({req:e,nextConfig:A,cacheKey:M,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:k,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:Y});if(!S)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(s=d.value)?void 0:s.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});Y||t.setHeader("x-nextjs-cache",B?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let c=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return Y&&S||c.delete(g.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||c.get("Cache-Control")||c.set("Cache-Control",(0,m.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(G,W,new Response(d.value.body,{headers:c,status:d.value.status||200})),null};L&&j?await s(j):(o=U.getActiveScopeSpan(),await U.withPropagatedContext(e.headers,()=>U.trace(c.BaseServerSpan.handleRequest,{spanName:`${q} ${x}`,kind:i.SpanKind.SERVER,attributes:{"http.method":q,"http.target":e.url}},s),void 0,!L))}catch(t){if(t instanceof f.NoFallbackError||await O.onRequestError(e,t,{routerKind:"App Router",routePath:H,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:z,isOnDemandRevalidate:B})},!1,D),S)throw t;return await (0,u.sendResponse)(G,W,new Response(null,{status:500})),null}}e.s(["handler",0,I,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:S,workUnitAsyncStorage:_})},"routeModule",0,O,"serverHooks",0,M,"workAsyncStorage",0,S,"workUnitAsyncStorage",0,_],16266)}];

//# sourceMappingURL=1hdb_next_dist_esm_build_templates_app-route_0fjn_tf.js.map