"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withBrazeAndroid_1 = require("./withBrazeAndroid");
const withBrazeiOS_1 = require("./withBrazeiOS");
const withBraze = (config, _props) => {
    const props = _props || { androidApiKey: "", iosApiKey: "", baseUrl: "" };
    config = (0, withBrazeAndroid_1.withAndroidBrazeSdk)(config, props);
    config = (0, withBrazeiOS_1.withIOSBrazeSdk)(config, props);
    return config;
};
const pkg = require("../package.json");
exports.default = (0, config_plugins_1.createRunOncePlugin)(withBraze, pkg.name, pkg.version);
