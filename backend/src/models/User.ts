// ─── User Roles ───

export enum UserRole {
  EMPLOYEE = "employee",
  MANAGER = "manager",
  FINANCE_ADMIN = "finance_admin",
}

// Permissions map by role (replaces the abstract class hierarchy)
export const RolePermissions: Record<UserRole, string[]> = {
  [UserRole.EMPLOYEE]: ["create_expense", "submit_expense", "view_own_expenses"],
  [UserRole.MANAGER]: ["approve_expense", "reject_expense", "view_team_expenses"],
  [UserRole.FINANCE_ADMIN]: ["approve_expense", "reject_expense", "mark_paid", "view_all_expenses"],
};
