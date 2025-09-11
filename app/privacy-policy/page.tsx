import { Header } from "@/components/ui/header-on-page";
import AnimationWrapper from "@/components/ui/animation-wrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Informativa sulla Privacy",
  description: "Informativa sulla privacy e sui cookie di Luigi Bruno Fotografo. Scopri come trattiamo i tuoi dati personali e l&apos;utilizzo dei cookie sul nostro sito web.",
  openGraph: {
    title: "Privacy Policy | Luigi Bruno Fotografo",
    description: "Informativa sulla privacy e politica sui cookie per i servizi fotografici di Luigi Bruno in Basilicata.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <AnimationWrapper>
      <Header
        title="Informativa sulla Privacy"
        subtitle="Informazioni su come trattiamo i tuoi dati e i cookie"
      />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">
              Utilizzo dei Cookie
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <h3 className="text-lg font-semibold text-foreground select-none">
                Cookie Necessari
              </h3>
              <p className="select-none">
                Questi cookie sono essenziali per il corretto funzionamento del
                sito web. Abilitano funzionalità di base come la navigazione tra
                le pagine, l&apos;invio di moduli e l&apos;accesso ad aree sicure del sito.
                Il sito web non può funzionare correttamente senza questi cookie.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Cookie di Analisi
              </h3>
              <p className="select-none">
                Utilizziamo Google Analytics per comprendere come i visitatori
                interagiscono con il nostro sito web. Questi cookie raccolgono
                informazioni come il numero di visitatori, quali pagine sono più
                popolari e come gli utenti navigano nel sito. Tutte le
                informazioni raccolte sono aggregate e anonime.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Cookie di Marketing
              </h3>
              <p className="select-none">
                Questi cookie tracciano i visitatori sui siti web per mostrare
                annunci pubblicitari pertinenti e misurare l&apos;efficacia delle
                campagne pubblicitarie.
              </p>

              <h3 className="text-lg font-semibold text-foreground select-none">
                Cookie di Preferenza
              </h3>
              <p className="select-none">
                Questi cookie ricordano le tue preferenze e impostazioni, come
                la lingua preferita o il tema, per fornire un&apos;esperienza più
                personalizzata.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">
              Raccolta Dati
            </h2>
            <p className="text-muted-foreground select-none">
              Raccogliamo i dati minimi necessari per fornire e migliorare i
              nostri servizi. Questo include:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li className="select-none">
                Analisi di base sull&apos;utilizzo del sito web (visualizzazioni di pagina, durata delle sessioni)
              </li>
              <li className="select-none">
                Informazioni tecniche (tipo di browser, informazioni sul dispositivo)
              </li>
              <li className="select-none">Le tue preferenze sui cookie</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">I Tuoi Diritti</h2>
            <p className="text-muted-foreground select-none">
              Hai il diritto di:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li className="select-none">
                Accettare o rifiutare i cookie non essenziali
              </li>
              <li className="select-none">
                Modificare le tue preferenze sui cookie in qualsiasi momento
              </li>
              <li className="select-none">
                Richiedere informazioni sui dati che raccogliamo
              </li>
              <li className="select-none">Richiedere la cancellazione dei tuoi dati</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 select-none">Contatti</h2>
            <p className="text-muted-foreground select-none">
              Se hai domande su questa informativa sulla privacy o sul nostro
              utilizzo dei cookie, contattaci all&apos;indirizzo{" "}
              <a
                href="mailto:info@jupiterfoto.it"
                className="text-primary underline hover:text-primary/80"
              >
                info@jupiterfoto.it
              </a>
              .
            </p>
          </section>

          <section>
            <p className="text-sm text-muted-foreground select-none">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </section>
        </div>
      </div>
    </AnimationWrapper>
  );
}
