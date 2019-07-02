const __genGUID = (() => {
    let timeStamp = +new Date()

    return function () {
        return timeStamp++;
    }
})()

const __getCallbackName = (guid) => {
    return "__callback" + guid;
}

const responsePost = (target, message, messageId) => {
    target.postMessage({
        message,
        __guid: messageId,
        __type: "response"
    })
}

window.requestPost = (target, message, callback) => {
    let guid = __genGUID();
    window[__getCallbackName(guid)] = callback;

    target.postMessage({
        message,
        __guid: guid,
        __type: "request"
    })
}

window.addEventListener("message", function (evt) {
    if (evt.data && evt.data.__guid && evt.data.__type) {
        if (evt.data.__type === "request") {
            responsePost(evt.source, "ok", evt.data.__guid)
        } else if (evt.data.__type === "response") {
            let {
                message,
                __guid
            } = evt.data

            let responseCallback = __getCallbackName(__guid)

            //TODO : async callback
            window[responseCallback](message)

            delete window[responseCallback]
        }
    }
}, false);