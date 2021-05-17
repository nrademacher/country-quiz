async function getCountries() {
  const raw = await fetch("https://restcountries.eu/rest/v2/all")
  const res = await raw.json()
  return res
}

export const countries = getCountries()
