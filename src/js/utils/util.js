export default {
	round(val, dec) {
		var multiplier = Math.pow(10, dec);
		return Math.round(multiplier * val) / multiplier;
	}
}