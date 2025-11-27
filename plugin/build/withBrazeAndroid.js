"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAndroidBrazeSdk = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const config_plugins_1 = require("expo/config-plugins");
const brazeAndroidConstants_1 = require("./brazeAndroidConstants");
async function writeBrazeXml(projectRoot, props) {
    const destinationPath = (0, path_1.resolve)(projectRoot, brazeAndroidConstants_1.ANDROID_BRAZE_XML_PATH);
    try {
        let brazeXml = '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n';
        brazeXml += '<string-array name="com_braze_internal_sdk_metadata">\n<item>GRADLE</item>\n</string-array>\n';
        Object.entries(props).forEach(([key, value]) => {
            const mappedConfigInfo = brazeAndroidConstants_1.ANDROID_CONFIG_MAP[key];
            if (value == null || mappedConfigInfo == null) {
                // If it's not defined just move on
                return;
            }
            // Should be the Braze configuration name, such as "com_braze_api_key"
            const xmlKeyName = mappedConfigInfo[0];
            // Should be the `braze.xml` key, such as "string"
            const xmlKeyType = mappedConfigInfo[1];
            brazeXml += "\n  ";
            switch (xmlKeyType) {
                case brazeAndroidConstants_1.BX_STR:
                    brazeXml += `<${xmlKeyType} translatable="false" name="${xmlKeyName}">${value}</${xmlKeyType}>`;
                    break;
                case brazeAndroidConstants_1.BX_INT:
                    brazeXml += `<${xmlKeyType} name="${xmlKeyName}">${value}</${xmlKeyType}>`;
                    break;
                case brazeAndroidConstants_1.BX_BOOL:
                    brazeXml += `<${xmlKeyType} name="${xmlKeyName}">${value}</${xmlKeyType}>`;
                    break;
                case brazeAndroidConstants_1.BX_DRAWABLE:
                    brazeXml += `<${xmlKeyType} name="${xmlKeyName}">${value}</${xmlKeyType}>`;
                    break;
                case brazeAndroidConstants_1.BX_COLOR:
                    brazeXml += `<${xmlKeyType} name="${xmlKeyName}">${value}</${xmlKeyType}>`;
                    break;
            }
        });
        brazeXml += "\n</resources>\n";
        (0, fs_1.writeFileSync)(destinationPath, brazeXml);
    }
    catch (e) {
        throw new Error(`Cannot write braze.xml file to ${destinationPath}.\n${e}`);
    }
    return true;
}
async function appendContentsToConfig(newConfig, newContents) {
    let { contents } = newConfig.modResults;
    // Don't add this twice
    if (!contents.includes(brazeAndroidConstants_1.GRADLE_APPEND_ID)) {
        contents += newContents;
        newConfig.modResults.contents = contents;
    }
    return newConfig;
}
const withAndroidBrazeSdk = (config, props) => {
    config = config_plugins_1.AndroidConfig.Permissions.withPermissions(config, brazeAndroidConstants_1.BRAZE_SDK_REQUIRED_PERMISSIONS);
    config = (0, config_plugins_1.withDangerousMod)(config, [
        'android',
        async (config) => {
            await writeBrazeXml(config.modRequest.projectRoot, props);
            return config;
        },
    ]);
    // Reference the project build.gradle
    config = (0, config_plugins_1.withProjectBuildGradle)(config, (newConfig) => {
        return appendContentsToConfig(newConfig, brazeAndroidConstants_1.BUILDSCRIPT_LEVEL_GRADLE);
    });
    // Update app build.gradle
    config = (0, config_plugins_1.withAppBuildGradle)(config, (newConfig) => {
        return appendContentsToConfig(newConfig, brazeAndroidConstants_1.APP_LEVEL_GRADLE);
    });
    // Add to the gradle properties
    config = (0, config_plugins_1.withGradleProperties)(config, (newConfig) => {
        const newProperties = [
            {
                type: "property",
                key: "expo.braze.fcmVersion",
                value: "23.0.0",
            },
            {
                type: "property",
                key: "expo.braze.addFirebaseMessaging",
                value: String(props.enableFirebaseCloudMessaging === true),
            },
        ];
        // Avoid adding duplicate entries to the gradle.properties file.
        const findExistingProperty = (key) => newConfig.modResults.find(property => property.type === 'property' && property.key === key);
        newProperties.forEach(newProperty => {
            // Only `property` types have a `key`. Check the type to prevent `undefined` states.
            if (newProperty.type === 'property') {
                const existingProperty = findExistingProperty(newProperty.key);
                if (!existingProperty) {
                    newConfig.modResults.push(newProperty);
                }
                else if (existingProperty.type === 'property' && existingProperty.value !== newProperty.value) {
                    existingProperty.value = newProperty.value;
                }
            }
        });
        return newConfig;
    });
    return config;
};
exports.withAndroidBrazeSdk = withAndroidBrazeSdk;
