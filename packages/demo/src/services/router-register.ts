import router from '../router';

export interface RouteRenderer {
    mount: (el: HTMLElement) => void;
    dispose: () => void;
}

export interface RouterOptions {
    path: string;
    name: string;
    renderer: RouteRenderer
}

export interface RouterRegister {
    register(options: RouterOptions): void
}

export const routerRegister: RouterRegister = {
    register(options: RouterOptions) {
        router.addRoute(options.name, {
            path: options.path,
            props() {
                return {
                    renderer: options.renderer,
                }
            },
            component: () => import('../components/RouteBase.vue')
        })
    }
}