import {randArrayItem} from '../lib/random';
import {restoreFromStorage} from './storage';

/**
 * Available snippet library types
 * @const SNIPPET_LIBRARIES
 * @readonly
 * @enum {string}
 * NOTE: Once updating libraries, update default options in storage.js
 */

export const SNIPPET_LIBRARIES = {
	javascript: 'javascript',
	react: 'react',
	python: 'python',
	interview: 'interview',
	php: 'php',
	css: 'css',
};

/**
 * Available snippet library labels
 * @const SNIPPET_LIBRARY_LABELS
 * @readonly
 * @enum {string}
 */

export const SNIPPET_LIBRARY_LABELS = {
	[SNIPPET_LIBRARIES.javascript]: 'JavaScript',
	[SNIPPET_LIBRARIES.react]: 'React',
	[SNIPPET_LIBRARIES.python]: 'Python',
	[SNIPPET_LIBRARIES.interview]: 'Interview Questions',
	[SNIPPET_LIBRARIES.php]: 'PHP',
	[SNIPPET_LIBRARIES.css]: 'CSS',
};

/**
 * Available snippet code extraction regex
 * @const SNIPPET_CODE_REGEX
 * @readonly
 * @enum {string}
 */

const SNIPPET_CODE_REGEX = {
	// html: new RegExp(/(?<=\`\`\`html)(.*?)(?=\`\`\`)/, 'gsm'),
	// css: new RegExp(/(?<=\`\`\`css)(.*?)(?=\`\`\`)/, 'gsm'),
	// js: new RegExp(/(?<=\`\`\`js)(.*?)(?=\`\`\`)/, 'gsm'),
};

/**
 * Returns a context for a specific snippet library
 * @function getLibratyContext
 * @param {SNIPPET_LIBRARIES} library - Name of the library to fetch context for
 */

const getLibratyContext = library => {
	switch (library) {
		case SNIPPET_LIBRARIES.javascript:
			return require.context('../../assets/snippets/javascript', false, /\.md$/);

		case SNIPPET_LIBRARIES.react:
			return require.context('../../assets/snippets/react', false, /\.md$/);

		case SNIPPET_LIBRARIES.python:
			return require.context('../../assets/snippets/python', false, /\.md$/);

		case SNIPPET_LIBRARIES.interview:
			return require.context('../../assets/snippets/interview', false, /\.md$/);

		case SNIPPET_LIBRARIES.php:
			return require.context('../../assets/snippets/php', false, /\.md$/);

		case SNIPPET_LIBRARIES.css:
			return require.context('../../assets/snippets/css', false, /\.md$/);

		default:
			return require.context('../../assets/snippets/javascript', false, /\.md$/);
	}
};

/**
 * Available snippet library contexts
 * @const SNIPPET_LIBRARY_CONTEXTS
 * @readonly
 */

export const SNIPPET_LIBRARY_CONTEXTS = {
	[SNIPPET_LIBRARIES.javascript]: getLibratyContext(SNIPPET_LIBRARIES.javascript),
	[SNIPPET_LIBRARIES.react]: getLibratyContext(SNIPPET_LIBRARIES.react),
	[SNIPPET_LIBRARIES.python]: getLibratyContext(SNIPPET_LIBRARIES.python),
	[SNIPPET_LIBRARIES.interview]: getLibratyContext(SNIPPET_LIBRARIES.interview),
	[SNIPPET_LIBRARIES.php]: getLibratyContext(SNIPPET_LIBRARIES.php),
	[SNIPPET_LIBRARIES.css]: getLibratyContext(SNIPPET_LIBRARIES.css),
};

/**
 * Returns a list of snippet paths for a specific library
 * @function getSnippetsFromLibrary
 * @param {SNIPPET_LIBRARIES} library - Name of the library to get snippets for
 */

export const getSnippetsFromLibrary = library => {
	const importAllFiles = r => r.keys().map(r);
	return importAllFiles(SNIPPET_LIBRARY_CONTEXTS[library]);
};

/**
 * Function that returnes a promisse that Fetches and returns a random snippet from a random library of snippets
 * @function fetchRandomSnippet
 * @returns {Promisse} Returns a prommise that when resolved provides snippet, language & language label
 */

export const fetchRandomSnippet = async () => {
	const appOptions = await restoreFromStorage();
	const enabledLibraries = Object.keys(SNIPPET_LIBRARIES).filter(val => {
		return appOptions.libs[val];
	});

	const randomLibrary = randArrayItem(enabledLibraries);
	const snippetSources = getSnippetsFromLibrary(randomLibrary);
	const randomSnippet = randArrayItem(snippetSources);

	return await fetchSnippet(randomSnippet, randomLibrary);
	// return await fetch(randomSnippet)
	// 	.then(res => res.text())
	// 	.then(res => {
	// 		const snippet = res;
	// 		const language = randomLibrary;
	// 		const language_label = SNIPPET_LIBRARY_LABELS[language];
	// 		const snippet_title = randomSnippet.slice(
	// 			randomSnippet.lastIndexOf('/') + 1,
	// 			randomSnippet.indexOf('.md')
	// 		);

	// 		return {
	// 			snippet,
	// 			language,
	// 			language_label,
	// 			snippet_src: randomSnippet,
	// 			snippet_title,
	// 		};
	// 	})
	// 	.catch(err => console.error(err));
};

/**
 * Function that returnes a promisse that Fetches and returns a specific snippet from a specific library of snippets
 * @function fetchSnippet
 * @returns {Promisse} Returns a prommise that when resolved provides snippet, language, language label, snippet_src & snippet_title
 */

export const fetchSnippet = async (snippetSrc, language) => {
	if (!snippetSrc) {
		console.error(`Snippet Soruce must be defined!`);
	}

	if (!language) {
		console.error(`Snippet Language must be defined!`);
	}

	return await fetch(snippetSrc)
		.then(res => res.text())
		.then(res => {
			const snippet = res;
			const language_label = SNIPPET_LIBRARY_LABELS[language];
			const snippet_title = snippetSrc.slice(
				snippetSrc.lastIndexOf('/') + 1,
				snippetSrc.indexOf('.md')
			);

			return {
				snippet,
				language,
				language_label,
				snippet_src: snippetSrc,
				snippet_title,
			};
		})
		.catch(err => console.error(err));
};

/**
 * Function that returnes a promisse that Fetches and returns a random snippet from a random library of snippets
 * @function extractCodeFromSnippet
 * @param {string} source - Snippet source to extract code from
 * @param {SNIPPET_LIBRARIES} lang - Name of the library/language to get code for
 * @returns {Array} Returns an array of strings of extracted code
 */

export const extractCodeFromSnippet = (source, lang) => {
	const CODE_REGEX = SNIPPET_CODE_REGEX[lang];

	const codes = CODE_REGEX.exec(source);
	const result = codes && codes.length ? codes[0] : '';

	return result;
};
