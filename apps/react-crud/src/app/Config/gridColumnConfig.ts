import { ApiEndPoint } from "../Modules/Slices/gridSlice";

  type ColumnConfig = {
    headerName: string;
    field: string;
    flex?: number;
    editable?: boolean;
    width?: number;
    maxWidth?: number;
  };
export const columnConfig: Record<ApiEndPoint, ColumnConfig[]> = {
    users: [
      { headerName: 'ID', field: 'id', width: 100},
      { headerName: 'Name', field: 'name' },
      { headerName: 'UserName', field: 'username' },
      { headerName: 'Email', field: 'email' },
      { headerName: 'Phone', field: 'phone', flex: 2 },
      { headerName: 'Website', field: 'website', flex: 2 },
    ],
    comments: [
      { headerName: 'PostId', field: 'postId',width: 100 },
      { headerName: 'Id', field: 'id',width: 100 },
      { headerName: 'Name', field: 'name', flex: 2, editable: true },
      { headerName: 'Email', field: 'email', flex: 2 },
      { headerName: 'Content', field: 'body', flex: 2 },
    ],
    posts: [
      { headerName: 'UserId', field: 'userId',width: 100 },
      { headerName: 'Id', field: 'id',width: 100 },
      { headerName: 'Title', field: 'title' },
      { headerName: 'Content', field: 'body', flex: 3 },
    ],
  };
