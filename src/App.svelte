<script>
  import { fade, fly } from "svelte/transition";
  import { tweened } from "svelte/motion";

  import ga from "./ga.js";
  import { cookiesAllowed, lastStep } from "./store.js";
  import { send, receive } from "./animations/crossfade.js";
  import Progress from "./Progress.svelte";
  import Select from "./Select.svelte";
  import Results from "./Results.svelte";
  import { bundeslaender, gewerbe, initialSelection } from "./data.js";

  let currentStep = 0;
  let progress = tweened(currentStep);

  let selection = null;

  let salesOptions = [
    {text: '0 - 2', value: 1000000},
    {text: '2 - 5', value: 3500000},
    {text: '5 - 10', value: 7500000},
    {text: '10 - 50', value: 30000000},
    {text: '50 - 500', value: 275000000},
    {text: 'mehr als 500', value: 6000000},
  ];
  let totalAssetsOptions = [
    {text: '0 - 1', value: 500000},
    {text: '1 - 2', value: 1500000},
    {text: '2 - 10', value: 600000},
    {text: '10 - 20', value: 15000000},
    {text: '20 - 43', value: 31500000},
    {text: 'mehr als 43', value: 50000000},
  ]//1,2,10,20,43, unendlich
  initialSelection.subscribe(s => {
    selection = s;
  });

  const next = () => {
    lastStep.set(1);
    currentStep++;
    progress.set(currentStep);
    ga.sendGAEvent("nav", "click", `next ${currentStep}`);
  };
  const back = () => {
    lastStep.set(-1);
    currentStep--;
    progress.set(currentStep);
    ga.sendGAEvent("nav", "click", `back ${currentStep}`);
  };
  const seeResults = () => {
    lastStep.set(1);
    currentStep = 6;
    progress.set(currentStep);
    ga.sendGAEvent("nav", "click", `next ${currentStep}`);
  };
  const toFirstStep = () => {
    lastStep.set(-1);
    currentStep = 1;
    progress.set(currentStep);
    ga.sendGAEvent("nav", "click", "restart");
  };
  const flyDirection = () => 1000 * $lastStep;
  const optin = () => ga.optin();
  const optout = () => ga.optout();
</script>

<style>
  .logo-link {
    position: absolute;
    max-width: 50%;
  }

  .fullpage {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
    margin: auto;
    height: 100%;
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .next-button-wrapper {
    width: 90%;
    max-width: 880px;
    z-index: 10;
    display: flex;
    align-items: stretch;
  }

  @media (max-width: 600px) {
    .wide-buttons {
      flex-direction: column;
    }

    .logo-link {
      display: none;
    }
  }

  .next-button-wrapper > button {
    flex: 1;
    margin: 8px;
    z-index: 10;
  }

  button.change-inputs {
    height: 50px;
    width: 90%;
    position: absolute;
    bottom: 16px;
    left: 0;
    right: 0;
    z-index: 10;
    margin: auto;
  }

  .input-wrapper {
    text-align: center;
    width: 100%;
    max-width: 880px;
    margin-top: 30px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .input-wrapper::-webkit-scrollbar {
    display: none;
  }

  .disclaimer {
    line-height: 1.25;
  }

  .cookies-banner {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    font-size: 0.75em;
    display: flex;
    padding: 16px 32px;
    box-sizing: border-box;
    align-items: center;
    background-color: #ffffffbb;
  }

  .cookies-banner > div {
    flex: 1;
  }

  .cookies-banner > button {
    margin: 0 8px;
  }

  .ga-optin {
    max-width: 300px;
    width: 30%;
  }

  .ga-optout {
    cursor: pointer;
  }
</style>

{#if $initialSelection}
  <main>
    {#if $cookiesAllowed === null}
      <div class="cookies-banner" transition:fly={{ y: 100, duration: 1500 }}>
        <div>
          <div>
            Diese Website verwendet Cookies – nähere Informationen dazu und zu
            Ihren Rechten als Benutzer finden Sie in unserer
            <a href="https://wir-bleiben-liqui.de/datenschutz/">
              Datenschutzerklärung
            </a>
            .
          </div>
          <div>
            Klicken Sie auf "Ich stimme zu", um Cookies zu akzeptieren und
            direkt unsere Website besuchen zu können.
          </div>
        </div>
        <button class="ga-optin" on:click={optin}>Ich stimme zu</button>
        <a on:click={optout} class="ga-optout">X</a>
      </div>
    {/if}
    {#if currentStep < 7}
      <a
        class="logo-link"
        out:send={{ duration: 1000, key: 'logo' }}
        in:receive={{ duration: 1000, key: 'logo' }}
        href="https://wir-bleiben-liqui.de">
        <img class="logo" src="/logo.png" alt="Wir bleiben liquide" />
      </a>
    {/if}
    {#if currentStep === 0}
      <div class="fullpage">
        <p
          class="input-wrapper disclaimer"
          in:fly={{ x: flyDirection(), duration: 1500 }}
          out:fly={{ x: -flyDirection(), duration: 1500 }}>
          <a target="_blank" href="wir-bleiben-liqui.de">
            wir-bleiben-liqui.de
          </a>
          bietet weder Rechts- noch Steuerberatung an.
          <br />
          Bei diesem Angebot handelt es sich lediglich um einen kostenfreien und
          unverbindlichen Informationszugang für alle, die aufgrund (drohender)
          Liquiditätsengpässe finanzielle Unterstützung benötigen.
          <br />
          Die Plattform bietet diese Unterstützung nicht selbst an, hilft aber
          dabei, passende Angebote von Finanzinstituten einzugrenzen.
          <br />
          Bei Fragen rechtlicher, steuerlicher oder finanzplanerischer Natur
          sollten Experten der jeweiligen Themenfelder oder die Finanzinstitute
          selbst konsultiert werden.
          <br />
        </p>
        <div
          class="next-button-wrapper wide-buttons"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          {#if Object.entries(selection).filter(([k, v]) => v !== null).length}
            <button on:click={seeResults}>Akzeptieren</button>
            <button on:click={next}>Akzeptieren & Kriterien anpassen</button>
          {:else}
            <button on:click={next}>Akzeptieren</button>
          {/if}
        </div>
      </div>
    {/if}
    {#if currentStep === 1}
      <div class="fullpage">
        <Select
          categoryName="Bundesland"
          bind:value={selection.state}
          options={$bundeslaender}
          help="Hiermit können wir Ihnen helfen die Programme aus Ihrem
          Bundesland für Sie zu finden. Bitte wählen Sie das Bundesland aus, in
          dem der Sitz Ihres Unternehmens ist." />
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.state === null}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}
    {#if currentStep === 2}
      <div class="fullpage">
        <Select
          categoryName="Branche"
          bind:value={selection.trade}
          options={$gewerbe}
          help="Für einige Branchen gibt es spezielle Förder- und
          Hilfsprogramme. Lassen Sie uns wissen in welcher Branche Sie tätig
          sind, damit wir Ihnen genauere Vorschläge machen können." />
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.trade === null}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}
    {#if currentStep === 3}
      <div class="fullpage">
        <div
          class="input-wrapper"
          in:fly={{ x: flyDirection(), duration: 1500 }}
          out:fly={{ x: -flyDirection(), duration: 1500 }}>
          Mein Unternehmen ist
          <input
            class="main-input"
            bind:value={selection.age}
            style="width: 100px;"
            placeholder="XX"
            type="number"
            min="0"
            max="999" />
          Jahre alt
          <div class="help-text">
            Für junge und bereits etablierte Unternehmen gibt es oft
            unterschiedliche Förderprogramme. Lassen Sie uns wissen seit
            wievielen Jahren es Ihr Unternehmen bereits gibt und wir suchen für
            Sie die passenden Angebote.
          </div>
        </div>
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.age === null || selection.age < 0 || selection.age > 999}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}
    <!-- Temporarily remove legal question during rework -->
    <!-- {#if currentStep === 4}
    <div class="fullpage">
      <Select
        categoryName="Rechtsform"
        bind:value={selection.legal}
        options={$rechtsformen}
        help="Je nach Rechtsform Ihres Unternehmen werden Sie unterschiedliche Unterlagen benötigen. Sollten Sie sich nicht sicher sein, sind Sie wahrscheinlich ein:e Einzelunternehmer:in oder wenn Sie mit mehreren Personen ein Unternehmen gegründet haben, sind Sie wahrscheinlich eine GbR."
      />
      <div class="next-button-wrapper" out:send="{{ duration: 1000, key: 'buttons' }}" in:receive="{{ duration: 1000, key: 'buttons' }}">
        <button class="next" on:click={back}>Zurück</button>
        <button class="next" on:click={next} disabled={!selection.legal}>Weiter</button>
      </div>
      <Progress progress={$progress} />
    </div>
  {/if} -->
    {#if currentStep === 4}
      <div class="fullpage">
        <div
          class="input-wrapper"
          in:fly={{ x: flyDirection(), duration: 1500 }}
          out:fly={{ x: -flyDirection(), duration: 1500 }}>
          Mein Unternehmen hat
          <input
            class="main-input"
            bind:value={selection.employees}
            style="width: 150px;"
            placeholder="XX"
            min="0"
            type="number" />
          Beschäftigte (Vollzeitäquivalente, VZÄ)
          <div class="help-text">
            Umrechnung von Teilzeitkräften und 450 Euro-Jobs in VZÄ:
            <ol type="i">
              <li>Mitarbeiter:innen auf 450 Euro-Basis = Faktor 0,3</li>
              <li>Mitarbeiter:innen bis 20 Stunden = Faktor 0,5</li>
              <li>Mitarbeiter:innen bis 30 Stunden = Faktor 0,75</li>
              <li>Mitarbeiter:innen über 30 Stunden = Faktor 1</li>
            </ol>
            Sollten Sie keine Mitarbeiter:innen haben und ein:e
            Solo-Unternehmer:in sein, tragen Sie bitte eine "0" ein.
            <b>Bitte das Ergebnis auf die nächsthöhere Zahl aufrunden.</b>
          </div>
        </div>
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.employees === null || selection.employees < 0}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}
    {#if currentStep === 5}
      <div class="fullpage">
        <div
          class="input-wrapper"
          in:fly={{ x: flyDirection(), duration: 1500 }}
          out:fly={{ x: -flyDirection(), duration: 1500 }}>
          Mein Unternehmen hatte 2019
          <br />
          einen Umsatz von
          <!-- <Select
          categoryName="Branche"
          bind:value={selection.sales}
          options={$gewerbe}
          help="Für einige Branchen gibt es spezielle Förder- und
          Hilfsprogramme. Lassen Sie uns wissen in welcher Branche Sie tätig
          sind, damit wir Ihnen genauere Vorschläge machen können." /> -->
          <select class="main-input" value={selection.sales} on:change="{(e) => {selection.sales = +e.target.value}}">
            <option disabled default value={null}>bitte wählen</option>
            {#each salesOptions as salesOption}
              <option value={salesOption.value}>{salesOption.text}</option>
            {/each}
          </select> Millionen €
          <!-- <input
            class="main-input"
            bind:value={selection.sales}
            style="width: 300px;"
            placeholder="XXXXXX"
            min="0"
            type="number" /> -->
          <div class="help-text">
            Je nach Umsatz Ihres Unternehmens gibt es unterschiedliche
            Förderprogramme, lassen Sie uns den Umsatz des letzten Jahres
            wissen, damit wir die für Sie passenden Programme finden können.
          </div>
        </div>
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.sales === null || selection.sales < 0}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}

    {#if currentStep === 6}
      <div class="fullpage">
        <div
          class="input-wrapper"
          in:fly={{ x: flyDirection(), duration: 1500 }}
          out:fly={{ x: -flyDirection(), duration: 1500 }}>
          Mein Unternehmen hat eine Bilanzsumme von
          
          <select class="main-input" value={selection.totalAssets} on:change="{(e) => {selection.totalAssets = +e.target.value}}">
            <option disabled default selected={!selection.totalAssets} value={null}>bitte wählen</option>
            {#each totalAssetsOptions as totalAssetsOption}
              <option value={totalAssetsOption.value}>{totalAssetsOption.text}</option>
            {/each}
          </select>
          <!-- <input
            class="main-input"
            bind:value={selection.totalAssets}
            style="width: 300px;"
            placeholder="XX"
            type="number"
            min="0"
            max="999" /> -->
          Millionen €
          <div class="help-text">
            Sollte Ihr Unternehmen keine Bilanz aufstellen, tragen Sie bitte
            eine "0" ein.
          </div>
        </div>
        <div
          class="next-button-wrapper"
          out:send={{ duration: 1000, key: 'buttons' }}
          in:receive={{ duration: 1000, key: 'buttons' }}>
          <button class="next" on:click={back}>Zurück</button>
          <button
            class="next"
            on:click={next}
            disabled={selection.totalAssets === null || selection.totalAssets < 0}>
            Weiter
          </button>
        </div>
        <Progress progress={$progress} />
      </div>
    {/if}
    {#if currentStep === 7}
      <div
        in:fly={{ x: flyDirection(), duration: 1500 }}
        out:fly={{ x: -flyDirection(), duration: 1500 }}>
        <Results {selection} />
      </div>
      <button
        class="change-inputs"
        on:click={toFirstStep}
        out:send={{ duration: 1000, key: 'buttons' }}
        in:receive={{ duration: 1000, key: 'buttons' }}>
        Zurück zum Finder
      </button>
    {/if}
  </main>
{/if}
