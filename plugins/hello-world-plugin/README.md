# Hello World Plugin

这是一个简单的 Hello World 插件，用于演示如何为 Jin 框架创建插件。

## 功能

- 注册一个新的路由 `/hello-world`
- 展示一个简单的 Hello World 页面

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建插件
pnpm build
```

## 使用

在你的应用中注册并激活插件：

```typescript
import { pluginManager } from '@ruxuwu/jin';
import HelloWorldPlugin from 'hello-world-plugin';

// 设置插件上下文
pluginManager.setPluginContext({ routerRegister });

// 注册插件
await pluginManager.registerPlugin({
    id: 'hello-world-plugin',
    name: 'Hello World Plugin',
    version: '0.1.0',
    url: '',
}, async () => HelloWorldPlugin);

// 激活插件
await pluginManager.activatePlugin('hello-world-plugin');
```

## 许可证

MIT 