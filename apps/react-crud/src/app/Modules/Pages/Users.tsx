import React, { ElementType, JSX, ReactElement, useEffect, useMemo, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import {
  ColDef,
  ModuleRegistry,
  AllCommunityModule,
  RowSelectedEvent,
  RowSelectionOptions,
  ICellRendererParams,
} from 'ag-grid-community';
import { useGetUsersQuery, User, useUpdateUsersMutation } from '../Slices/slice';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  FlowLayout,
  FormField,
  FormFieldLabel,
  GridLayout,
  Input,
  Scrim,
  Spinner,
  SplitLayout,
  StackLayout,
  StackLayoutProps,
  useResponsiveProp,
} from '@salt-ds/core';
import { useNavigate, useParams } from 'react-router-dom';
import { CloneIcon, CloseIcon, ErrorIcon, SuccessCircleIcon } from '@salt-ds/icons';
import { ToastMessage } from '../Components/Toast';
import { useAgGridHelpers } from '../Hooks/AgGridStyle';
ModuleRegistry.registerModules([AllCommunityModule]);

interface UsersProps{
  activeTab:string
}

const Users: React.FC<UsersProps> = ({activeTab}) => {
  const { data: users, error, isLoading,refetch } = useGetUsersQuery();
  const [updateUser, { isLoading: isUpdating, error: fetchError, isSuccess }] =
    useUpdateUsersMutation();
  const [selectedData, setSelectedData] = useState<User | undefined>();
  const [editableData, setEditableData] = useState<
    { key: string; value: any }[]
  >([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ [key: string]: any }>(
    {}
  );
  const [toast,setToast] = useState<JSX.Element| null>(null)
  const unWantedKeys = ['address', 'company'];
  const data = selectedData
    ? Object.entries(selectedData)
        .map(([key, value]) => ({ key, value }))
        .filter(({ key }) => !unWantedKeys.includes(key))
    : [];

    const{agGridProps,containerProps} = useAgGridHelpers()

  useEffect(() => {
    if (selectedData) {
      setEditableData(data);
    }
    console.log('selectedData', editableData);
  }, [selectedData]);

  useEffect(() => {
    console.log('submittedData', submittedData);
  }, [submittedData]);

  const params = window.location.pathname.split('/');

  const pathName = params[1]
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');

  const navigate = useNavigate();

  // const customComponent = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   return <Button onClick={() => selectedRowNodes(e)}>Edit</Button>;
  // };

  const editButtonRenderer = (e: ICellRendererParams<User>) => {
    const handleEditClick = () => {
      setDialogOpen(true);
      setSelectedData(e.data);
    };
    return <Button onClick={handleEditClick}>Edit</Button>;
  };
  const columns: ColDef<User>[] = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'UserName', field: 'username' },
    { headerName: 'Email', field: 'email' },
    {
      headerName: 'Actions',
      field: 'button',
      cellRenderer: editButtonRenderer,
    },
  ];
  console.log('users', users);

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
  };

  const handleInputChange = (key: string, newValue: string) => {
    setEditableData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  const handleSubmit = async () => {
    const dataToStore = Object.fromEntries(
      editableData.map(({ key, value }) => [key, value])
    );
    console.log('dataToStore',dataToStore)
    try {
      await updateUser(dataToStore).unwrap();
      setDialogOpen(false);
      setToast(<ToastMessage
               status="success"
               headText="Updated Successfully"
               content="Post was Updated Successfully"
               icon={<SuccessCircleIcon aria-label='success'/>}
               handleClose={() => setToast(null)}
             />)
      refetch()
    } catch (err) {
         console.error('err', err);
        setToast(
              <ToastMessage
                status="error"
                headText="Failed"
                content="Failed to Update"
                icon={<ErrorIcon aria-label='error'/>}
                handleClose={() => setToast(null)}
              />
            );
      refetch()
    }
    // setSubmittedData(dataToStore);
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedData(undefined);
  };
  const closeButton = (
    <Button
      aria-label="close Dialog"
      appearance="transparent"
      onClick={handleClose}
    >
      <CloseIcon aria-hidden />
    </Button>
  );

  if (isLoading || isUpdating)
    return (
      <Scrim open={isLoading || isUpdating}>
        <Spinner size="medium"></Spinner>
      </Scrim>
    );
  if (error || fetchError)
    return (
      <p className="text-center mt-10 text-red-500">Error fetching users</p>
    );

  const direction: StackLayoutProps<ElementType>['direction'] =
    useResponsiveProp(
      {
        xs: 'column',
        sm: 'row',
      },
      'row'
    );

  const cancel = (
    <Button sentiment="accented" appearance="bordered" onClick={handleClose}>
      Cancel
    </Button>
  );

  const accept = (
    <Button sentiment="accented" onClick={handleSubmit}>
      Accept
    </Button>
  );

  const endItem = (
    <StackLayout direction={{ xs: 'column', sm: 'row' }} gap={1}>
      {cancel}
      {accept}
    </StackLayout>
  );
  return (
    <div{...containerProps} className="text-2xl font-bold mb-4">
      <h1 className="text-4md font-bold mb-4">{activeTab}</h1>
      {/* <Button variant="primary" className="mb-4" onClick={() => navigate('/')}>Back to Home page</Button> */}
      <div className="ag-theme-alpine" style={{ height: 400, width: 1100 }}>
        <AgGridReact<User>
          {...agGridProps}
          rowData={users ?? []}
          columnDefs={columns}
          defaultColDef={defaultColDef}
          // rowSelection={rowSelection}
          animateRows={true}
          domLayout="autoHeight"
          pagination={true}
          // onRowSelected={(e) => selectedRowNodes(e)}
          paginationPageSizeSelector={[5, 10]}
        />
        {dialogOpen && (
          <Dialog open={dialogOpen} size="large">
            <DialogHeader header="Edit Item" actions={closeButton} />
            <DialogContent>
              <FlowLayout>
                {editableData.map(({ key, value }) => {
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <StackLayout gap={1} direction={'row'}>
                      <FormField>
                        <FormFieldLabel>{label}</FormFieldLabel>
                        <Input
                          value={value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleInputChange(key, e.target.value)
                          }
                        />
                      </FormField>
                    </StackLayout>
                  );
                })}
              </FlowLayout>
              <DialogActions>
                {direction === 'column' ? (
                  <StackLayout
                    gap={1}
                    style={{
                      width: '100%',
                    }}
                  >
                    {accept}
                    {cancel}
                    {''}
                  </StackLayout>
                ) : (
                  <SplitLayout
                    direction={'row'}
                    startItem={''}
                    endItem={endItem}
                    style={{
                      width: '100%',
                    }}
                  />
                )}
              </DialogActions>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
export default Users;
