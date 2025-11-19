import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import '@salt-ds/theme/index.css';
import { themeAlpine } from 'ag-grid-community';
import {
  Button,
  StackLayoutProps,
  useResponsiveProp,
  StackLayout,
  Scrim,
  Spinner,
  Dialog,
  DialogActions,
  DialogContent,
  DialogHeader,
  FlowLayout,
  FormField,
  FormFieldLabel,
  Input,
  MultilineInput,
  SplitLayout,
  Option,
  Dropdown,
  type DropdownProps,
} from '@salt-ds/core';
import {
  EditIcon,
  DeleteIcon,
  SuccessCircleIcon,
  ErrorIcon,
  CloseIcon,
  AddIcon,
} from '@salt-ds/icons';
import {
  themeQuartz,
  ICellRendererParams,
  ColDef,
  RowSelectionOptions,
  AllCommunityModule,
  ModuleRegistry,
} from 'ag-grid-community';
import React, {
  ChangeEvent,
  ElementType,
  JSX,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastMessage } from '../Components/Toast';
import { useAgGridHelpers } from '../Hooks/AgGridStyle';
import { ToastGroup, ComboBox } from '@salt-ds/lab';
import {
  AgGridReact,
  AgGridReact as AgGridReactType,
  type AgGridReactProps,
} from 'ag-grid-react';
import DialogBox from '../Components/DialogBox';
import {
  ApiEndPoint,
  useAddDataMutation,
  useDeleteDataMutation,
  useGetDataQuery,
  useUpdateDataMutation,
  Post,
  User,
  Comment,
} from '../Slices/gridSlice';
import { columnConfig } from '../../Config/gridColumnConfig';
import { formDataConfig } from '../../Config/formDataConfig';
ModuleRegistry.registerModules([AllCommunityModule]);

const GridSelection: React.FC = (props: AgGridReactProps) => {
  type Row = Post | Comment | User;
  const [selectedValue, setSelectedValue] = useState<ApiEndPoint[]>([]);
  const options = [
    { label: 'Posts', value: 'posts' },
    { label: 'Users', value: 'users' },
    { label: 'Comments', value: 'comments' },
  ];
  const {
    data: getGridData,
    error,
    isLoading,
    refetch,
  } = useGetDataQuery(selectedValue[0] as ApiEndPoint, {
    skip: !selectedValue[0],
  });
  const [addData] = useAddDataMutation();
  const [updateData, { error: fetchError, isLoading: isUpdating, isSuccess }] =
    useUpdateDataMutation();
  const [deleteData] = useDeleteDataMutation();

  const [selectedData, setSelectedData] = useState<Row | undefined>();
  const [multipleData, setMultipleData] = useState<Row[]>([]);
  const [editableData, setEditableData] = useState<
    { key: string; value: any }[][]
  >([]);
  const [addNewData, setAddNewData] = useState<
    { key: string; value: string | number }[][]
  >([]);
  const [originalData, setOriginalData] = useState<
    { key: string; value: any }[][]
  >([]);
  const [defaultData, setDefaultData] = useState<
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
  const gridRef = useRef<AgGridReactType<Row>>(null);
  const origin = originalData.map((row) =>
    Object.fromEntries(row.map(({ key, value }) => [key, String(value).trim()]))
  );
  const editable = editableData.map((row) =>
    Object.fromEntries(row.map(({ key, value }) => [key, String(value).trim()]))
  );
  const forAddbuttonDisable = addNewData.map((row) =>
    Object.fromEntries(
      row.map(({ key, value }) => [key, String(value ?? '').trim()])
    )
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
      ? 'Are you sure you want to cancel the changes? Any previous changes will not be saved'
      : isDelete
      ? `Are you sure you want to delete the selected ${
          selectedRows > 1 ? selectedValue[0] : selectedValue[0]?.slice(0, -1)
        } ?`
      : `Do you want to proceed with update from the selected ${
          selectedRows > 1 ? selectedValue[0] : selectedValue[0]?.slice(0, -1)
        } ?`;

  const navigate = useNavigate();

  const hiddenFields: Record<ApiEndPoint, string[]> = {
    users: ['address', 'company'],
    comments: [],
    posts: [],
  };

  useEffect(() => {
    if (selectedData) {
      const entries = Object.entries(selectedData)
        .filter(
          ([key]) =>
            !hiddenFields[selectedValue[0] as ApiEndPoint].includes(key)
        )
        .map(([key, value]) => ({ key, value }));
      setEditableData([entries]);
      setOriginalData([entries]);
      setDefaultData([
        Object.entries(selectedData).map(([key, value]) => ({ key, value })),
      ]);
    }
  }, [selectedData]);

  useEffect(() => {
    if (multipleData.length > 0) {
      const multipleEntries = multipleData.map((row) =>
        Object.entries(row)
          .filter(
            ([key]) =>
              !hiddenFields[selectedValue[0] as ApiEndPoint].includes(key)
          )
          .map(([key, value]) => ({ key, value }))
      );
      setEditableData(multipleEntries);
      setOriginalData(multipleEntries);
      setDefaultData(
        multipleData.map((row) =>
          Object.entries(row).map(([key, value]) => ({ key, value }))
        )
      );
    }
  }, [multipleData]);

  const ActionButtonRenderer = (e: ICellRendererParams<Row>) => {
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

  const baseColumns = selectedValue[0]
    ? columnConfig[selectedValue[0] as ApiEndPoint]
    : [];

  const actionColumn: ColDef = {
    headerName: 'Actions',
    field: 'button',
    width: 100,
    cellRenderer: ActionButtonRenderer,
  };

  const columnDefs: ColDef[] = [...baseColumns, actionColumn];

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
    setAddNewData([formDataConfig[selectedValue[0] as ApiEndPoint]]);
    setDialogOpen(true);
  };

  const handleEditDelete = () => {
    if (isEdit || isDelete) {
      setConfirmationDialogForEditDelete(true);
    } else {
      handleSubmit();
    }
  };

  const ALLOWED_FIELDS: Record<string, string[]> = {
    users: ['id', 'name', 'username', 'email', 'phone', 'website'],
    posts: ['id', 'userId', 'title', 'body'],
    comments: ['id', 'postId', 'name', 'email', 'body'],
  };

  const filterAllowed = (endpoint: string, obj: any) => {
  const allowed = ALLOWED_FIELDS[endpoint] ?? [];
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => allowed.includes(k))
  );
};

const rowTemplate = (endpoint: string, newId: number) => {
  const fields = ALLOWED_FIELDS[endpoint] ?? ["id"];

  return fields.map((key) => {
    switch (key) {
      case "id":
        return { key, value: newId.toString() };
      case "userId":
        return { key, value: Math.ceil(newId / 10).toString() };
      case "postId":
        return { key, value: Math.ceil(newId / 5).toString() };
      default:
        return { key, value: "" };
    }
  });
};

  const generateNewRecord = (
    lastRecord: any,
    formRecord: any,
    endpoint: string
  ) => {
    const lastId = Number(lastRecord.id);
    const newId = lastId + 1;
    // const newPostId = Math.ceil(newId / 5);
    // const newUserId = Math.ceil(newId / 10);

    if (endpoint === 'users') {
      return {
        ...filterAllowed('users',formRecord),
        id: newId.toString(),
      };
    }

    if (endpoint === 'comments') {
      const newPostId = Math.ceil(newId / 5);
      return {
        ...filterAllowed('comments',formRecord),
        id: newId.toString(),
        postId: newPostId,
      };
    }

    if (endpoint === 'posts') {
      const newUserId = Math.ceil(newId / 10);
      return {
        ...filterAllowed('posts',formRecord),
        id: newId.toString(),
        userId: newUserId,
      };
    }

    return {
      ...filterAllowed(endpoint,formRecord),
      id: newId.toString(),
    };
  };

  const handleSubmit = async () => {
    const updateDataToStore: Row[] = formData.map((row, idx) => {
      const editedObj = Object.fromEntries(
        row.map(({ key, value }) => [key, value])
      );
      const originalObj = Object.fromEntries(
        (defaultData[idx] ?? []).map(({ key, value }) => [key, value])
      );
      return { ...originalObj, ...editedObj };
    }) as Row[];

    const deleteDataFromStore = formData.map((record) =>
      parseInt(record.find((f) => f.key === 'id')?.value ?? '0', 10)
    );

    try {
      if (isEdit) {
        await Promise.all(
          updateDataToStore.map((data) =>
            updateData({ endpoint: selectedValue[0], body: data }).unwrap()
          )
        );
      } else if (isDelete) {
        await Promise.all(
          deleteDataFromStore.map((ids) =>
            deleteData({ endpoint: selectedValue[0], id: ids }).unwrap()
          )
        );
      } else {
        console.log(
          'updateDataToStore[0]',
          updateDataToStore[0],
          selectedValue[0]
        );
        //for adding new post
     
      }
      setDialogOpen(false);
      setIsAdd(false);
      setIsEdit(false);
      setIsDelete(false);
      setToast(
        <ToastMessage
          status="success"
          headText={`${
            isEdit ? `Updated` : isDelete ? `Deleted` : `Added`
          } Successfully`}
          content={`${
            selectedRows > 1 ? selectedValue[0] : selectedValue[0].slice(0, -1)
          } was ${
            isEdit ? `Updated` : isDelete ? `Deleted` : `Added`
          } Successfully`}
          icon={<SuccessCircleIcon aria-label="success" />}
          handleClose={() => setToast(null)}
        />
      );
      setSelectedRows(0);
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

  // const forAdd = forAddbuttonDisable.some(
  //   (obj) => !obj.title.trim() || !obj.body.trim()
  // );

  const forAdd = forAddbuttonDisable.some((obj) =>
    Object.values(obj).some((val) => (val ?? '').trim() === '')
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
      navigate('/gridselection');
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
    navigate('/gridselection');
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
    isDisabled = forAdd;
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
    );

  const handleSelectionChange: DropdownProps['onSelectionChange'] = (
    _event,
    newSelect
  ) => {
    setSelectedValue(newSelect as ApiEndPoint[]);
  };

  return (
    <div {...containerProps}>
      <h1 className="text-2xl font-bold mb-6">{pathName}</h1>
      <br></br>
      <FormField style={{ width: '266px' }}>
        <FormFieldLabel>Select Data</FormFieldLabel>
        <Dropdown
          value={selectedValue[0]}
          onSelectionChange={handleSelectionChange}
          //   InputProps={{ placeholder: "Select" }}
        >
          {options.map((val) => (
            <Option value={val.value} key={val.value}>
              {val.label}
            </Option>
          ))}
        </Dropdown>
      </FormField>
      {selectedValue[0] && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
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

          <div
            className="ag-theme-quartz"
            style={{ height: 500, marginTop: '10px' }}
          >
            <AgGridReact<Row>
              {...agGridProps}
              {...props}
              theme="legacy"
              rowData={getGridData ?? []}
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
        </>
      )}
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
                      const disableId =
                        key === 'userId' || key === 'id' || key === 'postId';
                      // if (isAdd && disableId) return null;
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
};
export default GridSelection;
