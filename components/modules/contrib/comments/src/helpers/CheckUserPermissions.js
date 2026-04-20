import { useAccount } from "@vactorynext/core/hooks"

export const GetUserCommentPermissions = (roles) => {
	const { profile, isAuthenticated } = useAccount()
	if (roles === undefined) return {}
	if (!isAuthenticated) {
		return {
			post_comment: roles["anonymous"]["post_comment"],
			view_comments: roles["anonymous"]["view_comments"],
		}
	}
	let perm = {
		post_comment: false,
		view_comments: false,
	}
	profile?.user?.roles.forEach((role) => {
		perm["post_comment"] = roles[role]["post_comment"] ? true : perm["post_comment"]
		perm["view_comments"] = roles[role]["view_comments"] ? true : perm["view_comments"]
	})

	return perm
}
