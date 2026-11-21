// Medição do site (components/medicao.tsx tem o aviso de cookies e o evento
// do WhatsApp). Fica fora do arquivo "use client" porque o layout, no
// servidor, monta o script do <head> com ele.

/** A mesma chave das landing pages da Adsgator. */
export const CHAVE_DO_CONSENTIMENTO = "cookie-consent";

/**
 * O que vai no <head>, antes de tudo: o consentimento negado por padrão (ou o
 * "Aceitar" de uma visita anterior) e, depois, o GTM. Assim nenhuma tag roda
 * antes de saber a escolha.
 * Fica no layout comum (no <head>, onde roda também quando a pessoa sai da 404
 * para o site), mas não faz nada na Central de Ajuda (ajuda.adsgator.com.br),
 * que não mede nada (decisão do Lucas, 2026-11-20; a CSP de lá também barra o
 * Google), nem no checkout (checkout.adsgator.com.br).
 */
export function scriptDaMedicao(gtmId: string) {
  return `if(!/^(ajuda|checkout)\\./.test(location.hostname)){window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};
gtag("consent","default",{ad_storage:"denied",analytics_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",wait_for_update:500});
try{if(localStorage.getItem("${CHAVE_DO_CONSENTIMENTO}")==="accepted"){gtag("consent","update",{ad_storage:"granted",analytics_storage:"granted",ad_user_data:"granted",ad_personalization:"granted"});}}catch(e){}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!="dataLayer"?"&l="+l:"";j.async=true;j.src="https://www.googletagmanager.com/gtm.js?id="+i+dl;f.parentNode.insertBefore(j,f);})(window,document,"script","dataLayer",${JSON.stringify(gtmId)});}`;
}

