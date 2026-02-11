<?php

namespace MediaWiki\Extension\VisualEditorPlus;

class Extension {

	public static function callback() {
		\mwsInitComponents();

		$GLOBALS[ 'wgVisualEditorPreloadModules' ][] = "ext.visualEditorPlus.styleInspector";
	}
}
