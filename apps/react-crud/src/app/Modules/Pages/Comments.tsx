import React, { useMemo } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectionOptions,
  RowSelectedEvent,
} from 'ag-grid-community';
import {  Scrim, Spinner } from '@salt-ds/core';
import { Comment, useGetCommentsQuery } from '../Slices/slice';
ModuleRegistry.registerModules([AllCommunityModule]);

interface CommentsProps{
  activeTab:string
}

const Comments: React.FC<CommentsProps> = ({activeTab}) => {
  const { data: comments, error, isLoading } = useGetCommentsQuery();
  const params = window.location.pathname.split('/');
  const pathName = params[1]
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');
  const columns: ColDef<Comment>[] = [
    { headerName: 'PostId', field: 'postId' },
    { headerName: 'Id', field: 'id' },
    { headerName: 'Name', field: 'name', flex: 2, editable: true },
    { headerName: 'Email', field: 'email', flex: 2 },
  ];

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: true,
  };

  const getSelectedRowNodes = (e: RowSelectedEvent<Comment, any>) => {
    if (e.node.isSelected()) {
      console.log('Currently Selected', e.data);
    }
  };


  if (isLoading)
    return (
      <Scrim>
        <Spinner size="medium"></Spinner>
      </Scrim>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Error fetching users</p>
    );
  return (
    <div>
      <h1 className="text-10xl font-bold mb-7">{pathName}</h1>
      {/* <Button variant="primary" className="mb-4" onClick={() => navigate('/')}>
        Click to go home page
      </Button> */}
      <br></br>
      <div className="ag-theme-salt-variant-zebra"  style={{ height: 400, width: 1100 }}>
        <AgGridReact<Comment>
          rowData={comments ?? []}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          pagination={true}
          onRowSelected={(e) => getSelectedRowNodes(e)}
          paginationPageSizeSelector={[10, 25, 50, 100]}
        />
      </div>
    </div>
  );
};
export default Comments;
