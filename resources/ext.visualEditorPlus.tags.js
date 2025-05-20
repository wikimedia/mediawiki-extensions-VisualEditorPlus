async function getSpecifications() {
	try {
		const data = await new Promise( ( resolve, reject ) => {
			$.ajax( {
				url: mw.util.wikiScript( 'rest' ) + '/mws/v1/tags',
				type: 'GET',
				success: resolve,
				error: ( jqXHR, textStatus, errorThrown ) => {
					reject( new Error( `Request failed: ${ textStatus }, ${ errorThrown }` ) );
				}
			} );
		} );
		const definitions = [];
		data.map( async ( fullData ) => {
			const spec = fullData.clientSpecification;
			if ( !spec ) {
				return;
			}
			for ( let i = 0; i < fullData.tags.length; i++ ) {
				const tagDefinition = null;
				const definitionData = Object.assign( spec, {
					name: fullData.tags[ i ].replaceAll( ':', '_' ),
					tagname: fullData.tags[ i ],
					paramDefinitions: fullData.paramDefinition
				} );
				mw.hook( 'ext.visualEditorPlus.tags.getTagDefinition' ).fire( definitionData, tagDefinition );
				if ( tagDefinition instanceof ext.visualEditorPlus.ui.tag.Definition ) {
					definitions.push( tagDefinition );
					continue;
				}
				definitions.push( new ext.visualEditorPlus.ui.tag.Definition( definitionData ) );
			}
		} );
		return {
			definitions: definitions,
			tags: data
		};
	} catch ( error ) {
		console.error( error.message ); // eslint-disable-line no-console
		throw error;
	}
}

async function _initialize() { // eslint-disable-line no-underscore-dangle
	const specs = await getSpecifications();
	const _registry = new ext.visualEditorPlus.ui.tag.Registry(); // eslint-disable-line no-underscore-dangle

	specs.definitions.forEach( ( definition ) => {
		_registry.registerTagDefinition( definition );
	} );

	/**
	 * @param {ext.visualEditorPlus.ui.tag.Registry} registry
	 * @param {Object} tags All tag data as retrieved from the API
	 */
	mw.hook( 'ext.visualEditorPlus.tags.registerTags' ).fire( _registry, specs.tags );
	_registry.initialize();
}

_initialize();
