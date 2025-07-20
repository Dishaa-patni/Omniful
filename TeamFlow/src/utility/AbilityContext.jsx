import React, { createContext, useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { defineAbilityFor } from "./defineAbility";

const AbilityContext = createContext();

export const useAbility = () => {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error("useAbility must be used within an AbilityProvider");
  }
  return context;
};

export const AbilityProvider = ({ children }) => {
  const user = useSelector((state) => state.users);

  const ability = useMemo(() => {
    return defineAbilityFor(user);
  }, [user]); // in app.jsx there are many components and it will be rendered every time , so we used useMemo to memoize it

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};
