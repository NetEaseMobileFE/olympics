export const SELECT_COUNTRY = 'SELECT_COUNTRY'

export function selectCountry(country) {
  return {
    type: SELECT_COUNTRY,
	  country
  }
}