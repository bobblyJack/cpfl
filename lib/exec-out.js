function outs(exr,std,err) {
    if (exr) {
        console.error(exr.message);
        throw exr;
    } else {
        console.log(std);
        if (err) {
            console.error(err);
        }   
    }
}

module.exports = outs