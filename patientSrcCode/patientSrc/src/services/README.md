# services 文件夹说明

- [services 文件夹说明](#services-%E6%96%87%E4%BB%B6%E5%A4%B9%E8%AF%B4%E6%98%8E)
  - [用途](#%E7%94%A8%E9%80%94)
  - [接口使用说明](#%E6%8E%A5%E5%8F%A3%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)
    - [基本使用](#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8)
    - [返回值](#%E8%BF%94%E5%9B%9E%E5%80%BC)
  - [规范](#%E8%A7%84%E8%8C%83)
  - [Q & A](#q--a)
  
## 用途

此文件夹主要用于存放所有的接口方法定义

## 接口使用说明

该项目中默认使用的 `axios 实例` 被 `AxiosWrapper` 重新进行了封装，一些公共业务逻辑会统一放在 `AxiosWrapper` 中进行处理，比如没有权限等，如需修改或添加规则优先在这里处理

### 基本使用

直接在文件中引入需要用到的 service 模块文件并调用具体接口方法即可，如：

~~~ts
import { requestLogin } from '-/services/auth'

// some code

try {
  await requestLogin()
} catch (err) {
  ...
}

// 或

requestLogin().then().catch()
~~~

### 返回值

所有被 `AxiosWrapper` 包裹后的接口方法返回的值包含 2 个参数，第一个是类型为 `ApiData` 的对象，里面包含了 `errcode`，`data`，`errmsg` 三个属性，和后端接口一致。第二个参数是 axios 返回的原始数据，类型为 `AxiosResponse`

## 规范

一个接口完整定义如下：

~~~ts
/* 请求参数类型 */
export type LoginParams = {
  account: string,
  password: string,
}
/* 返回值类型 */
export type LoginReturnData = {
  /* eslint-disable camelcase */
  id: number, // 用户 ID
  name: string, // 姓名
  phone: string, // 电话
  email: string, // 邮箱
  creator_id: number, // 创建 ID
  role: Roles, // 角色
  permission_data: string[], // 有权限的页面
  pharmacist_signature: string, // 签名
  pharmacist_cert: string[], // 资格证
  id_cards: string[], // 身份证图片
  block_flag: number, // 用户状态 0 - 正常，1 - 禁用
  created_at: string, // 创建时间
  updated_at: string, // 更新时间
  /* eslint-enable camelcase */
}
// 用户登录（无验证码）
// http://yapi.int.medlinker.com/project/99/interface/api/1460
export const requestLogin = (
  payload: ILoginParams
): AxiosCancelablePromise<ApiData<ILoginReturnData>> => service.post('/sess', qs.stringify(payload))
~~~

1. 为了避免接口方法和 `model` 中的 `effect` 方法重名，所有接口方法统一添加 `request` 前缀，如：`requestLogin`，`requestGetUserInfo`, `requestDeleteUser`等。
2. 所有 `get` 类型的接口统一采用 `requestGetXXXX` 的形式定义，避免 `fetch`，`load`等其他同义词。
3. 接口的请求参数或返回参数属性个数大于 1 个的，单独在该接口定义上方声明参数的数据类型，如上面示例中的 LoginParams 和 LoginReturnData。
4. 所有请求参数类型定义名称格式为 `接口方法名 + params`，如`LoginParams`，所有返回参数类型定义名称格式为 `接口方法名 + returnData`，如：`LoginReturnData`。
5. 所有请求值和返回值的字段必须要添加对应注释说明。
6. 所有接口声明上方要用注释写明该接口作用，同时附上 `yapi` 上对应接口地址，便于查看。
7. 如果接口方法的返回值是经过 `AxiosWrapper` 包裹后的 axios 实例调用，如 `service.get('xxx')`，则该方法返回值类型声明基本格式为 `AxiosCancelablePromise<ApiData<TYPE>>`，其中 `TYPE` 即为你定义的接口返回值中 `data` 属性对应的数据类型，应该和接口文档保持一致。
8. 带分页参数的请求参数通过叠加 `PaginationQuery` 来定义，如： `
    ~~~ts
    export type IGetUserListParams = PaginationQuery & {
      queryStr: string,
      id: number,
    }
    ~~~
9. 由于后端的特殊性导致所有数组类型数据在发请求前都需要转换成字符串，所有此类行为全部在定义的接口方法中进行转换，保证在整个应用中传递的数据类型和接口文档可以保持一致，如：
    ~~~ts
      export const requestModifyUserInfo = (
        params: IModifyUserInfoParams
      ): AxiosCancelablePromise<ApiData<string[]>> => {
        const { permissionData, channelIds, pharmacistCert, idCards, ...rest } = params
        // 在这里转换数组
        const finalParams = {
          permissionData: JSON.stringify(permissionData),
          channelIds: JSON.stringify(channelIds),
          pharmacistCert: JSON.stringify(pharmacistCert),
          idCards: JSON.stringify(idCards),
          ...rest,
        }

        return service.post('/user/manage/modify/user', qs.stringify(finalParams))
      }
    ~~~

## Q & A
