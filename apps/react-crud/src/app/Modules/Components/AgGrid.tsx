import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ColDef,
  RowSelectionOptions,
  AllCommunityModule,
  ModuleRegistry,
  SelectionChangedEvent,
} from 'ag-grid-community';
import React from 'react';
import { useTheme } from '../../../themeContext';

ModuleRegistry.registerModules([AllCommunityModule]);
interface AgGridProps<T> extends AgGridReactProps<T> {
  theme?: 'legacy' | undefined;
  rowData?: T[];
  columnDefs?: ColDef[];
  defaultColDef?: {};
  pagination?: boolean;
  rowSelection?: RowSelectionOptions;
  ref?: React.Ref<AgGridReact<T>>;
  onSelectionChanged?: (e: SelectionChangedEvent) => void;
  paginationPageSizeSelector?: number[];
  domLayout?: 'normal' | 'autoHeight' | 'print';
}

const AgGrid = <T,>({
  theme,
  rowData,
  columnDefs,
  defaultColDef,
  pagination,
  rowSelection,
  ref,
  onSelectionChanged,
  paginationPageSizeSelector,
  domLayout
}: AgGridProps<T>) => {
  const { dark } = useTheme();
  return (
    <div
      className={dark ? 'ag-theme-alpine-dark' : 'ag-theme-alpine'}
      style={{ height: 500, marginTop: '10px' }}
    >
      <AgGridReact<T>
        theme={theme}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={pagination}
        rowSelection={rowSelection}
        ref={ref}
        onSelectionChanged={onSelectionChanged}
        paginationPageSizeSelector={paginationPageSizeSelector}
        domLayout={domLayout}
      />
    </div>
  );
};

export default AgGrid;
