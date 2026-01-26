ext = window.ext || {};
ext.visualEditorPlus = ext.visualEditorPlus || {};
ext.visualEditorPlus.table = ext.visualEditorPlus.table || {};
ext.visualEditorPlus.table.dialog = ext.visualEditorPlus.table.dialog || {};

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog = function ( commands, contextItem ) {
	this.commands = commands;
	this.contextItem = contextItem;
	this.styleWidgets = {};

	ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.parent.call( this, {
		size: 'medium'
	} );
};

OO.inheritClass( ext.visualEditorPlus.table.dialog.AdditionalActionsDialog, OO.ui.ProcessDialog );

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.static.name = 'tableAdditionalActions';

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.static.actions = [
	{
		action: 'save',
		label: mw.msg( 'visualeditorplus-table-cell-actions-dialog-done-label' ),
		flags: [ 'primary', 'progressive' ]
	},
	{
		title: mw.msg( 'cancel' ),
		flags: [ 'safe', 'close' ]
	}
];
ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.static.title =
	mw.msg( 'visualeditorplus-table-cell-actions-dialog-title' );

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.prototype.initialize = function () {
	let command;
	let config;
	let indLayout;
	const mainLayout = new OO.ui.PanelLayout( {
		padded: true,
		expanded: false
	} );

	ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.parent.prototype.initialize.call( this, arguments );

	for ( command in this.commands ) {
		if ( !this.commands.hasOwnProperty( command ) ) {
			continue;
		}
		config = this.commands[ command ];
		this.styleWidgets[ command ] = this.contextItem.getWidgetFromConfig( command, config );
		this.styleWidgets[ command ].setShouldExecute( false );
		indLayout = new OO.ui.FieldLayout( this.styleWidgets[ command ], {
			label: config.label || ''
		} );
		mainLayout.$element.append( indLayout.$element );
	}
	this.$body.append( mainLayout.$element );
};

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.prototype.getActionProcess = function ( action ) {
	if ( action === 'save' ) {
		return new OO.ui.Process( () => this.close( { action: action, actionsToExecute: this.styleWidgets } ) );
	}
	return ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.parent.prototype.getActionProcess.call( this, action );
};

ext.visualEditorPlus.table.dialog.AdditionalActionsDialog.prototype.getBodyHeight = function () {
	return this.$body.outerHeight() + 100;
};
