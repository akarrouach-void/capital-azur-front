import { SYSTEM_ROUTES, query } from "@vactorynext/core/lib"

import NextAuth from "next-auth"
import { deserialise } from "kitsu-core"
import CredentialsProvider from "next-auth/providers/credentials"
import KeycloakProvider from "next-auth/providers/keycloak"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { jwtDecode } from "jwt-decode"
import { drupal } from "@vactorynext/core/drupal"
import { redis } from "@vactorynext/core/server"
import Redlock from "redlock"
import * as UrlParser from "url"
import { normalizeUser } from "@/account"

let redlock
if (!process.env.IS_DOCKER_BUILD) {
	redlock = new Redlock([redis], {
		driftFactor: 0.01,
		retryCount: 10,
		retryDelay: 200,
		retryJitter: 200,
		automaticExtensionThreshold: 500,
	})
}

const getDrupalUserinfoByProvider = async (token, provider) => {
	return drupal.fetch(`oauth/userinfo`, {
		method: "get",
		headers: {
			Accept: "application/vnd.api+json",
			"Content-Type": "application/vnd.api+json",
			"x-auth-provider": provider,
			Authorization: "Bearer " + token,
		},
	})
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessTokenForDrupal(token) {
	const formData = new URLSearchParams()
	formData.append("grant_type", "refresh_token")
	formData.append("client_id", process.env.OAUTH_CLIENT_ID)
	formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
	formData.append("refresh_token", token.refreshToken)

	// Get access token from Drupal.
	const response = await drupal.fetch(`oauth/token`, {
		method: "POST",
		body: formData,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
	})

	if (!response.ok) {
		return {
			...token,
			error: "RefreshAccessTokenError",
		}
	}

	const refreshedTokens = await response.json()

	const decoded = jwtDecode(refreshedTokens.access_token)

	return {
		...token,
		profile: decoded.profile,
		accessToken: refreshedTokens.access_token,
		accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
		refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
	}
}

async function refreshAccessTokenForFacebook(token) {
	try {
		const url =
			"https://graph.facebook.com/oauth/access_token?" +
			new URLSearchParams({
				client_id: process.env.FACEBOOK_CLIENT_ID,
				client_secret: process.env.FACEBOOK_CLIENT_SECRET,
				grant_type: "fb_exchange_token",
				fb_exchange_token: token.accessToken,
			})

		const response = await drupal.fetch(url, { absoluteUrl: true })

		const refreshedTokens = await response.json()

		if (!response.ok) {
			throw refreshedTokens
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			expires_in: refreshedTokens.expires_in,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		}
	} catch (error) {
		console.error(error)

		return {
			...token,
			error: "RefreshAccessTokenError",
		}
	}
}

async function refreshAccessTokenForKeycloak(token) {
	try {
		const url = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token?`

		const response = await drupal.fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: process.env.KEYCLOAK_ID,
				client_secret: process.env.KEYCLOAK_SECRET,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
			}),
			method: "POST",
			absoluteUrl: true,
		})

		const refreshedTokens = await response.json()

		if (!response.ok) {
			throw refreshedTokens
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			expires_in: refreshedTokens.expires_in,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		}
	} catch (error) {
		console.error(error)

		return {
			...token,
			error: "RefreshAccessTokenError",
		}
	}
}

async function refreshAccessTokenForGoogle(token) {
	//console.log("===+======== refreshAccessTokenForGoogle +============", token)

	try {
		const url =
			"https://oauth2.googleapis.com/token?" +
			new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				grant_type: "refresh_token",
				refresh_token: token.refreshToken,
			})

		const response = await drupal.fetch(url, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			method: "POST",
			absoluteUrl: true,
		})

		const refreshedTokens = await response.json()

		if (!response.ok) {
			throw refreshedTokens
		}

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			expires_in: refreshedTokens.expires_in,
			accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		}
	} catch (error) {
		console.error(error)

		return {
			...token,
			error: "RefreshAccessTokenError",
		}
	}
}

async function getProfileByUser(uuid, token, provider) {
	const jsonParams = query(params)
	const response = await drupal.fetch(`api/user/user/${uuid}?${jsonParams}`, {
		method: "get",
		headers: {
			Accept: "application/vnd.api+json",
			"Content-Type": "application/vnd.api+json",
			"x-auth-provider": provider,
			Authorization: "Bearer " + token,
		},
	})
	let jsonApiData = {}
	if (response?.ok) {
		const data = await response.json()
		jsonApiData = deserialise(data)?.data
		jsonApiData = normalizeUser(jsonApiData)
	}
	return jsonApiData
}

export default async function handler(req, res) {
	let lang = "fr"
	// dangerous stuff > see nextjs request-meta.ts
	// this is a temporary solution to allow us to pass data between bundled modules
	// we use lang code to force all call to drupal oauth to be localized
	// if we don't we can't know which jwt claim issuer to use
	// we're trying to not require project-config since it's breaking standalone build.
	try {
		const meta = req[Symbol.for("NextInternalRequestMeta")]
		lang = meta.match.detectedLocale
	} catch (e) {
		console.error(e)
	}

	return NextAuth(req, res, {
		pages: {
			signIn: SYSTEM_ROUTES.account_login.path,
			// signOut: "/auth/signout",
			// error: "/auth/error", // Error code passed in query string as ?error=
			// verifyRequest: "/auth/verify-request", // (used for check email message)
			// newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
		},
		providers: [
			CredentialsProvider({
				name: "Credentials",
				credentials: {
					username: { label: "Username", type: "text", placeholder: "Username" },
					password: { label: "Password", type: "password" },
				},
				async authorize(credentials) {
					const formData = new URLSearchParams()
					formData.append("grant_type", "password")
					formData.append("client_id", process.env.OAUTH_CLIENT_ID)
					formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
					formData.append("username", credentials.username)
					formData.append("password", credentials.password)
					formData.append("g-recaptcha-response", credentials?.captcha)

					// Get access token from Drupal.
					const response = await drupal.fetch(`oauth/login-token`, {
						method: "POST",
						body: formData,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					})

					const data = await response.json()
					if (response.ok && data?.access_token) {
						const decoded = jwtDecode(data.access_token)
						data.profile = decoded.profile

						// Blocked user.
						if (data?.profile?.isBlocked && data?.profile?.isBlocked === true) {
							return null
						}
						// Success.
						return data
					}
					// Errors.
					return data
				},
			}),
			CredentialsProvider({
				id: "otp",
				name: "OTP",
				credentials: {
					uid: { label: "Uid", type: "text" },
					otp: { label: "Otp", type: "text" },
				},
				async authorize(credentials) {
					// Check otp from drupal.
					const validate = await drupal.fetch(`api/otp/validate`, {
						method: "POST",
						body: JSON.stringify({
							uid: credentials.uid,
							otp: credentials.otp,
						}),
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					})

					const validated = await validate.json()

					if (validate.ok) {
						const formData = new URLSearchParams()
						formData.append("client_id", process.env.OAUTH_CLIENT_ID)
						formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
						formData.append("uid", credentials?.uid)
						formData.append("timestamp", validated?.timestamp)
						formData.append("hash", validated?.hash)

						// Get access token from Drupal.
						const res = await drupal.fetch(`oauth/one-time-token`, {
							method: "POST",
							body: formData,
							headers: {
								"Content-Type": "application/x-www-form-urlencoded",
							},
						})

						const data = await res.json()
						if (res.ok && data?.access_token) {
							const decoded = jwtDecode(data.access_token)
							data.profile = decoded.profile
							return data
						}

						return null
					} else {
						return null
					}
				},
			}),
			CredentialsProvider({
				id: "one-time-login",
				name: "One-time-login",
				credentials: {
					uid: { label: "Uid", type: "text" },
					timestamp: { label: "Timestamp", type: "text" },
					hash: { label: "Hash", type: "text" },
				},
				async authorize(credentials) {
					const formData = new URLSearchParams()
					formData.append("client_id", process.env.OAUTH_CLIENT_ID)
					formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
					formData.append("uid", credentials.uid)
					formData.append("timestamp", credentials.timestamp)
					formData.append("hash", credentials.hash)

					// Get access token from Drupal.
					const response = await drupal.fetch(`/oauth/one-time-token`, {
						method: "POST",
						body: formData,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					})

					const data = await response.json()
					if (response.ok && data?.access_token) {
						const decoded = jwtDecode(data.access_token)
						data.profile = decoded.profile
						return data
					}

					return null
				},
			}),
			{
				id: "drupal",
				name: "Drupal",
				type: "oauth",
				idToken: true,
				issuer: `${process.env.DRUPAL_BASE_URL}/${lang}`,
				clientId: process.env.OAUTH_CLIENT_ID,
				clientSecret: process.env.OAUTH_CLIENT_SECRET,
				authorization: `${process.env.DRUPAL_BASE_URL}/${lang}/oauth/authorize`,
				token: `${process.env.DRUPAL_BASE_URL}/${lang}/oauth/token`,
				jwks_endpoint: `${process.env.DRUPAL_BASE_URL}/${lang}/oauth/jwks`,
				profile(profile) {
					return {
						id: profile.sub,
						name: profile.full_name,
						email: profile.email,
					}
				},
				userinfo: {
					url: `${process.env.DRUPAL_BASE_URL}/${lang}/oauth/userinfo`,
					async request(ctx) {
						let data = {}
						try {
							const response = await drupal.fetch(`${lang}/oauth/userinfo`, {
								method: "get",
								headers: {
									Accept: "application/vnd.api+json",
									"Content-Type": "application/vnd.api+json",
									Authorization: "Bearer " + ctx.tokens.access_token,
								},
							})
							data = await response.json()
						} catch (err) {
							console.error(err)
						}
						return data
					},
				},
			},
			KeycloakProvider({
				clientId: process.env.KEYCLOAK_ID,
				clientSecret: process.env.KEYCLOAK_SECRET,
				issuer: process.env.KEYCLOAK_ISSUER,
				userinfo: {
					url: `${process.env.DRUPAL_BASE_URL}/oauth/userinfo`,
					async request(ctx) {
						let data = {}
						try {
							const response = await getDrupalUserinfoByProvider(
								ctx.tokens.access_token,
								ctx.provider.id
							)
							data = await response.json()
						} catch (err) {
							console.error(err)
						}
						return data
					},
				},
			}),
			FacebookProvider({
				clientId: process.env.FACEBOOK_CLIENT_ID,
				clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
				userinfo: {
					url: `${process.env.DRUPAL_BASE_URL}/oauth/userinfo`,
					async request(ctx) {
						let data = {}
						try {
							const response = await getDrupalUserinfoByProvider(
								ctx.tokens.access_token,
								ctx.provider.id
							)
							data = await response.json()
						} catch (err) {
							console.error(err)
						}

						return data
					},
				},
				profile(profile) {
					return profile
				},
			}),
			GoogleProvider({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				authorization: {
					params: {
						prompt: "consent",
						access_type: "offline",
						response_type: "code",
					},
				},
				userinfo: {
					url: `${process.env.DRUPAL_BASE_URL}/oauth/userinfo`,
					async request(ctx) {
						// console.log(ctx)
						let data = {}
						try {
							const response = await getDrupalUserinfoByProvider(
								ctx.tokens.access_token,
								ctx.provider.id
							)
							data = await response.json()
						} catch (err) {
							console.error(err)
						}
						return data
					},
				},
			}),
			CredentialsProvider({
				id: "apikey",
				name: "Api key",
				credentials: {
					apikey: { label: "Api key", type: "text" },
				},
				async authorize(credentials) {
					const formData = new URLSearchParams()
					formData.append("grant_type", "apikey")
					formData.append("client_id", process.env.OAUTH_CLIENT_ID)
					formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
					formData.append("apikey", credentials.apikey)

					// Get access token from Drupal.
					const response = await drupal.fetch(`oauth/login-token`, {
						method: "POST",
						body: formData,
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
					})

					const data = await response.json()

					if (response.ok && data?.access_token) {
						const decoded = jwtDecode(data.access_token)
						data.profile = decoded.profile

						// Blocked user.
						if (data?.profile?.isBlocked && data?.profile?.isBlocked === true) {
							return null
						}

						return data
					}

					return data
				},
			}),
		],
		jwt: {
			signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
			encryption: true,
		},
		session: {
			jwt: true,
			maxAge: 30 * 24 * 60 * 60,
		},
		callbacks: {
			async jwt({ token, user, account, profile }) {
				// Initial login.
				if (user && account) {
					if (
						["credentials", "one-time-login", "otp", "apikey"].includes(account.provider)
					) {
						// console.log("user", user)
						// console.log("====== account =====", account)
						const jwtToken = {
							accessToken: user.access_token,
							refreshToken: user.refresh_token,
							accessTokenExpires: Date.now() + user.expires_in * 1000,
							provider: account.provider,
							profile: user.profile,
							expires_in: user.expires_in,
						}
						await redis.set(`token:${user.profile.id}`, JSON.stringify(jwtToken))
						return jwtToken
					} else {
						// console.log("==== token ====", token)
						// console.log("user", user)
						// console.log("====== account =====", account)
						// console.log("profile", profile)
						const jwtToken = {
							accessToken: account.access_token,
							refreshToken: account.refresh_token,
							accessTokenExpires:
								account.provider === "drupal"
									? Date.now() + account.expires_at * 1000
									: account.expires_at,
							provider: account.provider,
							profile: profile,
							expires_in: account.expires_at,
						}

						// console.log("jwtToken", jwtToken)
						await redis.set(`token:${profile.id}`, JSON.stringify(jwtToken))
						return jwtToken
					}
				}

				// NB: we can update the session with this callback.
				// call /api/auth/session?update and that will invoke a reload of the user data from drupal.
				const forceUpdate = UrlParser.parse(req.url, true).query.update !== undefined

				// Return previous token if the access token has not expired yet.
				if (
					token.provider === "credentials" &&
					Date.now() < token.accessTokenExpires - 300 &&
					!forceUpdate
				) {
					// console.log("======= DDRUPAL TOKEN ===== ", token)
					return token
				}

				if (
					token.provider !== "credentials" &&
					Date.now() < token.accessTokenExpires &&
					!forceUpdate
				) {
					//console.log("======= Token Already 1 ===== ", token)
					return token
				}

				// console.log("======== token.expires_in", token.expires_in)

				return await redlock.using([token.profile.id, "jwt-refresh"], 5000, async () => {
					const redisToken = await redis.get(`token:${token.profile.id}`)

					// redisToken can be null, this can happen if redis restarted.
					// we fallback to user token.
					let currentToken
					if (redisToken) {
						currentToken = JSON.parse(redisToken)
					} else {
						currentToken = token
					}

					// This can happen when the there are multiple requests
					// and the first request already refreshed the tokens
					// so the consecutive requests already have access to the updated tokens
					if (
						currentToken.provider === "credentials" &&
						Date.now() < currentToken.accessTokenExpires - 300 &&
						!forceUpdate
					) {
						return currentToken
					}

					if (
						currentToken.provider !== "credentials" &&
						Date.now() < currentToken.accessTokenExpires &&
						!forceUpdate
					) {
						console.log("======= Token Already 2 ===== ", token)
						return currentToken
					}

					let newToken
					if (
						currentToken.provider === "credentials" ||
						currentToken.provider === "drupal"
					) {
						newToken = await refreshAccessTokenForDrupal(currentToken)
					} else if (currentToken.provider === "google") {
						newToken = await refreshAccessTokenForGoogle(currentToken)
					} else if (currentToken.provider === "facebook") {
						newToken = await refreshAccessTokenForFacebook(currentToken)
					} else if (currentToken.provider === "keycloak") {
						newToken = await refreshAccessTokenForKeycloak(currentToken)
					}

					// const newToken = await refreshAccessTokenForDrupal(currentToken)
					// Save new jwt token object to redis for the next requests
					await redis.set(`token:${token.profile.id}`, JSON.stringify(newToken))
					return newToken
				})

				// token.provider === "one-time-login" || token.provider === "credentials"

				// Refresh access token on expire.
				// return await redlock.using(
				// 	[token.profile, "jwt-refresh"],
				// 	token.expires_in * 1000,
				// 	async () => {
				// 		console.log("lock & refresh")
				// 		const redisToken = await redis.get(token.refreshToken)
				// 		const oldToken = redisToken ? await JSON.parse(redisToken) : token
				// 		const newToken = await refreshAccessTokenForDrupal(oldToken)
				// 		await redis.set(
				// 			token.refreshToken,
				// 			await JSON.stringify(newToken),
				// 			"ex",
				// 			token.expires_in + 10
				// 		)
				// 		return newToken
				// 	}
				// )
			},
			async session({ session, token }) {
				let userInfos = {}
				if (token?.error) return null
				if (token?.accessToken) {
					// console.log("======= TTTTTTT ===", token.provider)
					if (token.provider === "credentials") {
						session.accessToken = token.accessToken
						session.error = token.error

						// Decode token and pass info to session.
						// This data will be available client-side.
						const decoded = jwtDecode(token.accessToken)
						session.user.id = decoded.id
						session.user.email = decoded.email
						session.user.username = decoded.username
					} else {
						session.accessToken = token.accessToken
						session.error = token.error

						// Decode token and pass info to session.
						// This data will be available client-side.
						// const decoded = jwt_decode(token.accessToken)
						session.user.id = token.profile.id
						session.user.email = token.profile.email
						session.user.username = token.profile.username
						// console.log("===== token ===== jwt_decode", token)
						// console.log("===== SESSION ===== jwt_decode", session)
					}
					try {
						userInfos = await getProfileByUser(
							token?.profile?.uuid,
							token?.accessToken,
							token?.provider
						)
					} catch (err) {
						console.error(err)
					}
				}

				if (token?.profile) {
					session.user = { ...session.user, ...token.profile, ...userInfos }
				}

				if (token?.provider) {
					session.provider = token.provider
				}
				return session
			},
			async signIn({ user }) {
				if (user?.error) {
					throw new Error(user.message)
				}
				return true
			},
		},
		events: {
			signOut: async (message) => {
				const formData = new URLSearchParams()
				formData.append("client_id", process.env.OAUTH_CLIENT_ID)
				formData.append("client_secret", process.env.OAUTH_CLIENT_SECRET)
				formData.append("token", message?.token?.accessToken)
			},
		},
	})
}

export const params = {
	fields: {
		"user--user": "field_first_name,field_last_name,field_telephone",
	},
	// include: "field_vactory_media,field_vactory_media.thumbnail",
}
