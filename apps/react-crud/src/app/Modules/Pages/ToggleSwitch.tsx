import { StackLayout, Switch } from '@salt-ds/core';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Comments from './Comments';
import Users from './Users';

interface SwitchProps {
  activeTab:string
}
const ToggleSwitch: React.FC<SwitchProps> = ({activeTab}) => {
  const [divider, setDivider] = useState(false);
//   const location = useLocation().pathname.split('/')
//   const pathName = location[1].split(' ').map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(' ')
//   console.log('location',pathName)
  // useEffect(() => {
  //     if(divider){
  //         navigate('/comments')
  //     } else {
  //         navigate('/users')
  //     }
  // },[divider])
  return (
    <div>
      <h2>{activeTab}</h2>
      <br></br>
      <StackLayout>
        <Switch
          label={!divider ? 'Users' : 'Comments'}
          checked={divider}
          onChange={(e) => setDivider(e.target.checked)}
        />
      </StackLayout>
      <br></br>
      {!divider ? <Users activeTab={''} /> : <Comments activeTab={''} />}
    </div>
  );
};
export default ToggleSwitch;
