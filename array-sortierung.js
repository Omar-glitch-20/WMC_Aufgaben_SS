// Hausübung vom 25. Februar 2026
// Thema: Array-Sortierung mit gemischten Datentypen

const a = [23, false, -7n, true, "Vladimir", { age: 11 }];

// Reihenfolge, nach der zuerst gruppiert wird.
// Die Aufgabe gibt keine bestimmte Reihenfolge der Datentypen vor,
// deshalb wird hier einfach alphabetisch nach dem typeof-String sortiert.
const typReihenfolge = ["bigint", "boolean", "number", "object", "string"];

function vergleicheElemente(x, y) {
  const typX = typeof x;
  const typY = typeof y;

  // 1. Zuerst nach Datentyp gruppieren
  if (typX !== typY) {
    return typReihenfolge.indexOf(typX) - typReihenfolge.indexOf(typY);
  }

  // 2. Innerhalb des gleichen Datentyps nach Wert sortieren
  switch (typX) {
    case "number":
    case "bigint":
      // < und > funktionieren bei number und bigint problemlos,
      // solange man nicht number mit bigint vergleicht (hier nicht nötig,
      // weil oben schon nach Typ getrennt wurde)
      return x < y ? -1 : x > y ? 1 : 0;

    case "boolean":
      // false gilt als 0, true als 1 -> false kommt vor true
      return x === y ? 0 : x ? 1 : -1;

    case "string":
      return x.localeCompare(y);

    case "object":
      // Mehrere Objekte vergleichen wir über ihre JSON-Darstellung,
      // da es keinen "natürlichen" Wert für beliebige Objekte gibt
      return JSON.stringify(x).localeCompare(JSON.stringify(y));

    default:
      return 0;
  }
}

a.sort(vergleicheElemente);

console.log(a);
// Erwartetes Ergebnis: [-7n, false, true, 23, { age: 11 }, "Vladimir"]
