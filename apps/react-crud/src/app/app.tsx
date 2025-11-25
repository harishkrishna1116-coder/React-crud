import React, { act, ComponentType, lazy, Suspense, useState } from 'react';
import NxWelcome from './nx-welcome';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, StackLayout } from '@salt-ds/core';
import {
  TabBar,
  TabListNext,
  TabNext,
  TabNextTrigger,
  TabsNext,
} from '@salt-ds/lab';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import {
  AddToGridIcon,
  BooleanIcon,
  CommentaryIcon,
  SignpostIcon,
  UserIcon,
} from '@salt-ds/icons';

const Users = lazy(() => import('./Modules/Pages/Users'));
const Comments = lazy(() => import('./Modules/Pages/Comments'));
const Posts = lazy(() => import('./Modules/Pages/Posts'));
const ToggleSwitch = lazy(() => import('./Modules/Pages/ToggleSwitch'));
const GridSelection = lazy(() => import('./Modules/Pages/GridSelection'));

const tabToIcon: Record<string, ComponentType> = {
  Users: UserIcon,
  Comments: CommentaryIcon,
  Posts: SignpostIcon,
  Switch: BooleanIcon,
  GridSelection: AddToGridIcon,
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const tabs = [
    { label: 'Users', path: '/users' },
    { label: 'Comments', path: '/comments' },
    { label: 'Posts', path: '/posts' },
    { label: 'Switch', path: '/switch' },
    { label: 'GridSelection', path: '/gridselection' },
  ];

  const loaction = useLocation();
  const activeTab =
    tabs.find((t) => loaction.pathname.startsWith(t.path))?.label || 'Users';

  const handleValue = (_: unknown, newValue: string) => {
    const tab = tabs.find((t) => t.label === newValue);
    if (tab) navigate(tab.path);
  };

  // const renderPage = () => {
  //     switch (activeTab) {
  //       case 'Users':
  //         return <Users/>
  //       case 'Comments' :
  //         return <Comments/>
  //         case 'Switch' :
  //           return <ToggleSwitch/>
  //       default:
  //        return null;
  //     }
  // }

  return (
    <div className="text-black dark:text-white">
      <StackLayout>
        <div
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <TabsNext value={activeTab} onChange={handleValue}>
            <TabBar>
              <TabListNext appearance="bordered" activeColor="secondary">
                {tabs.map(({ label }, index) => {
                  const Icon = tabToIcon[label];
                  return (
                    <TabNext
                      value={label}
                      key={index}
                      className="text-2xl  mb-3"
                    >
                      <TabNextTrigger>
                        <Icon />
                        {label}
                      </TabNextTrigger>
                    </TabNext>
                  );
                })}
              </TabListNext>
            </TabBar>
          </TabsNext>
        </div>
      </StackLayout>

      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="*" element={<Users activeTab={activeTab} />} />
          <Route path="/users" element={<Users activeTab={activeTab} />} />
          <Route
            path="/comments"
            element={<Comments activeTab={activeTab} />}
          />
          <Route path="posts" element={<Posts activeTab={activeTab} />} />
          <Route
            path="/switch"
            element={<ToggleSwitch activeTab={activeTab} />}
          />
          <Route path="/gridselection" element={<GridSelection />} />
        </Routes>
      </Suspense>
      {/* END: routes */}
    </div>
  );
};

export default App;
