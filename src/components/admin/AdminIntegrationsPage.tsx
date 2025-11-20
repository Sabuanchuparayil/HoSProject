import React, { useState } from 'react';
import { IntegrationSettings, IntegrationName, IntegrationCredentials } from '../../types';
import { INTEGRATION_CONFIGS } from '../../data/integrations';
import { IntegrationCard } from './IntegrationCard';

interface AdminIntegrationsPageProps {
  settings: IntegrationSettings;
  onUpdate: (updatedSettings: IntegrationSettings) => void;
}

export const AdminIntegrationsPage: React.FC<AdminIntegrationsPageProps> = ({ settings, onUpdate }) => {
  const [feedback, setFeedback] = useState('');

  const handleSave = (integrationId: IntegrationName, credentials: IntegrationCredentials) => {
    onUpdate({
      ...settings,
      [integrationId]: credentials,
    });
    setFeedback(`${integrationId.charAt(0).toUpperCase() + integrationId.slice(1)} settings saved successfully!`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-cinzel text-[--text-primary]">Third-Party Integrations</h1>
          <p className="text-[--text-muted] mt-1 max-w-2xl">
            Connect to external services like payment gateways and shipping providers by entering your API credentials below.
          </p>
        </div>
        {feedback && <p className="text-sm font-semibold text-green-500 bg-green-500/10 p-2 rounded-md">{feedback}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {INTEGRATION_CONFIGS.map(config => (
          <IntegrationCard
            key={config.id}
            integrationConfig={config}
            credentials={settings[config.id]}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};
