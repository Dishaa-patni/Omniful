export const rolePermission={
     admin: ["viewDashboard", "viewOrders", "manageUsers", "editSettings"],
  manager: ["viewDashboard", "createOrder", "finalReview"],
};

export const hasPermission=(role,permission)=>{
    return rolePermission[role]?.includes(permission)
}