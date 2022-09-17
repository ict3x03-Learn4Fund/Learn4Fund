import {useState, createContext, useContext } from 'react'

const NavContext = createContext(null);

export function useNav() {
  return useContext(NavContext)
}

export function NavProvider({ children }) {
    const [tab, setTab] = useState('');
    
  

  return (<NavContext.Provider value={{tab, setTab}}>{children}</NavContext.Provider>);
}
