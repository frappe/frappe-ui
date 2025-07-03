export function pluralize(word: string) {
	if (word.endsWith('s')) {
		return word
	}
	return `${word}s`
}

export function unscrub(doctype: string) {
	return doctype
		.replace(/_/g, ' ')
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
}
