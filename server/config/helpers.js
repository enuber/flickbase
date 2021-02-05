const sortArgsHelper = sort => {
    let sortArgs = {sortBy:"_id",order:"asc",limit:3,skip:0};

    //for loop goes through the above object and will update if anything changes
    for(key in sort){
        if(sort[key]){
            sortArgs[key] = sort[key]
        }
    }

    return sortArgs;
};


module.exports = {
    sortArgsHelper
};

// {
//     "sortBy":"_id",
//     "order":"asc",
//     "limit":10,
//     "skip":0
// }