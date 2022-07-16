declare module "@webauthn/server" {
  export function generateRegistrationChallenge(options: {
    relyingParty: { name: string }
    user: { id: string; name: string; displayName?: string }
    authenticator: "platform" | "cross-platform"
  }): PublicKeyCredentialCreationOptions

  export function parseRegisterRequest(body: any): {
    challenge: string
    key: string
  }

  export function generateLoginChallenge(key: string): {
    challenge: Buffer
    allowCredentials: {
      type: string
      id: any
      transports: string[]
    }[]
  }

  export function parseLoginRequest(body: any): {
    challenge: Buffer
    keyId: string
  }

  export function verifyAuthenticatorAssertion(body: any, key: string): boolean
}

declare module "@webauthn/client" {
  export function solveLoginChallenge(challenge: any): any
  export function solveRegistrationChallenge(challenge: any): any
}
