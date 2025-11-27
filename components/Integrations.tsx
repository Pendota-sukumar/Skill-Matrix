
import React, { useState } from 'react';
import { DataSource, IntegrationType } from '../types';
import { Database, Globe, Server, Plug, Plus, Trash2, RefreshCw, Save, CheckCircle, AlertTriangle, X, ChevronDown, Filter } from './Icons';

interface IntegrationsProps {
  // Props can be expanded later
}

const INITIAL_SOURCES: DataSource[] = [
  { 
    id: '1', name: 'Production DB (Postgres)', type: 'PostgreSQL', status: 'Connected', lastSync: '10 mins ago',
    config: { url: 'jdbc:postgresql://prod-db:5432/skills', username: 'admin' }
  },
  {
    id: '2', name: 'SAP HR Connector', type: 'SAP S/4HANA', status: 'Error', lastSync: '2 days ago',
    config: { endpoint: 'https://sap-gateway.corp.local/erp', client: '100' }
  }
];

const MARKET_CONNECTORS = [
    { 
        category: "Databases & Warehouses", 
        options: [
            "PostgreSQL", "MySQL", "Oracle Database", "Microsoft SQL Server", 
            "Snowflake", "Databricks", "MongoDB", "Redis", "Amazon Redshift", "Google BigQuery"
        ] 
    },
    { 
        category: "ERP & Finance", 
        options: [
            "SAP S/4HANA", "Oracle NetSuite", "Microsoft Dynamics 365", 
            "Workday", "QuickBooks Online", "Xero", "Sage Intacct"
        ] 
    },
    { 
        category: "CRM & Sales", 
        options: [
            "Salesforce", "HubSpot", "Zoho CRM", "Pipedrive", "Zendesk", "ServiceNow"
        ] 
    },
    { 
        category: "Productivity & Collaboration", 
        options: [
            "Jira", "Slack", "Microsoft Teams", "Asana", "Trello", "Notion", "Monday.com"
        ] 
    },
    { 
        category: "Storage & Cloud", 
        options: [
            "AWS S3", "Google Cloud Storage", "Azure Blob Storage", "Dropbox", "Box"
        ] 
    },
    { 
        category: "Universal Protocols", 
        options: [
            "REST API", "GraphQL", "SOAP", "ODBC/JDBC", "FTP/SFTP", "Webhook"
        ] 
    }
];

export const Integrations: React.FC<IntegrationsProps> = () => {
  const [sources, setSources] = useState<DataSource[]>(INITIAL_SOURCES);
  const [selectedConnector, setSelectedConnector] = useState<string>('');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  
  // Form State
  const [formName, setFormName] = useState('');
  const [formHost, setFormHost] = useState('');
  const [formAuthType, setFormAuthType] = useState('Basic');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const handleSelectConnector = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const connector = e.target.value;
    if (!connector) return;
    
    setSelectedConnector(connector);
    setIsConfiguring(true);
    setTestStatus('idle');
    setFormName(`New ${connector} Connection`);
    setFormHost('');
    setFormUsername('');
    setFormPassword('');
  };

  const handleTestConnection = () => {
    setTestStatus('testing');
    setTimeout(() => {
        // Mock success for demo
        setTestStatus(Math.random() > 0.3 ? 'success' : 'failed');
    }, 1500);
  };

  const handleSave = () => {
    if (!selectedConnector) return;
    const newSource: DataSource = {
        id: Date.now().toString(),
        name: formName,
        type: selectedConnector,
        status: testStatus === 'success' ? 'Connected' : 'Disconnected',
        lastSync: 'Just now',
        config: { host: formHost, auth: formAuthType }
    };
    setSources([...sources, newSource]);
    setIsConfiguring(false);
    setSelectedConnector('');
    setFormName('');
  };

  const handleDelete = (id: string) => {
    setSources(sources.filter(s => s.id !== id));
  };

  // Helper to determine field labels based on type
  const getFieldLabels = (type: string) => {
      const lower = type.toLowerCase();
      if (lower.includes('sql') || lower.includes('database') || lower.includes('data')) {
          return { host: 'Connection String / Host URL', user: 'Database Username', pass: 'Database Password' };
      }
      if (lower.includes('s3') || lower.includes('storage') || lower.includes('aws')) {
          return { host: 'Bucket URL / Endpoint', user: 'Access Key ID', pass: 'Secret Access Key' };
      }
      return { host: 'API Endpoint / Instance URL', user: 'Client ID / Username', pass: 'Client Secret / API Token' };
  };

  const labels = getFieldLabels(selectedConnector);

  return (
    <div className="h-full flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
             <Plug className="text-indigo-600 w-6 h-6" />
          </div>
          Integrations & Connectors
        </h2>
        <p className="text-slate-500 text-sm max-w-2xl">
          Connect SkillMatrix AI to your enterprise ecosystem. Select from over 50+ pre-built connectors to sync operator data, training records, and machine status.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Management & Selection */}
        <div className="xl:col-span-2 flex flex-col gap-6">
            
            {/* Add New Connector Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Add New Data Source</label>
                        <div className="relative group">
                            <select 
                                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer group-hover:bg-white"
                                onChange={handleSelectConnector}
                                value={selectedConnector}
                            >
                                <option value="">Select a connector from the market list...</option>
                                {MARKET_CONNECTORS.map((category) => (
                                    <optgroup key={category.category} label={category.category}>
                                        {category.options.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                <Plus className="w-5 h-5" />
                            </div>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                <ChevronDown className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                    <div className="hidden sm:block mb-2">
                        <div className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                            50+ Connectors Available
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Connections List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1">
                <div className="p-5 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Active Connections</h3>
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-white border border-indigo-100 px-3 py-1.5 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" /> Sync All
                    </button>
                </div>
                <div className="divide-y divide-slate-100">
                    {sources.map(source => (
                        <div key={source.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm ${
                                    source.type.includes('SQL') || source.type.includes('Postgres') ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                    source.type.includes('SAP') ? 'bg-indigo-50 border-indigo-100 text-indigo-600' :
                                    source.type.includes('Salesforce') ? 'bg-sky-50 border-sky-100 text-sky-600' :
                                    'bg-slate-50 border-slate-200 text-slate-500'
                                }`}>
                                    {source.type.includes('SQL') || source.type.includes('Postgres') ? <Database className="w-6 h-6" /> :
                                     source.type.includes('SAP') || source.type.includes('Oracle') ? <Server className="w-6 h-6" /> :
                                     source.type.includes('Salesforce') || source.type.includes('HubSpot') ? <Globe className="w-6 h-6" /> :
                                     <Plug className="w-6 h-6" />
                                    }
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{source.name}</h4>
                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                            {source.type}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 font-medium ${
                                            source.status === 'Connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            source.status === 'Error' ? 'bg-red-50 text-red-700 border-red-100' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                source.status === 'Connected' ? 'bg-emerald-500' :
                                                source.status === 'Error' ? 'bg-red-500' : 'bg-slate-400'
                                            }`}></span>
                                            {source.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity self-end sm:self-auto">
                                <span className="text-xs text-slate-400 mr-2">Synced: {source.lastSync}</span>
                                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-100" title="Sync Now">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(source.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Remove">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {sources.length === 0 && (
                        <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                            <div className="p-4 bg-slate-50 rounded-full mb-3">
                                <Plug className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="font-medium text-slate-600">No active connections</p>
                            <p className="text-xs mt-1">Select a connector above to get started.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Configuration Panel */}
        <div className="xl:col-span-1">
             {isConfiguring && selectedConnector ? (
                 <div className="bg-white rounded-xl shadow-lg shadow-indigo-100 border border-indigo-100 p-6 sticky top-6 animate-slide-up relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-emerald-500"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Configure Connection</h3>
                            <p className="text-xs text-slate-500 font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded inline-block mt-1 border border-indigo-100">
                                {selectedConnector}
                            </p>
                        </div>
                        <button onClick={() => { setIsConfiguring(false); setSelectedConnector(''); }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-5">
                        {/* Connection Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Connection Name</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
                                placeholder={`My ${selectedConnector} Instance`}
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                            />
                        </div>

                        {/* Host / Endpoint */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">{labels.host}</label>
                            <div className="relative">
                                <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono text-slate-600 transition-all"
                                    placeholder={selectedConnector.includes('SQL') ? 'server.company.com:5432' : 'https://api.service.com/v1'}
                                    value={formHost}
                                    onChange={(e) => setFormHost(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Auth Type Selection */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Authentication Method</label>
                            <select 
                                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-600 transition-all"
                                value={formAuthType}
                                onChange={(e) => setFormAuthType(e.target.value)}
                            >
                                <option value="Basic">Basic Auth (User/Pass)</option>
                                <option value="API Key">API Key / Token</option>
                                <option value="OAuth2">OAuth 2.0</option>
                                <option value="None">No Authentication</option>
                            </select>
                        </div>

                        {/* Credentials */}
                        <div className="grid grid-cols-1 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">{labels.user}</label>
                                <input 
                                    type="text" 
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                    value={formUsername}
                                    onChange={(e) => setFormUsername(e.target.value)}
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1">{labels.pass}</label>
                                <input 
                                    type="password" 
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all"
                                    placeholder="••••••••••••"
                                    value={formPassword}
                                    onChange={(e) => setFormPassword(e.target.value)}
                                />
                             </div>
                        </div>

                        {/* Test Results */}
                        {testStatus !== 'idle' && (
                             <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-fade-in ${
                                 testStatus === 'testing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                 testStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                 'bg-red-50 text-red-700 border border-red-100'
                             }`}>
                                 <div className={`p-1.5 rounded-full ${
                                     testStatus === 'testing' ? 'bg-blue-200 text-blue-700' :
                                     testStatus === 'success' ? 'bg-emerald-200 text-emerald-700' :
                                     'bg-red-200 text-red-700'
                                 }`}>
                                    {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin" />}
                                    {testStatus === 'success' && <CheckCircle className="w-4 h-4" />}
                                    {testStatus === 'failed' && <AlertTriangle className="w-4 h-4" />}
                                 </div>
                                 
                                 <div>
                                     {testStatus === 'testing' && 'Establishing secure connection...'}
                                     {testStatus === 'success' && 'Connection verified successfully!'}
                                     {testStatus === 'failed' && 'Connection failed. Please check credentials.'}
                                 </div>
                             </div>
                        )}

                        <div className="pt-2 flex gap-3">
                            <button 
                                onClick={handleTestConnection}
                                disabled={testStatus === 'testing'}
                                className="flex-1 py-3 border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                            >
                                Test
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!formName || testStatus === 'testing'}
                                className="flex-1 py-3 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
                            >
                                Save Connection
                            </button>
                        </div>
                    </div>
                 </div>
             ) : (
                 <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-slate-400">
                     <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                        <Plug className="w-10 h-10 text-slate-300" />
                     </div>
                     <p className="font-bold text-slate-600 text-lg">No Connector Selected</p>
                     <p className="text-sm mt-2 max-w-[240px] leading-relaxed">
                        Choose a connector from the market list on the left to configure a new integration.
                     </p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};
