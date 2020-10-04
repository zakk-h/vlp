// code adapted from https://github.com/eemeli/yaml-loader

const { getOptions } = require('loader-utils')
const YAML = require('yaml')

const makeIdIterator = (prefix = 'v', i = 1) => ({ next: () => prefix + i++ })

module.exports = function yamlLoader(src) {
	const { namespace, ...options } = Object.assign(
		{ prettyErrors: true },
		getOptions(this)
	)

	// keep track of repeated object references
	const refs = new Map()
	const idIter = makeIdIterator()
	function addRef(ref, count) {
		if (ref && typeof ref === 'object' && count > 1)
			refs.set(ref, { id: idIter.next(), seen: false })
	}

	const doc = YAML.parseDocument(src, options)
	for (const warn of doc.warnings) this.emitWarning(warn)
	for (const err of doc.errors) throw err
	if (namespace) doc.contents = doc.getIn(namespace.split('.'))

	return JSON.stringify(doc.toJSON(null, addRef))
}