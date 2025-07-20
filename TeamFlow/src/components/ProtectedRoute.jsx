import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useAbility } from "../utility/AbilityContext.jsx";

const ProtectedRoute = ({ children, resource, action }) => {
  const user = useSelector((state) => state.users);
  const ability = useAbility();

  
  if (!user.isloggedIn) {
    return <Navigate to="/login" replace />;
  }

 
  if (resource && action && !ability.can(action, resource)) {
   
    if (user.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user.role === "manager") {
      return <Navigate to="/manager-dashboard" replace />;
    } else {
     
      return <Navigate to="/history" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 
