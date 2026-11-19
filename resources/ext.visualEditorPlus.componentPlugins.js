/**
 * Registry for plugins of VisualEditor components (inspectors, dialogs).
 * A plugin is a callback that gets the component instance and may return
 * a map of method names to functions that the component calls in addition to its own logic.
 */
( function () {
	const plugins = {};

	ext.visualEditorPlus.components = {
		LINK_ANNOTATION_INSPECTOR: 'link-annotation-inspector',
		MEDIA_DIALOG: 'media-dialog',
		SAVE_DIALOG: 'save-dialog',
		TABLE_DIALOG: 'table-dialog',
		META_DIALOG: 'meta-dialog'
	};

	ext.visualEditorPlus.componentPlugins = {
		/**
		 * @param {string} componentKey One of ext.visualEditorPlus.components
		 * @param {Function} pluginCallback
		 */
		register: function ( componentKey, pluginCallback ) {
			if ( !plugins[ componentKey ] ) {
				plugins[ componentKey ] = [];
			}
			plugins[ componentKey ].push( pluginCallback );
		},

		/**
		 * @param {string} componentKey
		 * @return {Function[]}
		 */
		get: function ( componentKey ) {
			if ( !plugins[ componentKey ] ) {
				plugins[ componentKey ] = [];
			}
			return plugins[ componentKey ];
		}
	};
}() );
