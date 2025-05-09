import { createContext } from 'react';

const MainContext = createContext<MainContextValue>({
  userInfo: null,
  permissons: [],
  formats: [],
  channels: [],
});

export default MainContext;
