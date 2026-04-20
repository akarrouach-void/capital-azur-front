import { SYSTEM_ROUTES } from "@vactorynext/core/lib"
import { drupal } from "@vactorynext/core/drupal"

export function redirectToLogin(context) {
	const { locale } = context
	return {
		redirect: {
			destination: `/${locale}${SYSTEM_ROUTES.account_login.path}`,
			permanent: false,
		},
	}
}

export function redirectToHomePage(context) {
	const { locale } = context
	return {
		redirect: {
			destination: `/${locale}`,
			permanent: false,
		},
	}
}

export function redirectToLostPassword(context) {
	const { locale } = context
	return {
		redirect: {
			destination: `/${locale}${SYSTEM_ROUTES.account_lost_password.path}`,
			permanent: false,
		},
	}
}

export function redirectToAccountProfile(context) {
	const { locale } = context
	return {
		redirect: {
			destination: `/${locale}${SYSTEM_ROUTES.account.path}`,
			permanent: false,
		},
	}
}

export async function checkOneTimeToken(uid, context) {
	const { locale } = context
	const response = await drupal.fetch(
		`${locale}/oauth/one-time-token-check?uid=${uid}&timestamp=${context?.query?.timestamp}&hash=${context?.query?.hash}`
	)
	return await response.json()
}
