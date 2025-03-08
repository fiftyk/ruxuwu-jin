import { SimplePluginManager } from '../plugin-manager';
import type { JinPlugin, PluginContext, PluginManifest, Disposable } from '../../plugin-manager';
import { describe, test, expect, beforeEach } from 'vitest';

// Mock plugin implementation
class MockPlugin implements JinPlugin {
  activateCalled = false;
  deactivateCalled = false;
  context: PluginContext | null = null;

  async activate(context: PluginContext): Promise<void> {
    this.activateCalled = true;
    this.context = context;
  }

  async deactivate(): Promise<void> {
    this.deactivateCalled = true;
  }
}

// Mock disposable implementation
class MockDisposable implements Disposable {
  disposed = false;
  
  dispose(): void {
    this.disposed = true;
  }
}

describe('SimplePluginManager', () => {
  let pluginManager: SimplePluginManager;
  let mockPlugin: MockPlugin;
  const mockManifest: PluginManifest = { 
    id: 'test-plugin', 
    name: 'Test Plugin', 
    version: '1.0.0',
    url: 'https://example.com/plugin' // Add the required url property
  };

  beforeEach(() => {
    pluginManager = new SimplePluginManager();
    mockPlugin = new MockPlugin();
  });

  test('should register and activate a plugin', async () => {
    // Register plugin
    await pluginManager.registerPlugin(mockManifest, async () => mockPlugin);
    
    // Activate plugin
    await pluginManager.activatePlugin(mockManifest.id);
    
    expect(mockPlugin.activateCalled).toBe(true);
    expect(mockPlugin.context).not.toBeNull();
    expect(Array.isArray(mockPlugin.context?.subscriptions)).toBe(true);
  });

  test('should deactivate a plugin and dispose subscriptions', async () => {
    // Register and activate plugin
    await pluginManager.registerPlugin(mockManifest, async () => mockPlugin);
    await pluginManager.activatePlugin(mockManifest.id);
    
    // Add a disposable to the plugin's subscriptions
    const disposable = new MockDisposable();
    mockPlugin.context!.subscriptions.push(disposable);
    
    // Deactivate plugin
    await pluginManager.deactivatePlugin(mockManifest.id);
    
    expect(mockPlugin.deactivateCalled).toBe(true);
    expect(disposable.disposed).toBe(true);
    expect(mockPlugin.context!.subscriptions.length).toBe(0);
  });

  test('should provide isolated contexts for different plugins', async () => {
    // Create two plugins
    const mockPlugin1 = new MockPlugin();
    const mockPlugin2 = new MockPlugin();
    const manifest1: PluginManifest = { 
      id: 'plugin1', 
      name: 'Plugin 1', 
      version: '1.0.0',
      url: 'https://example.com/plugin1'
    };
    const manifest2: PluginManifest = { 
      id: 'plugin2', 
      name: 'Plugin 2', 
      version: '1.0.0',
      url: 'https://example.com/plugin2'
    };
    
    // Register and activate both plugins
    await pluginManager.registerPlugin(manifest1, async () => mockPlugin1);
    await pluginManager.registerPlugin(manifest2, async () => mockPlugin2);
    await pluginManager.activatePlugin(manifest1.id);
    await pluginManager.activatePlugin(manifest2.id);
    
    // Add different disposables to each plugin
    const disposable1 = new MockDisposable();
    const disposable2 = new MockDisposable();
    mockPlugin1.context!.subscriptions.push(disposable1);
    mockPlugin2.context!.subscriptions.push(disposable2);
    
    // Verify contexts are different objects
    expect(mockPlugin1.context).not.toBe(mockPlugin2.context);
    
    // Deactivate only the first plugin
    await pluginManager.deactivatePlugin(manifest1.id);
    
    // Verify only the first plugin's disposable was disposed
    expect(disposable1.disposed).toBe(true);
    expect(disposable2.disposed).toBe(false);
    expect(mockPlugin1.context!.subscriptions.length).toBe(0);
    expect(mockPlugin2.context!.subscriptions.length).toBe(1);
  });

  test('should update all plugin contexts when base context changes', async () => {
    // Register two plugins
    const mockPlugin1 = new MockPlugin();
    const mockPlugin2 = new MockPlugin();
    const manifest1: PluginManifest = { 
      id: 'plugin1', 
      name: 'Plugin 1', 
      version: '1.0.0',
      url: 'https://example.com/plugin1'
    };
    const manifest2: PluginManifest = { 
      id: 'plugin2', 
      name: 'Plugin 2', 
      version: '1.0.0',
      url: 'https://example.com/plugin2'
    };
    
    await pluginManager.registerPlugin(manifest1, async () => mockPlugin1);
    await pluginManager.registerPlugin(manifest2, async () => mockPlugin2);
    await pluginManager.activatePlugin(manifest1.id);
    await pluginManager.activatePlugin(manifest2.id);
    
    // Set base context with a shared API
    pluginManager.setPluginContext({ sharedApi: { method: () => 'result' } });
    
    // Verify both plugins have access to the shared API
    expect(mockPlugin1.context!.sharedApi).toBeDefined();
    expect(mockPlugin2.context!.sharedApi).toBeDefined();
    expect(mockPlugin1.context!.sharedApi.method()).toBe('result');
    expect(mockPlugin2.context!.sharedApi.method()).toBe('result');
    
    // Update the base context
    pluginManager.setPluginContext({ newApi: { newMethod: () => 'new result' } });
    
    // Verify both plugins have access to both APIs
    expect(mockPlugin1.context!.sharedApi).toBeDefined();
    expect(mockPlugin1.context!.newApi).toBeDefined();
    expect(mockPlugin1.context!.newApi.newMethod()).toBe('new result');
    expect(mockPlugin2.context!.sharedApi).toBeDefined();
    expect(mockPlugin2.context!.newApi).toBeDefined();
    expect(mockPlugin2.context!.newApi.newMethod()).toBe('new result');
  });

  test('should throw error when activating non-existent plugin', async () => {
    await expect(pluginManager.activatePlugin('non-existent')).rejects.toThrow();
  });

  test('should throw error when deactivating non-existent plugin', async () => {
    await expect(pluginManager.deactivatePlugin('non-existent')).rejects.toThrow();
  });
}); 