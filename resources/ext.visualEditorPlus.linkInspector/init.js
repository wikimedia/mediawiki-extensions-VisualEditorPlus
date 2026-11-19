mw.loader.using( 'ext.visualEditor.desktopArticleTarget.init' ).done( () => {
	mw.libs.ve.targetLoader.addPlugin( () => {
		// The VE base classes are not available when plugin modules are loaded,
		// so the inspectors are loaded and registered once VE asks for plugins.
		const dfd = $.Deferred();
		mw.loader.using( [
			'ext.visualEditor.mwcore',
			'ext.visualEditorPlus.linkInspector'
		] ).done( () => {
			ve.ui.windowFactory.register( ext.visualEditorPlus.ui.MWLinkAnnotationInspector );
			if ( ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector ) {
				ve.ui.windowFactory.register( ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector );
			}
			dfd.resolve();
		} ).fail( dfd.reject );
		return dfd.promise();
	} );
} );
