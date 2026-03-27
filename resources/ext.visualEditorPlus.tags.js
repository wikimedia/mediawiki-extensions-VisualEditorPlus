async function getSpecifications() {
	const dfd = $.Deferred();
	$.ajax( {
		url: mw.util.wikiScript( 'rest' ) + '/mws/v1/tags',
		type: 'GET'
	} ).done( async ( data ) => {
		const definitions = [];
		for ( const fullData of data ) {
			const spec = fullData.clientSpecification;
			if ( !spec ) {
				continue;
			}
			if ( fullData.rlModules ) {
				await mw.loader.using( fullData.rlModules );
			}

			for ( let i = 0; i < fullData.tags.length; i++ ) {
				const tagDefinition = {
					instance: null
				};
				const definitionData = Object.assign( spec, {
					name: fullData.tags[ i ].replaceAll( ':', '_' ),
					tagname: fullData.tags[ i ],
					paramDefinitions: fullData.paramDefinition,
					isWrapper: fullData.isWrapper,
					containerElementName: fullData.containerElementName || 'div'
				} );

				mw.hook( 'ext.visualEditorPlus.tags.getTagDefinition' ).fire( definitionData, tagDefinition );
				if ( tagDefinition instanceof ext.visualEditorPlus.ui.tag.Definition ) {
					definitions.push( tagDefinition );
					continue;
				}
				if ( tagDefinition.instance instanceof ext.visualEditorPlus.ui.tag.Definition ) {
					definitions.push( tagDefinition.instance );
					continue;
				}

				if ( definitionData.isWrapper ) {
					definitions.push( new ext.visualEditorPlus.ui.tag.WrapperDefinition( definitionData ) );
				} else {
					definitions.push( new ext.visualEditorPlus.ui.tag.Definition( definitionData ) );
				}
			}
		}
		dfd.resolve( {
			definitions: definitions,
			tags: data
		} );
	} );
	return dfd.promise();
}

async function _initialize() { // eslint-disable-line no-underscore-dangle
	const specs = await getSpecifications();
	const _registry = new ext.visualEditorPlus.ui.tag.Registry(); // eslint-disable-line no-underscore-dangle

	await mw.loader.using( 'ext.visualEditorPlus.tags.wrapperAction' );
	specs.definitions.forEach( ( definition ) => {
		if ( definition instanceof ext.visualEditorPlus.ui.tag.WrapperDefinition ) {
			definition.register();
		} else {
			_registry.registerTagDefinition( definition );
		}
	} );

	/**
	 * @param {ext.visualEditorPlus.ui.tag.Registry} registry
	 * @param {Object} tags All tag data as retrieved from the API
	 */
	mw.hook( 'ext.visualEditorPlus.tags.registerTags' ).fire( _registry, specs.tags );
	_registry.initialize();
}

mw.libs.ve.targetLoader.addPlugin( () => {
	const dfd = $.Deferred();
	_initialize().then( () => {
		dfd.resolve();
	} );
	return dfd.promise();
} );
