import { SimplePluginManager } from '../impl/plugin-manager';
import type { PluginManifest } from '../plugin-manager';
declare global {
    interface Window {
        __ruxuwu__: {
            plugins: PluginManifest[];
            pluginManager: SimplePluginManager;
        };
    }
}
