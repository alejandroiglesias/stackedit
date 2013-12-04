define([
    "jquery",
    "underscore",
    "utils",
    "classes/Extension",
    "fileSystem",
    "settings",
    //"text!html/doremiScriptSettingsBlock.html",
], function($, _, utils, Extension, fileSystem, settings/*, doremiScriptSettingsBlockHTML*/) {

    var doremiScript = new Extension("doremiScript", "DoremiScript extension", true);
    //doremiScript.settingsBlock = doremiScriptSettingsBlockHTML;
    doremiScript.defaultConfig = {
        code: "",
    };

    var fileMgr;
    doremiScript.onFileMgrCreated = function(fileMgrParameter) {
        fileMgr = fileMgrParameter;
    };

    var synchronizer;
    doremiScript.onSynchronizerCreated = function(synchronizerParameter) {
        synchronizer = synchronizerParameter;
    };

    var publisher;
    doremiScript.onPublisherCreated = function(publisherParameter) {
        publisher = publisherParameter;
    };

    var eventMgr;
    doremiScript.onEventMgrCreated = function(eventMgrParameter) {
        eventMgr = eventMgrParameter;
    };

    doremiScript.onLoadSettings = function() {
        utils.setInputValue("#textarea-doremiScript-code", doremiScript.config.code);
    };

    doremiScript.onSaveSettings = function(newConfig, event) {
        newConfig.code = utils.getInputValue("#textarea-doremiScript-code");
        try {
            /*jshint evil: true */
            eval(newConfig.code);
        }
        catch(e) {
            eventMgr.onError(e);
            // Mark the textarea as error
            utils.getInputTextValue("#textarea-doremiScript-code", event, /^$/);
        }
    };

    doremiScript.onPagedownConfigure = function(editor) {
        editor.getConverter().hooks.chain("postConversion", function(text) {
            var value;
            value = text.replace(/\[doremi\]([^]*?)\[\/doremi\]/g, function(match, script) {
                console.log('doremiScript', 'postConversion', script);
                return '[DOREMI SCRIPT OUTPUT HERE]';
            });
            return value;
        });
    };

    doremiScript.onInit = function() {
        try {
            /*jshint evil: true */
            eval(doremiScript.config.code);
        }
        catch(e) {
            console.error(e);
        }
    };

    return doremiScript;
});
