/**
 * Adds plugin support to the link inspectors. Plugins are registered for
 * ext.visualEditorPlus.components.LINK_ANNOTATION_INSPECTOR and can return these methods:
 * * `annotationChanged`: Called on every change, before `updateActions` plugins. Cannot veto.
 * * `updateActions`: Return `false` to skip the remaining `updateActions` plugins and the default.
 * * `getInsertionText`: Return a string to replace the default text, or `null` to keep it.
 * * `getAnnotation`: Gets the annotation to apply and returns the annotation to use instead.
 * * `teardown`: Called when the inspector closes.
 *
 * @param {Function} Class Inspector class that inherits from a VE link inspector
 * @param {Function} Base The VE link inspector class
 */
ext.visualEditorPlus.ui.applyLinkInspectorPlugins = function ( Class, Base ) {
	Class.prototype.initialize = function () {
		Base.prototype.initialize.call( this );
		this.runComponentPlugins();
	};

	Class.prototype.runComponentPlugins = function () {
		const pluginCallbacks = ext.visualEditorPlus.componentPlugins.get(
			ext.visualEditorPlus.components.LINK_ANNOTATION_INSPECTOR
		);

		for ( let i = 0; i < pluginCallbacks.length; i++ ) {
			const pluginMethods = pluginCallbacks[ i ]( this ) || {};
			for ( const method in pluginMethods ) {
				if ( !Object.prototype.hasOwnProperty.call( this.pluginMethods, method ) ) {
					this.pluginMethods[ method ] = [];
				}
				this.pluginMethods[ method ].push( pluginMethods[ method ] );
			}
		}
	};

	Class.prototype.updateActions = function () {
		( this.pluginMethods.annotationChanged || [] ).forEach( ( method ) => method.call( this ) );
		const pluginMethods = this.pluginMethods.updateActions || [];
		for ( let i = 0; i < pluginMethods.length; i++ ) {
			if ( pluginMethods[ i ].call( this ) === false ) {
				return;
			}
		}
		Base.prototype.updateActions.call( this );
	};

	Class.prototype.getAnnotation = function () {
		let annotation = Base.prototype.getAnnotation.call( this );
		( this.pluginMethods.getAnnotation || [] ).forEach( ( method ) => {
			annotation = method.call( this, annotation );
		} );
		return annotation;
	};

	Class.prototype.getTeardownProcess = function ( data ) {
		return Base.prototype.getTeardownProcess.call( this, data ).next( () => {
			( this.pluginMethods.teardown || [] ).forEach( ( method ) => method.call( this ) );
		} );
	};

	Class.prototype.getInsertionText = function () {
		const pluginMethods = this.pluginMethods.getInsertionText || [];
		for ( let i = 0; i < pluginMethods.length; i++ ) {
			const res = pluginMethods[ i ].call( this );
			if ( res !== null ) {
				return res;
			}
		}
		return Base.prototype.getInsertionText.call( this );
	};
};

ext.visualEditorPlus.ui.MWLinkAnnotationInspector = function VePlusUiMWLinkAnnotationInspector( config ) {
	this.pluginMethods = {};
	ext.visualEditorPlus.ui.MWLinkAnnotationInspector.super.call(
		this, ve.extendObject( { padded: false }, config )
	);
};

OO.inheritClass( ext.visualEditorPlus.ui.MWLinkAnnotationInspector, ve.ui.MWLinkAnnotationInspector );

ext.visualEditorPlus.ui.applyLinkInspectorPlugins(
	ext.visualEditorPlus.ui.MWLinkAnnotationInspector, ve.ui.MWLinkAnnotationInspector
);

if ( ve.ui.MWWikitextLinkAnnotationInspector ) {
	ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector = function VePlusUiMWWikitextLinkAnnotationInspector( config ) {
		this.pluginMethods = {};
		ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector.super.call(
			this, ve.extendObject( { padded: false }, config )
		);
	};

	OO.inheritClass(
		ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector,
		ve.ui.MWWikitextLinkAnnotationInspector
	);

	ext.visualEditorPlus.ui.applyLinkInspectorPlugins(
		ext.visualEditorPlus.ui.MWWikitextLinkAnnotationInspector,
		ve.ui.MWWikitextLinkAnnotationInspector
	);
}
