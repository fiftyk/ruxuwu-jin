import type { JinPlugin, PluginContext } from '@ruxuwu/jin';
import type { RouterRegister } from './types';

declare module '@ruxuwu/jin' {
    interface PluginContext {
        routerRegister: RouterRegister
    }
}

const HelloWorldPlugin: JinPlugin = {
    async activate(context: PluginContext) {
        const { routerRegister } = context;

        // 注册新的路由
        routerRegister.register({
            path: '/hello-world',
            name: 'HelloWorld',
            renderer: {
                mount(el: HTMLElement) {
                    const container = document.createElement('div');
                    container.className = 'hello-world-container';
                    container.style.padding = '20px';
                    container.style.maxWidth = '800px';
                    container.style.margin = '0 auto';
                    container.style.backgroundColor = '#f8f9fa';
                    container.style.borderRadius = '8px';
                    container.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

                    const title = document.createElement('h1');
                    title.textContent = 'Hello World Plugin';
                    title.style.color = '#3498db';
                    title.style.marginBottom = '20px';

                    const description = document.createElement('p');
                    description.textContent = '这是一个简单的 Hello World 插件，展示了如何创建和注册插件路由。';
                    description.style.fontSize = '16px';
                    description.style.lineHeight = '1.6';
                    description.style.marginBottom = '20px';

                    const infoBox = document.createElement('div');
                    infoBox.style.backgroundColor = '#e8f4f8';
                    infoBox.style.padding = '15px';
                    infoBox.style.borderRadius = '5px';
                    infoBox.style.marginTop = '20px';

                    const infoTitle = document.createElement('h3');
                    infoTitle.textContent = '插件信息';
                    infoTitle.style.marginBottom = '10px';
                    infoTitle.style.color = '#2980b9';

                    const infoList = document.createElement('ul');
                    infoList.style.listStyleType = 'none';
                    infoList.style.padding = '0';

                    const items = [
                        { label: '名称', value: 'Hello World Plugin' },
                        { label: '版本', value: '0.1.0' },
                        { label: '路径', value: '/hello-world' }
                    ];

                    items.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.style.padding = '5px 0';
                        listItem.innerHTML = `<strong>${item.label}:</strong> ${item.value}`;
                        infoList.appendChild(listItem);
                    });

                    infoBox.appendChild(infoTitle);
                    infoBox.appendChild(infoList);

                    container.appendChild(title);
                    container.appendChild(description);
                    container.appendChild(infoBox);

                    el.appendChild(container);
                },
                dispose() {
                    // 清理逻辑
                }
            }
        });

        console.log('Hello World Plugin activated!');
    }
};

export default HelloWorldPlugin; 