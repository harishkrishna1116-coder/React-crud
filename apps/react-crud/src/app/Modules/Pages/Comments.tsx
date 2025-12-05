import React, { useMemo } from 'react';
import {type AgGridReactProps } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectionOptions,
  RowSelectedEvent,
} from 'ag-grid-community';
import { Scrim, Spinner } from '@salt-ds/core';
import { Comment, useGetCommentsQuery } from '../Slices/slice';
import AgGrid from '../Components/AgGrid';
import { useAgGridHelpers } from '../Hooks/AgGridStyle';
ModuleRegistry.registerModules([AllCommunityModule]);

interface CommentsProps extends AgGridReactProps {
  activeTab: string;
}

const Comments: React.FC<CommentsProps> = ({ activeTab, ...gridProps }) => {
  const { agGridProps, containerProps } = useAgGridHelpers();
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
      <p className="text-center mt-10 text-red-500">Error fetching Comments</p>
    );
  return (
    <div {...containerProps}>
      {/* <h1 className="text-10xl font-bold mb-7">{pathName}</h1> */}
      <AgGrid<Comment>
        {...agGridProps}
        {...gridProps}
        theme="legacy"
        rowData={comments ?? []}
        columnDefs={columns}
        defaultColDef={defaultColDef}
        rowSelection={rowSelection}
        pagination={true}
        onRowSelected={(e) => getSelectedRowNodes(e)}
        paginationPageSizeSelector={[10, 25, 50, 100]}
      />
    </div>
  );
};
export default Comments;
