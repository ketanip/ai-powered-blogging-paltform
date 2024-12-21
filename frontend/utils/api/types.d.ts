// Basic Types
export interface Author {
    _id: string;
    name: string;
};

export interface Blog {
    _id: string;
    title: string;
    body: string;
    authorID: Author;
    imageURL: string;
    tags: string[];
    createdOn: string;
    updatedOn: string;
    createdAt: string;
    updatedAt: string;
    summary: string;
    __v: number;
};

// RESPONSE
// AUTH
export interface AuthResponse {
    jwt_token: string,
    user: {
        id: string,
        name: string,
        email: string
    }
}

// BlOGS
export interface BlogResponse {
    blogs: Blog[];
    pagination: Pagination;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    limit: number;
}

export interface DeleteBlog {
    message: string;
}

// ERROR
export interface APIErrorResponse {
    error: string;
}


// REQUEST
// AUTH

export interface SignUp {
    name: string;
    email: string;
    password: string;
}

export interface SignIn {
    email: string;
    password: string;
}

// BLOG
export interface CreateBlog {
    title: string;
    imageURL: string;
    blog: string;
}

export interface UpdateBlog {
    title: string;
    imageURL?: string;
    blog?: string;
}

export interface GetBlogs {
    sort_order?: 'asc' | 'desc';
    page: number;
    author_id?: string;
}

export interface CreatePost {
    title: string;
    blog: string;
}