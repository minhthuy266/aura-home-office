import React from 'react';
import { Settings, Server, Plug } from 'lucide-react';

export default function SetupPrompt() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-semibold mb-3 tracking-tight">Backend Configuration Required</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your headless frontend is ready, but it needs a WordPress CMS to pull content from. 
          Please configure your <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">VITE_WP_API_URL</code> environment variable.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-4">
            <Server className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">1. Prepare your WordPress Site</h3>
              <p className="text-sm text-gray-500">Ensure your WordPress site has public access and the REST API is enabled (it usually is by default).</p>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex gap-4">
            <Plug className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">2. Add the URL to Settings</h3>
              <p className="text-sm text-gray-500">
                Open the AI Studio settings and add the URL to your WP site without a trailing slash. Example: <code className="text-xs bg-gray-200 px-1 rounded">https://yourdomain.com</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
