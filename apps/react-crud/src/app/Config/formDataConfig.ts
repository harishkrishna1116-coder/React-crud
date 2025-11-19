import { ApiEndPoint } from "../Modules/Slices/gridSlice";


export const formDataConfig:Record<ApiEndPoint,{key:string,value:string|number}[]> = {
    users:[
        {key: 'name', value: ''},
        {key: 'username', value: ''},
        {key: 'email', value: ''},
        {key: 'phone', value: ''},
        {key: 'website', value: ''},
    ],
    comments:[
        {key: 'name', value: ''},
        {key: 'email', value: ''},
        {key: 'body', value: ''},
    ],
    posts:[
        {key: 'title', value: ''},
        {key: 'body', value: ''},
    ]
}