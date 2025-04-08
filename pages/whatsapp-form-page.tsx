import Head from "next/head"
import { useRouter } from "next/router"
import { LeadWhatsappForm } from "@/forms/LeadWhatsappForm"
import cn from 'classnames';
const WhatsappFormPage = () => {

  const router = useRouter()
  const queryParams = router.query
  /**
   * An object containing UTM (Urchin Tracking Module) parameters extracted from query parameters.
   * These parameters are used for tracking the source and medium of traffic to the page.
   */
  const utmParams = {
    utm_content: Array.isArray(queryParams?.utm_content) ? queryParams.utm_content[0] : queryParams?.utm_content || null,
    utm_term: Array.isArray(queryParams?.utm_term) ? queryParams.utm_term.join(",") : queryParams?.utm_term || null,
    utm_campaign: Array.isArray(queryParams?.utm_campaign) ? queryParams.utm_campaign[0] : queryParams?.utm_campaign || null,
    utm_medium: Array.isArray(queryParams?.utm_medium) ? queryParams.utm_medium[0] : queryParams?.utm_medium || null,
    source: queryParams?.source,
    gclid: queryParams?.gclid || null,
  }
  const queryString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return <section className="flex justify-end">
    <Head>
      <title>Whatsapp Form</title>
      <meta property="title" content="Whatsapp Form" />
    </Head>
    <section className="bg-transparent relative">
      <div className={cn(" z-[9999] top-0 left-0 bg-surface-0 flex flex-col items-center justify-center min-w-[200px] max-w-[320px] h-auto w-fit")}>
        <div className="flex flex-col p-6 gap-2">
          <h3 className="font-texts text-2xl text-surface-800 font-bold">Completa con tus datos</h3>
          <p className="font-texts text-base text-surface-800 font-normal">Para más información compártenos los siguientes datos</p>
          <LeadWhatsappForm utmLeads={queryString} leadPhone={queryParams?.phone} utmData={utmParams}/>
        </div>
      </div>
    </section>
  </section>;
}

export default WhatsappFormPage

