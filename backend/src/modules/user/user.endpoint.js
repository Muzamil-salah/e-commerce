import { userRoles } from "../../middleware/auth.middleware.js"

export const endpoint={
    profile:[userRoles.user],
    updateProfile:[userRoles.user , userRoles.admin],
    deleteAccount:[userRoles.user],
    wishlistL:[userRoles.user],
    getOrders:[userRoles.admin]
}