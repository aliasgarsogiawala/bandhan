module.exports=[62272,e=>{"use strict";var t=e.i(57881),o=e.i(42355),r=e.i(27744),a=e.i(27098),n=e.i(12444),i=e.i(38333),l=e.i(498),s=e.i(43068),d=e.i(18480),p=e.i(58604),c=e.i(71547),u=e.i(95196),h=e.i(35439),g=e.i(7777),m=e.i(58831),f=e.i(93695);e.i(50386);var x=e.i(27031),y=e.i(73763),$=e.i(91180),b=e.i(34468),v=e.i(61745),w=e.i(48423),R=e.i(63931);let A="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";function N(e,t,o){let r=o.border??o.fill;return`
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr>
      <td align="center" bgcolor="${o.fill}" style="border-radius:9999px;border:1px solid ${r};">
        <a href="${t}" target="_blank"
           style="display:inline-block;padding:13px 30px;font-family:${A};font-size:14px;font-weight:700;line-height:1;color:${o.text};text-decoration:none;border-radius:9999px;">
          ${(0,R.escapeHtml)(e)}
        </a>
      </td>
    </tr>
  </table>`}function D(e,t){return`
  <tr>
    <td style="padding:9px 0;border-bottom:1px solid ${R.BRAND.border};font-family:${A};font-size:13px;color:${R.BRAND.muted};">
      ${(0,R.escapeHtml)(e)}
    </td>
    <td align="right" style="padding:9px 0;border-bottom:1px solid ${R.BRAND.border};font-family:${A};font-size:13px;font-weight:700;color:${R.BRAND.foreground};">
      ${(0,R.escapeHtml)(t)}
    </td>
  </tr>`}async function C(e){let t=process.env.RESEND_API_KEY;if(!t)return{delivered:!1,provider:"not-configured",error:"RESEND_API_KEY is not configured."};let o=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({from:process.env.EMAIL_FROM||"Bandhan Tours <onboarding@resend.dev>",to:[e.to],...e.cc?.length?{cc:e.cc}:{},subject:e.subject,html:e.html,text:e.text,attachments:e.attachments})}),r=await o.json().catch(()=>({}));return o.ok?{delivered:!0,provider:"resend",id:r.id}:{delivered:!1,provider:"resend",error:r.error?.message||r.message||"Email delivery failed."}}var B=e.i(93384);async function k(e,{params:t}){let{id:o}=await t,r=await (0,v.getBookingById)(o);if(!r)return y.NextResponse.json({ok:!1,error:"Booking not found."},{status:404});let a=await e.json().catch(()=>({})),n=await (0,$.getSessionUserId)(),i=await (0,b.getActor)(e),l=!!(n&&r.user_id===n),s=!!(a.token&&a.token===r.access_token);if(!l&&!i&&!s)return y.NextResponse.json({ok:!1,error:"Not authorized."},{status:403});let d=new URL(e.url).origin,p=`${d}/api/bookings/${r.id}/brochure?token=${r.access_token}`,c=r.user_id?`${d}/account/bookings/${r.id}`:p,u=r.package_snapshot?.title||r.package_title||r.destination||"Your Personalised Holiday",h=r.package_snapshot?.destination||r.destination,g=Number(r.pricing_snapshot?.total||r.price_amount||0),m=(0,w.quotationBrochureFileName)(r),f=function(e){let{customerName:t,bookingCode:o,packageTitle:r,destination:a,travelDate:n,durationLabel:i,travellersCount:l,priceAmount:s,pdfFileName:d=`Bandhan-Tours-Itinerary-${o}.pdf`,pdfUrl:p,portalUrl:c,agentName:u,validityNote:h}=e,g=(t||"there").trim().split(/\s+/)[0],m=`Your custom itinerary is ready — ${r} (${o})`,f=`Your personalised travel plan and quotation for ${a||r} is attached as a PDF.`,x=[];a&&x.push(D("Destination",a)),n&&x.push(D("Travel Dates",n)),i&&x.push(D("Duration",i)),null!=l&&x.push(D("Travellers",String(l))),x.push(D("Booking Reference",o)),s&&x.push(D("Quoted Price",s));let y=[c?N("View in My Account",c,{fill:R.BRAND.primary,text:R.BRAND.white}):"",p?N("Download PDF",p,{fill:R.BRAND.gold,text:R.BRAND.primary,border:R.BRAND.goldDark}):""].filter(Boolean),$=`<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${(0,R.escapeHtml)(m)}</title>
</head>
<body style="margin:0;padding:0;background-color:${R.BRAND.sandBg};">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${R.BRAND.sandBg};">
    ${(0,R.escapeHtml)(f)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${R.BRAND.sandBg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${R.BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${R.BRAND.border};">

          <!-- Header -->
          <tr>
            <td style="background-color:${R.BRAND.primary};padding:26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${A};font-size:20px;font-weight:800;letter-spacing:0.3px;color:${R.BRAND.white};">
                    ${(0,R.escapeHtml)(R.COMPANY.name)}
                  </td>
                  <td align="right" style="font-family:${A};font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${R.BRAND.gold};">
                    ${(0,R.escapeHtml)(R.COMPANY.tagline)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Gold accent rule -->
          <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${R.BRAND.gold};">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:34px 32px 8px 32px;">
              <p style="margin:0 0 4px 0;font-family:${A};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${R.BRAND.accent};">
                Your Custom Itinerary
              </p>
              <h1 style="margin:0 0 16px 0;font-family:${A};font-size:24px;line-height:1.25;font-weight:800;color:${R.BRAND.primary};">
                ${(0,R.escapeHtml)(r)}
              </h1>
              <p style="margin:0 0 14px 0;font-family:${A};font-size:15px;line-height:1.65;color:${R.BRAND.foreground};">
                Hi ${(0,R.escapeHtml)(g)},
              </p>
              <p style="margin:0 0 22px 0;font-family:${A};font-size:15px;line-height:1.65;color:${R.BRAND.foreground};">
                Great news — your personalised travel plan is ready! We've attached your full
                <strong>itinerary &amp; quotation as a PDF</strong> to this email. It covers your day-by-day
                plan, inclusions, hotels, and pricing, tailored to the preferences you shared with us.
              </p>
            </td>
          </tr>

          <!-- PDF attachment callout -->
          <tr>
            <td style="padding:0 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${R.BRAND.sand};border:1px solid ${R.BRAND.border};border-radius:12px;">
                <tr>
                  <td width="46" style="padding:14px 0 14px 16px;vertical-align:middle;">
                    <div style="width:34px;height:34px;border-radius:8px;background-color:${R.BRAND.accent};font-family:${A};font-size:10px;font-weight:800;color:${R.BRAND.white};text-align:center;line-height:34px;">
                      PDF
                    </div>
                  </td>
                  <td style="padding:12px 16px;vertical-align:middle;font-family:${A};">
                    <div style="font-size:14px;font-weight:700;color:${R.BRAND.primary};">${(0,R.escapeHtml)(d)}</div>
                    <div style="font-size:12px;color:${R.BRAND.muted};">Attached to this email${p?" · or download below":""}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip summary -->
          <tr>
            <td style="padding:18px 32px 6px 32px;">
              <p style="margin:0 0 6px 0;font-family:${A};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${R.BRAND.muted};">
                Trip Summary
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${x.join("")}
              </table>
              ${h?`<p style="margin:14px 0 0 0;font-family:${A};font-size:12px;line-height:1.6;color:${R.BRAND.muted};">${(0,R.escapeHtml)(h)}</p>`:""}
            </td>
          </tr>

          ${y.length?`<!-- CTAs -->
          <tr>
            <td style="padding:26px 32px 6px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  ${y.map(e=>`<td style="padding:0 6px;">${e}</td>`).join("")}
                </tr>
              </table>
            </td>
          </tr>`:""}

          <!-- Next steps -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <p style="margin:0 0 10px 0;font-family:${A};font-size:15px;line-height:1.65;color:${R.BRAND.foreground};">
                <strong>What happens next?</strong> Review the plan at your pace. Want to tweak the dates,
                hotels, or pace? Just reply to this email — nothing is locked in until you're delighted with it.
                When you're ready to confirm, a small advance secures your booking.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:18px 32px 30px 32px;">
              <p style="margin:0;font-family:${A};font-size:15px;line-height:1.6;color:${R.BRAND.foreground};">
                Warm regards,<br />
                <strong>${(0,R.escapeHtml)(u||`The ${R.COMPANY.name} Team`)}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${R.BRAND.primary};padding:24px 32px;">
              <p style="margin:0 0 8px 0;font-family:${A};font-size:13px;font-weight:700;color:${R.BRAND.white};">
                ${(0,R.escapeHtml)(R.COMPANY.name)}
              </p>
              <p style="margin:0 0 4px 0;font-family:${A};font-size:12px;line-height:1.6;color:#AEBACB;">
                ${(0,R.escapeHtml)(R.COMPANY.address)}
              </p>
              <p style="margin:0 0 10px 0;font-family:${A};font-size:12px;line-height:1.6;color:#AEBACB;">
                <a href="${R.COMPANY.phoneHref}" style="color:${R.BRAND.gold};text-decoration:none;">${(0,R.escapeHtml)(R.COMPANY.phoneLabel)}</a>
                &nbsp;\xb7&nbsp;
                <a href="mailto:${R.COMPANY.email}" style="color:${R.BRAND.gold};text-decoration:none;">${(0,R.escapeHtml)(R.COMPANY.email)}</a>
                &nbsp;\xb7&nbsp;
                <a href="${R.COMPANY.whatsappHref}" style="color:${R.BRAND.gold};text-decoration:none;">WhatsApp</a>
              </p>
              <p style="margin:0;font-family:${A};font-size:11px;line-height:1.6;color:#6E7F94;">
                You're receiving this because you requested a custom travel plan from ${(0,R.escapeHtml)(R.COMPANY.name)}.
                Office hours: ${(0,R.escapeHtml)(R.COMPANY.hours)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;return{subject:m,html:$,text:[`${R.COMPANY.name} — Your Custom Itinerary`,"",`Hi ${g},`,"",`Great news — your personalised travel plan is ready. Your full itinerary & quotation is attached as a PDF (${d}).`,"","TRIP SUMMARY",a?`- Destination: ${a}`:"",n?`- Travel Dates: ${n}`:"",i?`- Duration: ${i}`:"",null!=l?`- Travellers: ${l}`:"",`- Booking Reference: ${o}`,s?`- Quoted Price: ${s}`:"",h?`
${h}`:"",p?`
Download the PDF: ${p}`:"",c?`View in your account: ${c}`:"","","Want to tweak the dates, hotels, or pace? Just reply to this email — nothing is locked in until you're happy. When you're ready to confirm, a small advance secures your booking.","","Warm regards,",u||`The ${R.COMPANY.name} Team`,"",`${R.COMPANY.name} \xb7 ${R.COMPANY.address}`,`${R.COMPANY.phoneLabel} \xb7 ${R.COMPANY.email} \xb7 ${R.COMPANY.whatsappHref}`].filter(e=>""!==e).join("\n")}}({customerName:r.contact_name,bookingCode:r.booking_code,packageTitle:u,destination:h,travelDate:r.travel_date,durationLabel:r.duration_label||r.package_snapshot?.duration,travellersCount:r.travellers_count,priceAmount:g?(0,B.formatMoney)(g):null,pdfFileName:m,pdfUrl:p,portalUrl:c,validityNote:`This indicative proposal is valid for ${r.pricing_snapshot?.validityDays||7} days and is subject to live availability verification.`});if("whatsapp"===a.channel){let e=(a.recipientPhone||r.contact_phone).replace(/\D/g,""),t=[`Hello ${r.contact_name},`,`Your Bandhan Tours proposal for ${u} is ready.`,`Quotation: ${r.quotation_number}`,g?`Indicative total: ${(0,B.formatMoney)(g)}`:"",`View or download the brochure: ${p}`].filter(Boolean).join("\n"),o=`https://wa.me/${e}?text=${encodeURIComponent(t)}`;return await (0,v.addNotification)(r.id,"whatsapp","Brochure prepared for WhatsApp sharing."),await (0,v.markBrochureSent)(r.id),y.NextResponse.json({ok:!0,delivered:!0,mode:"share",shareUrl:o})}let x=(a.recipientEmail||r.contact_email).trim().toLowerCase(),P=r.notify_booker&&r.booker_email&&r.booker_email!==x?[r.booker_email]:void 0,E=await (0,w.renderQuotationBrochurePdf)(r),_=await C({to:x,cc:P,...f,attachments:[{filename:m,content:Buffer.from(E).toString("base64")}]});if(_.delivered)return await (0,v.addNotification)(r.id,"email",`Quotation brochure sent to ${x}${P?` (copied to ${P.join(", ")})`:""}.`),await (0,v.markBrochureSent)(r.id),y.NextResponse.json({ok:!0,delivered:!0,provider:_.provider});let O=`mailto:${encodeURIComponent(x)}?subject=${encodeURIComponent(f.subject)}&body=${encodeURIComponent(`${f.text}

Brochure: ${p}`)}`;return await (0,v.addNotification)(r.id,"email",`Email draft prepared for ${x}; transactional email provider is not configured.`),y.NextResponse.json({ok:!0,delivered:!1,provider:_.provider,error:_.error,mailtoUrl:O})}e.s(["POST",0,k,"runtime",0,"nodejs"],41562);var P=e.i(41562);let E=new t.AppRouteRouteModule({definition:{kind:o.RouteKind.APP_ROUTE,page:"/api/bookings/[id]/send-brochure/route",pathname:"/api/bookings/[id]/send-brochure",filename:"route",bundlePath:""},distDir:".next-preview",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/bookings/[id]/send-brochure/route.ts",nextConfigOutput:"",userland:P,...{}}),{workAsyncStorage:_,workUnitAsyncStorage:O,serverHooks:T}=E;async function H(e,t,r){r.requestMeta&&(0,a.setRequestMeta)(e,r.requestMeta),E.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let y="/api/bookings/[id]/send-brochure/route";y=y.replace(/\/index$/,"")||"/";let $=await E.prepare(e,t,{srcPage:y,multiZoneDraftMode:!1});if(!$)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:b,deploymentId:v,params:w,nextConfig:R,parsedUrl:A,isDraftMode:N,prerenderManifest:D,routerServerContext:C,isOnDemandRevalidate:B,revalidateOnlyGenerated:k,resolvedPathname:P,clientReferenceManifest:_,serverActionsManifest:O}=$,T=(0,l.normalizeAppPath)(y),H=!!(D.dynamicRoutes[T]||D.routes[P]),M=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,A,!1):t.end("This page could not be found"),null);if(H&&!N){let e=!!D.routes[P],t=D.dynamicRoutes[T];if(t&&!1===t.fallback&&!e){if(R.adapterPath)return await M();throw new f.NoFallbackError}}let S=null;!H||E.isDev||N||(S="/index"===(S=P)?"/":S);let I=!0===E.isDev||!H,j=H&&!I;O&&_&&(0,i.setManifestsSingleton)({page:y,clientReferenceManifest:_,serverActionsManifest:O});let z=e.method||"GET",Y=(0,n.getTracer)(),U=Y.getActiveScopeSpan(),q=!!(null==C?void 0:C.isWrappedByNextServer),F=!!(0,a.getRequestMeta)(e,"minimalMode"),W=(0,a.getRequestMeta)(e,"incrementalCache")||await E.getIncrementalCache(e,R,D,F);null==W||W.resetRequestCache(),globalThis.__incrementalCache=W;let L={params:w,previewProps:D.preview,renderOpts:{experimental:{authInterrupts:!!R.experimental.authInterrupts},cacheComponents:!!R.cacheComponents,supportsDynamicResponse:I,incrementalCache:W,cacheLifeProfiles:R.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,o,r,a)=>E.onRequestError(e,t,r,a,C)},sharedContext:{buildId:b,deploymentId:v}},K=new s.NodeNextRequest(e),G=new s.NodeNextResponse(t),V=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let a,i=async e=>E.handle(V,L).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let o=Y.getRootSpanAttributes();if(!o)return;if(o.get("next.span_type")!==p.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${o.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let r=o.get("next.route");if(r){let t=`${z} ${r}`;e.setAttributes({"next.route":r,"http.route":r,"next.span_name":t}),e.updateName(t),a&&a!==e&&(a.setAttribute("http.route",r),a.updateName(t))}else e.updateName(`${z} ${y}`)}),l=async a=>{var n,l;let s=async({previousCacheEntry:o})=>{try{if(!F&&B&&k&&!o)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(a);e.fetchMetrics=L.renderOpts.fetchMetrics;let l=L.renderOpts.pendingWaitUntil;l&&r.waitUntil&&(r.waitUntil(l),l=void 0);let s=L.renderOpts.collectedTags;if(!H)return await (0,u.sendResponse)(K,G,n,L.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(n.headers);s&&(t[m.NEXT_CACHE_TAGS_HEADER]=s),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let o=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,r=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:x.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:o,expire:r}}}}catch(t){throw(null==o?void 0:o.isStale)&&await E.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:B})},!1,C),t}},d=await E.handleResponse({req:e,nextConfig:R,cacheKey:S,routeKind:o.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:k,responseGenerator:s,waitUntil:r.waitUntil,isMinimalMode:F});if(!H)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==x.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(l=d.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",B?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),N&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let p=(0,h.fromNodeOutgoingHttpHeaders)(d.value.headers);return F&&H||p.delete(m.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||p.get("Cache-Control")||p.set("Cache-Control",(0,g.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(K,G,new Response(d.value.body,{headers:p,status:d.value.status||200})),null};q&&U?await l(U):(a=Y.getActiveScopeSpan(),await Y.withPropagatedContext(e.headers,()=>Y.trace(p.BaseServerSpan.handleRequest,{spanName:`${z} ${y}`,kind:n.SpanKind.SERVER,attributes:{"http.method":z,"http.target":e.url}},l),void 0,!q))}catch(t){if(t instanceof f.NoFallbackError||await E.onRequestError(e,t,{routerKind:"App Router",routePath:T,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:j,isOnDemandRevalidate:B})},!1,C),H)throw t;return await (0,u.sendResponse)(K,G,new Response(null,{status:500})),null}}e.s(["handler",0,H,"patchFetch",0,function(){return(0,r.patchFetch)({workAsyncStorage:_,workUnitAsyncStorage:O})},"routeModule",0,E,"serverHooks",0,T,"workAsyncStorage",0,_,"workUnitAsyncStorage",0,O],62272)}];

//# sourceMappingURL=1hdb_next_dist_esm_build_templates_app-route_192pllu.js.map