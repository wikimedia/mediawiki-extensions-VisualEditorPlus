const colActions = [ 'insertColumnBefore', 'insertColumnAfter', 'moveColumnBefore', 'moveColumnAfter' ];
const rowActions = [ 'insertRowBefore', 'insertRowAfter', 'moveRowBefore', 'moveRowAfter' ];
mw.hook( 'visualeditorplus.table.col.actions' ).fire( this, colActions );
mw.hook( 'visualeditorplus.table.row.actions' ).fire( this, rowActions );

colActions.push( 'deleteColumn' );
rowActions.push( 'deleteRow' );

ve.ui.TableLineContext.static.groups.col = colActions;
ve.ui.TableLineContext.static.groups.row = rowActions;
