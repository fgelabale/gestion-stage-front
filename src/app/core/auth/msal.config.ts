import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication,
} from '@azure/msal-browser';
import {
  MsalGuardConfiguration,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';

export const msalEnv = {
  clientId: 'TON_CLIENT_ID_FRONT',
  tenantId: 'TON_TENANT_ID',
  authority: 'https://login.microsoftonline.com/TON_TENANT_ID',
  redirectUri: 'http://localhost:4200/auth/callback',
  postLogoutRedirectUri: 'http://localhost:4200/login',
  apiBaseUrl: 'http://localhost:3000',
  apiScope: 'api://emica-api/access_as_user',
};

export function msalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: msalEnv.clientId,
      authority: msalEnv.authority,
      redirectUri: msalEnv.redirectUri,
      postLogoutRedirectUri: msalEnv.postLogoutRedirectUri,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
  });
}

export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['openid', 'profile', 'email', msalEnv.apiScope],
    },
  };
}

export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, string[]>();
  protectedResourceMap.set(msalEnv.apiBaseUrl, [msalEnv.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}