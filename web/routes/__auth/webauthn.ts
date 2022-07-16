import { WebAuthNType } from "@gs/webauthn"
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime"
import { json } from "@remix-run/server-runtime"
import {
  generateLoginChallenge,
  generateRegistrationChallenge,
  parseLoginRequest,
  parseRegisterRequest,
  verifyAuthenticatorAssertion,
} from "@webauthn/server"
import invariant from "tiny-invariant"

export const loader: LoaderFunction = async ({ request }) => {
  return null
}

declare global {
  var users1: Map<
    string,
    { key?: any; id: string; username: string; challenge: string }
  >
}

const users = global.users1 || (global.users1 = new Map())

export const action: ActionFunction = async ({ request }) => {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const body = await request.json()
  console.log({ users })

  switch (type) {
    case WebAuthNType.RequestRegister: {
      const { id, username } = body
      invariant(username, "username is required")

      const challengeResponse = generateRegistrationChallenge({
        relyingParty: { name: "ACME" },
        user: { id, name: username },
        authenticator: "platform",
      })

      const challenge = String(challengeResponse.challenge)
      users.set(challenge, {
        id,
        username,
        challenge,
      })

      return json(challengeResponse)
    }

    case WebAuthNType.Register: {
      const { key, challenge } = parseRegisterRequest(body)
      const user = users.get(challenge)
      if (!user) {
        return json({ error: "user not found" }, 400)
      }

      users.set(challenge, { ...user, key })

      return json({ loggedIn: true }, 200)
    }

    case WebAuthNType.Login: {
      const { username } = body
      const user = [...users.values()].find((u) => u.username === username)
      if (!user) {
        return json({ error: "user not found" }, 400)
      }

      const assertionChallenge = generateLoginChallenge(user.key)
      const challenge = String(assertionChallenge.challenge)

      users.delete(user.challenge)
      users.set(challenge, { ...user, challenge })

      return json(assertionChallenge)
    }

    case WebAuthNType.LoginChallenge: {
      const { challenge, keyId } = parseLoginRequest(body)
      if (!challenge) {
        return json({ error: "challenge could not be generated" }, 400)
      }
      const user = users.get(String(challenge))
      if (!user || !user.key || user.key.credID !== keyId) {
        return json({ error: "user not found" }, 400)
      }

      const loggedIn = verifyAuthenticatorAssertion(body, user.key)

      return json({ loggedIn }, 200)
    }
  }

  return json(null)
}

export function CatchBoundary() {}

// helpers
