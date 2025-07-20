import { AbilityBuilder, Ability } from "@casl/ability";

export function defineAbilityFor(user) {
  const { can, build } = new AbilityBuilder(Ability);

  if (!user || !user.isloggedIn) {
    return build();
  }

  if (user.role === "admin") {
    can("read", "Dashboard");
    can("read", "Order");
    can("manage", "Settings");
  } else if (user.role === "manager") {
    can("create", "Order");
    can("update", "Order");
    can("delete", "Order");
    can("send", "Order");
    can("read", "History");
    can("read", "ManagerDashboard");
    can("read", "FinalReview");
  } else if (user.role === "employee") {
    can("read", "History");
  }

  return build();
}
