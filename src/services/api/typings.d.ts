declare namespace API {
  type AdminDTO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    enabled?: boolean;
    password?: string;
    department?: string;
    phone?: string;
    email?: string;
    modList?: AdminModDTO[];
  };

  type AdminModDTO = {
    id?: string;
    privList?: string[];
  };

  type AdminVO = {
    id?: number;
    userCode?: string;
    name?: string;
    sex?: number;
    enabled?: boolean;
    password?: string;
    department?: string;
    phone?: string;
    email?: string;
    createdAt?: string;
    createdBy?: number;
    createdByDesc?: string;
    updatedAt?: string;
    updatedBy?: number;
    updatedByDesc?: string;
  };

  type categoryExistsParams = {
    /** 栏目名称 */
    name: string;
  };

  type createCategoryParams = {
    /** 栏目名称 */
    name: string;
  };

  type deleteCategoryParams = {
    /** 要删除的栏目ID */
    id: number;
    /** 新闻转移的目标栏目ID，不指定则无法删除有新闻的栏目 */
    transferCategoryId?: number;
  };

  type deleteNewsParams = {
    /** 新闻ID */
    id: number;
  };

  type DepartmentDTO = {
    id?: number;
    departmentName?: string;
    contact?: string;
    contactPhone?: string;
    description?: string;
  };

  type DepartmentQueryDTO = {
    current?: number;
    pageNum?: number;
    pageSize?: number;
    departmentName?: string;
  };

  type DepartmentVO = {
    id?: number;
    departmentName?: string;
    contact?: string;
    contactPhone?: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: number;
    createdByDesc?: string;
  };

  type getAdminParams = {
    id: number;
  };

  type getCategoryParams = {
    /** 栏目ID */
    id: number;
  };

  type getDepartmentParams = {
    id: number;
  };

  type getNewsParams = {
    /** 新闻ID */
    id: number;
  };

  type KeywordQueryDTO = {
    current?: number;
    pageNum?: number;
    pageSize?: number;
    keyword?: string;
    orderBy?: string;
  };

  type kickParams = {
    readerToken: string;
  };

  type LoginLogQueryDTO = {
    current?: number;
    pageNum?: number;
    pageSize?: number;
    userCode?: string;
    ipAddress?: string;
    createdAt?: string;
    orderBy?: string;
  };

  type LoginLogVO = {
    id?: number;
    userCode?: string;
    ipAddress?: string;
    name?: string;
    os?: string;
    browser?: string;
    createdAt?: string;
  };

  type loginParams = {
    userId: string;
    password: string;
  };

  type ModuleVO = {
    id?: string;
    privilegeList?: PrivilegeVO[];
  };

  type News = {
    id?: number;
    title?: string;
    content?: string;
    categoryId?: number;
    createBy?: string;
    updateBy?: string;
    createTime?: string;
    updateTime?: string;
  };

  type NewsCategory = {
    id?: number;
    name?: string;
    createTime?: string;
    updateTime?: string;
  };

  type NewsDTO = {
    id?: number;
    title: string;
    content: string;
    categoryId: number;
  };

  type NewsQueryDTO = {
    current?: number;
    pageNum?: number;
    pageSize?: number;
    title?: string;
    categoryId?: number;
    startTime?: string;
    endTime?: string;
  };

  type OnlineUserVO = {
    accessToken?: string;
    backend?: boolean;
    userName?: string;
    userCode?: string;
    userId?: number;
    roleId?: number;
    roleName?: string;
    lastAction?: string;
    sex?: string;
    department?: string;
    ipAddr?: string;
    os?: string;
    browser?: string;
    browserVersion?: string;
    device?: string;
    country?: string;
    location?: string;
    isp?: string;
    totalNetFlow?: number;
    referer?: string;
  };

  type PageAdminVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: AdminVO[];
  };

  type PageDepartmentVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: DepartmentVO[];
  };

  type PageLoginLogVO = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: LoginLogVO[];
  };

  type PageNews = {
    current?: number;
    pageSize?: number;
    total?: number;
    list?: News[];
  };

  type PrivilegeVO = {
    id?: string;
    description?: string;
  };

  type queryNewsParams = {
    queryDTO: NewsQueryDTO;
  };

  type ResultBoolean = {
    code?: number;
    message?: string;
    data?: boolean;
    success?: boolean;
  };

  type ResultListNewsCategory = {
    code?: number;
    message?: string;
    data?: NewsCategory[];
    success?: boolean;
  };

  type ResultNews = {
    code?: number;
    message?: string;
    data?: News;
    success?: boolean;
  };

  type ResultNewsCategory = {
    code?: number;
    message?: string;
    data?: NewsCategory;
    success?: boolean;
  };

  type ResultPageNews = {
    code?: number;
    message?: string;
    data?: PageNews;
    success?: boolean;
  };

  type ResultVoid = {
    code?: number;
    message?: string;
    data?: Record<string, any>;
    success?: boolean;
  };

  type searchCategoriesParams = {
    /** 栏目名称，支持模糊查询 */
    name?: string;
  };

  type Token = {
    accessToken?: string;
    userName?: string;
    userCode?: string;
    browser?: string;
    os?: string;
    device?: string;
    userId?: number;
    sex?: number;
    department?: string;
    ipAddress?: string;
    privSet?: string[];
    lastAction?: string;
  };

  type updateCategoryParams = {
    /** 栏目ID */
    id: number;
    /** 新栏目名称 */
    name: string;
  };

  type updateNewsParams = {
    /** 新闻ID */
    id: number;
  };
}
