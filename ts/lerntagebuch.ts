// lerntagebuch.ts
// Baut das Lerntagebuch dynamisch per DOM-Manipulation auf und nutzt dabei
// die Techniken aus dem Semester: Interfaces, Promises/async-await, try/catch,
// createElement/appendChild, classList, addEventListener, Array-Methoden.

interface Eintrag {
  datum: string;
  titel: string;
  themen: string[];
  hü?: string; // nicht jeder Tag hat eine Hausübung -> optional
}

const eintraege: Eintrag[] = [
  {
    datum: "11.02.2026",
    titel: "Intro JavaScript",
    themen: ["Datentypen", "let, const", "Functions, Arguments"],
  },
  {
    datum: "18.02.2026",
    titel: "Functions & Strings",
    themen: [
      "Wiederholung Functions, insbesondere das Arguments-Object",
      "Template Strings",
      "document.getElementById ...",
    ],
    hü: "Kleinen Taschenrechner ausgehend vom Code dieser Stunde bauen",
  },
  {
    datum: "25.02.2026",
    titel: "JavaScript in Action",
    themen: [
      "Fehler in der Browser-Konsole finden",
      "eval() und seine Problematik",
      "document.getElementById / querySelector",
      "Arrays, Funktionen, anonyme / Lambda-Funktionen",
      "for (let i ...), Template Strings",
      "for (const [index, value] of a.entries())",
      "BigInt (1n)",
      "a.sort((e1, e2) => ...) mit eigener Vergleichsfunktion",
    ],
    hü: "Array mit gemischten Datentypen sortieren: zuerst nach Typ, dann nach Wert",
  },
  {
    datum: "04.03.2026",
    titel: "Array Methods",
    themen: [
      'JSON importieren: import personen from "./persons.json" with { type: "json" }',
      "map() – ein Array in ein anderes Array transformieren",
      "filter() – ein Array nach einer Bedingung einschränken",
      "slice(start, end) – ein Teilarray zurückgeben",
      "reduce() – ein Array auf einen einzelnen Wert reduzieren",
    ],
  },
  {
    datum: "11.03.2026",
    titel: "Array-Übungen & JS-Runtimes",
    themen: [
      "Array-Übungen vertieft",
      "JS-Runtimes im Vergleich: Node.js (V8), Deno (V8), Bun (JavaScriptCore)",
    ],
  },
  {
    datum: "18.03.2026",
    titel: "Code in den Browser bringen",
    themen: [
      "Code als globale Variable im Browser ablegen",
      "innerText vs. innerHTML",
      "document.querySelector – alle bekannten CSS-Selektoren funktionieren hier",
      "querySelectorAll gibt eine NodeList zurück → mit Array.from(...) bzw. [...] in ein Array umwandeln",
      'onclick="funktion()"',
    ],
  },
  {
    datum: "08.04.2026",
    titel: "defer, addEventListener & Exceptions",
    themen: [
      "<script defer> statt Script am Seitenende",
      "doch kein onclick mehr – stattdessen addEventListener",
      "Exceptions: try / catch",
      "Wissensüberprüfung am Stundenende",
    ],
  },
  {
    datum: "15.04.2026",
    titel: "Public APIs",
    themen: [
      'GitHub-Liste "public-apis" durchsucht',
      "Entscheidung, mit welcher API ein eigenes Projekt entstehen soll",
    ],
  },
  {
    datum: "22.04.2026",
    titel: "DOM-Manipulation",
    themen: [
      "document.querySelector / querySelectorAll",
      "innerText vs. innerHTML",
      "document.createElement",
      "element.appendChild",
      "element.remove() / removeChild()",
      "element.classList.add / remove / toggle",
      "addEventListener mit Callback-Funktionen",
    ],
  },
  {
    datum: "29.04.2026",
    titel: "TypeScript & Deno-Transpile",
    themen: [
      "TypeScript-Primer",
      "Promises, async/await wiederholt",
      "Transpile-Deno-Projekt hochgeladen",
    ],
    hü: "Transpile-Projekt so lange aufräumen, bis Deno keine TypeScript-Fehler mehr meldet",
  },
];

// Simuliert einen asynchronen Ladevorgang, genauso wie es ein fetch() von einem
// Server tun würde. Bewusst als Promise gebaut (statt die Einträge einfach direkt
// zu verwenden), damit echtes async/await + try/catch gezeigt wird – und damit die
// Seite auch funktioniert, wenn man sie per Doppelklick öffnet (ein echtes fetch()
// einer lokalen Datei wird von manchen Browsern über das file://-Protokoll blockiert).
function ladeEintraege(): Promise<Eintrag[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (eintraege.length > 0) {
        resolve(eintraege);
      } else {
        reject(new Error("Keine Einträge gefunden"));
      }
    }, 150);
  });
}

function erzeugeEintragElement(eintrag: Eintrag): HTMLDetailsElement {
  const details = document.createElement("details");

  const summary = document.createElement("summary");
  const datumSpan = document.createElement("span");
  datumSpan.classList.add("datum");
  datumSpan.textContent = eintrag.datum;
  summary.appendChild(datumSpan);
  summary.appendChild(document.createTextNode(" " + eintrag.titel));
  details.appendChild(summary);

  const liste = document.createElement("ul");
  liste.classList.add("themen");
  eintrag.themen
    .map((thema) => {
      const li = document.createElement("li");
      li.textContent = thema;
      return li;
    })
    .forEach((li) => liste.appendChild(li));
  details.appendChild(liste);

  if (eintrag.hü) {
    details.classList.add("hat-hü");

    const huNote = document.createElement("p");
    huNote.classList.add("hu-note");

    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = "HÜ";

    huNote.appendChild(badge);
    huNote.appendChild(document.createTextNode(eintrag.hü));
    details.appendChild(huNote);
  }

  return details;
}

async function init(): Promise<void> {
  const container = document.querySelector<HTMLElement>("#eintraege");
  if (!container) return;

  try {
    const daten = await ladeEintraege();

    const anzahlMitHü = daten.filter((e) => e.hü !== undefined).length;
    const anzahlThemenGesamt = daten.reduce((summe, e) => summe + e.themen.length, 0);

    const hinweis = document.createElement("p");
    hinweis.classList.add("hinweis");
    hinweis.textContent = `${daten.length} Einträge · ${anzahlThemenGesamt} Themen behandelt · ${anzahlMitHü} davon mit Hausübung`;
    container.appendChild(hinweis);

    daten.forEach((eintrag) => container.appendChild(erzeugeEintragElement(eintrag)));

    const erstesDetails = container.querySelector("details");
    if (erstesDetails) erstesDetails.setAttribute("open", "");
  } catch (error) {
    const fehlertext = document.createElement("p");
    fehlertext.textContent = "Die Einträge konnten nicht geladen werden.";
    container.appendChild(fehlertext);
    console.error(error);
  }

  const filterBtn = document.querySelector<HTMLButtonElement>("#nurHuBtn");
  filterBtn?.addEventListener("click", () => {
    const aktiv = filterBtn.classList.toggle("aktiv");
    filterBtn.textContent = aktiv ? "Alle anzeigen" : "Nur Einträge mit HÜ";

    const alleEintraege: HTMLDetailsElement[] = Array.from(
      container.querySelectorAll("details")
    );
    alleEintraege.forEach((d) => {
      const zeigen = !aktiv || d.classList.contains("hat-hü");
      d.classList.toggle("ausgeblendet", !zeigen);
    });
  });

  const toggleBtn = document.querySelector<HTMLButtonElement>("#toggleAlleBtn");
  toggleBtn?.addEventListener("click", () => {
    const alleOffen = toggleBtn.classList.toggle("aktiv");
    const alleEintraege: HTMLDetailsElement[] = Array.from(
      container.querySelectorAll("details")
    );
    alleEintraege.forEach((d) => {
      if (alleOffen) d.setAttribute("open", "");
      else d.removeAttribute("open");
    });
    toggleBtn.textContent = alleOffen ? "Alle zuklappen" : "Alle aufklappen";
  });
}

init();
