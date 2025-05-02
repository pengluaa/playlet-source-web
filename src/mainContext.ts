import { createContext } from 'react';

const MainContext = createContext<MainContextValue>({
  userInfo: null,
  permissons: [],
});

export default MainContext;
