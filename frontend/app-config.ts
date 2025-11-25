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
  companyName: 'upGrad',
  pageTitle: 'upGrad Voice Learning - AI Tutor',
  pageDescription: 'Learn programming through interactive voice conversations with AI',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/lk-logo.svg',
  accent: '#5B2E90', // upGrad Purple
  logoDark: '/lk-logo-dark.svg',
  accentDark: '#7B4EBF', // Lighter upGrad Purple for dark mode
  startButtonText: 'Start Learning',

  // for LiveKit Cloud Sandbox
  sandboxId: undefined,
  agentName: undefined,
};
