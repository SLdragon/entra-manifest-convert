#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';

async function manifestToApplication(manifest) {
  const result = {
    id: manifest.id,
    appId: manifest.appId,
    disabledByMicrosoftStatus: manifest.disabledByMicrosoftStatus,
    displayName: manifest.name,
    description: manifest.description,
    groupMembershipClaims: manifest.groupMembershipClaims,
    identifierUris: manifest.identifierUris,
    isFallbackPublicClient: manifest.allowPublicClient,
    notes: manifest.notes,
    signInAudience: manifest.signInAudience,
    tags: manifest.tags,
    tokenEncryptionKeyId: manifest.tokenEncryptionKeyId,
    addIns: manifest.addIns,
    api: {
      acceptMappedClaims: manifest.acceptMappedClaims,
      knownClientApplications: manifest.knownClientApplications,
      requestedAccessTokenVersion: manifest.accessTokenAcceptedVersion,
      oauth2PermissionScopes: manifest.oauth2Permissions,
      preAuthorizedApplications: manifest.preAuthorizedApplications?.map((item) => {
        return { appId: item.appId, delegatedPermissionIds: item.permissionIds };
      }),
    },
    appRoles: manifest.appRoles,
    info: {
      marketingUrl: manifest.informationalUrls?.marketing,
      privacyStatementUrl: manifest.informationalUrls?.privacy,
      supportUrl: manifest.informationalUrls?.support,
      termsOfServiceUrl: manifest.informationalUrls?.termsOfService,
    },
    keyCredentials: manifest.keyCredentials?.map((item) => {
      return {
        customKeyIdentifier: item.customKeyIdentifier,
        displayName: item.displayName,
        endDateTime: item.endDate,
        key: item.value,
        keyId: item.keyId,
        startDateTime: item.startDate,
        type: item.type,
        usage: item.usage,
      };
    }),
    optionalClaims: manifest.optionalClaims,
    parentalControlSettings: manifest.parentalControlSettings,
    publicClient: {
      redirectUris: manifest.replyUrlsWithType
        ?.filter((item) => item.type === "InstalledClient")
        .map((item) => item.url),
    },
    requiredResourceAccess: manifest.requiredResourceAccess,
    web: {
      homePageUrl: manifest.signInUrl,
      logoutUrl: manifest.logoutUrl,
      redirectUris: manifest.replyUrlsWithType
        ?.filter((item) => item.type === "Web")
        .map((item) => item.url),
      implicitGrantSettings: {
        enableIdTokenIssuance: manifest.oauth2AllowIdTokenImplicitFlow,
        enableAccessTokenIssuance: manifest.oauth2AllowImplicitFlow,
      },
    },
    spa: {
      redirectUris: manifest.replyUrlsWithType
        ?.filter((item) => item.type === "Spa")
        .map((item) => item.url),
    },
  };

  return result;
}

async function convertManifest(manifestPath, outPath, spaces) {
  if (!(await fs.pathExists(manifestPath))) {
    console.error(`File not found: ${manifestPath}`);
    process.exit(1);
  }

  const manifest = await fs.readJson(manifestPath);
  const application = await manifestToApplication(manifest);
  await fs.writeJson(outPath, application, { spaces });
  console.log(`Successfully converted and saved: ${outPath}`);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error("Usage: convert <path-to-manifest> [--out <output-file>] [--spaces <number-of-spaces>]");
    process.exit(1);
  }
  const manifestPath = path.resolve(args[0]);
  let outPath = manifestPath;
  let spaces = 2;
  if (args.includes('--out')) {
    const outIndex = args.indexOf('--out');
    if (args[outIndex + 1]) {
      outPath = path.resolve(args[outIndex + 1]);
    }
  }
  if (args.includes('--spaces')) {
    const spacesIndex = args.indexOf('--spaces');
    if (args[spacesIndex + 1]) {
      spaces = parseInt(args[spacesIndex + 1], 10);
    }
  }
  await convertManifest(manifestPath, outPath, spaces);
})();
