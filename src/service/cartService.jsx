import request from "./request";

const ENDPOINT = "api/cart";

const add = async (data) => {
    const url = `${ENDPOINT}`;
    return request.post(url, data).then((res) => {
        return res;
    }).catch((e) => {
        return Promise.reject(e.response);
    })
}

const updateItems = async (data) => {
    const url = `${ENDPOINT}`;
    return request
        .put(url, data)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return Promise.reject(e);
        });
};

const getList = async (id) => {
    const url = `${ENDPOINT}?userId=${id}`;
    return request.get(url).then((res) => {
        return res;
    });
};

const removeItem = async (id) => {
    const url = `${ENDPOINT}?id=${id}`;
    return request
        .delete(url)
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return e;
        });
};

const cartService={
    add,
    getList,
    updateItems,
    removeItem,
}

export default cartService;