import { SimplePluginManager } from '../impl/plugin-manager';

// 如果打包成 esm 时，我希望运行的是下面这一行
export const pluginManager = new SimplePluginManager()

