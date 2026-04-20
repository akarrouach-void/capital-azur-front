import get from "lodash.get"

export const normalizeUser = (user) => {
	return {
		first_name: get(user, "field_first_name", null),
		last_name: get(user, "field_last_name", null),
		phone: get(user, "field_telephone", null),
	}
}
