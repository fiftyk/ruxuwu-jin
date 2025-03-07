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