import { AgGridReact } from 'ag-grid-react';
import {
  AgGridReact as AgGridReactType,
  type AgGridReactProps,
} from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { themeAlpine, themeQuartz } from 'ag-grid-community';
import {
  Post,
  useAddPostsMutation,
  useDeletePostsMutation,
  useGetPostsQuery,
  useUpdateMultiplePostsMutation,
  useUpdatePostsMutation,
} from '../Slices/slice';
import {
  AllCommunityModule,
  ColDef,
  ICellRendererParams,
  ModuleRegistry,
  RowSelectedEvent,
  RowSelectionOptions,
} from 'ag-grid-community';
import React, {
  useEffect,
  useMemo,
  useState,
  FC,
  ElementType,
  JSX,
  useRef,
  useCallback,
} from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  FlowLayout,
  FormField,
  FormFieldLabel,
  Input,
  Scrim,
  Spinner,
  SplitLayout,
  StackLayout,
  StackLayoutProps,
  Toast,
  Text,
  ToastContent,
  useResponsiveProp,
  MultilineInput,
  useId,
} from '@salt-ds/core';
import {
  AddIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  ErrorIcon,
  SuccessCircleIcon,
} from '@salt-ds/icons';
import { ToastMessage } from '../Components/Toast';
import { ToastGroup } from '@salt-ds/lab';
import { useAgGridHelpers } from '../Hooks/AgGridStyle';
import DialogBox from '../Components/DialogBox';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
ModuleRegistry.registerModules([AllCommunityModule]);

interface Postsprops extends AgGridReactProps{
  activeTab:string
}

const addData = [
  [
    { key: 'title', value: '' },
    { key: 'body', value: '' },
  ],
];
function Posts({activeTab,...gridProps}:Postsprops) {
  const { data: posts, error, isLoading, refetch } = useGetPostsQuery();
  const [updatePosts, { error: fetchError, isLoading: isUpdating, isSuccess }] =
    useUpdatePostsMutation();
  const [updateMultiplePosts] = useUpdateMultiplePostsMutation();
  const [addPosts] = useAddPostsMutation();
  const [deletePosts] = useDeletePostsMutation();
  const [selectedData, setSelectedData] = useState<Post | undefined>();
  const [multipleData, setMultipleData] = useState<Post[]>([]);
  const [editableData, setEditableData] = useState<
    { key: string; value: any }[][]
  >([]);
  const [addNewData, setAddNewData] = useState<{ key: string; value: any }[][]>(
    []
  );
  const [originalData, setOriginalData] = useState<
    { key: string; value: any }[][]
  >([]);
  const [selectedRows, setSelectedRows] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [confirmationDialogForEditDelete, setConfirmationDialogForEditDelete] =
    useState(false);
  // const data = selectedData
  //   ? Object.entries(selectedData).map(([key, value]) => ({ key, value }))
  //   : multipleData
  //   ? multipleData.flatMap((row) =>
  //       Object.entries(row).map(([key, value]) => ({ key, value }))
  //     )
  //   : [];
  const params = window.location.pathname.split('/');
  const pathName = params[1]
    .split(' ')
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(' ');
  const [toast, setToast] = useState<JSX.Element | null>(null);
  const gridRef = useRef<AgGridReactType<Post>>(null);
  const origin = originalData.map((row) =>
    Object.fromEntries(row.map(({ key, value }) => [key, String(value).trim()]))
  );
  const editable = editableData.map((row) =>
    Object.fromEntries(row.map(({ key, value }) => [key, String(value).trim()]))
  );
  const forAddbuttonDisable = addNewData.map((row) =>
    Object.fromEntries(row.map(({ key, value }) => [key, String(value).trim()]))
  );
  const { agGridProps, containerProps } = useAgGridHelpers();
  const [emptyField, setEmptyField] = useState<boolean>(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [dialogCancellation, setDialogCancellation] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const formData = isEdit || isDelete ? editableData : addNewData;

  const confirmationDialog =
    JSON.stringify(origin) !== JSON.stringify(editable);

  const confirmDialogContent =
    (isAdd || isEdit) && dialogCancellation
      ? 'Are you sure you want to reset all grid data? Any previous changes will not be saved'
      : isDelete
      ? 'Are you sure you want to delete this post?'
      : 'Do you want to proceed with update from the selected post?';

  const navigate = useNavigate();
  const zebraTheme = themeQuartz.withParams({
    rowHoverColor: '#c4c5c8ff',
    accentColor: '#1976d2', // primary highlight color
    headerBackgroundColor: '#fafafa', // header background
    foregroundColor: '#333333', // text color
    borderColor: '#e0e0e0',
  });

  useEffect(() => {
    if (selectedData) {
      setEditableData([
        Object.entries(selectedData).map(([key, value]) => ({ key, value })),
      ]);
      setOriginalData([
        Object.entries(selectedData).map(([key, value]) => ({ key, value })),
      ]);
    }
  }, [selectedData]);

  useEffect(() => {
    console.log("activeTabbb",activeTab)
  },[])

  useEffect(() => {
    if (multipleData.length > 0) {
      setEditableData(
        multipleData.map((row) =>
          Object.entries(row).map(([key, value]) => ({ key, value }))
        )
      );
      setOriginalData(
        multipleData.map((row) =>
          Object.entries(row).map(([key, value]) => ({ key, value }))
        )
      );
    }
  }, [multipleData]);

  const ActionButtonRenderer = (e: ICellRendererParams<Post>) => {
    const handleClickAction = (actionType: string) => {
      setDialogOpen(true);
      setSelectedData(e.data);
      actionType === 'edit' ? setIsEdit(true) : setIsDelete(true);
    };

    return (
      <>
        <Button
          sentiment="accented"
          appearance="transparent"
          disabled={selectedRows >= 1}
          onClick={() => handleClickAction('edit')}
        >
          <EditIcon />
        </Button>
        &nbsp;
        <Button
          sentiment="accented"
          appearance="transparent"
          disabled={selectedRows >= 1}
          onClick={() => handleClickAction('delete')}
        >
          <DeleteIcon />
        </Button>
      </>
    );
  };

  const getMultiRowData = (action: string) => {
    if (!gridRef.current) return false;
    const selected = gridRef.current.api.getSelectedRows();
    const order = selected.sort((a, b) => Number(a.id) - Number(b.id));
    if (order.length > 0) {
      setDialogOpen(true);
      action === 'edit' ? setIsEdit(true) : setIsDelete(true);
      setMultipleData(order);
    }
  };

  const columnDefs: ColDef<Post>[] = [
    { headerName: 'UserId', field: 'userId' },
    { headerName: 'ID', field: 'id' },
    { headerName: 'Title', field: 'title' },
    { headerName: 'Content', field: 'body', flex: 3 },
    {
      headerName: 'Actions',
      field: 'button',
      cellRenderer: ActionButtonRenderer,
    },
  ];

  const rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    headerCheckbox: true,
  };

  const defaultColDef = useMemo(() => {
    return {
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    };
  }, []);

  const handleInputChange = (
    rowIndex: number,
    key: string,
    newValue: string
  ) => {
    if (!isEdit) {
      setAddNewData((prev) => {
        const updated = prev.map((row) =>
          row.map((item) =>
            item.key === key ? { ...item, value: newValue } : item
          )
        );
        const hasEmpty = updated.some((row) =>
          row.some((item) => !item.value || String(item.value).trim() === '')
        );
        setEmptyField(hasEmpty);
        return updated;
      });
    } else {
      setEditableData((prev) => {
        const updated = prev.map((row, i) =>
          i === rowIndex
            ? row.map((item) =>
                item.key === key ? { ...item, value: newValue } : item
              )
            : row
        );
        const hasEmpty = updated.some((row) =>
          row.some((item) => !item.value || String(item.value).trim() === '')
        );
        setEmptyField(hasEmpty);
        return updated;
      });
    }
  };
  useEffect(() => {
    console.log('addNewData', addNewData);
    console.log('forAddbuttonDisable', forAddbuttonDisable);
    console.log('isAdd', isAdd);
  }, [addNewData]);

  const createRecord = () => {
    setIsAdd(true);
    setIsEdit(false);
    setIsDelete(false);
    setAddNewData(addData);
    setDialogOpen(true);
  };

  const handleEditDelete = async () => {
    if (isEdit || isDelete) {
      setConfirmationDialogForEditDelete(true);
    } else {
      handleSubmit();
    }
  };

  function reorderPost(post: Post): Post {
    return {
      userId: post.userId,
      id: post.id,
      title: post.title,
      body: post.body,
    };
  }

  const handleSubmit = async () => {
    const updateDataToStore: Post[] = formData.map((row) =>
      Object.fromEntries(row.map(({ key, value }) => [key, value]))
    ) as Post[];

    const deleteDataFromStore = formData.map((record) =>
      parseInt(record.find((f) => f.key === 'id')?.value ?? '0', 10)
    );
    try {
      if (isEdit) {
        await Promise.all(
          updateDataToStore.map((post) => updatePosts(post).unwrap())
        );
      } else if (isDelete) {
        await Promise.all(
          deleteDataFromStore.map((ids) => deletePosts(ids).unwrap())
        );
      } else {
        //for adding new post
        if (posts && posts.length > 0) {
          const lastRecord: Post = posts[posts.length - 1];

          // const lastId = lastRecord.find((f) => f.key === 'id')?.value ?? '0';
          const newId = Number(lastRecord.id) + 1;
          const newUserId = Math.ceil(newId / 10);

          const newRecord: Post = reorderPost({
            userId: newUserId,
            id: newId.toString(),
            title: updateDataToStore[0].title || '',
            body: updateDataToStore[0].body || '',
          });

          await addPosts(newRecord);
        }
      }
      // await updateMultiplePosts(dataToStore).unwrap()
      setDialogOpen(false);
      setIsAdd(false);
      setIsEdit(false);
      setIsDelete(false);
      setSelectedRows(0);
      setToast(
        <ToastMessage
          status="success"
          headText="Updated Successfully"
          content={`Post was ${
            isEdit ? `Updated` : isDelete ? `Deleted` : `Added`
          } Successfully`}
          icon={<SuccessCircleIcon aria-label="success" />}
          handleClose={() => setToast(null)}
        />
      );
      refetch();
    } catch (err) {
      console.log(err);
      setToast(
        <ToastMessage
          status="error"
          headText="Failed"
          content="Failed to Update"
          icon={<ErrorIcon aria-label="error" />}
          handleClose={() => setToast(null)}
        />
      );
      refetch();
    }
  };

  const allRowsChanged = editableData.every((row, i) => {
    const orginalRow = originalData[i];
    const oriObj = Object.fromEntries(
      orginalRow.map(({ key, value }) => [key, String(value ?? '').trim()])
    );
    const editObj = Object.fromEntries(
      row.map(({ key, value }) => [key, String(value ?? '').trim()])
    );
    return Object.keys(oriObj).some((k) => oriObj[k] !== editObj[k]);
  });

  const forAdd = forAddbuttonDisable.some(
    (obj) => !obj.title.trim() || !obj.body.trim()
  );
  const handleClose = () => {
    if ((confirmationDialog && isEdit) || (isAdd && !forAdd)) {
      setConfirmDialogOpen(true);
      setDialogCancellation(true);
    } else {
      setDialogOpen(false);
      setIsAdd(false);
      setIsEdit(false);
      setIsDelete(false);
      setSelectedData(undefined);
      setEmptyField(false);
    }
  };

  const confirmDialogHandleClose = () => {
    setConfirmDialogOpen(false);
    setDialogCancellation(false);
    setConfirmationDialogForEditDelete(false);
  };

  const confirmationDialogSubmit = () => {
    if (isEdit || isDelete) {
      !dialogCancellation ? handleSubmit() : null;
      setConfirmationDialogForEditDelete(false);
      setConfirmDialogOpen(false);
      setDialogOpen(false);
      setIsAdd(false);
      setIsEdit(false);
      setIsDelete(false);
      setSelectedData(undefined);
      setEmptyField(false);
      setDialogCancellation(false);
      navigate('/posts');
    }
    setConfirmationDialogForEditDelete(false);
    setConfirmDialogOpen(false);
    setDialogOpen(false);
    setIsAdd(false);
    setIsEdit(false);
    setIsDelete(false);
    setSelectedData(undefined);
    setEmptyField(false);
    setDialogCancellation(false);
    navigate('/posts');
  };

  const validationStatus = (value: string) => {
    if (isEdit) {
      const isValid = !value;
      return !isValid ? undefined : 'error';
    }
  };

  let isDisabled = false;

  if (isEdit) {
    console.log('edit called');
    isDisabled =
      JSON.stringify(origin) === JSON.stringify(editable) ||
      !allRowsChanged ||
      emptyField ||
      confirmDialogOpen;
  } else if (isAdd) {
    console.log('Add called');
    // Add mode
    isDisabled = forAddbuttonDisable.some(
      (obj) => !obj.title.trim() || !obj.body.trim()
    );
  }

  const closeButton = (
    <Button
      aria-label="closing-dialog"
      appearance="transparent"
      onClick={handleClose}
    >
      <CloseIcon aria-hidden />
    </Button>
  );

  const direction: StackLayoutProps<ElementType>['direction'] =
    useResponsiveProp(
      {
        xs: 'column',
        sm: 'row',
        lg: 'row',
        xl: 'row',
      },
      'row'
    );

  const cancel = (
    <Button sentiment="accented" appearance="bordered" onClick={handleClose}>
      Cancel
    </Button>
  );

  const accept = (
    <Button
      sentiment={isDelete ? 'negative' : 'accented'}
      onClick={handleEditDelete}
      disabled={isDisabled}
    >
      {isEdit ? 'Update' : isDelete ? 'Delete' : 'Add'}
    </Button>
  );

  const endItem = (
    <StackLayout direction={{ xs: 'column', sm: 'row' }} gap={1}>
      {cancel}
      {accept}
    </StackLayout>
  );

  const confirmationDialogCloseButton = (
    <Button
      aria-label="closing-dialog"
      appearance="transparent"
      onClick={confirmDialogHandleClose}
    >
      <CloseIcon aria-hidden />
    </Button>
  );

  const confirmationCancel = (
    <Button
      sentiment="accented"
      appearance="bordered"
      onClick={confirmDialogHandleClose}
    >
      Cancel
    </Button>
  );

  const confirm = (
    <Button
      sentiment={isDelete ? 'negative' : 'accented'}
      onClick={confirmationDialogSubmit}
    >
      {(isAdd || isEdit) && dialogCancellation
        ? 'Accept'
        : isDelete
        ? 'Delete'
        : 'Update'}
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
    )

  return (
    <div
      {...containerProps}
      className={clsx(containerProps.className, {
        'ag-theme-salt-variant-zebra': 'zebra',
      })}
    >
      <h1 className="text-5md font-bold mb-6">{activeTab}</h1>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          // style={{ marginLeft: '1107px' }}
          sentiment="accented"
          appearance="bordered"
          onClick={createRecord}
          disabled={selectedRows > 0}
        >
          <AddIcon />
          Add Record
        </Button>
        &nbsp;
        <Button
          // style={{ marginLeft: '1107px' }}
          sentiment="accented"
          appearance="bordered"
          onClick={() => getMultiRowData('edit')}
          disabled={selectedRows <= 1}
        >
          <EditIcon />
          Edit Records
        </Button>
        &nbsp;
        <Button
          // style={{ marginLeft: '1107px' }}
          sentiment="accented"
          appearance="bordered"
          onClick={() => getMultiRowData('delete')}
          disabled={selectedRows <= 1}
        >
          <DeleteIcon />
          Delete Records
        </Button>
      </div>
      <div className="ag-theme-quartz" style={{ height: 500 }}>
        <AgGridReact<Post>
          {...agGridProps}
          {...gridProps}
          theme='legacy'
          rowData={posts ?? []}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // animateRows={true}
          // domLayout="autoHeight"
          pagination={true}
          rowSelection={rowSelection}
          ref={gridRef}
          onSelectionChanged={(e) =>
            setSelectedRows(e.api.getSelectedRows().length)
          }
          // onRowSelected={(e) => selectedRowNodes(e)}
          paginationPageSizeSelector={[5, 10, 25, 50, 100]}
        />
      </div>
      {dialogOpen && (
        <Dialog open={dialogOpen} size="large">
          <DialogHeader
            header={`${isEdit ? 'Edit' : isDelete ? 'Delete' : 'Add'} Item`}
            actions={closeButton}
          />
          <DialogContent>
            <FlowLayout>
              <StackLayout gap={2} direction={'column'}>
                {formData.map((row, rowIndex) => (
                  <StackLayout gap={2} direction={'row'} key={rowIndex}>
                    {row.map(({ key, value }, index) => {
                      const label = key.charAt(0).toUpperCase() + key.slice(1);
                      const disableId = key === 'userId' || key === 'id';
                      if (!isEdit && !isDelete && disableId) return null;
                      const multiLineInput = key === 'body';
                      return (
                        <FormField key={index}>
                          <FormFieldLabel>{label}</FormFieldLabel>
                          {!multiLineInput ? (
                            <>
                              <Input
                                value={value}
                                validationStatus={validationStatus(value)}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleInputChange(
                                    rowIndex,
                                    key,
                                    e.target.value
                                  )
                                }
                                disabled={disableId || isDelete}
                              />
                              {isEdit && !value ? <p>Field is Empty</p> : ''}
                            </>
                          ) : (
                            <>
                              <MultilineInput
                                value={value}
                                validationStatus={validationStatus(value)}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleInputChange(
                                    rowIndex,
                                    key,
                                    e.target.value
                                  )
                                }
                                disabled={isDelete}
                              />
                              {isEdit && !value ? <p>Field is Empty</p> : ''}
                            </>
                          )}
                        </FormField>
                      );
                    })}
                  </StackLayout>
                ))}
              </StackLayout>
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
      {toast && <ToastGroup placement="top-right">{toast}</ToastGroup>}
      {(confirmDialogOpen || confirmationDialogForEditDelete) && (
        <DialogBox
          open={confirmDialogOpen || confirmationDialogForEditDelete}
          size="small"
          status={isDelete ? 'error' : 'warning'}
          content={confirmDialogContent}
          direction={direction}
          confirm={confirm}
          cancel={confirmationCancel}
          closeButton={confirmationDialogCloseButton}
        />
      )}
    </div>
  );
}
export default Posts;
