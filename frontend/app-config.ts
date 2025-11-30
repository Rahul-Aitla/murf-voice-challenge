export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // for LiveKit Cloud Sandbox
  sandboxId?: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Zudio',
  pageTitle: 'Zudio Voice Shopping - AI Assistant',
  pageDescription: 'Shop with your voice at Zudio',

  supportsChatInput: true,
  supportsVideoInput: false,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/lk-logo.svg',
  accent: '#000000',
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#000000',
  startButtonText: 'START VOICE SHOPPING',

  // for LiveKit Cloud Sandbox
  sandboxId: undefined,
  agentName: undefined,
};
